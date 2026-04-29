"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchFeed } from "@/lib/api";
import { daysAgoISO, todayISO } from "@/lib/formatters";
import type { Asteroid, FeedFilters, FeedResponse, SortDirection, SortField } from "@/lib/types";

interface UseFeedState {
  data: FeedResponse | null;
  isLoading: boolean;
  error: string | null;
  errorCode: string | null;
  startDate: string;
  endDate: string;
  filters: FeedFilters;
  sortField: SortField;
  sortDir: SortDirection;
  page: number;
  pageSize: number;
}

export function useFeed(initialData?: FeedResponse | null) {
  const [state, setState] = useState<UseFeedState>({
    data: initialData ?? null,
    isLoading: false,
    error: null,
    errorCode: null,
    startDate: daysAgoISO(7),
    endDate: todayISO(),
    filters: { hazardousOnly: null, nameSearch: "" },
    sortField: "miss_distance_km",
    sortDir: "asc",
    page: 1,
    pageSize: 20,
  });

  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (start: string, end: string) => {
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setState((s) => ({ ...s, isLoading: true, error: null, errorCode: null, page: 1 }));

    try {
      const data = await fetchFeed(start, end);
      setState((s) => ({ ...s, data, isLoading: false }));
    } catch (err) {
      const e = err as Error & { status?: number; code?: string };
      setState((s) => ({
        ...s,
        isLoading: false,
        error: e.message ?? "Failed to fetch data",
        errorCode: e.code ?? null,
      }));
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      load(state.startDate, state.endDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setDateRange = useCallback(
    (start: string, end: string) => {
      setState((s) => ({ ...s, startDate: start, endDate: end }));
      load(start, end);
    },
    [load]
  );

  const setFilters = useCallback((filters: Partial<FeedFilters>) => {
    setState((s) => ({ ...s, filters: { ...s.filters, ...filters }, page: 1 }));
  }, []);

  const setSort = useCallback((field: SortField, dir: SortDirection) => {
    setState((s) => ({ ...s, sortField: field, sortDir: dir, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setState((s) => ({ ...s, page }));
  }, []);

  const filtered = useMemo((): Asteroid[] => {
    if (!state.data) return [];
    let list = [...state.data.asteroids];

    if (state.filters.hazardousOnly === true) {
      list = list.filter((a) => a.is_potentially_hazardous);
    } else if (state.filters.hazardousOnly === false) {
      list = list.filter((a) => !a.is_potentially_hazardous);
    }

    if (state.filters.nameSearch) {
      const q = state.filters.nameSearch.toLowerCase();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      let av: number, bv: number;
      switch (state.sortField) {
        case "miss_distance_km":
          av = a.close_approach.miss_distance_km;
          bv = b.close_approach.miss_distance_km;
          break;
        case "diameter_max_km":
          av = a.estimated_diameter.max_km;
          bv = b.estimated_diameter.max_km;
          break;
        case "relative_velocity_kph":
          av = a.close_approach.relative_velocity_kph;
          bv = b.close_approach.relative_velocity_kph;
          break;
        case "danger_score":
          av = a.danger_score;
          bv = b.danger_score;
          break;
        case "name":
          return state.sortDir === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        default:
          return 0;
      }
      return state.sortDir === "asc" ? av - bv : bv - av;
    });

    return list;
  }, [state.data, state.filters, state.sortField, state.sortDir]);

  const paginated = useMemo(() => {
    const start = (state.page - 1) * state.pageSize;
    return filtered.slice(start, start + state.pageSize);
  }, [filtered, state.page, state.pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    errorCode: state.errorCode,
    startDate: state.startDate,
    endDate: state.endDate,
    filters: state.filters,
    sortField: state.sortField,
    sortDir: state.sortDir,
    page: state.page,
    totalPages,
    filtered,
    paginated,
    setDateRange,
    setFilters,
    setSort,
    setPage,
    reload: () => load(state.startDate, state.endDate),
  };
}
