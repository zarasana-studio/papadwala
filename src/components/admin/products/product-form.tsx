"use client";

import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  type ProductFormValues,
} from "./product-form-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Loader2, Plus, Trash } from "lucide-react";
import { upsertProduct } from "@/lib/actions/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ImageUploader } from "./image-uploader";
import { slugify } from "@/lib/utils";

import { products, productVariants } from "@/lib/db/schema";
import { InferSelectModel } from "drizzle-orm";

type Product = InferSelectModel<typeof products>;
type Variant = InferSelectModel<typeof productVariants>;

type ProductWithVariants = Product & {
  variants: Variant[];
};

interface ProductFormProps {
  initialData?: ProductWithVariants | null;
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [uploadingCount, setUploadingCount] = React.useState(0);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      description: initialData?.description ?? "",
      images: initialData?.images?.map((url: string) => ({ value: url })) ?? [
        { value: "" },
      ],
      isHandmade: initialData?.isHandmade ?? true,
      isAvailable: initialData?.isAvailable ?? true,
      label: initialData?.label || null,
      variants: initialData?.variants?.map((v) => ({
        ...v,
        price: typeof v.price === "string" ? parseFloat(v.price) : v.price,
      })) ?? [
        {
          name: "Standard",
          flavor: "Original",
          weight: "500g",
          packSize: "Pack of 1",
          price: 99,
          stock: 100,
        },
      ],
      id: initialData?.id,
    },
  });

  const name = form.watch("name");

  React.useEffect(() => {
    // Only auto-generate if we're not currently submitting to avoid weird UI jumps
    if (name) {
      form.setValue("slug", slugify(name), { shouldValidate: true });
    }
  }, [name, form]);

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  async function onSubmit(values: ProductFormValues) {
    startTransition(async () => {
      const result = await upsertProduct({
        ...values,
        id: initialData?.id,
      });

      if (result.success) {
        toast.success(initialData?.id ? "Product updated" : "Product created");
        router.push("/admin/products");
        router.refresh();
      } else {
        const error = result as { success: false; error: string };
        toast.error(error.error || "Something went wrong");
      }
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 max-w-5xl mx-auto pb-20 px-4"
    >
      <div className="flex items-center justify-between sticky top-0 z-20 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4 -mt-4 border-b rounded-xl">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full h-10 w-10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              {initialData?.id ? "Edit Product" : "New Product"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {initialData?.id
                ? "Update existing product details"
                : "Create a new entry in your catalogue"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            className="rounded-xl font-bold text-xs uppercase"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending || uploadingCount > 0}
            className="rounded-xl shadow shadow-indigo-100 px-6 h-10 min-w-32 font-bold transition-all disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : uploadingCount > 0 ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading…
              </>
            ) : initialData?.id ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* General Information */}
          <Section
            title="General Information"
            description="Basic product details and branding."
          >
            <div className="space-y-6">
              <div className="grid gap-2">
                <Label
                  htmlFor="name"
                  className="text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Product Name
                </Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="e.g. Traditional Spicy Moong Papad"
                  className="rounded-xl border-none bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive font-medium">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="slug"
                  className="text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Product Slug
                </Label>
                <Input
                  id="slug"
                  {...form.register("slug")}
                  placeholder="spicy-moong-papad"
                  className="rounded-xl border-none bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                />
                {form.formState.errors.slug && (
                  <p className="text-xs text-destructive font-medium">
                    {form.formState.errors.slug.message}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="description"
                  className="text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  {...form.register("description")}
                  placeholder="Describe your delicious papad..."
                  className="rounded-xl border-none bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 min-h-[120px] resize-none"
                />
                {form.formState.errors.description && (
                  <p className="text-xs text-destructive font-medium">
                    {form.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>
          </Section>

          {/* Product Media */}
          <Section
            title="Media & Visuals"
            description="Upload high-quality images of your product."
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {imageFields.map((field, index) => (
                  <ImageUploader
                    key={field.id}
                    index={index}
                    value={form.watch(`images.${index}.value`)}
                    onChange={(url) => {
                      form.setValue(`images.${index}.value`, url, {
                        shouldValidate: true,
                      });
                      setUploadingCount((c) => Math.max(0, c - 1));
                    }}
                    onRemove={() => {
                      if (imageFields.length === 1) {
                        form.setValue(`images.0.value`, "", {
                          shouldValidate: true,
                        });
                      } else {
                        removeImage(index);
                      }
                    }}
                    disabled={isPending}
                  />
                ))}
                {/* Add slot button */}
                {imageFields.length < 6 && (
                  <button
                    type="button"
                    onClick={() => {
                      appendImage({ value: "" });
                    }}
                    className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-5 w-5 text-slate-400" />
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Add Image
                    </span>
                  </button>
                )}
              </div>
              {form.formState.errors.images && (
                <p className="text-xs text-destructive font-medium">
                  {form.formState.errors.images.message}
                </p>
              )}
            </div>
          </Section>

          {/* Table for Variants */}
          <Section
            title="Variants & Pricing"
            description="Manage different flavors, sizes, and pricing."
          >
            <div className="space-y-6">
              {variantFields.map((field, index) => (
                <div
                  key={field.id}
                  className="relative p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                      Variant #{index + 1}
                    </h4>
                    {variantFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVariant(index)}
                        className="h-8 text-destructive/80 hover:text-destructive hover:bg-destructive/5 rounded-lg"
                      >
                        <Trash className="h-3.5 w-3.5 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Variant Name
                      </Label>
                      <Input
                        {...form.register(`variants.${index}.name`)}
                        placeholder="e.g. Regular 500g"
                        className="bg-slate-50 border-none ring-1 ring-slate-100 rounded-lg h-9"
                      />
                      {form.formState.errors.variants?.[index]?.name && (
                        <p className="text-[10px] text-destructive font-semibold">
                          {form.formState.errors.variants[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Flavor
                      </Label>
                      <Input
                        {...form.register(`variants.${index}.flavor`)}
                        placeholder="Mild / Spicy"
                        className="bg-slate-50 border-none ring-1 ring-slate-100 rounded-lg h-9"
                      />
                      {form.formState.errors.variants?.[index]?.flavor && (
                        <p className="text-[10px] text-destructive font-semibold">
                          {form.formState.errors.variants[index]?.flavor?.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Weight
                      </Label>
                      <Input
                        {...form.register(`variants.${index}.weight`)}
                        placeholder="500g"
                        className="bg-slate-50 border-none ring-1 ring-slate-100 rounded-lg h-9"
                      />
                      {form.formState.errors.variants?.[index]?.weight && (
                        <p className="text-[10px] text-destructive font-semibold">
                          {form.formState.errors.variants[index]?.weight?.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Pack Size
                      </Label>
                      <Input
                        {...form.register(`variants.${index}.packSize`)}
                        placeholder="Pack of 1"
                        className="bg-slate-50 border-none ring-1 ring-slate-100 rounded-lg h-9"
                      />
                      {form.formState.errors.variants?.[index]?.packSize && (
                        <p className="text-[10px] text-destructive font-semibold">
                          {form.formState.errors.variants[index]?.packSize?.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Price (₹)
                      </Label>
                      <Input
                        type="number"
                        {...form.register(`variants.${index}.price`, {
                          valueAsNumber: true,
                        })}
                        className="bg-slate-50 border-none ring-1 ring-slate-100 rounded-lg h-9"
                      />
                      {form.formState.errors.variants?.[index]?.price && (
                        <p className="text-[10px] text-destructive font-semibold">
                          {form.formState.errors.variants[index]?.price?.message}
                        </p>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-bold uppercase text-slate-500">
                        Stock Availability
                      </Label>
                      <Input
                        type="number"
                        {...form.register(`variants.${index}.stock`, {
                          valueAsNumber: true,
                        })}
                        className="bg-slate-50 border-none ring-1 ring-slate-100 rounded-lg h-9"
                      />
                      {form.formState.errors.variants?.[index]?.stock && (
                        <p className="text-[10px] text-destructive font-semibold">
                          {form.formState.errors.variants[index]?.stock?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 rounded-2xl border-none shadow-sm ring-1 ring-slate-200 hover:ring-2 hover:ring-indigo-100 transition-all font-bold text-sm"
                onClick={() =>
                  appendVariant({
                    name: "",
                    flavor: "",
                    weight: "",
                    packSize: "",
                    price: 0,
                    stock: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Variant
              </Button>
            </div>
          </Section>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <Section title="Settings" description="Availability and tags.">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 ring-1 ring-slate-100">
                <div>
                  <Label className="text-sm font-bold">
                    Publicly Available
                  </Label>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-0.5">
                    Show in catalogue
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...form.register("isAvailable")}
                  className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 ring-1 ring-slate-100">
                <div>
                  <Label className="text-sm font-bold">
                    Handmade / Artisan
                  </Label>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight mt-0.5">
                    Custom badge
                  </p>
                </div>
                <input
                  type="checkbox"
                  {...form.register("isHandmade")}
                  className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                  Product Label
                </Label>
                <select
                  {...form.register("label")}
                  className="w-full h-10 px-3 rounded-xl border-none bg-slate-50 ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                >
                  <option value="">None</option>
                  <option value="featured">Featured</option>
                  <option value="bestseller">Bestseller</option>
                  <option value="coming_soon">Coming Soon</option>
                </select>
                {form.formState.errors.label && (
                  <p className="text-xs text-destructive font-medium">
                    {form.formState.errors.label.message}
                  </p>
                )}
              </div>
            </div>
          </Section>
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-serif">{title}</h3>
        <p className="text-xs text-muted-foreground font-medium">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}
