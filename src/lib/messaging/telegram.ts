export const buildTelegramMessage = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_TELEGRAM_CTA_TEMPLATE_EN;
  const normalized = fromEnv?.replace(/\\n/g, "\n").trim();

  if (normalized && normalized.length > 0) {
    return normalized;
  }

  return "Hi Angel 👋 I found your portfolio and I'd like to discuss working together. Could we talk?";
};

export const buildTelegramUrl = (
  baseTelegramUrl: string,
  message: string
): string => {
  try {
    const url = new URL(baseTelegramUrl);
    url.searchParams.set("text", message);
    return url.toString();
  } catch {
    const encodedMessage = encodeURIComponent(message);
    const separator = baseTelegramUrl.includes("?") ? "&" : "?";
    return `${baseTelegramUrl}${separator}text=${encodedMessage}`;
  }
};
