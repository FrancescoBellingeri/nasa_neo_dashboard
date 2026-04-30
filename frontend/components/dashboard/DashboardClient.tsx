"use client";

import { useCallback, useEffect, useState } from "react";

import { AlertCircle, RefreshCw } from "lucide-react";

import { DistanceTimeline } from "@/components/charts/DistanceTimeline";
import { HazardDonut } from "@/components/charts/HazardDonut";
import { SizeHistogram } from "@/components/charts/SizeHistogram";
import { VelocityChart } from "@/components/charts/VelocityChart";
import { AsteroidTable } from "@/components/dashboard/AsteroidTable";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { ThreatPanel } from "@/components/dashboard/ThreatPanel";
import { LiveStatsBar } from "@/components/layout/LiveStatsBar";
import { Button } from "@/components/ui/button";
import { fetchStats } from "@/lib/api";
import { useFeed } from "@/hooks/useFeed";
import type { FeedResponse, StatsResponse } from "@/lib/types";

interface DashboardClientProps {
  initialFeed: FeedResponse | null;
  initialStats: StatsResponse | null;
}

export function DashboardClient({ initialFeed, initialStats }: DashboardClientProps) {
  const feed = useFeed(initialFeed);
  const [stats, setStats] = useState<StatsResponse | null>(initialStats);
  const [statsLoading, setStatsLoading] = useState(false);

  const loadStats = useCallback(async (start: string, end: string) => {
    setStatsLoading(true);
    try {
      const s = await fetchStats(start, end);
      setStats(s);
    } catch {
      // stats failure is non-fatal — feed still shows
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const handleDateChange = useCallback(
    (start: string, end: string) => {
      feed.setDateRange(start, end);
      loadStats(start, end);
    },
    [feed, loadStats]
  );

  // Load stats on mount if not provided server-side
  useEffect(() => {
    if (!initialStats) {
      loadStats(feed.startDate, feed.endDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = feed.isLoading || statsLoading;

  return (
    <div className="flex flex-col gap-0">
      <LiveStatsBar stats={stats?.live_stats ?? null} loading={statsLoading} />

      <main className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Date picker */}
        <DateRangePicker
          startDate={feed.startDate}
          endDate={feed.endDate}
          isLoading={isLoading}
          onDateChange={handleDateChange}
        />

        {/* Rate limit / error banner */}
        {feed.error && (
          <div
            className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm ${
              feed.errorCode === "rate_limit"
                ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-300"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="flex-1">
              {feed.errorCode === "rate_limit"
                ? "NASA API rate limit reached — try again in a few minutes."
                : feed.error}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={feed.reload}
              className="h-7 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Retry
            </Button>
          </div>
        )}

        {/* Top row: ThreatPanel + DistanceTimeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <ThreatPanel asteroids={feed.data?.asteroids ?? []} />
          <DistanceTimeline
            data={stats?.distance_timeline ?? []}
            loading={statsLoading}
          />
        </div>

        {/* Bottom charts row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <SizeHistogram
            data={stats?.size_distribution ?? []}
            loading={statsLoading}
          />
          <HazardDonut
            hazardous={stats?.hazard_ratio.hazardous ?? 0}
            safe={stats?.hazard_ratio.safe ?? 0}
            loading={statsLoading}
          />
          <VelocityChart
            data={stats?.velocity_distribution ?? []}
            loading={statsLoading}
          />
        </div>

        {/* Asteroid table */}
        <AsteroidTable
          paginated={feed.paginated}
          filtered={feed.filtered}
          allAsteroids={feed.data?.asteroids ?? []}
          isLoading={feed.isLoading}
          filters={feed.filters}
          sortField={feed.sortField}
          sortDir={feed.sortDir}
          page={feed.page}
          totalPages={feed.totalPages}
          onFilterChange={feed.setFilters}
          onSortChange={feed.setSort}
          onPageChange={feed.setPage}
        />
      </main>
    </div>
  );
}
