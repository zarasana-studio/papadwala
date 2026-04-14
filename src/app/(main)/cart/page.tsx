"use client";

import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const cartTotal = total();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#FDFCF8] px-4 py-32 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center"
        >
          <div className="h-28 w-28 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-8 text-brand-primary relative overflow-hidden shadow-inner">
            <ShoppingBag className="h-10 w-10 relative z-10" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-brand-dark mb-4 tracking-tight">
            Your cart is <span className="italic text-brand-primary">empty</span>
          </h1>
          <p className="text-brand-dark/60 text-sm font-medium mb-10 max-w-sm leading-relaxed">
            Looks like you haven't added any handcrafted flavors yet. Let's find
            something delicious!
          </p>
          <Button
            asChild
            size="lg"
            className="rounded-full bg-brand-primary transition-all hover:scale-[1.02] hover:shadow-lg shadow-brand-primary/20 hover:bg-brand-primary/90 px-10 py-7 text-[15px] font-medium"
          >
            <Link href="/products">Explore Our Flavors</Link>
          </Button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] px-4 pt-24 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-14 flex flex-col sm:flex-row items-center justify-between border-b border-brand-dark/10 pb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={12} className="text-brand-primary" />
              <span className="text-[11px] font-medium tracking-widest uppercase text-brand-dark/60">
                Your Selection
              </span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl font-normal text-brand-dark tracking-tight">
              Shopping Cart
            </h1>
          </div>
          <div className="px-5 py-2.5 rounded-full bg-white/50 border border-brand-dark/10 shadow-sm backdrop-blur-sm">
            <p className="text-[13px] font-medium text-brand-dark/80">
              <span className="text-brand-primary font-bold">{items.length}</span> {items.length === 1 ? "Item" : "Items"} waiting
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Cart Items */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: idx * 0.05 }}
                className="group relative flex flex-col sm:flex-row items-center gap-6 rounded-[2rem] border border-brand-dark/5 bg-white/70 backdrop-blur-md p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-colors hover:bg-white"
              >
                <div className="h-24 w-24 rounded-2xl bg-[#FDFCF8] border border-brand-dark/5 flex items-center justify-center text-brand-dark/30 text-[10px] uppercase tracking-widest text-center shadow-inner overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 px-2 leading-relaxed">
                    [ {item.flavor} ]
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-serif text-xl font-medium text-brand-dark">
                    {item.name}
                  </h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    <span className="text-[13px] font-medium text-brand-dark/60 bg-brand-dark/5 px-2.5 py-0.5 rounded-md">
                      {item.flavor}
                    </span>
                    <span className="text-[13px] font-medium text-brand-dark/60">
                      • {item.packSize || item.weight}
                    </span>
                  </div>
                  <p className="mt-3 font-medium text-brand-primary/90 text-lg">
                    ₹{item.price}
                  </p>
                </div>

                <div className="flex items-center gap-4 mt-4 sm:mt-0">
                  <div className="flex items-center rounded-full border border-brand-dark/10 bg-white shadow-sm p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-brand-primary/10 hover:text-brand-primary text-brand-dark/70 transition-colors"
                    >
                      <Minus strokeWidth={2} className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-[14px] font-medium text-brand-dark">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 h-8 w-8 flex items-center justify-center rounded-full hover:bg-brand-primary/10 hover:text-brand-primary text-brand-dark/70 transition-colors"
                    >
                      <Plus strokeWidth={2} className="h-3 w-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-3 h-10 w-10 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-5 xl:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="sticky top-28 rounded-[2.5rem] bg-brand-dark p-8 sm:p-10 text-[#FDFCF8] shadow-2xl shadow-brand-dark/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ShoppingBag size={120} />
              </div>
              
              <div className="relative z-10">
                <h2 className="font-serif text-2xl font-normal text-white tracking-tight mb-8">
                  Order Summary
                </h2>

                <div className="space-y-4 pb-6 border-b border-white/10">
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-white/60 font-medium">Subtotal</span>
                    <span className="font-medium text-white">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-[15px]">
                    <span className="text-white/60 font-medium">Shipping</span>
                    <span className="text-brand-primary font-medium px-2.5 py-0.5 rounded bg-brand-primary/10">FREE</span>
                  </div>
                </div>

                <div className="mt-8 flex items-end justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium mb-1">Total</p>
                    <p className="text-white/40 text-[11px]">(incl. taxes)</p>
                  </div>
                  <span className="text-3xl font-serif font-normal text-brand-primary">
                    ₹{cartTotal.toFixed(2)}
                  </span>
                </div>

                <Button
                  asChild
                  className="group mt-10 w-full rounded-full bg-brand-primary py-7 text-[16px] font-medium text-white transition-all hover:scale-[1.02] shadow-xl shadow-brand-primary/20 border border-brand-primary border-t-white/20"
                >
                  <Link href="/checkout" className="flex items-center justify-center">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>

                <p className="mt-8 text-center text-[12px] font-medium text-white/40">
                  Secure encrypted checkout
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
