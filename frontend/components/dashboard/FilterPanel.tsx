"use client";

import { ArrowUpDown, Download, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDate, formatDiameter, formatKm, formatKph } from "@/lib/formatters";
import type { Asteroid, FeedFilters, SortDirection, SortField } from "@/lib/types";
import { useEffect, useState } from "react";

interface FilterPanelProps {
  filters: FeedFilters;
  sortField: SortField;
  sortDir: SortDirection;
  totalFiltered: number;
  totalAll: number;
  allAsteroids: Asteroid[];
  onFilterChange: (f: Partial<FeedFilters>) => void;
  onSortChange: (field: SortField, dir: SortDirection) => void;
}

function exportCSV(asteroids: Asteroid[]) {
  const headers = [
    "Name", "Hazardous", "Danger Score",
    "Miss Distance (km)", "Diameter Min (km)", "Diameter Max (km)",
    "Velocity (km/h)", "Close Approach Date", "Orbiting Body",
  ];
  const rows = asteroids.map((a) => [
    `"${a.name}"`,
    a.is_potentially_hazardous ? "YES" : "NO",
    a.danger_score,
    a.close_approach.miss_distance_km.toFixed(0),
    a.estimated_diameter.min_km.toFixed(4),
    a.estimated_diameter.max_km.toFixed(4),
    a.close_approach.relative_velocity_kph.toFixed(0),
    a.close_approach.close_approach_date,
    a.close_approach.orbiting_body,
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `neo-asteroids-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "miss_distance_km", label: "Distance" },
  { value: "danger_score", label: "Danger Score" },
  { value: "diameter_max_km", label: "Size" },
  { value: "relative_velocity_kph", label: "Velocity" },
  { value: "name", label: "Name" },
];

export function FilterPanel({
  filters,
  sortField,
  sortDir,
  totalFiltered,
  totalAll,
  allAsteroids,
  onFilterChange,
  onSortChange,
}: FilterPanelProps) {
  const [searchInput, setSearchInput] = useState(filters.nameSearch);
  const debounced = useDebounce(searchInput, 250);

  useEffect(() => {
    onFilterChange({ nameSearch: debounced });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const hazardOptions = [
    { label: "All", value: "all" },
    { label: "Hazardous", value: "hazardous" },
    { label: "Safe", value: "safe" },
  ] as const;

  const currentHazard =
    filters.hazardousOnly === true
      ? "hazardous"
      : filters.hazardousOnly === false
      ? "safe"
      : "all";

  const handleHazard = (v: string) => {
    onFilterChange({
      hazardousOnly: v === "hazardous" ? true : v === "safe" ? false : null,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px] max-w-xs">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search asteroid…"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-8 pl-8 font-mono text-xs bg-card/50"
        />
      </div>

      {/* Hazard filter */}
      <div className="flex items-center gap-1">
        {hazardOptions.map((opt) => (
          <Button
            key={opt.value}
            variant={currentHazard === opt.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleHazard(opt.value)}
            className="h-8 text-xs font-mono"
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex items-center gap-1.5">
        <Select
          value={sortField}
          onValueChange={(v) => onSortChange(v as SortField, sortDir)}
        >
          <SelectTrigger className="h-8 w-36 text-xs font-mono bg-card/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value} className="text-xs font-mono">
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onSortChange(sortField, sortDir === "asc" ? "desc" : "asc")}
          title={sortDir === "asc" ? "Ascending" : "Descending"}
        >
          <ArrowUpDown className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Count */}
      <Badge variant="outline" className="font-mono text-xs h-8 px-3">
        {totalFiltered} / {totalAll}
      </Badge>

      {/* CSV export */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs font-mono ml-auto"
        onClick={() => exportCSV(allAsteroids)}
        disabled={allAsteroids.length === 0}
      >
        <Download className="h-3.5 w-3.5 mr-1.5" />
        Export CSV
      </Button>
    </div>
  );
}
