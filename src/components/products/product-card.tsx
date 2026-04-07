"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import * as motion from "motion/react-client";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = product.variants?.[0]?.price || "0";
  const labelColor =
    product.label === "bestseller"
      ? "bg-amber-100 text-amber-800"
      : product.label === "featured"
        ? "bg-orange-100 text-orange-800"
        : "bg-blue-100 text-blue-800";

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Product Image Placeholder */}
      <div className="relative aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center italic text-gray-400 group-hover:bg-gray-100 transition-colors">
        {product.label && (
          <Badge
            className={`absolute top-2 left-2 uppercase tracking-tighter ${labelColor} border-none`}
          >
            {product.label.replace("_", " ")}
          </Badge>
        )}
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-10"
        >
          <span className="sr-only">View {product.name}</span>
        </Link>
        <span className="text-sm font-medium">Coming Soon</span>
      </div>

      <div className="mt-4 flex flex-col flex-1">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-lg font-bold text-brand-dark">₹{minPrice}</p>
        </div>

        <p className="mb-6 line-clamp-2 text-sm text-muted-foreground flex-1">
          {product.description ||
            "The traditional handcrafted flavor of Indian kitchens."}
        </p>

        <div className="flex items-center gap-2">
          <Button
            asChild
            className="flex-1 rounded-full bg-brand-dark hover:bg-brand-primary text-white font-semibold transition-all"
          >
            <Link href={`/products/${product.slug}`}>Select Flavor</Link>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="rounded-full border-gray-200 hover:border-brand-primary hover:text-brand-primary"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
