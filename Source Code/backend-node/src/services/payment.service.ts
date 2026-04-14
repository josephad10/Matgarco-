import axios from 'axios';

const PAYMOB_BASE = 'https://accept.paymob.com';

export interface PaymobIntentionPayload {
  amount: number;         // بالقروش (× 100)
  currency: string;       // 'EGP'
  merchantOrderId: string;
  billingData: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    country: string;
    state?: string;
    postalCode?: string;
  };
  items: Array<{
    name: string;
    amount: number;
    quantity: number;
  }>;
}

export interface PaymobIntentionResult {
  clientSecret: string;
  intentionId: string;
  paymentUrl: string;
}

/**
 * Create a Paymob Payment Intention using the Intention API v2.
 * Returns client_secret used to redirect to Paymob hosted checkout.
 *
 * Flow:
 *  POST https://accept.paymob.com/v1/intention
 *  → { client_secret, id }
 *
 * Redirect:
 *  https://accept.paymob.com/unifiedcheckout/?publicKey=<PK>&clientSecret=<CS>
 */
export async function createPaymobIntention(
  payload: PaymobIntentionPayload,
  merchantKeys?: { secretKey: string; publicKey: string }
): Promise<PaymobIntentionResult> {
  const secretKey = merchantKeys?.secretKey || process.env.PAYMOB_SECRET_KEY;
  const publicKey = merchantKeys?.publicKey || process.env.PAYMOB_PUBLIC_KEY;

  if (!secretKey || !publicKey) {
    throw new Error('Paymob credentials (PAYMOB_SECRET_KEY / PAYMOB_PUBLIC_KEY) not configured');
  }

  // All payment methods available (online card by default)
  const body = {
    amount: payload.amount,
    currency: payload.currency,
    payment_methods: ['card'],
    items: payload.items.map((i) => ({
      name: i.name,
      amount: i.amount,
      quantity: i.quantity,
    })),
    billing_data: {
      first_name: payload.billingData.firstName,
      last_name: payload.billingData.lastName,
      phone_number: payload.billingData.phone,
      email: payload.billingData.email,
      street: payload.billingData.street,
      city: payload.billingData.city,
      country: payload.billingData.country,
      state: payload.billingData.state || payload.billingData.city,
      postal_code: payload.billingData.postalCode || 'NA',
    },
    extras: {
      merchant_order_id: payload.merchantOrderId,
    },
  };

  const response = await axios.post(`${PAYMOB_BASE}/v1/intention/`, body, {
    headers: {
      Authorization: `Token ${secretKey}`,
      'Content-Type': 'application/json',
    },
  });

  const { client_secret: clientSecret, id: intentionId } = response.data;

  if (!clientSecret) {
    throw new Error('Paymob did not return a client_secret');
  }

  const paymentUrl = `${PAYMOB_BASE}/unifiedcheckout/?publicKey=${publicKey}&clientSecret=${clientSecret}`;

  return { clientSecret, intentionId, paymentUrl };
}

/**
 * Verify Paymob HMAC signature on webhook payload.
 * Paymob signs callbacks using HMAC-SHA512.
 */
export function verifyPaymobHmac(data: Record<string, any>, receivedHmac: string): boolean {
  const hmacSecret = process.env.PAYMOB_HMAC_SECRET;
  if (!hmacSecret) return true; // Skip if not configured (dev mode)

  const { createHmac } = require('crypto');

  // Paymob concatenates specific fields alphabetically
  const concatenated = [
    data.amount_cents,
    data.created_at,
    data.currency,
    data.error_occured,
    data.has_parent_transaction,
    data.id,
    data.integration_id,
    data.is_3d_secure,
    data.is_auth,
    data.is_capture,
    data.is_refunded,
    data.is_standalone_payment,
    data.is_voided,
    data.order?.id,
    data.owner,
    data.pending,
    data.source_data?.pan,
    data.source_data?.sub_type,
    data.source_data?.type,
    data.success,
  ].join('');

  const computed = createHmac('sha512', hmacSecret)
    .update(concatenated)
    .digest('hex');

  return computed === receivedHmac;
}
