import { getProducts } from "@/lib/actions";
import { ProductsList } from "@/components/products/products-list";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";

export default async function ProductsPage() {
  const initialProducts = await getProducts();

  return (
    <main className="min-h-screen bg-[#FDFCF8]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
        <header className="mb-20 flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 backdrop-blur-sm rounded-full border border-brand-primary/30">
            <Sparkles size={10} className="text-amber-600" />
            <span className="text-[10px] font-medium tracking-widest uppercase text-brand-dark/80">
              The Collection
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight text-brand-dark text-balance">
            Our Handcrafted{" "}
            <span className="text-brand-primary">Collection</span>.
          </h1>
          <p className="max-w-2xl text-sm font-normal text-brand-dark/70 leading-relaxed text-balance">
            Explore our authentic, handmade papad flavors. Each pack is
            hand-rolled with traditional expertise and pure, natural
            ingredients.
          </p>
        </header>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-brand-dark/5 aspect-[4/5] rounded-[2.5rem]"
                />
              ))}
            </div>
          }
        >
          <ProductsList initialData={initialProducts} />
        </Suspense>
      </div>
    </main>
  );
}
