"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/actions";
import { ProductCard } from "./product-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import * as motion from "motion/react-client";

export function ProductsList({ initialData }: { initialData: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: () => getProducts(),
    initialData,
  });

  const filteredProducts = (productsData || []).filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-12">
      {/* Search Bar - Minimal & elegant */}
      <div className="relative max-w-sm mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-brand-dark/40" strokeWidth={1.5} />
        </div>
        <Input
          type="search"
          placeholder="Search authentic flavors..."
          className="h-12 pl-12 pr-4 rounded-full bg-white/50 border border-brand-dark/10 text-sm font-medium focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm transition-all focus:bg-white text-brand-dark/80 placeholder:text-brand-dark/40"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: idx * 0.1,
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-24 text-center flex flex-col items-center justify-center space-y-4"
        >
          <Search className="w-10 h-10 text-brand-dark/20" strokeWidth={1.5} />
          <p className="text-brand-dark/60 text-[15px] font-medium tracking-wide">
            No papads found matching &quot;{searchQuery}&quot;.
          </p>
        </motion.div>
      )}
    </div>
  );
}
