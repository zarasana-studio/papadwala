"use client";

import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Sun, Award } from "lucide-react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative w-full h-[calc(100vh+20px)] mask-b-from-97% flex items-center overflow-hidden">
      {/* Abstract Background Shapes */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
          delay: 0.2,
          ease: "easeOut",
        }}
        className="absolute top-0 right-0 w-1/3 h-full bg-amber-50/80 -skew-x-12 translate-x-1/2 backdrop-blur-3xl backdrop-filter z-2"
      />
      <div
        className={cn(
          "absolute inset-0 z-0",
          "bg-size-[20px_20px]",
          "bg-[radial-gradient(var(--color-amber-500)_1px,transparent_1px)]",
        )}
      />

      <div className="pointer-events-none absolute inset-0 bg-amber-50 mask-[radial-gradient(ellipse_at_left,black_50%,white_10%,transparent_80%)]"></div>

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
                Ranchi's Gold Standard of Papad
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
              Ranchi's{" "}
              <span className="text-brand-primary font-light">
                Pride.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-md text-base leading-relaxed text-brand-dark/80 mb-12"
            >
              Experience the authentic crunch that defined generations across Jharkhand. 
              Hand-rolled, sun-dried, and seasoned with our local heritage.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap items-center gap-8"
            >
              <Button
                asChild
                className="py-5 rounded-full bg-brand-primary hover:bg-brand-primary/90 px-7 text-sm font-medium tracking-wide uppercase text-white shadow transition-colors"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="relative aspect-square w-full"
            >
              {/* Decorative background circle */}
              <div className="absolute inset-0 bg-brand-primary/10 rounded-full blur-3xl scale-90" />

              {/* Papad Image with extremely slow continuous rotation */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 250, repeat: Infinity, ease: "linear" }}
                className="w-full h-full flex items-center justify-center relative z-1"
              >
                <Image
                  src="/transparent/papadcircletransparent1.webp"
                  alt="Premium Hand-rolled Papads"
                  height={1080}
                  width={1920}
                  className="object-cover scale-110 aspect-square drop-shadow-2xl drop-shadow-amber-100/50"
                  priority
                />
              </motion.div>

              {/* Floating label 1: Organic */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                className="absolute top-12 -right-2 md:-right-6 z-20"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="bg-white/60 backdrop-blur-md border border-white/40 px-5 py-3.5 rounded-2xl shadow-lg ring-1 ring-black/5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="bg-emerald-500/20 p-1.5 rounded-full">
                      <Leaf className="text-emerald-600 h-4 w-4" />
                    </div>
                    <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-brand-dark">
                      100% Organic Spices
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating label 2: Sun-Dried */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                className="absolute bottom-20 -left-2 md:-left-6 z-20"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="bg-white/60 backdrop-blur-md border border-white/40 px-5 py-3.5 rounded-2xl shadow-lg ring-1 ring-black/5"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="bg-amber-500/20 p-1.5 rounded-full">
                      <Sun className="text-amber-600 h-4 w-4" />
                    </div>
                    <span className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-brand-dark">
                      Sun-Dried Daily
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Floating label 3: Quality Seal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                className="absolute top-[20%] z-0"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{
                    duration: 4.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="bg-gradient-to-br from-brand-primary/90 to-amber-600/90 backdrop-blur-md border border-white/40 p-3 md:p-4 rounded-full shadow-lg ring-4 ring-white/40"
                >
                  <Award className="text-white h-5 w-5 md:h-6 md:w-6" />
                </motion.div>
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
