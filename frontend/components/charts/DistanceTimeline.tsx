"use client";

import {
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatKm } from "@/lib/formatters";
import type { DistanceDataPoint } from "@/lib/types";

import { ChartCard } from "./ChartCard";

const AMBER = "#f59e0b";
const EMERALD = "#10b981";

interface Props {
  data: DistanceDataPoint[];
  loading: boolean;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DistanceDataPoint & { x: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs font-mono shadow-lg">
      <p className="font-semibold text-foreground mb-1 max-w-[200px] truncate">{d.name}</p>
      <p className="text-muted-foreground">{d.date}</p>
      <p className="text-foreground">{formatKm(d.miss_distance_km)}</p>
      <p className={d.is_hazardous ? "text-yellow-400" : "text-emerald-400"}>
        {d.is_hazardous ? "⚠ Hazardous" : "✓ Safe"}
      </p>
    </div>
  );
}

export function DistanceTimeline({ data, loading }: Props) {
  const safeData = data
    .filter((d) => !d.is_hazardous)
    .map((d) => ({ ...d, x: new Date(d.date + "T00:00:00").getTime(), y: d.miss_distance_km }));

  const hazardData = data
    .filter((d) => d.is_hazardous)
    .map((d) => ({ ...d, x: new Date(d.date + "T00:00:00").getTime(), y: d.miss_distance_km }));

  const tickDates = [...new Set(data.map((d) => d.date))].slice(0, 7);
  const ticks = tickDates.map((d) => new Date(d + "T00:00:00").getTime());

  return (
    <ChartCard title="Approach Distance Timeline" loading={loading} className="lg:col-span-2">
      <ResponsiveContainer width="100%" height={260} minWidth={0}>
        <ScatterChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" />
          <XAxis
            type="number"
            dataKey="x"
            domain={["dataMin", "dataMax"]}
            ticks={ticks}
            tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            tick={{ fill: "oklch(0.58 0.02 260)", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            tickFormatter={(v) => formatKm(v)}
            tick={{ fill: "oklch(0.58 0.02 260)", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "oklch(1 0 0 / 15%)" }} />
          <Scatter name="Safe" data={safeData} fill={EMERALD} fillOpacity={0.7} r={4} />
          <Scatter name="Hazardous" data={hazardData} fill={AMBER} fillOpacity={0.9} r={5} />
        </ScatterChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Safe
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" /> Hazardous
        </span>
      </div>
    </ChartCard>
  );
}
