"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { AlertTriangle, CheckCircle } from "lucide-react";

import { DangerBadge } from "@/components/dashboard/DangerBadge";
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
    <span className={`text-xs font-medium shrink-0 ${isPast ? "text-muted-foreground" : "text-primary"}`}>
      {isPast ? formatDate(date) : `⏱ ${label}`}
    </span>
  );
}

export function ThreatPanel({ asteroids }: { asteroids: Asteroid[] }) {
  const threats = [...asteroids]
    .filter((a) => a.is_potentially_hazardous)
    .sort((a, b) => b.danger_score - a.danger_score)
    .slice(0, 4);

  return (
    <div className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Hazardous Objects</h2>
        </div>
        {threats.length > 0 && (
          <span className="text-xs font-bold text-primary bg-primary/15 border border-primary/30 rounded-full px-2.5 py-0.5">
            {threats.length}
          </span>
        )}
      </div>

      {threats.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground">
          <CheckCircle className="h-8 w-8 text-emerald-500" />
          <p className="text-sm font-medium">Clear skies in this period</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {threats.map((a) => (
            <li key={a.id} className="flex items-center gap-3 rounded-lg border border-border bg-background/50 px-3 py-2.5 hover:border-primary/30 transition-colors">
              <DangerBadge score={a.danger_score} size={40} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/asteroids/${a.id}`}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                >
                  {a.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatKm(a.close_approach.miss_distance_km)} miss distance
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
