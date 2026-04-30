"use client";

import { ChevronLeft, ChevronRight, Telescope } from "lucide-react";

import { AsteroidRow } from "@/components/dashboard/AsteroidRow";
import { FilterPanel } from "@/components/dashboard/FilterPanel";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Asteroid, FeedFilters, SortDirection, SortField } from "@/lib/types";

interface AsteroidTableProps {
  paginated: Asteroid[];
  filtered: Asteroid[];
  allAsteroids: Asteroid[];
  isLoading: boolean;
  filters: FeedFilters;
  sortField: SortField;
  sortDir: SortDirection;
  page: number;
  totalPages: number;
  onFilterChange: (f: Partial<FeedFilters>) => void;
  onSortChange: (field: SortField, dir: SortDirection) => void;
  onPageChange: (p: number) => void;
}

const COL_HEADERS = [
  { label: "Risk", width: "w-12" },
  { label: "Name / Date", width: "min-w-[160px]" },
  { label: "Status", width: "w-28" },
  { label: "Distance", width: "w-28" },
  { label: "Diameter", width: "w-36" },
  { label: "Velocity", width: "w-28" },
  { label: "", width: "w-8" },
];

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, i) => (
        <tr key={i} className="border-b border-border/30">
          {Array.from({ length: 7 }).map((_, j) => (
            <td key={j} className="py-3 px-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="py-16 text-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Telescope className="h-10 w-10 opacity-30" />
          <p className="text-sm font-mono">No asteroids match your filters</p>
          <p className="text-xs">Try removing filters or expanding the date range</p>
        </div>
      </td>
    </tr>
  );
}

export function AsteroidTable({
  paginated,
  filtered,
  allAsteroids,
  isLoading,
  filters,
  sortField,
  sortDir,
  page,
  totalPages,
  onFilterChange,
  onSortChange,
  onPageChange,
}: AsteroidTableProps) {
  return (
    <div className="rounded-xl border border-border/50 bg-card/50 flex flex-col gap-0 overflow-hidden">
      {/* Filter bar */}
      <div className="px-4 py-3 border-b border-border/30">
        <FilterPanel
          filters={filters}
          sortField={sortField}
          sortDir={sortDir}
          totalFiltered={filtered.length}
          totalAll={allAsteroids.length}
          allAsteroids={filtered}
          onFilterChange={onFilterChange}
          onSortChange={onSortChange}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/30 bg-background/40">
              {COL_HEADERS.map((h) => (
                <th
                  key={h.label}
                  className={`py-2.5 px-3 text-left text-xs font-mono uppercase tracking-wider text-muted-foreground ${h.width}`}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableSkeleton />
            ) : paginated.length === 0 ? (
              <EmptyState />
            ) : (
              paginated.map((a) => <AsteroidRow key={a.id} asteroid={a} />)
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/30">
          <p className="text-xs font-mono text-muted-foreground">
            Page {page} of {totalPages} · {filtered.length} results
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pg = totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page + i - 2;
              if (pg < 1 || pg > totalPages) return null;
              return (
                <Button
                  key={pg}
                  variant={pg === page ? "default" : "outline"}
                  size="sm"
                  className="h-7 w-7 p-0 font-mono text-xs"
                  onClick={() => onPageChange(pg)}
                >
                  {pg}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              className="h-7 w-7 p-0"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
