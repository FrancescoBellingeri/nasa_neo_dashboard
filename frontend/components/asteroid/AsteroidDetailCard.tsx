import { ExternalLink } from "lucide-react";

import { CloseApproachTable } from "@/components/asteroid/CloseApproachTable";
import { OrbitalDataPanel } from "@/components/asteroid/OrbitalDataPanel";
import { DangerBadge } from "@/components/dashboard/DangerBadge";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDiameter, formatKm, formatKph } from "@/lib/formatters";
import type { AsteroidDetail } from "@/lib/types";

interface AsteroidDetailCardProps {
  asteroid: AsteroidDetail;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 rounded-lg bg-background/40 border border-border/30 px-3 py-2.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground leading-tight">
        {label}
      </span>
      <span className="text-sm font-mono font-semibold text-foreground leading-snug break-all">
        {value}
      </span>
    </div>
  );
}

export function AsteroidDetailCard({ asteroid: a }: AsteroidDetailCardProps) {
  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <DangerBadge score={a.danger_score} size={52} />
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold font-mono text-foreground leading-snug break-words">
            {a.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {a.is_potentially_hazardous ? (
              <Badge className="text-xs font-mono bg-amber-500/20 text-amber-300 border-amber-500/30">
                ⚠ Potentially Hazardous
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
                ✓ Non-Hazardous
              </Badge>
            )}
            {a.absolute_magnitude_h != null && (
              <Badge variant="outline" className="text-xs font-mono">
                H = {a.absolute_magnitude_h}
              </Badge>
            )}
          </div>
          <a
            href={a.nasa_jpl_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline mt-2"
          >
            View on NASA JPL <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Stats — 3 columns on wide, 2 on narrow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        <Stat label="Closest Approach" value={formatDate(a.close_approach.close_approach_date)} />
        <Stat label="Miss Distance" value={formatKm(a.close_approach.miss_distance_km)} />
        <Stat label="Velocity" value={formatKph(a.close_approach.relative_velocity_kph)} />
        <Stat label="Diameter (min)" value={`${a.estimated_diameter.min_km.toFixed(3)} km`} />
        <Stat label="Diameter (max)" value={`${a.estimated_diameter.max_km.toFixed(3)} km`} />
        <Stat label="Danger Score" value={`${a.danger_score} / 100`} />
      </div>

      {/* Close approach history */}
      <CloseApproachTable approaches={a.all_close_approaches} />

      {/* Orbital data */}
      <div className="rounded-lg border border-border/50 bg-card/30 p-4">
        <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
          Orbital Data
        </h3>
        <OrbitalDataPanel orbital={a.orbital_data} />
      </div>
    </div>
  );
}
