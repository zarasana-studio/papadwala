"use client";

import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-dark px-6 py-24 sm:py-32 lg:px-8">
      {/* Background Decorative Elements */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        className="absolute -top-24 -left-20 h-96 w-96 rounded-full bg-brand-primary blur-3xl"
      />

      <div className="relative mx-auto max-w-2xl text-center">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-serif text-5xl font-bold tracking-tight text-white sm:text-7xl"
        >
          Handcrafted <span className="text-brand-primary">Traditional</span>{" "}
          Papads
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg leading-8 text-gray-300"
        >
          Zero chemicals, 100% homemade. Bringing the authentic flavors of India
          straight to your kitchen. Hand-rolled with love and tradition.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-10 flex items-center justify-center gap-x-6"
        >
          <Button
            asChild
            size="lg"
            className="bg-brand-primary text-white hover:bg-brand-primary/90 rounded-full px-8 py-6 text-lg font-semibold transition-transform hover:scale-105"
          >
            <Link href="/products">Shop Our Flavors</Link>
          </Button>
          <Link
            href="/about"
            className="text-sm font-semibold leading-6 text-white hover:text-brand-accent transition-colors"
          >
            Our Story <span aria-hidden="true">→</span>
          </Link>
        </motion.div>
      </div>

      {/* Product Highlight / Floating Element Mock */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          rotate: [0, 2, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="mt-16 flex justify-center lg:mt-24"
      >
        <div className="relative rounded-2xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur">
          <div className="h-64 w-64 bg-brand-accent/20 rounded-xl flex items-center justify-center border border-white/10 italic text-white/50">
            [ Vibrant Papad Image ]
          </div>
        </div>
      </motion.div>
    </section>
  );
}
