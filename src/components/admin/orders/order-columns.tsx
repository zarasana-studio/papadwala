"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

export type OrderItem = {
  id: string;
  userName: string | null;
  userEmail: string | null;
  phone: string;
  total: string;
  status: "progress" | "packaging" | "shipped" | "delivered";
  paymentStatus: "pending" | "completed" | "failed";
  createdAt: string | Date;
};

export const columns: ColumnDef<OrderItem>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.original.id;
      const date = new Date(row.original.createdAt);
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900 font-serif text-sm">
            #{id.slice(0, 8)}
          </span>
          <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
            {date.toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
            })}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      const orderId = row.original.id.toLowerCase();
      const customerName = row.original.userName?.toLowerCase() ?? "";
      const searchTerm = value.toLowerCase();
      return orderId.includes(searchTerm) || customerName.includes(searchTerm);
    },
  },
  {
    accessorKey: "userName",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.getValue("userName") as string;
      const email = row.original.userEmail;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-slate-900 text-sm">
            {name || "Guest"}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {email}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.getValue("total") as string;
      return (
        <span className="font-semibold text-slate-700">₹{total}</span>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment",
    cell: ({ row }) => {
      const status = row.getValue("paymentStatus") as string;
      return (
        <Badge
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border-none shadow-sm ${
            status === "completed"
              ? "bg-green-100/80 text-green-700"
              : status === "failed"
                ? "bg-rose-100/80 text-rose-700"
                : "bg-amber-100/80 text-amber-700"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Shipping",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          className={`rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border-none shadow-sm ${
            status === "delivered"
              ? "bg-sky-100 text-sky-700"
              : status === "shipped"
                ? "bg-indigo-100/80 text-indigo-700"
                : "bg-slate-100 text-slate-600"
          }`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="text-right">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-lg border-none bg-white shadow-sm shadow-slate-100 transition-all hover:bg-slate-50"
            asChild
          >
            <Link href={`/admin/orders/${id}`}>
              <Eye className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </Button>
        </div>
      );
    },
  },
];
