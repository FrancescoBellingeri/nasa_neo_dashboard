import { Orbit } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 flex h-14 items-center justify-between">
        <div className="flex items-center gap-3">
          <Orbit className="h-5 w-5 text-primary" />
          <span className="font-mono text-sm font-semibold tracking-widest text-foreground uppercase">
            NASA NEO Tracker
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          <span className="font-mono">LIVE</span>
        </div>
      </div>
    </header>
  );
}
