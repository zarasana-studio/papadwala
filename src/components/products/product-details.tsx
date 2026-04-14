"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Info, Sparkles } from "lucide-react";
import * as motion from "motion/react-client";
import { useCart } from "@/lib/store";
import { toast } from "sonner";
import Image from "next/image";

export function ProductDetails({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const addItem = useCart((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: selectedVariant.id,
      productId: product.id,
      name: product.name,
      flavor: selectedVariant.flavor,
      weight: selectedVariant.weight,
      packSize: selectedVariant.packSize,
      price: selectedVariant.price,
      quantity: 1,
    });
    toast.success(`Added ${product.name} to your basket`);
  };

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-16 lg:grid-cols-2 pt-8">
      {/* Product Image Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-square md:aspect-[4/5] rounded-[2.5rem] bg-brand-primary/5 flex items-center justify-center overflow-hidden border border-brand-primary/10 group group-hover:border-brand-primary/20 transition-colors"
      >
        <div className="absolute inset-0 bg-[radial-gradient(var(--color-amber-500)_1px,transparent_1px)] opacity-[0.15] bg-[size:16px_16px] pointer-events-none" />

        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-12 transition-transform duration-700 ease-[0.22,1,0.36,1] group-hover:scale-105"
          />
        ) : (
          <div className="relative z-10 flex flex-col items-center space-y-4 text-brand-dark/30">
            <Sparkles size={32} strokeWidth={1} />
            <span className="font-serif italic tracking-wide text-lg">
              Finest {product.name}
            </span>
          </div>
        )}
      </motion.div>

      {/* Product Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col justify-center"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] uppercase tracking-widest font-medium text-brand-dark">
              <Sparkles size={10} className="text-brand-primary" />
              {product.label?.replace("_", " ") || "Authentic"}
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium text-brand-dark tracking-tight text-balance mb-4">
            {product.name}
          </h1>
          <p className="text-2xl font-serif font-medium text-brand-primary">
            ₹{selectedVariant.price}
          </p>
        </div>

        <div className="mb-10 content-description">
          <p className="text-[15px] font-normal leading-relaxed text-brand-dark/70 text-balance">
            {product.description ||
              "The traditional handcrafted flavor of Indian kitchens, made with authentic spices and sun-dried for the perfect crispiness."}
          </p>
        </div>

        {/* Variant Selector */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-medium text-brand-dark uppercase tracking-widest">
              Available Packs
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {product.variants.map((v: any) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`relative flex flex-col rounded-2xl border p-5 text-left transition-all duration-300 focus:outline-none ${
                  selectedVariant.id === v.id
                    ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary/50 shadow-sm"
                    : "border-gray-200 hover:border-brand-primary/30 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-brand-dark">
                    {v.weight}
                  </span>
                  {selectedVariant.id === v.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-4 w-4 rounded-full bg-brand-primary flex items-center justify-center"
                    >
                      <Check
                        className="h-2.5 w-2.5 text-white"
                        strokeWidth={3}
                      />
                    </motion.div>
                  )}
                </div>
                <span className="text-[13px] text-brand-dark/60">
                  {v.flavor}
                </span>
                <span className="mt-4 text-sm font-medium text-brand-dark">
                  ₹{v.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row mb-12">
          <Button
            size="lg"
            onClick={handleAddToCart}
            className="flex-1 rounded-full bg-brand-dark hover:bg-[#2A1a16] text-amber-50 h-14 text-[15px] font-medium shadow-xl shadow-brand-dark/10 transition-all duration-300 hover:shadow-brand-dark/20 hover:-translate-y-0.5"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Basket
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-brand-dark/20 bg-white hover:bg-brand-dark/5 hover:text-brand-dark h-14 text-[15px] font-medium transition-all"
          >
            Buy Now
          </Button>
        </div>

        {/* Quality Guarantees */}
        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-brand-dark/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 border border-orange-100">
              <Check className="h-4 w-4 text-orange-600" />
            </div>
            <span className="text-[13px] font-medium text-brand-dark/80">
              Hand Rolled
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 border border-green-100">
              <Info className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-[13px] font-medium text-brand-dark/80">
              100% Organic
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
