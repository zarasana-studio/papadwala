"use client";

import { useCart } from "@/lib/store";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrder } from "@/lib/order-actions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CreditCard, Truck, ShieldCheck, ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const cartTotal = total();

  const handleCheckout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) {
      toast.error("Please sign in to complete your order");
      router.push("/signin?callbackUrl=/checkout");
      return;
    }

    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const shippingAddress = `${formData.get("address")}, ${formData.get("city")} - ${formData.get("pincode")}`;
      const phone = formData.get("phone") as string;

      const result = await createOrder({
        items: items.map((item) => ({
          variantId: item.id,
          quantity: item.quantity,
          priceAtOrder: item.price,
        })),
        total: cartTotal.toString(),
        shippingAddress,
        phone,
      });

      if (result.success && result.paymentUrl) {
        toast.success("Redirecting to payment...");
        clearCart();
        window.location.href = result.paymentUrl;
      } else {
        toast.error((result as any).error || "Failed to initiate payment");
        router.push("/checkout/status?status=failure");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during checkout");
      router.push("/checkout/status?status=failure");
    } finally {
      setIsPending(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="flex min-h-screen bg-[#FDFCF8] flex-col items-center justify-center p-4 text-center">
        <div className="h-24 w-24 rounded-full bg-brand-primary/10 flex items-center justify-center mb-6 text-brand-primary">
          <ShoppingBag className="h-12 w-12" />
        </div>
        <h1 className="font-serif text-3xl font-normal text-brand-dark tracking-tight mb-4 text-balance">
          You don't have anything in your cart to checkout.
        </h1>
        <Button asChild className="rounded-full bg-brand-primary font-medium text-[15px] px-8 py-6 hover:scale-[1.02] transition-transform">
          <Link href="/products">Shop Flavors</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFCF8] px-4 pt-24 pb-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <Link
            href="/cart"
            className="inline-flex items-center text-[13px] font-medium text-brand-dark/50 hover:text-brand-dark transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-7 space-y-8">
            <form onSubmit={handleCheckout} className="space-y-8">
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[2.5rem] bg-white/70 backdrop-blur-md p-8 sm:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-brand-dark/5"
              >
                <div className="flex items-center gap-3 mb-10">
                  <div className="p-2.5 rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <Truck className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h2 className="font-serif text-2xl font-normal tracking-tight text-brand-dark">
                    Delivery Details
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-brand-dark/70 font-medium text-sm ml-1">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={session?.user.name || ""}
                      required
                      className="rounded-2xl h-12 bg-white/50 border-brand-dark/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-brand-dark/70 font-medium text-sm ml-1">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91"
                      required
                      className="rounded-2xl h-12 bg-white/50 border-brand-dark/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address" className="text-brand-dark/70 font-medium text-sm ml-1">Shipping Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="House No, Street, Landmark"
                      required
                      className="rounded-2xl h-12 bg-white/50 border-brand-dark/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-brand-dark/70 font-medium text-sm ml-1">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      className="rounded-2xl h-12 bg-white/50 border-brand-dark/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-brand-dark/70 font-medium text-sm ml-1">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      required
                      maxLength={6}
                      className="rounded-2xl h-12 bg-white/50 border-brand-dark/10 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
                    />
                  </div>
                </div>
              </motion.section>

              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="rounded-[2.5rem] bg-white/70 backdrop-blur-md p-8 sm:p-10 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] border border-brand-dark/5"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-2.5 rounded-2xl bg-brand-primary/10 text-brand-primary">
                    <CreditCard className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h2 className="font-serif text-2xl font-normal tracking-tight text-brand-dark">
                    Payment Method
                  </h2>
                </div>
                
                <div className="rounded-[1.5rem] border border-brand-primary/30 bg-brand-primary/5 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="font-medium text-[15px] text-brand-dark mb-1">
                        Secure Checkout
                      </p>
                      <p className="text-[13px] font-medium text-brand-dark/60">
                        Pay via UPI, Cards, or Netbanking (PhonePe)
                      </p>
                    </div>
                    <div className="h-10 w-16 bg-white rounded-xl border border-brand-dark/10 flex items-center justify-center font-bold text-[11px] text-purple-700 shadow-sm">
                      PhonePe
                    </div>
                  </div>
                </div>
              </motion.section>

              <Button
                type="submit"
                disabled={isPending}
                className="group relative overflow-hidden w-full rounded-full bg-brand-primary py-8 border border-brand-primary border-t-white/20 shadow-xl shadow-brand-primary/20 transition-all hover:scale-[1.01] hover:shadow-2xl hover:shadow-brand-primary/30 disabled:opacity-70 disabled:hover:scale-100"
              >
                <div className="absolute inset-0 translate-y-[100%] bg-amber-600 transition-transform duration-500 ease-[0.22,1,0.36,1] group-hover:translate-y-[0%]" />
                <span className="relative z-10 flex items-center gap-2 text-[17px] font-medium text-white tracking-wide">
                  {isPending ? (
                    "Processing Request..."
                  ) : (
                    <>
                      Pay ₹{cartTotal.toFixed(2)} Securely <ShieldCheck strokeWidth={2} className="w-5 h-5 ml-1" />
                    </>
                  )}
                </span>
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5 relative">
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
               className="sticky top-28 rounded-[2.5rem] bg-brand-dark p-8 sm:p-10 text-white shadow-2xl shadow-brand-dark/20 relative overflow-hidden"
            >
              <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                <ShoppingBag size={200} />
              </div>
              <h2 className="font-serif text-2xl font-normal text-white tracking-tight mb-8">
                Order Review
              </h2>
              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-3 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shrink-0">
                      <span className="text-[10px] text-white/40 tracking-widest uppercase">[{item.quantity}x]</span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <p className="font-medium text-[15px] leading-tight mb-1 truncate text-white/90">{item.name}</p>
                      <p className="text-[12px] font-medium text-white/50">
                        {item.flavor}
                      </p>
                    </div>
                    <div className="flex items-center text-[15px] font-medium">
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4 border-t border-white/10 pt-8">
                <div className="flex justify-between text-[15px] font-medium">
                  <span className="text-white/60">Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[15px] font-medium text-brand-primary">
                  <span>Shipping</span>
                  <span className="px-2.5 py-0.5 rounded bg-brand-primary/10">FREE</span>
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

              <div className="mt-10 flex items-center justify-center gap-2 text-[12px] text-white/40 font-medium bg-white/5 py-3 rounded-full border border-white/5">
                <ShieldCheck className="h-4 w-4 text-white/60" />
                256-bit Secure Encryption
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
