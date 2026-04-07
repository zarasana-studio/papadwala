import { db } from "@/lib/db";
import { orders, phonepeTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const SALT_KEY = process.env.PHONEPE_SALT_KEY || "test-salt-key";
  const x_verify = request.headers.get("X-VERIFY");

  if (!x_verify) {
    return NextResponse.json({ success: false }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { response } = body;

    // Verify signature
    const string = response + SALT_KEY;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = `${sha256}###${process.env.PHONEPE_SALT_INDEX || "1"}`;

    if (checksum !== x_verify) {
      console.error("PhonePe Webhook verification failed");
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Decode response
    const decodedResponse = JSON.parse(Buffer.from(response, "base64").toString("utf8"));
    const { data } = decodedResponse;
    const { merchantTransactionId, state } = data;

    if (state === "COMPLETED") {
      await db.transaction(async (tx) => {
        const [transaction] = await tx
          .select()
          .from(phonepeTransactions)
          .where(eq(phonepeTransactions.merchantTransactionId, merchantTransactionId))
          .limit(1);

        if (transaction) {
          await tx
            .update(phonepeTransactions)
            .set({ status: "SUCCESS" })
            .where(eq(phonepeTransactions.merchantTransactionId, merchantTransactionId));

          await tx
            .update(orders)
            .set({ paymentStatus: "completed" })
            .where(eq(orders.id, transaction.orderId));
        }
      });
    } else {
      await db
        .update(phonepeTransactions)
        .set({ status: "FAILED" })
        .where(eq(phonepeTransactions.merchantTransactionId, merchantTransactionId));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PhonePe Webhook Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
