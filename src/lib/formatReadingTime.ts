export const formatReadingTime = (minutes: number): string => {
  const safeMinutes = Number.isFinite(minutes)
    ? Math.max(0, Math.trunc(minutes))
    : 0;
  return `${safeMinutes} min read`;
};

export default formatReadingTime;
