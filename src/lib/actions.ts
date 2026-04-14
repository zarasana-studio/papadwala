"use server";

import { db } from "@/lib/db";
import { products, productVariants, comments, users } from "@/lib/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getFilterOptions() {
  try {
    const variants = await db.query.productVariants.findMany({
      columns: {
        flavor: true,
        weight: true,
        price: true,
      },
      where: eq(productVariants.isArchived, false)
    });

    const flavors = new Set<string>();
    const weights = new Set<string>();
    let minP = Infinity;
    let maxP = 0;

    variants.forEach((v) => {
      if (v.flavor) flavors.add(v.flavor);
      if (v.weight) weights.add(v.weight);
      const p = Number(v.price);
      if (!isNaN(p)) {
        if (p < minP) minP = p;
        if (p > maxP) maxP = p;
      }
    });

    if (minP === Infinity) minP = 0;
    maxP = Math.ceil(maxP * 1.1); // Add padding for slider boundary

    return {
      flavors: Array.from(flavors).sort(),
      weights: Array.from(weights).sort(),
      minPrice: minP,
      maxPrice: maxP,
    };
  } catch (error) {
    console.error("Error fetching filter options:", error);
    return {
      flavors: [],
      weights: [],
      minPrice: 0,
      maxPrice: 1000,
    };
  }
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  searchQuery?: string;
  flavors?: string[];
  weights?: string[];
  maxPrice?: number;
}) {
  try {
    const { page = 1, limit = 9, searchQuery = "", flavors = [], weights = [], maxPrice } = params || {};
    const offset = Math.max(0, (page - 1) * limit);

    const allProducts = await db.query.products.findMany({
      where: eq(products.isArchived, false),
      with: {
        variants: true,
      },
      orderBy: [desc(products.createdAt)],
    });

    // Server-side filtering applied over raw result set
    const filteredProducts = allProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      const matchingVariants =
        product.variants?.filter((v) => {
          const vPrice = Number(v.price);
          const matchesPrice = maxPrice === undefined || (!isNaN(vPrice) && vPrice <= maxPrice);
          const matchesFlavor = flavors.length === 0 || flavors.includes(v.flavor);
          const matchesWeight = weights.length === 0 || weights.includes(v.weight);

          return matchesPrice && matchesFlavor && matchesWeight && !v.isArchived;
        }) || [];

      return matchingVariants.length > 0;
    });

    const totalRecords = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(offset, offset + limit);

    return {
      data: paginatedProducts,
      pagination: {
        totalItems: totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        hasNextPage: offset + limit < totalRecords,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      data: [],
      pagination: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        hasNextPage: false,
      },
    };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.query.products.findFirst({
      where: eq(products.slug, slug),
      with: {
        variants: true,
        comments: {
          with: {
            user: true,
          },
          orderBy: [desc(comments.createdAt)],
        },
      },
    });
    return product;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

export async function createComment(data: {
  userId: string;
  productId: string;
  rating: number;
  title: string;
  description: string;
}) {
  try {
    await db.insert(comments).values({
      userId: data.userId,
      productId: data.productId,
      rating: data.rating,
      title: data.title,
      description: data.description,
    });

    // Revalidate the product detail page
    const product = await db.query.products.findFirst({
      where: eq(products.id, data.productId),
    });
    if (product) {
      revalidatePath(`/products/${product.slug}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to post comment" };
  }
}
