"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { DangerBadge } from "@/components/dashboard/DangerBadge";
import { formatDate, formatDiameter, formatKm, formatKph } from "@/lib/formatters";
import type { Asteroid } from "@/lib/types";

interface AsteroidRowProps {
  asteroid: Asteroid;
}

export function AsteroidRow({ asteroid: a }: AsteroidRowProps) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/asteroids/${a.id}`)}
      className="group border-b border-border/30 hover:bg-primary/5 transition-colors cursor-pointer"
    >
      <td className="py-3 pl-4 pr-2">
        <DangerBadge score={a.danger_score} size={36} />
      </td>
      <td className="py-3 px-3 max-w-[200px]">
        <span
          className="font-mono text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate block"
          title={a.name}
        >
          {a.name}
        </span>
        <span className="font-mono text-xs text-muted-foreground mt-0.5 block">
          {formatDate(a.close_approach.close_approach_date)}
        </span>
      </td>
      <td className="py-3 px-3">
        {a.is_potentially_hazardous ? (
          <Badge className="text-xs font-mono bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30">
            ⚠ hazardous
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
            ✓ safe
          </Badge>
        )}
      </td>
      <td className="py-3 px-3 font-mono text-xs text-foreground tabular-nums">
        {formatKm(a.close_approach.miss_distance_km)}
      </td>
      <td className="py-3 px-3 font-mono text-xs text-muted-foreground tabular-nums">
        {formatDiameter(a.estimated_diameter.min_km, a.estimated_diameter.max_km)}
      </td>
      <td className="py-3 px-3 font-mono text-xs text-muted-foreground tabular-nums">
        {formatKph(a.close_approach.relative_velocity_kph)}
      </td>
      <td className="py-3 pr-4 pl-3 text-right">
        <span className="font-mono text-xs text-muted-foreground group-hover:text-primary transition-colors whitespace-nowrap">
          →
        </span>
      </td>
    </tr>
  );
}
