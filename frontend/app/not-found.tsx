import { Telescope } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
      <Telescope className="h-12 w-12 text-muted-foreground opacity-40" />
      <h2 className="text-lg font-semibold font-mono text-foreground">Object not found</h2>
      <p className="text-sm text-muted-foreground font-mono">
        This asteroid doesn&apos;t exist or couldn&apos;t be found in the NASA database.
      </p>
      <Button asChild variant="outline" className="font-mono text-sm">
        <Link href="/">← Back to dashboard</Link>
      </Button>
    </div>
  );
}
