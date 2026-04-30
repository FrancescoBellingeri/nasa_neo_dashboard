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
      className={`flex flex-col gap-1 rounded-xl border px-4 py-3 ${
        highlight
          ? "border-primary/50 bg-primary/10"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-1.5">
        <span className={`${highlight ? "text-primary" : "text-muted-foreground"}`}>
          {icon}
        </span>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className={`text-xl font-bold leading-tight ${highlight ? "text-primary" : "text-foreground"}`}>
        {value}
      </p>
      {sub && (
        <p className="text-xs text-muted-foreground truncate leading-tight">{sub}</p>
      )}
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3 flex flex-col gap-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-6 w-24" />
    </div>
  );
}

export function LiveStatsBar({ stats, loading }: { stats: LiveStats | null; loading: boolean }) {
  if (loading || !stats) {
    return (
      <div className="border-b border-border bg-background/60">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-border bg-background/60">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard
          icon={<Target className="h-3.5 w-3.5" />}
          label="Tracked"
          value={stats.total_asteroids.toString()}
          sub="in period"
        />
        <StatCard
          icon={<AlertTriangle className="h-3.5 w-3.5" />}
          label="Hazardous"
          value={stats.hazardous_count.toString()}
          sub={`${stats.hazardous_pct}% of total`}
          highlight={stats.hazardous_count > 0}
        />
        <StatCard
          icon={<ArrowUpDown className="h-3.5 w-3.5" />}
          label="Closest"
          value={formatKm(stats.closest_approach_km)}
          sub={stats.closest_approach_name}
        />
        <StatCard
          icon={<Zap className="h-3.5 w-3.5" />}
          label="Avg Velocity"
          value={formatKph(stats.avg_velocity_kph)}
        />
        <StatCard
          icon={<Maximize2 className="h-3.5 w-3.5" />}
          label="Largest"
          value={`${stats.largest_diameter_km.toFixed(2)} km`}
        />
        <StatCard
          icon={<Target className="h-3.5 w-3.5" />}
          label="Hazard %"
          value={`${stats.hazardous_pct}%`}
          sub={`${stats.total_asteroids - stats.hazardous_count} safe`}
        />
      </div>
    </div>
  );
}
