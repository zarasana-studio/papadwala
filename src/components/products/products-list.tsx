"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/actions";
import { ProductCard } from "./product-card";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <Input
          type="search"
          placeholder="Search by flavor or keyword..."
          className="pl-10 rounded-full border-gray-200 focus:border-brand-primary focus:ring-brand-primary"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-muted-foreground text-lg italic">
            No papads found matching "{searchQuery}". Try searching for
            something else!
          </p>
        </div>
      )}
    </div>
  );
}
