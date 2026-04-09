"use server";

import { db } from "@/lib/db";
import { products, productVariants } from "@/lib/db/schema";
import { eq, notInArray, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/components/admin/products/product-form-schema";

export async function upsertProduct(data: ProductFormValues & { id?: string }) {
  // 1. We accept `id` explicitly to ensure Zod doesn't strip it if it's missing from the schema
  const { id: rawId } = data;
  
  // Clean Images BEFORE validation
  const flatImages = (data.images || [])
    .map((img) => (typeof img === "string" ? img : img.value))
    .filter((url) => url && url.trim() !== "");

  const validationResult = productFormSchema.safeParse({
    ...data,
    images: flatImages.map((url) => ({ value: url })),
  });

  if (!validationResult.success) {
    const errorMessage = validationResult.error.issues[0]?.message || "Validation failed";
    return { success: false, error: errorMessage };
  }

  const validatedData = validationResult.data;
  const { variants, ...rest } = validatedData;
  const productData = { ...rest, images: flatImages };

  try {
    return await db.transaction(async (tx) => {
      let productId = rawId;

      if (rawId) {
        // --- EDIT EXISTING PRODUCT ---
        
        // 1. Ensure Slug Uniqueness if changed
        let finalSlug = productData.slug;
        const existingWithSlug = await tx.query.products.findFirst({
          where: and(
            eq(products.slug, finalSlug),
            notInArray(products.id, [rawId])
          ),
        });

        if (existingWithSlug) {
          const suffix = Math.random().toString(36).substring(2, 6);
          finalSlug = `${finalSlug}-${suffix}`;
        }

        await tx
          .update(products)
          .set({ ...productData, slug: finalSlug })
          .where(eq(products.id, rawId));

        if (variants && variants.length > 0) {
          const incomingIds = variants
            .map((v) => v.id as string)
            .filter(Boolean);

          // A. Safely Update existing variants, Insert new ones
          for (const v of variants) {
            const variantData = {
              name: v.name,
              flavor: v.flavor,
              weight: v.weight,
              packSize: v.packSize,
              price: v.price.toString(),
              stock: v.stock,
              productId: rawId,
            };

            if (v.id) {
              await tx
                .update(productVariants)
                .set(variantData)
                .where(eq(productVariants.id, v.id));
            } else {
              await tx.insert(productVariants).values(variantData);
            }
          }

          // B. Handle variants removed in the UI
          const variantsToDelete = await tx
            .select({ id: productVariants.id })
            .from(productVariants)
            .where(
              and(
                eq(productVariants.productId, rawId),
                incomingIds.length > 0
                  ? notInArray(productVariants.id, incomingIds)
                  : undefined,
              ),
            );

          for (const v of variantsToDelete) {
            try {
              await tx
                .delete(productVariants)
                .where(eq(productVariants.id, v.id));
            } catch (error: unknown) {
              const dbError = (error as { cause?: { code?: string } })?.cause || (error as { code?: string });
              
              // If variant is referenced in orders (Code 23503), archive it instead
              if (dbError && typeof dbError === "object" && dbError.code === "23503") {
                await tx
                  .update(productVariants)
                  .set({ isArchived: true, stock: 0 })
                  .where(eq(productVariants.id, v.id));
              } else {
                throw error;
              }
            }
          }
        }
      } else {
        // --- CREATE NEW PRODUCT ---
        // 1. Ensure Slug Uniqueness
        let finalSlug = productData.slug;
        const existingSlug = await tx.query.products.findFirst({
          where: eq(products.slug, finalSlug),
        });

        if (existingSlug) {
          // If collision, append a short random string
          const suffix = Math.random().toString(36).substring(2, 6);
          finalSlug = `${finalSlug}-${suffix}`;
        }

        const [newProduct] = await tx
          .insert(products)
          .values({ ...productData, slug: finalSlug })
          .returning({ id: products.id });
        productId = newProduct.id;

        if (variants && variants.length > 0) {
          await tx.insert(productVariants).values(
            variants.map((v) => ({
              ...v,
              productId: productId!,
              price: v.price.toString(),
            })),
          );
        }
      }

      if (!productId) throw new Error("Product ID not found");

      // 3. FIX CACHE: Invalidate the entire admin layout so everything updates instantly
      revalidatePath("/admin", "layout");
      revalidatePath(`/products/${productData.slug}`);

      return { success: true, id: productId };
    });
  } catch (error: unknown) {
    console.error("Upsert product error:", error);
    let message = "Something went wrong";
    if (typeof error === "object" && error !== null && "code" in error && error.code === "23505") {
      message = "A product with this slug already exists";
    }
    return { success: false, error: message };
  }
}

export async function getProductById(id: string) {
  try {
    const product = await db.query.products.findFirst({
      where: and(eq(products.id, id), eq(products.isArchived, false)),
      with: {
        variants: {
          where: eq(productVariants.isArchived, false),
        },
      },
    });
    return product;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

export async function getProducts() {
  try {
    const allProducts = await db.query.products.findMany({
      where: eq(products.isArchived, false),
      with: {
        variants: {
          where: eq(productVariants.isArchived, false),
        },
      },
      orderBy: (products, { desc }) => [desc(products.createdAt)],
    });
    return allProducts;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function deleteProduct(id: string) {
  try {
    // 1. Attempt hard delete
    const [product] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning({ slug: products.slug });

    revalidatePath("/admin/products");
    if (product) {
      revalidatePath(`/products/${product.slug}`);
    }
    return { success: true };
  } catch (error: unknown) {
    const dbError = (error as { cause?: { code?: string } })?.cause || (error as { code?: string });

    // 2. Fallback to archiving if referenced in orders (Code 23503)
    if (dbError && typeof dbError === "object" && dbError.code === "23503") {
      const [product] = await db
        .update(products)
        .set({ isArchived: true, isAvailable: false })
        .where(eq(products.id, id))
        .returning({ slug: products.slug });

      revalidatePath("/admin/products");
      if (product) {
        revalidatePath(`/products/${product.slug}`);
      }
      return { success: true, archived: true };
    }

    console.error("Delete product error:", error);
    return { success: false, error: "Failed to delete product" };
  }
}
