import { getProducts } from "@/lib/actions";
import { ProductsList } from "@/components/products/products-list";
import { Suspense } from "react";

export default async function ProductsPage() {
  const initialProducts = await getProducts();

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12 border-b border-gray-100 pb-10 flex flex-col items-center text-center">
          <h1 className="font-serif text-4xl font-bold text-brand-dark sm:text-5xl uppercase tracking-widest underline decoration-brand-primary decoration-double underline-offset-8 text-balance">
            Our Handcrafted Collection
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground italic">
            Explore our authentic, handmade papad flavors. Each pack is
            hand-rolled with traditional expertise and natural ingredients.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-gray-100 h-96 rounded-2xl"
                />
              ))}
            </div>
          }
        >
          <ProductsList initialData={initialProducts as any} />
        </Suspense>
      </div>
    </main>
  );
}
