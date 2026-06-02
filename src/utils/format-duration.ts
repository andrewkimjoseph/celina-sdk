/** Format a duration in seconds as a short human-readable string (hours and minutes). */
export function formatDuration(seconds: bigint | number): string {
  const total = Number(seconds);
  if (total <= 0) return "0 minutes";

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} hour${hours === 1 ? "" : "s"}`);
  }
  if (minutes > 0 || hours === 0) {
    parts.push(`${minutes} minute${minutes === 1 ? "" : "s"}`);
  }

  return parts.join(" ");
}
