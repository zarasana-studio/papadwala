"use client";

import { useCart } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const cartTotal = total();

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white px-4 py-32 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-brand-dark mb-4 uppercase tracking-widest">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground italic mb-10 max-w-sm">
          Looks like you haven't added any handcrafted flavors yet. Let's find
          something delicious!
        </p>
        <Button
          asChild
          size="lg"
          className="rounded-full bg-brand-primary px-10 py-6 font-bold"
        >
          <Link href="/products">Shop Flavors</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12 border-b border-gray-100 pb-10">
          <h1 className="font-serif text-4xl font-bold text-brand-dark uppercase tracking-widest">
            Shopping Cart
          </h1>
          <p className="mt-2 text-muted-foreground italic">
            {items.length} {items.length === 1 ? "item" : "items"} in your cart.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row items-center gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
              >
                <div className="h-24 w-24 rounded-2xl bg-gray-50 flex items-center justify-center italic text-gray-400 text-xs text-center border border-gray-100">
                  [ {item.name} ]
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-serif text-xl font-bold text-brand-dark">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.flavor} • {item.weight} • {item.packSize}
                  </p>
                  <p className="mt-1 font-bold text-brand-primary">
                    ₹{item.price}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-gray-200">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:text-brand-primary transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:text-brand-primary transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-gray-400 hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl bg-brand-dark p-8 text-white shadow-xl shadow-brand-dark/20">
              <h2 className="font-serif text-2xl font-bold uppercase tracking-widest mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 border-b border-white/10 pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-brand-primary">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <Button
                asChild
                className="mt-8 w-full rounded-full bg-brand-primary py-8 text-lg font-bold text-white hover:bg-brand-primary/90 transition-transform hover:scale-[1.02]"
              >
                <Link
                  href="/checkout"
                  className="flex items-center justify-center"
                >
                  Checkout
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <p className="mt-6 text-center text-xs text-gray-400 italic">
                Secure payment powered by PhonePe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
