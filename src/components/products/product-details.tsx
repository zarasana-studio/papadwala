"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check, Info } from "lucide-react";
import * as motion from "motion/react-client";
import { useCart } from "@/lib/store";
import { toast } from "sonner";

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
    toast.success(`Added ${product.name} (${selectedVariant.flavor}) to cart!`);
  };

  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-10 lg:grid-cols-2">
      {/* Product Image */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="aspect-square rounded-3xl bg-gray-50 flex items-center justify-center italic text-gray-400 text-xl border border-gray-100"
      >
        [ Product Image: {product.name} ]
      </motion.div>

      {/* Product Info */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col"
      >
        <div className="mb-4">
          <Badge className="bg-orange-100 text-orange-800 border-none uppercase tracking-tighter mb-2">
            {product.label?.replace("_", " ") || "Authentic"}
          </Badge>
          <h1 className="font-serif text-4xl font-bold text-brand-dark sm:text-5xl uppercase tracking-widest text-balance">
            {product.name}
          </h1>
          <p className="mt-4 text-2xl font-bold text-brand-primary">
            ₹{selectedVariant.price}
          </p>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest mb-4">
            About this flavor
          </h3>
          <p className="text-lg text-muted-foreground italic leading-relaxed">
            {product.description ||
              "The traditional handcrafted flavor of Indian kitchens."}
          </p>
        </div>

        {/* Variant Selector */}
        <div className="mt-10">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-widest mb-4">
            Select Variant
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {product.variants.map((v: any) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`relative flex flex-col rounded-2xl border p-4 text-left transition-all focus:outline-none ${
                  selectedVariant.id === v.id
                    ? "border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary"
                    : "border-gray-200 hover:border-brand-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-brand-dark">{v.weight}</span>
                  {selectedVariant.id === v.id && (
                    <Check className="h-4 w-4 text-brand-primary" />
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {v.flavor} • {v.packSize}
                </span>
                <span className="mt-2 text-sm font-bold text-brand-dark">
                  ₹{v.price}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Add to Cart */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Button
            size="lg"
            onClick={handleAddToCart}
            className="flex-1 rounded-full bg-brand-dark hover:bg-brand-primary text-white font-bold py-8 text-lg shadow-xl shadow-brand-dark/10 transition-all hover:scale-[1.02]"
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            Add to Cart
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-gray-200 py-8 text-lg font-semibold hover:border-brand-dark"
          >
            Buy Now
          </Button>
        </div>

        {/* Features */}
        <div className="mt-10 grid grid-cols-1 gap-4 border-t border-gray-100 pt-10 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              Hand Rolled
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-600">
              No Preservatives
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
