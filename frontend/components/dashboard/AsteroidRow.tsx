"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { DangerBadge } from "@/components/dashboard/DangerBadge";
import { formatDate, formatDiameter, formatKm, formatKph } from "@/lib/formatters";
import type { Asteroid } from "@/lib/types";

export function AsteroidRow({ asteroid: a }: { asteroid: Asteroid }) {
  const router = useRouter();
  const href = `/asteroids/${a.id}`;

  return (
    <tr
      onClick={(e) => {
        // Let Link elements handle themselves (they trigger intercepting routes)
        if ((e.target as HTMLElement).closest("a")) return;
        router.push(href);
      }}
      className="group border-b border-border hover:bg-muted/40 transition-colors cursor-pointer"
    >
      <td className="py-3 pl-4 pr-2">
        <DangerBadge score={a.danger_score} size={36} />
      </td>
      <td className="py-3 px-3 max-w-[200px]">
        {/* Real Link — triggers intercepting route on name click */}
        <Link
          href={href}
          className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate block"
          title={a.name}
        >
          {a.name}
        </Link>
        <span className="text-xs text-muted-foreground mt-0.5 block">
          {formatDate(a.close_approach.close_approach_date)}
        </span>
      </td>
      <td className="py-3 px-3">
        {a.is_potentially_hazardous ? (
          <Badge className="text-xs bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30">
            ⚠ Hazardous
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/40">
            ✓ Safe
          </Badge>
        )}
      </td>
      <td className="py-3 px-3 text-sm text-foreground tabular-nums font-medium">
        {formatKm(a.close_approach.miss_distance_km)}
      </td>
      <td className="py-3 px-3 text-sm text-muted-foreground tabular-nums">
        {formatDiameter(a.estimated_diameter.min_km, a.estimated_diameter.max_km)}
      </td>
      <td className="py-3 px-3 text-sm text-muted-foreground tabular-nums">
        {formatKph(a.close_approach.relative_velocity_kph)}
      </td>
      <td className="py-3 pr-4 pl-3 text-right">
        <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm">→</span>
      </td>
    </tr>
  );
}
