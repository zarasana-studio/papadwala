/**
 * PhonePe Payment Gateway Integration - V2 API (OAuth)
 * Uses Client ID + Client Secret to get a Bearer Token, then calls checkout v2 APIs.
 * Docs: https://developer.phonepe.com/payment-gateway/website-integration/standard-checkout
 */

const CLIENT_ID = process.env.PHONEPE_CLIENT_ID || "";
const CLIENT_SECRET = process.env.PHONEPE_CLIENT_SECRET || "";
const CLIENT_VERSION = process.env.PHONEPE_CLIENT_VERSION || "1";
const PHONEPE_HOST =
  process.env.PHONEPE_HOST || "https://api-preprod.phonepe.com/apis/pg-sandbox";

// In-memory token cache to avoid fetching a new token on every request
let cachedToken: { token: string; expiresAt: number } | null = null;

/**
 * Step 1: Get an OAuth Bearer Token using client credentials.
 * Token is cached until it expires.
 */
export async function getPhonePeToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.token;
  }

  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    client_version: CLIENT_VERSION,
    client_secret: CLIENT_SECRET,
    grant_type: "client_credentials",
  });

  const response = await fetch(`${PHONEPE_HOST}/v1/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PhonePe token fetch failed: ${response.status} - ${text}`);
  }

  const data = await response.json();

  if (!data.access_token) {
    throw new Error(`PhonePe token response invalid: ${JSON.stringify(data)}`);
  }

  cachedToken = {
    token: data.access_token,
    expiresAt: data.expires_at ?? now + 600,
  };

  return cachedToken.token;
}

/**
 * Step 2: Initiate a payment session.
 * Returns the redirectUrl (PhonePe-hosted payment page) and the PhonePe orderId.
 */
export async function initiatePhonePePayment(data: {
  amount: number; // in rupees — will be converted to paise internally
  merchantOrderId: string; // your internal order ID used as the idempotency key
  redirectUrl: string; // where PhonePe redirects after payment
}) {
  const token = await getPhonePeToken();

  const payload = {
    merchantOrderId: data.merchantOrderId,
    amount: Math.round(data.amount * 100), // Convert to paise
    expireAfter: 1200, // 20 minutes
    paymentFlow: {
      type: "PG_CHECKOUT",
      merchantUrls: {
        redirectUrl: data.redirectUrl,
      },
    },
  };

  const response = await fetch(`${PHONEPE_HOST}/checkout/v2/pay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok || !result.redirectUrl) {
    console.error("PhonePe initiation failed:", JSON.stringify(result));
    return { success: false, message: result.message || "Payment initiation failed", data: result };
  }

  return { success: true, redirectUrl: result.redirectUrl as string, orderId: result.orderId as string };
}

/**
 * Step 3: Check the status of a payment using the merchant order ID.
 */
export async function checkPhonePeStatus(merchantOrderId: string) {
  const token = await getPhonePeToken();

  const response = await fetch(
    `${PHONEPE_HOST}/checkout/v2/order/${merchantOrderId}/status`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `O-Bearer ${token}`,
      },
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error("PhonePe status check failed:", JSON.stringify(result));
    throw new Error(result.message || "Status check failed");
  }

  return result as {
    orderId: string;
    state: "COMPLETED" | "PENDING" | "FAILED";
    amount: number;
    paymentDetails?: { state: string }[];
  };
}
