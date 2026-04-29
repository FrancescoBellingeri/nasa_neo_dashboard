import type { AsteroidDetail, FeedResponse, StatsResponse } from "./types";

const BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000";

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, opts);

  if (!res.ok) {
    let detail: unknown;
    try {
      const body = await res.json();
      detail = body?.detail ?? body;
    } catch {
      detail = res.statusText;
    }
    const err = new Error(
      typeof detail === "string"
        ? detail
        : (detail as { message?: string })?.message ?? "Unknown error"
    ) as Error & { status: number; code?: string };
    err.status = res.status;
    if (typeof detail === "object" && detail !== null) {
      err.code = (detail as { error?: string }).error;
    }
    throw err;
  }

  return res.json() as Promise<T>;
}

export async function fetchFeed(
  startDate: string,
  endDate: string
): Promise<FeedResponse> {
  return apiFetch<FeedResponse>(
    `/api/v1/feed?start_date=${startDate}&end_date=${endDate}`,
    { cache: "no-store" }
  );
}

export async function fetchStats(
  startDate: string,
  endDate: string
): Promise<StatsResponse> {
  return apiFetch<StatsResponse>(
    `/api/v1/stats?start_date=${startDate}&end_date=${endDate}`,
    { cache: "no-store" }
  );
}

export async function fetchNeo(id: string): Promise<AsteroidDetail> {
  return apiFetch<AsteroidDetail>(`/api/v1/neo/${id}`, {
    cache: "no-store",
  });
}
