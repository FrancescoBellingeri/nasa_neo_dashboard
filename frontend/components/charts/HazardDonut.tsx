"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartCard } from "./ChartCard";

const COLORS = { hazardous: "#f59e0b", safe: "#10b981" };

interface Props {
  hazardous: number;
  safe: number;
  loading: boolean;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-foreground capitalize font-semibold">{payload[0].name}</p>
      <p className="text-muted-foreground">{payload[0].value} asteroids</p>
    </div>
  );
}

export function HazardDonut({ hazardous, safe, loading }: Props) {
  const total = hazardous + safe;
  const pct = total > 0 ? Math.round((hazardous / total) * 100) : 0;
  const data = [
    { name: "hazardous", value: hazardous },
    { name: "safe", value: safe },
  ];

  return (
    <ChartCard title="Hazard Ratio">
      <div className="relative flex items-center justify-center" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={64}
              outerRadius={88}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLORS[entry.name as keyof typeof COLORS]}
                  fillOpacity={0.85}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-2xl font-bold text-foreground">{pct}%</span>
          <span className="font-mono text-xs text-muted-foreground">hazardous</span>
        </div>
      </div>
      <div className="flex items-center justify-center gap-6 text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-400" />
          {hazardous} hazardous
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
          {safe} safe
        </span>
      </div>
    </ChartCard>
  );
}
