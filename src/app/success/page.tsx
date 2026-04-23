import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import orderModel from "@/domains/order/model";
import { formatIdShort } from "@/lib/formatId";
import {
  getArticleSlugForProductKey,
  getSuccessPath,
} from "@/lib/payments/routes";

export const metadata: Metadata = {
  title: "Payment status | Angel Pixel",
  description: "Review your payment result and unlock details.",
};

type SearchParams = {
  order_id?: string | string[];
};

type SuccessPageProps = {
  searchParams: Promise<SearchParams>;
};

const getOrderId = (value: string | string[] | undefined): string => {
  if (!value) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
};

const getUnlockResource = (productKey: string): string => {
  if (productKey === "article-why-portfolio-pattern") {
    return (
      process.env.PAYMENT_UNLOCK_URL_ARTICLE_PATTERN ??
      "https://github.com/angelpixel-core"
    );
  }

  return process.env.PAYMENT_UNLOCK_URL_DEFAULT ?? "https://angelpixel.io";
};

export default async function SuccessPage({
  searchParams,
}: SuccessPageProps): Promise<React.JSX.Element> {
  const resolvedSearchParams = await searchParams;
  const orderId = getOrderId(resolvedSearchParams.order_id);

  if (!orderId) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-dark dark:text-light">
        <h1 className="text-3xl font-semibold">
          We could not verify this order
        </h1>
        <p className="mt-4 text-base opacity-80">
          The payment confirmation is missing an order reference.
        </p>
        <div className="mt-8">
          <Link href="/articles" className="underline">
            Back to articles
          </Link>
        </div>
      </main>
    );
  }

  const order = await orderModel.findById(orderId);

  if (!order) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-dark dark:text-light">
        <h1 className="text-3xl font-semibold">Order not found</h1>
        <p className="mt-4 text-base opacity-80">
          We could not find this payment record. Please contact support if you
          were charged.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/articles" className="underline">
            Back to articles
          </Link>
          <a href="mailto:contact@angelpixel.io" className="underline">
            Contact support
          </a>
        </div>
      </main>
    );
  }

  const articleSlug = getArticleSlugForProductKey(order.productKey);
  const articleHref = articleSlug ? `/articles/${articleSlug}` : "/articles";
  const statusHref = getSuccessPath({
    orderId: order.id,
    productKey: order.productKey,
  });

  if (order.status === "paid") {
    const unlockUrl = getUnlockResource(order.productKey);

    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-dark dark:text-light">
        <h1 className="text-3xl font-semibold">Payment confirmed</h1>
        <p className="mt-4 text-base opacity-90 dark:opacity-80">
          Your purchase is complete. You can unlock the resource now.
        </p>

        <section className="mt-8 rounded-xl border border-dark/20 bg-light/90 p-5 dark:border-light/25 dark:bg-dark/50">
          <h2 className="text-xl font-semibold">Unlock</h2>
          <p className="mt-3 text-sm opacity-90 dark:opacity-80">
            Access is enabled for order{" "}
            <Link
              href={statusHref}
              className="font-mono underline underline-offset-4"
            >
              {formatIdShort(order.id)}
            </Link>
            .
          </p>
          <a
            href={unlockUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-md border border-dark/30 bg-dark text-sm font-semibold text-light px-4 py-2 hover:bg-dark/85 dark:border-light/30 dark:bg-light dark:text-dark dark:hover:bg-light/85"
          >
            Open unlock resource
          </a>
          <div className="mt-4">
            <Link
              href={articleHref}
              className="text-sm underline underline-offset-4"
            >
              Back to article
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (order.status === "pending") {
    return (
      <main className="mx-auto max-w-3xl px-4 py-24 text-dark dark:text-light">
        <h1 className="text-3xl font-semibold">Payment is processing</h1>
        <p className="mt-4 text-base opacity-90 dark:opacity-80">
          We are still waiting for final confirmation from Stripe. This can take
          a few seconds.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href={statusHref} className="underline underline-offset-4">
            Recheck payment status
          </Link>
          <Link href={articleHref} className="underline underline-offset-4">
            Back to article
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-24 text-dark dark:text-light">
      <h1 className="text-3xl font-semibold">Payment failed</h1>
      <p className="mt-4 text-base opacity-90 dark:opacity-80">
        We could not confirm your payment. No unlock was granted.
      </p>
      <div className="mt-8 flex gap-4">
        <Link href={articleHref} className="underline underline-offset-4">
          Try checkout again
        </Link>
        <a
          href="mailto:contact@angelpixel.io"
          className="underline underline-offset-4"
        >
          Contact support
        </a>
      </div>
    </main>
  );
}
