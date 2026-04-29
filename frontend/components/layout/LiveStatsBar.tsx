"use client";

import { AlertTriangle, ArrowUpDown, Maximize2, Target, Zap } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { formatKm, formatKph } from "@/lib/formatters";
import type { LiveStats } from "@/lib/types";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
}

function StatCard({ icon, label, value, sub, highlight }: StatCardProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${
        highlight
          ? "border-primary/40 bg-primary/10"
          : "border-border/50 bg-card/50"
      }`}
    >
      <div className={`shrink-0 ${highlight ? "text-primary" : "text-muted-foreground"}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-mono truncate">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground truncate">{value}</p>
        {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-lg border border-border/50 bg-card/50 px-4 py-3">
      <Skeleton className="h-3 w-20 mb-2" />
      <Skeleton className="h-4 w-28" />
    </div>
  );
}

interface LiveStatsBarProps {
  stats: LiveStats | null;
  loading: boolean;
}

export function LiveStatsBar({ stats, loading }: LiveStatsBarProps) {
  if (loading || !stats) {
    return (
      <div className="border-b border-border/30 bg-background/50">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border/30 bg-background/50">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Tracked"
          value={stats.total_asteroids.toString()}
          sub="in period"
        />
        <StatCard
          icon={<AlertTriangle className="h-4 w-4" />}
          label="Hazardous"
          value={`${stats.hazardous_count}`}
          sub={`${stats.hazardous_pct}% of total`}
          highlight={stats.hazardous_count > 0}
        />
        <StatCard
          icon={<ArrowUpDown className="h-4 w-4" />}
          label="Closest"
          value={formatKm(stats.closest_approach_km)}
          sub={stats.closest_approach_name}
        />
        <StatCard
          icon={<Zap className="h-4 w-4" />}
          label="Avg Velocity"
          value={formatKph(stats.avg_velocity_kph)}
        />
        <StatCard
          icon={<Maximize2 className="h-4 w-4" />}
          label="Largest"
          value={`${stats.largest_diameter_km.toFixed(2)} km`}
        />
        <StatCard
          icon={<Target className="h-4 w-4" />}
          label="Hazard %"
          value={`${stats.hazardous_pct}%`}
          sub={`${stats.total_asteroids - stats.hazardous_count} safe`}
        />
      </div>
    </div>
  );
}
