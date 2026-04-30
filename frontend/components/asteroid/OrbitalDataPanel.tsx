"use client";

import { useEffect, useRef } from "react";

import type { OrbitalData } from "@/lib/types";

interface OrbitalDataPanelProps {
  orbital: OrbitalData | null;
}

function OrbitCanvas({ orbital }: { orbital: OrbitalData }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;
    const AU = Math.min(W, H) * 0.28;

    const sma = parseFloat(orbital.semi_major_axis ?? "1.5");
    const ecc = Math.min(parseFloat(orbital.eccentricity ?? "0.2"), 0.98);
    const period = parseFloat(orbital.orbital_period ?? "500") / 365.25; // years

    const a = sma * AU;
    const b = a * Math.sqrt(1 - ecc * ecc);
    const focalDist = a * ecc; // distance from ellipse center to focus

    function drawStars() {
      ctx!.fillStyle = "rgba(255,255,255,0.5)";
      // deterministic star positions via seeded values
      const seeds = [17, 37, 53, 71, 89, 113, 137, 157, 173, 193, 211, 229];
      seeds.forEach((s, i) => {
        const x = ((s * 97 + i * 43) % W);
        const y = ((s * 53 + i * 71) % H);
        const r = (s % 3 === 0) ? 1.5 : 1;
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fill();
      });
    }

    function draw(timestamp: number) {
      ctx!.clearRect(0, 0, W, H);

      // Background
      ctx!.fillStyle = "oklch(0.06 0.01 265)";
      ctx!.fillRect(0, 0, W, H);

      drawStars();

      // Earth orbit reference (1 AU ring)
      ctx!.strokeStyle = "rgba(99,102,241,0.2)";
      ctx!.lineWidth = 1;
      ctx!.setLineDash([4, 4]);
      ctx!.beginPath();
      ctx!.arc(cx, cy, AU, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Asteroid orbit ellipse — focus (Sun) at cx,cy
      const orbitCx = cx + focalDist;
      ctx!.strokeStyle = "rgba(245,158,11,0.35)";
      ctx!.lineWidth = 1.5;
      ctx!.setLineDash([3, 5]);
      ctx!.beginPath();
      ctx!.ellipse(orbitCx, cy, a, b, 0, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Sun
      const sunGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 10);
      sunGrad.addColorStop(0, "#fff7a0");
      sunGrad.addColorStop(1, "rgba(253,224,71,0)");
      ctx!.fillStyle = sunGrad;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 10, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#fde047";
      ctx!.beginPath();
      ctx!.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx!.fill();

      // Earth — orbits Sun at 1 AU, 1 year period
      const earthT = timestamp / 1000 / 365.25 / (365.25 * 0.01);
      const earthAngle = (earthT * Math.PI * 2) % (Math.PI * 2);
      const ex = cx + Math.cos(earthAngle) * AU;
      const ey = cy + Math.sin(earthAngle) * AU;

      const earthGrad = ctx!.createRadialGradient(ex, ey, 0, ex, ey, 7);
      earthGrad.addColorStop(0, "#93c5fd");
      earthGrad.addColorStop(1, "#1d4ed8");
      ctx!.fillStyle = earthGrad;
      ctx!.beginPath();
      ctx!.arc(ex, ey, 5, 0, Math.PI * 2);
      ctx!.fill();

      // Asteroid — orbits along its ellipse
      const asteroidT = timestamp / 1000 / (period * 365.25 * 0.01);
      const asteroidAngle = (asteroidT * Math.PI * 2) % (Math.PI * 2);
      const ax2 = orbitCx + Math.cos(asteroidAngle) * a;
      const ay2 = cy + Math.sin(asteroidAngle) * b;

      // Glow
      const astGrad = ctx!.createRadialGradient(ax2, ay2, 0, ax2, ay2, 8);
      astGrad.addColorStop(0, "rgba(245,158,11,0.8)");
      astGrad.addColorStop(1, "rgba(245,158,11,0)");
      ctx!.fillStyle = astGrad;
      ctx!.beginPath();
      ctx!.arc(ax2, ay2, 8, 0, Math.PI * 2);
      ctx!.fill();

      ctx!.fillStyle = "#f59e0b";
      ctx!.beginPath();
      ctx!.arc(ax2, ay2, 3, 0, Math.PI * 2);
      ctx!.fill();

      // Legend
      ctx!.font = "9px monospace";
      ctx!.fillStyle = "rgba(255,255,255,0.4)";
      ctx!.fillText("☀ Sun", cx + 8, cy - 8);
      ctx!.fillStyle = "rgba(147,197,253,0.7)";
      ctx!.fillText("🌍 Earth", ex + 7, ey - 5);

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [orbital]);

  return (
    <canvas
      ref={canvasRef}
      width={320}
      height={220}
      className="rounded-lg w-full"
      style={{ maxWidth: 320 }}
    />
  );
}

const ORBITAL_LABELS: Record<string, string> = {
  orbit_class: "Orbit Class",
  semi_major_axis: "Semi-major Axis (AU)",
  eccentricity: "Eccentricity",
  inclination: "Inclination (°)",
  orbital_period: "Period (days)",
  perihelion_distance: "Perihelion (AU)",
  aphelion_distance: "Aphelion (AU)",
  ascending_node_longitude: "Ascending Node (°)",
  first_observation_date: "First Observed",
  last_observation_date: "Last Observed",
};

export function OrbitalDataPanel({ orbital }: OrbitalDataPanelProps) {
  if (!orbital) {
    return (
      <div className="rounded-lg border border-border/30 px-4 py-6 text-center text-xs text-muted-foreground font-mono">
        No orbital data available
      </div>
    );
  }

  const displayKeys = Object.keys(ORBITAL_LABELS).filter(
    (k) => orbital[k as keyof OrbitalData] != null
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {(orbital.semi_major_axis || orbital.eccentricity) && (
          <OrbitCanvas orbital={orbital} />
        )}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {displayKeys.map((k) => (
            <div key={k} className="flex flex-col">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                {ORBITAL_LABELS[k]}
              </span>
              <span className="text-sm font-mono text-foreground truncate">
                {String(orbital[k as keyof OrbitalData])}
              </span>
            </div>
          ))}
          {orbital.orbit_class_description && (
            <div className="col-span-2 flex flex-col">
              <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Description</span>
              <span className="text-xs font-mono text-muted-foreground leading-relaxed">
                {orbital.orbit_class_description}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
