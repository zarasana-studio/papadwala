import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Variant name is required"),
  flavor: z.string().min(1, "Flavor is required"),
  weight: z.string().min(1, "Weight is required (e.g., 500g)"),
  packSize: z.string().min(1, "Pack size is required (e.g., Pack of 1)"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
});

export const productFormSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  images: z
    .array(z.object({ value: z.string() }))
    .min(1, "At least one image is required")
    .refine(
      (imgs) => imgs.some((img) => img.value.trim().length > 0),
      "At least one valid image URL is required"
    ),
  description: z.string().optional().nullable(),
  isHandmade: z.boolean(),
  isAvailable: z.boolean(),
  label: z.enum(["coming_soon", "featured", "bestseller"]).nullable().optional(),
  variants: z.array(variantSchema).min(1),
});


export type ProductFormValues = z.infer<typeof productFormSchema>;
export type VariantFormValues = z.infer<typeof variantSchema>;
