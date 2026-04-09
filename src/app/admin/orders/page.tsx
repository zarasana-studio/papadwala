import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { OrderTable } from "@/components/admin/orders/order-table";
import { OrderItem } from "@/components/admin/orders/order-columns";

export default async function AdminOrdersPage() {
  const allOrders = await db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      paymentStatus: orders.paymentStatus,
      createdAt: orders.createdAt,
      phone: orders.phone,
      userName: users.name,
      userEmail: users.email,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  const stats = [
    {
      label: "In Progress",
      count: allOrders.filter((o) => o.status === "progress").length,
      bg: "bg-amber-50/50",
      text: "text-amber-700",
      icon: Package,
      iconColor: "text-amber-500",
    },
    {
      label: "Shipped",
      count: allOrders.filter((o) => o.status === "shipped").length,
      bg: "bg-sky-50/50",
      text: "text-sky-700",
      icon: Truck,
      iconColor: "text-sky-500",
    },
    {
      label: "Delivered",
      count: allOrders.filter((o) => o.status === "delivered").length,
      bg: "bg-emerald-50/50",
      text: "text-emerald-700",
      icon: CheckCircle2,
      iconColor: "text-emerald-500",
    },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-medium tracking-tight font-serif text-slate-900">
          Order Management
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Track and update the status of customer orders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className={`rounded-3xl border-none shadow-sm shadow-slate-100 overflow-hidden transition-all hover:opacity-90 ${stat.bg}`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={`text-[11px] font-semibold uppercase tracking-wider ${stat.text}`}>
                {stat.label}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight text-slate-900">
                {stat.count}
              </div>
              <p className={`text-[10px] font-medium uppercase tracking-wider opacity-60 ${stat.text}`}>
                Current Orders
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <OrderTable data={allOrders as OrderItem[]} />
    </div>
  );
}
