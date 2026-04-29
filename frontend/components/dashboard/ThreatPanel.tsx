"use client";

import { useEffect, useState } from "react";

import { AlertTriangle, CheckCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { countdownTo, formatDate, formatKm } from "@/lib/formatters";
import type { Asteroid } from "@/lib/types";

function DangerRing({ score }: { score: number }) {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const color =
    score >= 60 ? "#ef4444" : score >= 30 ? "#f59e0b" : "#10b981";

  return (
    <svg width="44" height="44" className="shrink-0 -rotate-90">
      <circle cx="22" cy="22" r={r} fill="none" stroke="currentColor" strokeWidth="3" className="text-border/40" />
      <circle
        cx="22"
        cy="22"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
      />
      <text
        x="22"
        y="22"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="9"
        fontFamily="monospace"
        fill={color}
        className="rotate-90"
        transform="rotate(90, 22, 22)"
      >
        {Math.round(score)}
      </text>
    </svg>
  );
}

function CountdownBadge({ date }: { date: string }) {
  const [label, setLabel] = useState(() => countdownTo(date));

  useEffect(() => {
    const id = setInterval(() => setLabel(countdownTo(date)), 60_000);
    return () => clearInterval(id);
  }, [date]);

  const isPast = label === "passed";

  return (
    <Badge
      variant="outline"
      className={`font-mono text-xs ${isPast ? "text-muted-foreground" : "text-primary border-primary/40"}`}
    >
      {isPast ? formatDate(date) : `⏱ ${label}`}
    </Badge>
  );
}

interface ThreatPanelProps {
  asteroids: Asteroid[];
}

export function ThreatPanel({ asteroids }: ThreatPanelProps) {
  const threats = [...asteroids]
    .filter((a) => a.is_potentially_hazardous)
    .sort((a, b) => b.danger_score - a.danger_score)
    .slice(0, 4);

  return (
    <div className="rounded-xl border border-border/50 bg-card/50 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-semibold font-mono uppercase tracking-wider">
          Hazardous Objects
        </h2>
        {threats.length > 0 && (
          <Badge variant="destructive" className="ml-auto text-xs font-mono">
            {threats.length}
          </Badge>
        )}
      </div>

      {threats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 gap-2 text-muted-foreground">
          <CheckCircle className="h-8 w-8 text-green-500" />
          <p className="text-sm">Clear skies in this period</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {threats.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-lg border border-border/30 bg-background/40 px-3 py-2"
            >
              <DangerRing score={a.danger_score} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground truncate">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatKm(a.close_approach.miss_distance_km)}
                </p>
              </div>
              <CountdownBadge date={a.close_approach.close_approach_date} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
