import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ *
 * FallingSquares: a playful ambient layer of little squares raining
 * down the screen. Each square drops from just above the top to just
 * below the bottom with gravity-like acceleration, spinning and drifting
 * sideways as it goes, then loops after a random pause. Sizes, speeds,
 * rotations and delays are all randomized so the rain never looks
 * mechanical. Purely decorative — sits behind the content and ignores
 * pointer events.
 * ------------------------------------------------------------------ */

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export interface FallingSquaresProps {
  /** How many squares are raining at once. */
  count?: number;
  /** Square fill (defaults to the palette's light blue). */
  color?: string;
}

export function FallingSquares({
  count = 18,
  color = "#CEE2FF",
}: FallingSquaresProps) {
  const reduced = useReducedMotion();

  // Build the randomized config once so it stays stable across re-renders.
  const squares = React.useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: rand(0, 100), // vw %
        size: rand(8, 26), // px
        duration: rand(2.6, 5.2), // s to fall
        delay: rand(0, 5), // s before first drop
        repeatDelay: rand(0.4, 3), // s pause between drops
        rotate: rand(-540, 540), // deg over one fall
        drift: rand(-45, 45), // px sideways sway
        opacity: rand(0.18, 0.5),
      })),
    [count],
  );

  // No rain under reduced-motion — keep the stage calm.
  if (reduced) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {squares.map((s, i) => (
        <motion.div
          key={i}
          className="absolute top-0 rounded-[2px]"
          style={{
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            backgroundColor: color,
            opacity: s.opacity,
          }}
          initial={{ y: "-12vh", x: 0, rotate: 0 }}
          animate={{ y: "112vh", x: [0, s.drift, -s.drift, 0], rotate: s.rotate }}
          transition={{
            y: {
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: s.repeatDelay,
              ease: "easeIn", // accelerate like gravity
            },
            x: {
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: s.repeatDelay,
              ease: "easeInOut", // gentle side-to-side wobble
            },
            rotate: {
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              repeatDelay: s.repeatDelay,
              ease: "linear",
            },
          }}
        />
      ))}
    </div>
  );
}
