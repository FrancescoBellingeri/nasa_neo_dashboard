"use client";

import { AlertOctagon, RefreshCw } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <AlertOctagon className="h-12 w-12 text-destructive opacity-70" />
      <h2 className="text-lg font-semibold font-mono text-foreground">Something went wrong</h2>
      <p className="text-sm text-muted-foreground font-mono max-w-sm">
        {error.message || "An unexpected error occurred while loading NEO data."}
      </p>
      <Button onClick={reset} variant="outline" className="font-mono text-sm gap-2">
        <RefreshCw className="h-4 w-4" /> Try again
      </Button>
    </div>
  );
}
