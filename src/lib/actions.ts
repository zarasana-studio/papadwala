"use server";

import { db } from "@/lib/db";
import { products, productVariants, comments, users } from "@/lib/db/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  try {
    const allProducts = await db.query.products.findMany({
      with: {
        variants: true,
      },
      orderBy: [desc(products.createdAt)],
    });
    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
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
