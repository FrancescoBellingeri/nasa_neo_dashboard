export function formatKm(km: number): string {
  if (km >= 1_000_000) return `${(km / 1_000_000).toFixed(2)}M km`;
  if (km >= 1_000) return `${(km / 1_000).toFixed(1)}k km`;
  return `${km.toFixed(0)} km`;
}

export function formatKph(kph: number): string {
  if (kph >= 1_000_000) return `${(kph / 1_000_000).toFixed(2)}M km/h`;
  if (kph >= 1_000) return `${(kph / 1_000).toFixed(1)}k km/h`;
  return `${kph.toFixed(0)} km/h`;
}

export function formatDiameter(min: number, max: number): string {
  if (max < 0.001) return `${(min * 1000).toFixed(0)}–${(max * 1000).toFixed(0)} m`;
  return `${min.toFixed(3)}–${max.toFixed(3)} km`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "N/A") return "N/A";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function todayISO(): string {
  return formatDateISO(new Date());
}

export function daysAgoISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return formatDateISO(d);
}

export function daysFromNowISO(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return formatDateISO(d);
}

/** Countdown string: "3d 14h" or "2h 30m" */
export function countdownTo(targetDate: string): string {
  const now = Date.now();
  const target = new Date(targetDate + "T00:00:00").getTime();
  const diff = target - now;
  if (diff <= 0) return "passed";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}
