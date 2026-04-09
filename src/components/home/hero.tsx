"use client";

import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CookingPot, Leaf, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 w-full overflow-hidden bg-brand-dark">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/papadherosquare.png"
          alt="Artisan Papads"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradients and Overlays */}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-brand-dark/20 backdrop-brightness-[0.85]" />
      </div>

      {/* Content Container */}
      <div className="relative mx-auto h-full max-w-7xl px-6 lg:px-8">
        <div className="flex h-full flex-col justify-center">
          <div className="max-w-2xl space-y-8">
            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-xl"
            >
              <Sparkles size={14} className="text-amber-200" />
              <p className="text-[0.65rem] font-medium tracking-[0.3em] uppercase text-amber-50">
                Traditional Heritage Since 1987
              </p>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl font-medium leading-[1.1] text-white sm:text-7xl lg:text-8xl"
            >
              Experience the, <br />
              <span className="text-orange-200">Heritage</span> of Taste.
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-md text-lg font-medium leading-relaxed text-orange-50/90"
            >
              Artisanal small-batch papads, sun-dried and hand-rolled with
              generations of tradition. Zero chemicals, 100% soul.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <Button
                asChild
                className="group relative h-14 rounded-full bg-orange-500 px-10 text-sm font-medium tracking-wide text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
              >
                <Link href="/products" className="flex items-center gap-2">
                  <span>Explore Collection</span>
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </Button>
              <Link
                href="/about"
                className="text-sm font-medium text-white/90 underline-offset-8 transition-colors hover:text-white hover:underline"
              >
                Our Legacy
              </Link>
            </motion.div>
          </div>

          {/* Floating Features Bar (Desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="absolute bottom-12 left-6 right-6 hidden items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-2xl lg:flex max-w-7xl mx-auto"
          >
            <FeatureItem
              icon={<CookingPot size={20} className="text-amber-200" />}
              title="Small Batch Production"
              desc="Quality over quantity, every time."
            />
            <div className="h-10 w-px bg-white/10" />
            <FeatureItem
              icon={<Leaf size={20} className="text-emerald-300" />}
              title="Clean Ingredients"
              desc="No preservatives, no chemicals."
            />
            <div className="h-10 w-px bg-white/10" />
            <FeatureItem
              icon={<Sparkles size={20} className="text-orange-200" />}
              title="Authentic Spices"
              desc="Directly sourced from organic farms."
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
        {icon}
      </div>
      <div>
        <h3 className="text-xs font-semibold text-white tracking-wide">
          {title}
        </h3>
        <p className="text-[10px] text-white/60 font-medium">{desc}</p>
      </div>
    </div>
  );
}
