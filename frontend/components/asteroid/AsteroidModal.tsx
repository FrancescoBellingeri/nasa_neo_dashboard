"use client";

import { useRouter } from "next/navigation";

import { AsteroidDetailCard } from "@/components/asteroid/AsteroidDetailCard";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { AsteroidDetail } from "@/lib/types";

interface AsteroidModalProps {
  asteroid: AsteroidDetail;
}

export function AsteroidModal({ asteroid }: AsteroidModalProps) {
  const router = useRouter();

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-card border-border/60">
        <DialogTitle className="sr-only">{asteroid.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Asteroid detail: danger score {asteroid.danger_score}/100,{" "}
          {asteroid.is_potentially_hazardous ? "potentially hazardous" : "non-hazardous"}
        </DialogDescription>
        <AsteroidDetailCard asteroid={asteroid} />
      </DialogContent>
    </Dialog>
  );
}
