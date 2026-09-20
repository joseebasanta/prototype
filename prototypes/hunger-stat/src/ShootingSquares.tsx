import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ *
 * ShootingSquares: an ambient layer of little squares that streak
 * straight UP the screen, bottom to top, each dragging a fading trail
 * behind it — like shooting stars. A square leads (the bright head) and
 * a tapering gradient streams below it (back toward where it came from).
 * Positions, sizes, speeds, trail lengths and delays are randomized so
 * the sky never looks mechanical. Purely decorative — sits behind the
 * content and ignores pointer events.
 * ------------------------------------------------------------------ */

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export interface ShootingSquaresProps {
  /** How many shooting squares are travelling at once. */
  count?: number;
  /** Square + trail color (defaults to the palette's light blue). */
  color?: string;
}

export function ShootingSquares({
  count = 18,
  color = "#0066FF",
}: ShootingSquaresProps) {
  const reduced = useReducedMotion();

  // Build the randomized config once so it stays stable across re-renders.
  const stars = React.useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: rand(0, 100), // vw %
        size: rand(6, 16), // px — the head cube
        trail: rand(70, 180), // px — length of the streak
        duration: rand(1.2, 2.8), // s to cross the screen
        delay: rand(0, 4), // s before first launch
        repeatDelay: rand(0.6, 3.5), // s pause between launches
        opacity: rand(0.35, 0.85),
      })),
    [count],
  );

  // No streaks under reduced-motion — keep the stage calm.
  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className="absolute top-0 flex flex-col items-center"
          style={{ left: `${s.left}%`, width: s.size, opacity: s.opacity }}
          // Start just below the bottom, travel straight up past the top.
          initial={{ y: "105vh" }}
          animate={{ y: "-45vh" }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            repeatDelay: s.repeatDelay,
            ease: "easeOut",
          }}
        >
          {/* Head cube — bright, with a soft glow. */}
          <div
            style={{
              width: s.size,
              height: s.size,
              backgroundColor: color,
              borderRadius: 2,
              boxShadow: `0 0 ${s.size}px ${color}`,
            }}
          />
          {/* Trail streaming behind (below, since it's heading up), fading out. */}
          <div
            style={{
              width: Math.max(2, s.size * 0.5),
              height: s.trail,
              background: `linear-gradient(to bottom, ${color}, transparent)`,
              borderRadius: 2,
              opacity: 0.6,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
