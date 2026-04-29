"use client";

import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { daysAgoISO, todayISO } from "@/lib/formatters";

const PRESETS = [
  { label: "Today", start: () => todayISO(), end: () => todayISO() },
  { label: "7 Days", start: () => daysAgoISO(6), end: () => todayISO() },
  { label: "30 Days", start: () => daysAgoISO(29), end: () => todayISO() },
  { label: "90 Days", start: () => daysAgoISO(89), end: () => todayISO() },
];

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  isLoading: boolean;
  onDateChange: (start: string, end: string) => void;
}

export function DateRangePicker({
  startDate,
  endDate,
  isLoading,
  onDateChange,
}: DateRangePickerProps) {
  const activePreset = PRESETS.find(
    (p) => p.start() === startDate && p.end() === endDate
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />

      {PRESETS.map((preset) => (
        <Button
          key={preset.label}
          variant={activePreset?.label === preset.label ? "default" : "outline"}
          size="sm"
          disabled={isLoading}
          onClick={() => onDateChange(preset.start(), preset.end())}
          className="font-mono text-xs h-8"
        >
          {preset.label}
        </Button>
      ))}

      <div className="flex items-center gap-1.5">
        <Input
          type="date"
          value={startDate}
          max={endDate}
          disabled={isLoading}
          onChange={(e) => onDateChange(e.target.value, endDate)}
          className="h-8 w-36 font-mono text-xs bg-card/50"
        />
        <span className="text-muted-foreground text-xs">→</span>
        <Input
          type="date"
          value={endDate}
          min={startDate}
          max={todayISO()}
          disabled={isLoading}
          onChange={(e) => onDateChange(startDate, e.target.value)}
          className="h-8 w-36 font-mono text-xs bg-card/50"
        />
      </div>

      {isLoading && (
        <span className="text-xs text-muted-foreground font-mono animate-pulse">
          fetching…
        </span>
      )}
    </div>
  );
}
