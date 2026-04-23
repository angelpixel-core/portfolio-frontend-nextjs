const PRODUCT_ARTICLE_SLUG_MAP: Record<string, string> = {
  "article-why-portfolio-pattern": "why-portfolio-not-convert",
};

export const getArticleSlugForProductKey = (
  productKey: string
): string | null => {
  return PRODUCT_ARTICLE_SLUG_MAP[productKey] ?? null;
};

export const getSuccessPath = (input: {
  orderId: string;
  productKey: string;
}): string => {
  const articleSlug = getArticleSlugForProductKey(input.productKey);

  if (articleSlug) {
    return `/articles/${articleSlug}/success?order_id=${input.orderId}`;
  }

  return `/success?order_id=${input.orderId}`;
};

export const getCancelPath = (input: {
  orderId: string;
  productKey: string;
}): string => {
  const articleSlug = getArticleSlugForProductKey(input.productKey);

  if (articleSlug) {
    return `/articles/${articleSlug}/cancel?order_id=${input.orderId}`;
  }

  return `/cancel?order_id=${input.orderId}`;
};
