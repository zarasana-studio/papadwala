"use client";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight } from "lucide-react";
import * as motion from "motion/react-client";
import { Link } from "next-view-transitions";
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
      ? "bg-amber-100/90 text-amber-900 shadow-amber-900/10"
      : product.label === "featured"
        ? "bg-emerald-100/90 text-emerald-900 shadow-emerald-900/10"
        : "bg-white/90 text-brand-dark/80 shadow-brand-dark/5";

  return (
    <motion.div
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      className="group h-[400px] relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white/30 p-2 shadow-sm shadow-brand-dark/5"
    >
      {/* Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative h-1/2 w-full overflow-hidden rounded-[2rem] bg-[oklch(0.97_0.01_85)]"
      >
        {product.label && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={`absolute top-4 left-4 z-20 rounded-full border border-white/50 px-3 py-1 text-[9px] font-medium uppercase tracking-widest shadow-sm backdrop-blur-md ${labelColor}`}
          >
            {product.label.replace("_", " ")}
          </motion.div>
        )}

        <Image
          src={firstImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-1000 ease-[0.25,1,0.5,1] group-hover:scale-105"
        />
      </Link>

      {/* Content */}
      <div className="flex flex-col p-3 pt-5">
        <div className="mb-2 flex flex-col items-start justify-between gap-2">
          <h3 className="font-serif text-base font-medium tracking-tight text-brand-dark transition-colors truncate w-[99%] group-hover:text-amber-700">
            <Link
              href={`/products/${product.slug}`}
              className="focus:outline-none"
            >
              {product.name}
            </Link>
          </h3>
          <p className="text-base font-medium text-green-800 shrink-0">
            ₹{minPrice}
          </p>
        </div>

        <p className="mb-6 line-clamp-2 text-xs font-normal leading-relaxed text-brand-dark/60 text-balance">
          {product.description ||
            "The traditional handcrafted flavor of Indian kitchens."}
        </p>

        <div className="flex items-center gap-3">
          <Button
            asChild
            className="flex-1 rounded-full bg-brand-primary hover:bg-brand-primary/80 h-10 text-sm font-medium text-white transition-all duration-300 active:translate-y-0"
          >
            <Link
              href={`/products/${product.slug}`}
              className="flex items-center justify-center gap-2 group/btn"
            >
              <span>View Details</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover/btn:translate-x-1"
              />
            </Link>
          </Button>
          <Button
            size="icon"
            className="group/cart h-10 w-10 shrink-0 rounded-full bg-white/60 hover:bg-white/40 cursor-pointer border border-brand-dark/10 text-brand-dark/70 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] "
          >
            <ShoppingCart className="h-4 w-4 group-hover/cart:text-brand-primary transition-colors duration-200 ease-in-out" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
