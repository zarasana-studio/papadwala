import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { orders, orderItems, productVariants, products } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

async function getOrder(orderId: string, userId: string) {
  const result = await db
    .select({
      order: orders,
      item: orderItems,
      variant: productVariants,
      product: products,
    })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, userId)))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id));

  if (result.length === 0) return null;

  const order = result[0].order;
  const items = result.map((r) => ({
    id: r.item?.id,
    quantity: r.item?.quantity,
    price: r.item?.priceAtOrder,
    variantName: r.variant?.name,
    productName: r.product?.name,
    productImage: r.product?.images?.[0],
  }));

  return { ...order, items };
}

export default async function CheckoutStatusPage({
  searchParams,
}: {
  searchParams: Promise<{
    orderId: string;
    status?: "success" | "failure" | "cancel";
  }>;
}) {
  const searchParamsResolved = await searchParams;
  const { orderId, status = "success" } = searchParamsResolved;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/signin");
  }

  // Next.js searchParams can sometimes parse missing values as `"undefined"` or `""`.
  const isValidOrderId = typeof orderId === "string" && orderId.trim() !== "" && orderId !== "undefined";
  const order = isValidOrderId ? await getOrder(orderId, session.user.id) : null;

  // Only throw 404 if the user is supposed to see a successful checkout page but the order is missing.
  // For 'failure' or 'cancel', we can just gracefully render the failure UI without the order details.
  if (status === "success" && !order) {
    notFound();
  }

  const statusConfig = {
    success: {
      icon: <CheckCircle className="w-12 h-12 text-white" />,
      title: "Order Confirmed!",
      subtitle: "Thank you for your purchase from Papadwala.",
      bg: "bg-primary",
      paymentLabel: "PAID",
      paymentColor: "text-emerald-600",
    },
    failure: {
      icon: <XCircle className="w-12 h-12 text-white" />,
      title: "Payment Failed",
      subtitle: "Something went wrong with your transaction.",
      bg: "bg-destructive",
      paymentLabel: "FAILED",
      paymentColor: "text-destructive",
    },
    cancel: {
      icon: <AlertCircle className="w-12 h-12 text-white" />,
      title: "Order Cancelled",
      subtitle: "The payment process was cancelled.",
      bg: "bg-amber-500",
      paymentLabel: "CANCELLED",
      paymentColor: "text-amber-600",
    },
  }[status];

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-none shadow-2xl overflow-hidden rounded-3xl">
          <div
            className={`${statusConfig.bg} p-12 text-center text-white relative`}
          >
            <div className="relative z-10">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 scale-110">
                {statusConfig.icon}
              </div>
              <h1 className="text-4xl font-serif font-bold mb-2">
                {statusConfig.title}
              </h1>
              <p className="opacity-90 font-medium">{statusConfig.subtitle}</p>
            </div>
          </div>

          <CardContent className="p-8 space-y-8">
            {order && (
              <div className="flex flex-col md:flex-row justify-between gap-6 pb-6 border-b border-slate-100">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">
                    Order ID
                  </p>
                  <p className="font-mono font-bold text-slate-900">{order.id}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-1">
                    Status
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-bold ${statusConfig.paymentColor}`}
                  >
                    {statusConfig.paymentLabel}
                  </div>
                </div>
              </div>
            )}

            {order && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg font-serif">Order Summary</h3>
                <div className="space-y-4 max-h-75 overflow-auto pr-2 scrollbar-hide">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center group">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        {item.productImage && (
                          <Image
                            src={item.productImage}
                            alt={item.productName || "Product"}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 truncate">
                          {item.productName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.variantName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">₹{item.price}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {order && (
              <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Amount</span>
                  <span className="font-bold text-slate-900">₹{order.total}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery To</span>
                  <span className="font-medium text-slate-800 text-right max-w-50 truncate">
                    {order.shippingAddress}
                  </span>
                </div>
              </div>
            )}

            {status !== "success" ? (
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="flex-1 rounded-full h-12 text-md font-bold group"
                >
                  <Link href={order ? `/checkout?reorder=${order.id}` : `/cart`}>
                    <RefreshCcw className="mr-2 w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Try Payment Again
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 rounded-full h-12 text-md font-bold border-2"
                >
                  <Link href="/contact">Need Help?</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <Button
                  asChild
                  className="rounded-full h-12 text-md font-bold group"
                >
                  <Link href="/products">
                    <ShoppingBag className="mr-2 w-5 h-5" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full h-12 text-md font-bold group border-2"
                >
                  <Link href="/">
                    Back to Home
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {status === "success" && (
          <p className="text-center text-muted-foreground text-sm mt-8">
            A confirmation email has been sent to your email. <br />
            Need help?{" "}
            <Link
              href="/contact"
              className="text-primary font-bold hover:underline"
            >
              Contact Support
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
