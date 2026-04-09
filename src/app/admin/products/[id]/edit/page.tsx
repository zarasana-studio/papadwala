import { getProductById } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/products/product-form";
import { notFound } from "next/navigation";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="p-8">
      <ProductForm initialData={product} />
    </div>
  );
}
