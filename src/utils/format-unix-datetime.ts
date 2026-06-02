/** Format a Unix timestamp (seconds) as an ISO 8601 UTC string. */
export function formatUnixIso(unixSeconds: number | bigint): string {
  return new Date(Number(unixSeconds) * 1000).toISOString();
}

/** Format a Unix timestamp for display in reason strings (UTC date and time). */
export function formatUnixDateTimeUtc(unixSeconds: number | bigint): string {
  const date = new Date(Number(unixSeconds) * 1000);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  }).format(date);
}
