import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { orders, orderItems, productVariants, products } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  Package,
  Truck,
  Calendar,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  const userOrders = await db
    .select({
      order: orders,
      item: orderItems,
      variant: productVariants,
      product: products,
    })
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .leftJoin(orderItems, eq(orderItems.orderId, orders.id))
    .leftJoin(productVariants, eq(orderItems.variantId, productVariants.id))
    .leftJoin(products, eq(productVariants.productId, products.id))
    .orderBy(desc(orders.createdAt));

  // Group by orderId
  const groupedOrders = userOrders.reduce(
    (acc, row) => {
      const orderId = row.order.id;
      if (!acc[orderId]) {
        acc[orderId] = {
          ...row.order,
          items: [],
        };
      }
      if (row.item) {
        acc[orderId].items.push({
          ...row.item,
          variantName: row.variant?.name,
          productName: row.product?.name,
          productImage: row.product?.images?.[0],
        });
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const ordersList = Object.values(groupedOrders);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">
              My Orders
            </h1>
            <p className="text-muted-foreground">
              Track and manage your delicious purchases
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-2">
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Shop More
            </Link>
          </Button>
        </div>

        {ordersList.length === 0 ? (
          <Card className="p-12 text-center rounded-3xl border-dashed border-2">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-400" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-8">
              It's a great time to start your first order!
            </p>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/products">Browse Products</Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {ordersList.map((order) => (
              <Card
                key={order.id}
                className="overflow-hidden rounded-3xl border-none shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-white p-6 border-b border-slate-100">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/10 rounded-2xl">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                          Order ID
                        </p>
                        <p className="font-mono font-bold text-sm">
                          {order.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                          Date
                        </p>
                        <div className="flex items-center gap-1.5 font-medium text-sm">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                          Total
                        </p>
                        <p className="font-bold text-primary">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                          Status
                        </p>
                        <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {order.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-4 group">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-50 shrink-0">
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
                            {item.variantName} • Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-bold text-slate-900 italic">
                          ₹{item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full group font-bold text-primary hover:bg-primary/5"
                      asChild
                    >
                      <Link href={`/checkout/success?orderId=${order.id}`}>
                        View Full Details
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
