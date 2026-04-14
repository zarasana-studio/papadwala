"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/lib/actions";
import { ProductCard } from "./product-card";
import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Check, X, Loader2, Sparkles } from "lucide-react";
import * as motion from "motion/react-client";

// Define TypeScript structures for our component
export interface VariantType {
  id: string;
  productId: string;
  name: string;
  flavor: string;
  weight: string;
  packSize: string;
  price: string | number;
  stock: number;
  soldCount: number;
  isArchived: boolean;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  images: string[] | null;
  description: string | null;
  isHandmade: boolean;
  isAvailable: boolean;
  label: string | null;
  createdAt: Date | string;
  isArchived: boolean;
  variants?: VariantType[];
}

export interface PaginatedProducts {
  data: ProductType[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
  };
}

export interface FilterOptions {
  flavors: string[];
  weights: string[];
  minPrice: number;
  maxPrice: number;
}

// Custom hook for debouncing fast-changing inputs
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function ProductsList({
  initialData,
  initialFilterOptions,
}: {
  initialData: PaginatedProducts;
  initialFilterOptions: FilterOptions;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedWeights, setSelectedWeights] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(
    initialFilterOptions.maxPrice || 1000,
  );

  const isInitialState =
    debouncedSearchQuery === "" &&
    selectedFlavors.length === 0 &&
    selectedWeights.length === 0 &&
    priceRange === initialFilterOptions.maxPrice;

  // Utilize TanStack's robust infinite query engine for automated pagination networking
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: [
      "products",
      debouncedSearchQuery,
      selectedFlavors,
      selectedWeights,
      priceRange,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await getProducts({
        page: pageParam as number,
        limit: 9,
        searchQuery: debouncedSearchQuery,
        flavors: selectedFlavors,
        weights: selectedWeights,
        maxPrice: priceRange,
      });
      // Safety casting for strict typing compliance
      return response as PaginatedProducts;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNextPage
        ? lastPage.pagination.currentPage + 1
        : undefined,
    ...(isInitialState
      ? {
          initialData: {
            pages: [initialData],
            pageParams: [1],
          },
        }
      : {}),
  });

  const filteredProducts = data?.pages.flatMap((page) => page.data) || [];

  // Memoize toggles to prevent re-rendering identical callbacks
  const toggleFlavor = useCallback((flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor)
        ? prev.filter((f) => f !== flavor)
        : [...prev, flavor],
    );
  }, []);

  const toggleWeight = useCallback((weight: string) => {
    setSelectedWeights((prev) =>
      prev.includes(weight)
        ? prev.filter((w) => w !== weight)
        : [...prev, weight],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedFlavors([]);
    setSelectedWeights([]);
    setPriceRange(initialFilterOptions.maxPrice);
    setSearchQuery("");
  }, [initialFilterOptions.maxPrice]);

  const activeFilterCount =
    selectedFlavors.length +
    selectedWeights.length +
    (priceRange < initialFilterOptions.maxPrice ? 1 : 0);

  // Smooth loading grid skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-brand-dark/5 aspect-[4/5] rounded-[2.5rem]"
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-12 text-brand-dark">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden flex items-center justify-between mb-4">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-dark font-medium text-sm transition-all active:scale-95"
        >
          <SlidersHorizontal size={16} className="text-brand-primary" />
          Filters{" "}
          {activeFilterCount > 0 && (
            <span className="flex items-center justify-center h-5 w-5 rounded-full bg-brand-primary text-white text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Sidebar Filter Panel */}
      <aside
        className={`w-full lg:block lg:w-72 shrink-0 space-y-8 ${
          isMobileFiltersOpen ? "block" : "hidden"
        } lg:!block`}
      >
        <div className="sticky top-28 bg-white/50 backdrop-blur-xl border border-brand-dark/10 p-6 rounded-[2rem] shadow-sm">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-dark/10">
            <h3 className="font-serif text-xl font-medium text-brand-dark tracking-tight">
              Refine
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-[11px] uppercase tracking-widest font-medium text-brand-dark/50 hover:text-brand-primary transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h4 className="text-[11px] uppercase tracking-widest font-medium text-brand-dark/60 mb-4">
              Max Price
            </h4>
            <div className="space-y-4">
              <input
                type="range"
                min={initialFilterOptions.minPrice}
                max={initialFilterOptions.maxPrice}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full h-1.5 bg-brand-primary/20 rounded-lg appearance-none cursor-pointer accent-brand-primary outline-none hover:bg-brand-primary/30 transition-colors"
                style={{
                  background: `linear-gradient(to right, var(--color-brand-primary) ${
                    initialFilterOptions.maxPrice ===
                    initialFilterOptions.minPrice
                      ? 0
                      : ((priceRange - initialFilterOptions.minPrice) /
                          (initialFilterOptions.maxPrice -
                            initialFilterOptions.minPrice)) *
                        100
                  }%, color-mix(in srgb, var(--color-brand-primary) 20%, transparent) ${
                    initialFilterOptions.maxPrice ===
                    initialFilterOptions.minPrice
                      ? 0
                      : ((priceRange - initialFilterOptions.minPrice) /
                          (initialFilterOptions.maxPrice -
                            initialFilterOptions.minPrice)) *
                        100
                  }%)`,
                }}
              />
              <div className="flex justify-between items-center text-[13px] font-medium text-brand-dark/70">
                <span>₹{initialFilterOptions.minPrice}</span>
                <span className="text-brand-primary font-bold">
                  Up to ₹{priceRange}
                </span>
              </div>
            </div>
          </div>

          {/* Flavors Filter */}
          {initialFilterOptions.flavors.length > 0 && (
            <div className="mb-8">
              <h4 className="text-[11px] uppercase tracking-widest font-medium text-brand-dark/60 mb-4">
                Flavors
              </h4>
              <div className="flex flex-col gap-2">
                {initialFilterOptions.flavors.map((flavor) => {
                  const isChecked = selectedFlavors.includes(flavor);
                  return (
                    <label
                      key={flavor}
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFlavor(flavor);
                      }}
                    >
                      <input 
                        type="checkbox" 
                        className="sr-only" 
                        checked={isChecked}
                        readOnly
                      />
                      <div
                        className={`flex items-center justify-center w-5 h-5 rounded-md border transition-all duration-300 ${
                          isChecked
                            ? "bg-brand-primary border-brand-primary shadow-sm shadow-brand-primary/30"
                            : "border-brand-dark/20 bg-white group-hover:border-brand-primary/50"
                        }`}
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: isChecked ? 1 : 0 }}
                        >
                          <Check
                            size={12}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </motion.div>
                      </div>
                      <span
                        className={`text-[14px] transition-colors ${
                          isChecked
                            ? "text-brand-dark font-medium"
                            : "text-brand-dark/70 group-hover:text-brand-dark"
                        }`}
                      >
                        {flavor}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Weights Filter */}
          {initialFilterOptions.weights.length > 0 && (
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-medium text-brand-dark/60 mb-4">
                Weight Packs
              </h4>
              <div className="flex flex-wrap gap-2">
                {initialFilterOptions.weights.map((weight) => {
                  const isSelected = selectedWeights.includes(weight);
                  return (
                    <button
                      key={weight}
                      onClick={() => toggleWeight(weight)}
                      className={`px-3 py-1.5 rounded-xl text-[13px] font-medium transition-all duration-300 border ${
                        isSelected
                          ? "bg-brand-primary text-white border-brand-primary shadow-sm shadow-brand-primary/20"
                          : "bg-white text-brand-dark/70 border-brand-dark/10 hover:border-brand-primary/50 hover:text-brand-dark"
                      }`}
                    >
                      {weight}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Grid */}
      <div className="flex-1 space-y-12">
        {/* Search Bar - Minimal & elegant */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-brand-dark/40" strokeWidth={1.5} />
          </div>
          <Input
            type="search"
            placeholder="Search by authentic flavors or names..."
            className="h-14 pl-14 pr-14 rounded-2xl bg-white/50 border border-brand-dark/10 text-[15px] font-medium focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/50 shadow-sm transition-all focus:bg-white text-brand-dark/80 placeholder:text-brand-dark/40"
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-5 flex items-center text-brand-dark/30 hover:text-brand-dark transition-colors"
            >
              <X size={18} strokeWidth={2} />
            </button>
          )}

          {/* Background Loader Spinner (top right over grid) */}
          {isFetching && !isLoading && !isFetchingNextPage && (
            <div className="absolute -top-10 right-2">
              <Loader2 className="w-5 h-5 text-brand-primary animate-spin" />
            </div>
          )}
        </div>

        {isLoading ? (
          <div>...loading</div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-12">
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product: ProductType, idx: number) => (
                <motion.div
                  layout
                  layoutId={product.id}
                  key={`${product.id}-${idx}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: (idx % 9) * 0.05,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <ProductCard product={product as any} />
                </motion.div>
              ))}
            </div>

            {/* Load More Pagination Mechanism */}
            {hasNextPage && (
              <div className="flex justify-center pt-8 pb-12">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="group relative overflow-hidden rounded-full bg-white px-8 py-3.5 border border-brand-dark/10 shadow-sm transition-all hover:border-brand-primary/50 hover:shadow-md disabled:opacity-70"
                >
                  <div className="absolute inset-0 translate-y-[100%] bg-brand-primary transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:translate-y-[0%]" />
                  <div className="relative flex items-center justify-center gap-2">
                    {isFetchingNextPage ? (
                      <Loader2 className="h-4 w-4 animate-spin text-brand-dark transition-colors" />
                    ) : (
                      <span className="text-[13px] font-medium tracking-wide text-brand-dark transition-colors group-hover:text-white">
                        Discover More
                      </span>
                    )}
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : isInitialState && initialData.pagination.totalItems === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="py-32 px-6 text-center flex flex-col items-center justify-center rounded-[3rem] border border-brand-dark/5 bg-white/50 backdrop-blur-sm shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent opacity-50" />
            <div className="h-28 w-28 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 shadow-inner relative z-10">
              <Sparkles className="w-12 h-12" strokeWidth={1} />
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-dark tracking-tight mb-6 relative z-10">
              We're launching <span className="italic text-brand-primary">soon</span>
            </h3>
            <p className="text-brand-dark/70 text-[15px] sm:text-[17px] max-w-lg text-balance leading-relaxed relative z-10">
              Our master artisans are carefully handcrafting the finest traditional papads in our kitchens. 
              The ovens are warm, the spices are ready, and our full catalog is dropping very soon.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-32 text-center flex flex-col items-center justify-center space-y-4 rounded-[3rem] border border-dashed border-brand-dark/20 bg-brand-primary/5"
          >
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
              <Search
                className="w-6 h-6 text-brand-primary/50"
                strokeWidth={2}
              />
            </div>
            <h3 className="font-serif text-xl font-medium text-brand-dark tracking-tight">
              No papads found
            </h3>
            <p className="text-brand-dark/60 text-[15px] max-w-sm text-balance">
              We couldn't find any papads matching your current filters. Try
              adjusting your search, price range, or flavor selections.
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2.5 rounded-full bg-brand-dark hover:bg-[#2a1a16] text-white text-[13px] font-medium transition-all"
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
