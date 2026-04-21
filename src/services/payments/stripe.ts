import { logger } from "@/lib/logger";

export type CheckoutProduct = {
  productKey: string;
  name: string;
  amount: number;
  currency: string;
  priceId?: string;
};

type CreateStripeCheckoutSessionInput = {
  orderId: string;
  product: CheckoutProduct;
  email?: string;
  source?: string;
};

type StripeCreateSessionResult =
  | {
      ok: true;
      url: string;
      sessionId: string;
      paymentIntentId: string | null;
    }
  | { ok: false };

const STRIPE_API_BASE = "https://api.stripe.com/v1";

const CHECKOUT_PRODUCTS: Record<string, Omit<CheckoutProduct, "productKey">> = {
  "article-why-portfolio-pattern": {
    name: "Hire Entry Pattern",
    amount: 2900,
    currency: "usd",
    priceId: process.env.STRIPE_PRICE_ID_ARTICLE_PATTERN,
  },
};

const getStripeConfig = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    "http://localhost:9000";

  if (!secretKey) {
    logger.warn("Payments", "Missing Stripe secret key");
    return null;
  }

  return { secretKey, siteUrl: siteUrl.replace(/\/$/, "") };
};

export const resolveCheckoutProduct = (
  productKey: string
): CheckoutProduct | null => {
  const product = CHECKOUT_PRODUCTS[productKey];
  if (!product) {
    return null;
  }

  return { productKey, ...product };
};

export const createStripeCheckoutSession = async (
  input: CreateStripeCheckoutSessionInput
): Promise<StripeCreateSessionResult> => {
  const config = getStripeConfig();
  if (!config) {
    return { ok: false };
  }

  const params = new URLSearchParams();
  params.set("mode", "payment");
  params.set(
    "success_url",
    `${config.siteUrl}/success?order_id=${input.orderId}`
  );
  params.set(
    "cancel_url",
    `${config.siteUrl}/cancel?order_id=${input.orderId}`
  );
  params.set("metadata[order_id]", input.orderId);
  params.set("metadata[product_key]", input.product.productKey);

  if (input.source) {
    params.set("metadata[source]", input.source);
  }

  if (input.email) {
    params.set("customer_email", input.email);
  }

  if (input.product.priceId) {
    params.set("line_items[0][price]", input.product.priceId);
  } else {
    params.set("line_items[0][price_data][currency]", input.product.currency);
    params.set(
      "line_items[0][price_data][unit_amount]",
      String(input.product.amount)
    );
    params.set(
      "line_items[0][price_data][product_data][name]",
      input.product.name
    );
  }

  params.set("line_items[0][quantity]", "1");

  try {
    const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const body = await response.text();
      logger.error("Payments", "Stripe checkout session creation failed", {
        status: response.status,
        body,
        orderId: input.orderId,
      });
      return { ok: false };
    }

    const data = (await response.json()) as {
      id?: string;
      url?: string;
      payment_intent?: string;
    };

    if (!data.id || !data.url) {
      logger.error(
        "Payments",
        "Stripe checkout session missing required fields",
        {
          orderId: input.orderId,
          hasId: Boolean(data.id),
          hasUrl: Boolean(data.url),
        }
      );
      return { ok: false };
    }

    return {
      ok: true,
      url: data.url,
      sessionId: data.id,
      paymentIntentId: data.payment_intent ?? null,
    };
  } catch (error) {
    logger.error("Payments", "Stripe checkout session request error", error);
    return { ok: false };
  }
};
