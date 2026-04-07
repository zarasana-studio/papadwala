"use server";

import { db } from "@/lib/db";
import { orders, orderItems, phonepeTransactions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { initiatePhonePePayment } from "@/lib/payments/phonepe";

export async function createOrder(data: {
  items: { variantId: string; quantity: number; priceAtOrder: string }[];
  total: string;
  shippingAddress: string;
  phone: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("You must be signed in to place an order");
  }

  // Create order in a transaction
  const result = await db.transaction(async (tx) => {
    const [newOrder] = await tx
      .insert(orders)
      .values({
        userId: session.user.id,
        total: data.total,
        status: "progress",
        paymentStatus: "pending",
        shippingAddress: data.shippingAddress,
        phone: data.phone,
      })
      .returning();

    await tx.insert(orderItems).values(
      data.items.map((item) => ({
        orderId: newOrder.id,
        variantId: item.variantId,
        quantity: item.quantity,
        priceAtOrder: item.priceAtOrder,
      }))
    );

    // Use the orderId as the merchantTransactionId for idempotency
    const merchantTransactionId = `T${Date.now()}${newOrder.id.slice(0, 8)}`;
    await tx.insert(phonepeTransactions).values({
      orderId: newOrder.id,
      merchantTransactionId: merchantTransactionId,
      amount: data.total,
      status: "PENDING",
    });

    return { orderId: newOrder.id, merchantTransactionId };
  });

  // Initiate PhonePe Payment
  try {
    const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/phonepe/callback?id=${result.merchantTransactionId}`;
    const phonepeResponse = await initiatePhonePePayment({
      amount: Number(data.total),
      merchantOrderId: result.merchantTransactionId,
      redirectUrl: callbackUrl,
    });

    if (phonepeResponse.success && phonepeResponse.redirectUrl) {
      return {
        success: true,
        orderId: result.orderId,
        paymentUrl: phonepeResponse.redirectUrl,
      };
    }

    return { 
      success: false, 
      error: phonepeResponse.message || "Failed to initiate payment" 
    };
  } catch (error) {
    console.error("Payment Error:", error);
    return { success: false, error: "Something went wrong during payment initiation" };
  }
}
