import { db } from "@/lib/db";
import { orders, phonepeTransactions } from "@/lib/db/schema";
import { checkPhonePeStatus } from "@/lib/payments/phonepe";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const merchantTransactionId = searchParams.get("id");

  const failureUrl = new URL("/checkout/status?status=failure", request.url);

  if (!merchantTransactionId) {
    return NextResponse.redirect(failureUrl);
  }

  try {
    const statusResult = await checkPhonePeStatus(merchantTransactionId);

    // Find the transaction and order
    const [transaction] = await db
      .select()
      .from(phonepeTransactions)
      .where(eq(phonepeTransactions.merchantTransactionId, merchantTransactionId))
      .limit(1);

    if (!transaction) {
      return NextResponse.redirect(failureUrl);
    }

    if (statusResult.state === "COMPLETED") {
      // Update DB atomically
      await db.transaction(async (tx) => {
        await tx
          .update(phonepeTransactions)
          .set({
            status: "SUCCESS",
            pgResponse: JSON.stringify(statusResult),
          })
          .where(eq(phonepeTransactions.merchantTransactionId, merchantTransactionId));

        await tx
          .update(orders)
          .set({
            paymentStatus: "completed",
          })
          .where(eq(orders.id, transaction.orderId));
      });

      const successUrl = new URL(
        `/checkout/status?status=success&orderId=${transaction.orderId}`,
        request.url
      );
      return NextResponse.redirect(successUrl);
    } else {
      // Update as failed
      await db
        .update(phonepeTransactions)
        .set({
          status: "FAILED",
          pgResponse: JSON.stringify(statusResult),
        })
        .where(eq(phonepeTransactions.merchantTransactionId, merchantTransactionId));

      const failureWithOrderUrl = new URL(
        `/checkout/status?status=failure&orderId=${transaction.orderId}`,
        request.url
      );
      return NextResponse.redirect(failureWithOrderUrl);
    }
  } catch (error) {
    console.error("PhonePe Callback Error:", error);
    return NextResponse.redirect(failureUrl);
  }
}
