"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AlertTriangle, CheckCircle } from "lucide-react";

import { DangerBadge } from "@/components/dashboard/DangerBadge";
import { Badge } from "@/components/ui/badge";
import { countdownTo, formatDate, formatKm } from "@/lib/formatters";
import type { Asteroid } from "@/lib/types";

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
              <DangerBadge score={a.danger_score} size={44} />
              <div className="min-w-0 flex-1">
                <Link href={`/asteroids/${a.id}`} className="text-xs font-semibold text-foreground hover:text-primary transition-colors truncate block">
                  {a.name}
                </Link>
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
