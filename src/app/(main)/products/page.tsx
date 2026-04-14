import { getProducts, getFilterOptions } from "@/lib/actions";
import { ProductsList } from "@/components/products/products-list";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Authentic Papads | Buy Besan & Aaloo Papad in Ranchi",
  description:
    "Browse our premium collection of traditional handcrafted papads. Fast delivery of chemical-free Besan, Aaloo, and Lehsun papads locally in Ranchi and across Jharkhand.",
  keywords: [
    "buy besan papad in ranchi",
    "authentic aaloo papad online",
    "handcrafted lehsun papad delivery",
    "best local snacks jharkhand",
    "buy traditional papad near me",
  ],
};

export default async function ProductsPage() {
  const [initialProductsResponse, initialFilterOptions] = await Promise.all([
    getProducts({ page: 1, limit: 9 }),
    getFilterOptions(),
  ]);

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
          <ProductsList 
            initialData={initialProductsResponse} 
            initialFilterOptions={initialFilterOptions}
          />
        </Suspense>
      </div>
    </main>
  );
}
