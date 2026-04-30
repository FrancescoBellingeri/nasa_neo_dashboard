"use client";

import { useEffect, useRef } from "react";

import type { OrbitalData } from "@/lib/types";

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
    const period = parseFloat(orbital.orbital_period ?? "500") / 365.25;

    if (isNaN(sma) || isNaN(ecc) || isNaN(period)) return;

    const a = sma * AU;
    const b = a * Math.sqrt(1 - ecc * ecc);
    const focalDist = a * ecc;

    const seeds = [17, 37, 53, 71, 89, 113, 137, 157, 173, 193, 211, 229];

    function drawStars() {
      seeds.forEach((s, i) => {
        const x = (s * 97 + i * 43) % W;
        const y = (s * 53 + i * 71) % H;
        ctx!.fillStyle = "rgba(255,255,255,0.45)";
        ctx!.beginPath();
        ctx!.arc(x, y, s % 3 === 0 ? 1.5 : 1, 0, Math.PI * 2);
        ctx!.fill();
      });
    }

    function draw(timestamp: number) {
      ctx!.clearRect(0, 0, W, H);
      ctx!.fillStyle = "oklch(0.12 0.018 265)";
      ctx!.fillRect(0, 0, W, H);

      drawStars();

      // Earth orbit ring (1 AU)
      ctx!.strokeStyle = "rgba(99,102,241,0.2)";
      ctx!.lineWidth = 1;
      ctx!.setLineDash([4, 4]);
      ctx!.beginPath();
      ctx!.arc(cx, cy, AU, 0, Math.PI * 2);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Asteroid orbit ellipse
      const orbitCx = cx + focalDist;
      ctx!.strokeStyle = "rgba(245,158,11,0.4)";
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

      // Earth
      const earthT = timestamp / 1000 / (365.25 * 0.01);
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
      ctx!.font = "9px monospace";
      ctx!.fillStyle = "rgba(147,197,253,0.7)";
      ctx!.fillText("Earth", ex + 7, ey - 4);

      // Asteroid
      const asteroidT = timestamp / 1000 / (period * 365.25 * 0.01);
      const asteroidAngle = (asteroidT * Math.PI * 2) % (Math.PI * 2);
      const ax2 = orbitCx + Math.cos(asteroidAngle) * a;
      const ay2 = cy + Math.sin(asteroidAngle) * b;
      const astGrad = ctx!.createRadialGradient(ax2, ay2, 0, ax2, ay2, 8);
      astGrad.addColorStop(0, "rgba(245,158,11,0.9)");
      astGrad.addColorStop(1, "rgba(245,158,11,0)");
      ctx!.fillStyle = astGrad;
      ctx!.beginPath();
      ctx!.arc(ax2, ay2, 8, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.fillStyle = "#f59e0b";
      ctx!.beginPath();
      ctx!.arc(ax2, ay2, 3, 0, Math.PI * 2);
      ctx!.fill();

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [orbital]);

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={200}
      className="rounded-lg w-full"
    />
  );
}

const ORBITAL_ROWS: { key: keyof OrbitalData; label: string }[] = [
  { key: "orbit_class", label: "Orbit Class" },
  { key: "semi_major_axis", label: "Semi-major Axis (AU)" },
  { key: "eccentricity", label: "Eccentricity" },
  { key: "inclination", label: "Inclination (°)" },
  { key: "orbital_period", label: "Period (days)" },
  { key: "perihelion_distance", label: "Perihelion (AU)" },
  { key: "aphelion_distance", label: "Aphelion (AU)" },
  { key: "first_observation_date", label: "First Observed" },
  { key: "last_observation_date", label: "Last Observed" },
];

export function OrbitalDataPanel({ orbital }: { orbital: OrbitalData | null }) {
  if (!orbital) {
    return (
      <p className="text-xs text-muted-foreground font-mono text-center py-4">
        No orbital data available
      </p>
    );
  }

  const hasCanvas = !!(orbital.semi_major_axis || orbital.eccentricity);

  return (
    <div className="flex flex-col gap-4">
      {/* Canvas full width on top */}
      {hasCanvas && <OrbitCanvas orbital={orbital} />}

      {/* Data grid below — 2 columns, plenty of space */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
        {ORBITAL_ROWS.filter((r) => orbital[r.key] != null).map(({ key, label }) => (
          <div key={key} className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {label}
            </span>
            <span className="text-sm font-medium text-foreground break-words">
              {String(orbital[key])}
            </span>
          </div>
        ))}
      </div>

      {orbital.orbit_class_description && (
        <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
          {orbital.orbit_class_description}
        </p>
      )}
    </div>
  );
}
