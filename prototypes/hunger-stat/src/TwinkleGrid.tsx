import * as React from "react";
import { useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ *
 * TwinkleGrid: a full-bleed grid of tiny "+" marks that gently twinkle
 * (fade their opacity up and down out of phase with one another), like a
 * faint animated cross-stitch texture behind the content. Rendered on a
 * canvas so thousands of marks stay smooth. Deliberately subtle — the
 * marks live at very low opacity so they read as texture, not noise.
 * Purely decorative; sits behind everything and ignores pointer events.
 * ------------------------------------------------------------------ */

export interface TwinkleGridProps {
  /** Mark color as an "r,g,b" triplet. */
  color?: string;
  /** Grid spacing in px between marks. */
  cell?: number;
  /** Overall opacity multiplier (lower = more subtle). */
  intensity?: number;
}

export function TwinkleGrid({
  color = "0,102,255",
  cell = 26,
  intensity = 1,
}: TwinkleGridProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let cells: {
      x: number;
      y: number;
      phase: number;
      speed: number;
      base: number;
      amp: number;
    }[] = [];

    // (Re)build the grid to fit the current canvas size.
    const build = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cells = [];
      const cols = Math.ceil(W / cell) + 1;
      const rows = Math.ceil(H / cell) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          // A few marks are a touch stronger to give the field some life;
          // the rest stay very faint. Everything is kept low on purpose.
          const strong = Math.random() < 0.12;
          cells.push({
            x: c * cell,
            y: r * cell,
            phase: Math.random() * Math.PI * 2,
            speed: 0.35 + Math.random() * 0.7, // rad/s — slow, lazy twinkle
            base: strong ? 0.1 : 0.05,
            amp: strong ? 0.09 : 0.05,
          });
        }
      }
    };

    const arm = 3.5; // half-length of each "+" bar
    const th = 1.6; // bar thickness

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const c of cells) {
        let a = c.base + c.amp * Math.sin(t * c.speed + c.phase);
        a = Math.max(0, a) * intensity;
        if (a <= 0.002) continue;
        ctx.fillStyle = `rgba(${color},${a.toFixed(3)})`;
        // A small "+" centered at (x, y): horizontal bar + vertical bar.
        ctx.fillRect(c.x - arm, c.y - th / 2, arm * 2, th);
        ctx.fillRect(c.x - th / 2, c.y - arm, th, arm * 2);
      }
    };

    build();

    // Static faint grid under reduced-motion — no animation.
    if (reduced) {
      draw(0);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      draw((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => build();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [color, cell, intensity, reduced]);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
