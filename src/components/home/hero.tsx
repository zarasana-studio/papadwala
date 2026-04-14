"use client";

import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh+20px)] mask-b-from-97% flex items-center overflow-hidden bg-[oklch(0.92_0.12_85)]">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[oklch(0.88_0.15_85)] -skew-x-12 translate-x-1/2 opacity-50" />
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[20px_20px]",
          "bg-[radial-gradient(var(--color-amber-500)_1px,transparent_1px)]",
        )}
      />

      <div className="pointer-events-none absolute inset-0 bg-[oklch(0.92_0.12_85)] mask-[radial-gradient(ellipse_at_left,black_50%,white_10%,transparent_80%)]"></div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Content Area */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 mb-6"
            >
              <div className="h-px w-8 bg-brand-dark/30" />
              <p className="text-[10px] font-medium tracking-[0.4em] uppercase text-brand-dark/60">
                The Gold Standard of Papad
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-serif text-7xl font-medium leading-[0.95] text-brand-dark mb-8 tracking-tighter"
            >
              Traditional
              <span className="font-light text-brand-primary"> Taste.</span>
              <br />
              Pure{" "}
              <span className="text-brand-primary font-light">
                Ingredients.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-md text-base leading-relaxed text-brand-dark/80 mb-12"
            >
              Experience the crunch that defined generations. Hand-rolled,
              sun-dried, and seasoned with heritage.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-8"
            >
              <Button
                asChild
                className="py-5 rounded-full bg-brand-dark hover:bg-brand-dark/90 px-7 text-sm font-medium tracking-wide uppercase text-white shadow transition-colors"
              >
                <Link href="/products" className="flex items-center gap-3">
                  Shop Collection
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                className="group px-7 py-5 rounded-full gap-2 text-sm font-medium tracking-wide uppercase text-brand-dark/90 hover:text-brand-dark hover:bg-yellow-100/50 shadow shadow-yellow-800/10 transition-colors bg-yellow-100/50 backdrop-blur-sm"
                asChild
              >
                <Link href="/about">Our Roots</Link>
              </Button>
            </motion.div>

            {/* Quick Stats/Trust badges */}
            <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-10">
              <StatItem label="Years of Heritage" value="35+" />
              <StatItem label="Stone Ground" value="100%" />
              <StatItem label="Hand Rolled" value="Daily" />
            </div>
          </div>

          {/* Image Area */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative aspect-square w-full"
            >
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-3xl" />

              <Image
                src="/transparent/papadcircletransparent1.webp"
                alt="Premium Hand-rolled Papads"
                height={1080}
                width={1920}
                className="object-cover scale-110 aspect-square drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
                priority
              />

              {/* Floating label */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-10 -right-4 bg-white/40 backdrop-blur-xl border border-white/40 px-6 py-4 rounded-3xl shadow-lg ring-1 ring-black/5"
              >
                <div className="flex items-center gap-3">
                  <Leaf className="text-emerald-600 h-5 w-5" />
                  <span className="text-[0.65rem] font-black tracking-widest uppercase text-brand-dark">
                    100% Organic Spices
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xl font-serif font-semibold text-brand-dark tracking-tight">
        {value}
      </span>
      <span className="text-[0.6rem] font-medium tracking-widest uppercase text-brand-dark/40">
        {label}
      </span>
    </div>
  );
}
