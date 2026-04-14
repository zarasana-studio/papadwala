import Image from "next/image";
import * as motion from "motion/react-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Sparkles } from "lucide-react";

export default function HeroV2() {
  return (
    <section className="relative h-[calc(100vh+20px)] w-full bg-hero-radial bg-grain overflow-hidden flex items-center justify-center pt-20 mask-b-from-97%">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/papadherowideview40kb.webp"
          alt="Premium Hand-rolled Papads"
          fill
          className="object-bottom object-cover brightness-105 contrast-125 opacity-70 mix-blend-overlay"
          priority
        />
      </div>

      {/* Decorative Radial Overlay for content focus */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,oklch(0.95_0.02_85/0.4)_100%] pointer-events-none z-10" />

      {/* Content Area */}
      <div className="relative z-30 max-w-5xl px-6 text-center">
        {/* Value Prop Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-10"
        >
          <ValueBadge icon={<Leaf size={14} />} text="100% Organic" />
          <ValueBadge icon={<Sparkles size={14} />} text="Hand-made Heritage" />
        </motion.div>

        {/* Primary Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-[clamp(2.5rem,8vw,5.5rem)] font-black leading-[1.05] text-brand-dark tracking-tight mb-8"
        >
          The Authentic <br />
          <span className="italic font-light">Taste of Tradition.</span>
        </motion.h1>

        {/* Descriptive Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-brand-dark/70 mb-12 text-balance"
        >
          Discover a diverse world of papad varieties, sun-dried and hand-rolled
          with zero artificial flavors. Pure heritage in every crunch.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6"
        >
          <Button
            asChild
            className="w-full sm:w-auto h-14 sm:h-16 rounded-full bg-brand-dark hover:bg-brand-dark/90 px-8 sm:px-10 text-sm font-bold tracking-[0.1em] uppercase text-white shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/products" className="flex items-center gap-3">
              Explore Our Varieties
              <ArrowRight size={18} />
            </Link>
          </Button>

          <Link
            href="/our-story"
            className="group flex items-center gap-2 text-sm font-bold tracking-[0.1em] uppercase text-brand-dark/60 hover:text-brand-dark transition-colors"
          >
            <span>Our Roots</span>
            <div className="h-px w-6 bg-brand-dark/20 group-hover:w-10 transition-all duration-300" />
          </Link>
        </motion.div>

        {/* Trust Stats (Mobile Responsive) */}
        <div className="mt-16 sm:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 border-t border-brand-dark/5 pt-10 sm:pt-12 opacity-60">
          <Stat text="35+ Years Heritage" />
          <Stat text="Ancient Recipes" />
          <Stat text="No Preservatives" />
          <Stat text="Chemical Free" />
        </div>
      </div>
    </section>
  );
}

function ValueBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 px-4 py-1.5 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-[0.65rem] font-black uppercase tracking-widest text-brand-dark/80 shadow-sm">
      {icon}
      <span>{text}</span>
    </div>
  );
}

function Stat({ text }: { text: string }) {
  return (
    <div className="text-center">
      <p className="text-[0.6rem] font-bold tracking-[0.2em] uppercase text-brand-dark">
        {text}
      </p>
    </div>
  );
}
