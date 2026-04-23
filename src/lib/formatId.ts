export const formatIdShort = (value: string, head = 8, tail = 6): string => {
  if (!value) return "";
  if (value.length <= head + tail + 1) return value;

  const start = value.slice(0, head);
  const end = value.slice(-tail);
  return `${start}...${end}`;
};
