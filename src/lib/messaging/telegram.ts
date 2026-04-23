type BuildTelegramMessageInput = {
  source: string;
  page: string;
  product?: string;
  price?: string;
  intent?: string;
};

const normalizePath = (value: string): string => {
  if (!value || value.trim().length === 0) {
    return "/";
  }

  return value.startsWith("/") ? value : `/${value}`;
};

export const buildTelegramMessage = (): string => {
  return [process.env.TELEGRAM_CTA_MESSAGE].join("\n");
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
