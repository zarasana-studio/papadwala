"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import Image from "next/image";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string[] | null;
  label: string | null;
  variants?: { price: string }[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = product.variants?.[0]?.price || "0";
  const firstImage = product.images?.[0] || "/placeholder.png";

  const labelColor =
    product.label === "bestseller"
      ? "bg-amber-50/80 text-amber-700 font-medium"
      : product.label === "featured"
        ? "bg-orange-50/80 text-orange-700 font-medium"
        : "bg-blue-50/80 text-blue-700 font-medium";

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-sm shadow-slate-100 transition-all hover:shadow-xl hover:shadow-slate-200/50"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-slate-50">
        {product.label && (
          <Badge
            className={`absolute top-4 left-4 z-20 border-none px-3 py-1 text-[10px] uppercase tracking-widest backdrop-blur-md ${labelColor}`}
          >
            {product.label.replace("_", " ")}
          </Badge>
        )}
        
        <Image
          src={firstImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 z-10 bg-black/0 transition-colors duration-300 group-hover:bg-black/5" />
        
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-0 z-20"
        >
          <span className="sr-only">View {product.name}</span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-col p-6 pt-5">
        <div className="mb-1 flex items-start justify-between">
          <h3 className="font-serif text-xl font-medium tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="text-lg font-medium text-slate-900">₹{minPrice}</p>
        </div>

        <p className="mb-6 line-clamp-2 text-xs font-medium leading-relaxed text-slate-500">
          {product.description ||
            "The traditional handcrafted flavor of Indian kitchens."}
        </p>

        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 rounded-2xl border-none bg-slate-50 h-11 text-xs font-semibold text-slate-700 shadow-sm shadow-slate-100 transition-all hover:bg-orange-500 hover:text-white"
          >
            <Link href={`/products/${product.slug}`} className="flex items-center justify-center gap-2">
              <span>View Details</span>
              <ArrowRight size={14} />
            </Link>
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="h-11 w-11 rounded-2xl border-none bg-slate-50 text-slate-400 shadow-sm shadow-slate-100 transition-all hover:bg-slate-100 hover:text-slate-600"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
