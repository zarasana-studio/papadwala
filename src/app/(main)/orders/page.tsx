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
  Clock,
  CheckCircle2,
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
          flavor: row.variant?.flavor,
          weight: row.variant?.weight,
        });
      }
      return acc;
    },
    {} as Record<string, any>,
  );

  const ordersList = Object.values(groupedOrders);

  // Status visual mapping helper
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "shipped":
      case "in transit":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-brand-primary/10 text-brand-primary border-brand-primary/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "shipped":
      case "in transit":
        return <Truck className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] pt-32 pb-32">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package size={14} className="text-brand-primary" />
              <span className="text-[12px] font-medium tracking-widest uppercase text-brand-dark/60">
                Purchase History
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-brand-dark">
              My Orders
            </h1>
          </div>
          <Button asChild className="rounded-full bg-brand-dark px-6 py-5 border border-brand-dark text-white hover:bg-[#2a1a16] transition-all flex items-center justify-center shadow-lg shadow-brand-dark/10">
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {ordersList.length === 0 ? (
          <div className="p-16 sm:p-24 text-center rounded-[3rem] border border-dashed border-brand-dark/20 bg-brand-primary/5 flex flex-col items-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-8">
              <Package className="w-10 h-10 text-brand-dark/40" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-serif font-normal text-brand-dark mb-4 tracking-tight">
              No orders yet
            </h2>
            <p className="text-brand-dark/60 mb-10 max-w-sm text-balance leading-relaxed">
              You haven't ordered any of our handcrafted authentic flavors yet. 
              Let's change that!
            </p>
            <Button asChild className="rounded-full px-10 py-7 font-medium text-[15px] bg-brand-primary shadow-xl shadow-brand-primary/20 hover:scale-[1.02] transition-transform hover:bg-brand-primary/90">
              <Link href="/products">Explore Our Catalog</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            {ordersList.map((order) => (
              <div
                key={order.id}
                className="overflow-hidden rounded-[2.5rem] bg-white border border-brand-dark/5 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] transition-all hover:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.1)] group"
              >
                {/* Header Strip */}
                <div className="bg-[#FDFCF8] p-6 sm:px-10 sm:py-8 border-b border-brand-dark/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none transition-transform duration-700 ease-out group-hover:scale-110 group-hover:opacity-[0.05]">
                    <Package size={200} />
                  </div>
                  
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-y-8 gap-x-12">
                    <div className="flex items-center gap-5">
                      <div className="p-3 bg-brand-primary/10 rounded-2xl shrink-0">
                        <ShoppingBag className="w-6 h-6 text-brand-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-brand-dark/50 font-medium mb-1">
                          Order Reference
                        </p>
                        <p className="font-mono text-brand-dark text-sm sm:text-base font-medium">
                          {order.id}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-10">
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-brand-dark/50 font-medium mb-1.5">
                          Placed On
                        </p>
                        <div className="flex items-center gap-2 font-medium text-[15px] text-brand-dark">
                          <Calendar className="w-4 h-4 text-brand-dark/50" />
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
                        <p className="text-[11px] uppercase tracking-widest text-brand-dark/50 font-medium mb-1.5">
                          Order Total
                        </p>
                        <p className="font-medium text-[17px] text-brand-primary">
                          ₹{order.totalAmount}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-widest text-brand-dark/50 font-medium mb-1.5">
                          Current Status
                        </p>
                        <div className={`px-3 py-1.5 border rounded-full text-xs font-semibold flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="p-6 sm:px-10 sm:py-8">
                  <div className="space-y-6">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-6">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#FDFCF8] border border-brand-dark/5 shrink-0 flex items-center justify-center">
                          {item.productImage ? (
                            <Image
                              src={item.productImage}
                              alt={item.productName || "Product"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-brand-dark/30 tracking-widest uppercase">
                              [{item.flavor}]
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-lg text-brand-dark truncate mb-1">
                            {item.productName}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            {item.flavor && (
                              <span className="text-[12px] font-medium text-brand-dark/60 bg-brand-dark/5 px-2 py-0.5 rounded-md">
                                {item.flavor}
                              </span>
                            )}
                            <span className="text-sm font-medium text-brand-dark/60">
                              • Qty: {item.quantity}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-medium text-brand-dark text-lg">
                            ₹{item.price * item.quantity}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-[11px] text-brand-dark/40 font-medium mt-1">
                              ₹{item.price} each
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-8 border-t border-brand-dark/10 flex justify-end">
                    <Button
                      asChild
                      className="rounded-full bg-white text-brand-dark border-brand-dark/20 shadow-sm hover:bg-brand-dark hover:text-white transition-all px-6 font-medium group"
                    >
                      <Link href={`/checkout/success?orderId=${order.id}`}>
                        View Complete Details
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
