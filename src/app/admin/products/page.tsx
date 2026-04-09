import { getProducts } from "@/lib/actions/products";
import { ProductTable } from "@/components/admin/products/product-table";
import { ProductWithVariants } from "@/components/admin/products/product-columns";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="px-4 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-medium tracking-tight font-serif text-slate-900">
          Products
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Manage your inventory, variants, and pricing from one place.
        </p>
      </div>

      <ProductTable data={products as ProductWithVariants[]} />
    </div>
  );
}
