"use client";

import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import * as motion from "motion/react-client";

interface ProductShowcaseProps {
  products: Product[];
}

export function ProductShowcase({ products }: ProductShowcaseProps) {
  return (
    <section className="py-32 mask-y-from-95% overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
        {/* Subtle background decorative shapes inside the container */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-brand-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-6 mb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-2 px-3 py-1 bg-brand-primary/10 backdrop-blur-sm rounded-full border border-brand-primary/30 group"
          >
            <Sparkles
              size={10}
              className="text-amber-600 transition-transform duration-500 group-hover:rotate-12"
            />
            <span className="text-[10px] font-medium tracking-widest uppercase text-brand-dark/80">
              Curated selection
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif text-6xl font-normal text-brand-dark"
          >
            Our Signature{" "}
            <span className="text-brand-primary font-light">Flavors</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl text-brand-dark/80 text-sm sm:text-base font-normal leading-relaxed text-balance"
          >
            Experience the crunch that defined generations. Hand-rolled,
            sun-dried, and seasoned with our century-old heritage recipes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          {products.slice(0, 4).map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                delay: idx * 0.1,
                duration: 0.7,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-24 flex justify-center relative z-10"
        >
          <Button
            asChild
            className="overflow-hidden group py-5 rounded-full bg-brand-dark hover:bg-brand-dark/80 px-8 text-sm font-medium tracking-wide uppercase text-white "
          >
            <Link href="/products" className="flex items-center gap-3 relative">
              <span className="relative z-10">View All Flavors</span>
              <ArrowRight
                size={18}
                className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
