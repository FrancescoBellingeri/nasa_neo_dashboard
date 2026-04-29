"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { SizeDataPoint } from "@/lib/types";

import { ChartCard } from "./ChartCard";

const COLORS = ["#10b981", "#6ee7b7", "#f59e0b", "#ef4444", "#dc2626"];

interface Props {
  data: SizeDataPoint[];
  loading: boolean;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: SizeDataPoint; value: number }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-foreground font-semibold">{d.bucket}</p>
      <p className="text-muted-foreground">{d.count} asteroids</p>
    </div>
  );
}

export function SizeHistogram({ data, loading }: Props) {
  return (
    <ChartCard title="Size Distribution">
      <ResponsiveContainer width="100%" height={220} minWidth={0}>
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 6%)" vertical={false} />
          <XAxis
            dataKey="bucket"
            tick={{ fill: "oklch(0.58 0.02 260)", fontSize: 9, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: "oklch(0.58 0.02 260)", fontSize: 10, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "oklch(1 0 0 / 5%)" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
