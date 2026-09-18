import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import { cn } from "./lib/cn";

/* ------------------------------------------------------------------ *
 * Tunable parameters — everything you'd want to nudge lives here.
 * ------------------------------------------------------------------ */

/** Spring used by every odometer digit column (per the brief). */
const DIGIT_SPRING: Transition = {
  type: "spring",
  damping: 20,
  stiffness: 100,
};

const DEFAULTS = {
  /** The number that rolls up on the odometer. */
  count: "200",
  /** Green emphasis line under the number in Phase 1. */
  unit: "million people",
  /** White lead-in of the final message. */
  finalLead: "are going ",
  /** Green emphasis word that closes the final message. */
  finalEmph: "hungry.",

  /** Seconds each successive digit column lags behind the previous one. */
  digitStagger: 0.12,
  /** Seconds after the number starts before "million people" fades in. */
  subtextDelay: 1.5,
  /** Milliseconds Phase 1 is on screen before it exits and Phase 2 enters. */
  phaseSwitchMs: 3000,
  /** Milliseconds Phase 2 holds before the loop restarts (loop mode only). */
  finalHoldMs: 2600,
  /** Replay from the top forever (handy for previewing). */
  loop: false,
};

/** Height of one digit cell in px; the odometer translates by multiples of it.
 *  Font size is derived from this so the digits fill the cell cleanly. */
const DIGIT_H = 132;

export interface StatRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  count?: string;
  unit?: string;
  finalLead?: string;
  finalEmph?: string;
  digitStagger?: number;
  subtextDelay?: number;
  phaseSwitchMs?: number;
  finalHoldMs?: number;
  loop?: boolean;
}

/* ------------------------------------------------------------------ *
 * Odometer: one masked digit that rolls up a 0–9 column and lands on
 * its target value with a spring. Columns are staggered by the caller.
 * ------------------------------------------------------------------ */

function OdometerDigit({
  value,
  delay,
  reduced,
}: {
  value: number;
  delay: number;
  reduced: boolean | null;
}) {
  return (
    <span
      className="relative block overflow-hidden tabular-nums"
      style={{ height: DIGIT_H }}
      aria-hidden="true"
    >
      <motion.span
        className="flex flex-col"
        initial={{ y: 0 }}
        animate={{ y: -value * DIGIT_H }}
        transition={reduced ? { duration: 0 } : { ...DIGIT_SPRING, delay }}
      >
        {Array.from({ length: 10 }, (_, n) => (
          <span
            key={n}
            className="flex items-center justify-center leading-none"
            style={{ height: DIGIT_H, width: "0.72em" }}
          >
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

function Odometer({
  value,
  stagger,
  reduced,
}: {
  value: string;
  stagger: number;
  reduced: boolean | null;
}) {
  const digits = value.split("");
  return (
    <div
      className="flex justify-center tracking-tight text-white"
      style={{
        fontSize: DIGIT_H * 0.9,
        lineHeight: 1,
        // Doto (black) for the counter; monospace fallback keeps digits aligned.
        fontFamily: '"Doto", ui-monospace, "SFMono-Regular", monospace',
        fontWeight: 900,
      }}
    >
      {/* Real value for assistive tech; the rolling columns are decorative. */}
      <span className="sr-only">{value}</span>
      {digits.map((d, i) => {
        const n = Number(d);
        // Non-numeric characters (e.g. a comma) render statically.
        if (Number.isNaN(n)) {
          return (
            <span key={i} aria-hidden="true" className="flex items-center">
              {d}
            </span>
          );
        }
        return (
          <OdometerDigit key={i} value={n} delay={i * stagger} reduced={reduced} />
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * StatReveal: the full multi-stage sequence.
 *   Phase 1 — odometer rolls to `count`; `unit` fades in below (green).
 *   Phase 2 — Phase 1 slides up & out as the final message slides up in.
 * A single `step` state (1 → 2) drives the AnimatePresence swap.
 * ------------------------------------------------------------------ */

export const StatReveal = React.forwardRef<HTMLDivElement, StatRevealProps>(
  (
    {
      count = DEFAULTS.count,
      unit = DEFAULTS.unit,
      finalLead = DEFAULTS.finalLead,
      finalEmph = DEFAULTS.finalEmph,
      digitStagger = DEFAULTS.digitStagger,
      subtextDelay = DEFAULTS.subtextDelay,
      phaseSwitchMs = DEFAULTS.phaseSwitchMs,
      finalHoldMs = DEFAULTS.finalHoldMs,
      loop = DEFAULTS.loop,
      className,
      ...props
    },
    ref,
  ) => {
    const reduced = useReducedMotion();
    const [step, setStep] = React.useState<1 | 2>(1);
    // Bumping `cycle` remounts Phase 1 so its odometer springs replay on loop.
    const [cycle, setCycle] = React.useState(0);

    React.useEffect(() => {
      const toPhase2 = window.setTimeout(() => setStep(2), phaseSwitchMs);
      let restart: number | undefined;
      if (loop) {
        restart = window.setTimeout(() => {
          setStep(1);
          setCycle((c) => c + 1);
        }, phaseSwitchMs + finalHoldMs);
      }
      return () => {
        window.clearTimeout(toPhase2);
        if (restart) window.clearTimeout(restart);
      };
    }, [phaseSwitchMs, finalHoldMs, loop, cycle]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative min-h-screen w-full overflow-hidden",
          "flex items-center justify-center px-4 text-center",
          className,
        )}
        {...props}
      >
        {/* Both phases are absolutely centered so they overlap during the
            hand-off — Phase 2 enters exactly as Phase 1 exits. */}
        <AnimatePresence>
          {step === 1 && (
            <motion.div
              key={`phase1-${cycle}`}
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              initial={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.55, ease: "easeIn" }}
            >
              <Odometer value={count} stagger={digitStagger} reduced={reduced} />
              <motion.p
                className="text-2xl font-semibold text-green-400 sm:text-3xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { delay: subtextDelay, duration: 0.6, ease: "easeOut" }
                }
              >
                {unit}
              </motion.p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="phase2"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 0.7, ease: "easeOut" }
              }
            >
              <p className="max-w-[16ch] text-5xl font-bold leading-tight tracking-tight sm:text-6xl md:max-w-none">
                <span className="text-white">{finalLead}</span>
                <span className="text-green-400">{finalEmph}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
StatReveal.displayName = "StatReveal";
