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
import { motion } from "motion/react";
import { CreditCard, Truck, ShieldCheck, ArrowLeft } from "lucide-react";
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
      <div className="flex h-[60vh] flex-col items-center justify-center p-4 text-center">
        <h1 className="font-serif text-3xl font-bold">Your cart is empty</h1>
        <Button asChild className="mt-4 rounded-full bg-brand-primary">
          <Link href="/products">Shop Flavors</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <Link
            href="/cart"
            className="flex items-center text-sm font-medium text-muted-foreground hover:text-brand-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Shipping & Payment Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleCheckout} className="space-y-8">
              <section className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="flex items-center gap-3 font-serif text-2xl font-bold uppercase tracking-widest text-brand-dark mb-8">
                  <Truck className="h-6 w-6 text-brand-primary" /> Delivery
                  Details
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={session?.user.name || ""}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="address">Shipping Address</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="House No, Street, Landmark"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      required
                      maxLength={6}
                      className="rounded-xl"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-3xl bg-white p-8 shadow-sm">
                <h2 className="flex items-center gap-3 font-serif text-2xl font-bold uppercase tracking-widest text-brand-dark mb-8">
                  <CreditCard className="h-6 w-6 text-brand-primary" /> Payment
                  Method
                </h2>
                <div className="rounded-2xl border-2 border-brand-primary bg-brand-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-brand-dark lowercase first-letter:uppercase">
                        UPI / Online via PhonePe
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Secure, integrated payment
                      </p>
                    </div>
                    <div className="h-8 w-12 bg-white rounded border border-gray-100 flex items-center justify-center font-bold text-[10px] text-purple-700">
                      PhonePe
                    </div>
                  </div>
                </div>
              </section>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full rounded-full bg-brand-primary py-8 text-xl font-bold text-white transition-all hover:scale-[1.01] shadow-lg shadow-brand-primary/20"
              >
                {isPending
                  ? "Processing..."
                  : `Pay ₹${cartTotal.toFixed(2)} Now`}
              </Button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 rounded-3xl bg-brand-dark p-8 text-white">
              <h2 className="font-serif text-2xl font-bold uppercase tracking-widest mb-6">
                Your Order
              </h2>
              <div className="space-y-4 max-h-75 overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-bold">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.flavor} x {item.quantity}
                      </p>
                    </div>
                    <span>
                      ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3 border-t border-white/10 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-green-400">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-2xl font-bold">
                <span>Total</span>
                <span className="text-brand-primary">
                  ₹{cartTotal.toFixed(2)}
                </span>
              </div>

              <div className="mt-10 flex items-center justify-center gap-4 text-xs text-gray-400 italic">
                <ShieldCheck className="h-4 w-4" />
                100% Secure Checkout & Transaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
