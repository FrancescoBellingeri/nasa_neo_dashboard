"use client";

import { useState } from "react";

import { formatDate, formatKm, formatKph } from "@/lib/formatters";
import type { CloseApproach } from "@/lib/types";

const VISIBLE_DEFAULT = 10;

interface CloseApproachTableProps {
  approaches: CloseApproach[];
}

export function CloseApproachTable({ approaches }: CloseApproachTableProps) {
  const [showAll, setShowAll] = useState(false);

  const sorted = [...approaches].sort(
    (a, b) => b.close_approach_date.localeCompare(a.close_approach_date)
  );
  const visible = showAll ? sorted : sorted.slice(0, VISIBLE_DEFAULT);
  const hasMore = sorted.length > VISIBLE_DEFAULT;

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border/30 bg-background/40">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Close Approach History ({approaches.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead className="sticky top-0 bg-card/80 backdrop-blur-sm">
            <tr className="border-b border-border/30">
              <th className="text-left px-4 py-2 text-muted-foreground font-normal uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-2 text-muted-foreground font-normal uppercase tracking-wider">Miss Distance</th>
              <th className="text-left px-4 py-2 text-muted-foreground font-normal uppercase tracking-wider">Velocity</th>
              <th className="text-left px-4 py-2 text-muted-foreground font-normal uppercase tracking-wider">Body</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((a, i) => (
              <tr
                key={i}
                className="border-b border-border/20 hover:bg-primary/5 transition-colors"
              >
                <td className="px-4 py-2 text-foreground">{formatDate(a.close_approach_date)}</td>
                <td className="px-4 py-2 text-foreground tabular-nums">{formatKm(a.miss_distance_km)}</td>
                <td className="px-4 py-2 text-muted-foreground tabular-nums">{formatKph(a.relative_velocity_kph)}</td>
                <td className="px-4 py-2 text-muted-foreground">{a.orbiting_body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="w-full px-4 py-2 text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors border-t border-border/20"
        >
          {showAll
            ? "Show less"
            : `Show all ${sorted.length} approaches`}
        </button>
      )}
    </div>
  );
}
