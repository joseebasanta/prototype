import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "./lib/cn";

/* ------------------------------------------------------------------ *
 * Tunable parameters — everything you'd want to nudge lives here.
 * ------------------------------------------------------------------ */

const DEFAULTS = {
  /** The number the odometer counts UP to. */
  count: "200",
  /** Number the counter starts from before climbing to `count`. */
  from: 173,
  /** Seconds the count-up takes (decelerates into the final number). */
  countDuration: 1.8,
  /** Emphasis line under the number in Phase 1 (rendered all-caps). */
  unit: "BUILDERS",
  /** Lead-in of the final message (empty here — the CTA stands alone). */
  finalLead: "",
  /** Word that closes the final message. */
  finalEmph: "Únetenos",

  /** Seconds after the number starts before the subtext fades in. */
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
  from?: number;
  countDuration?: number;
  unit?: string;
  finalLead?: string;
  finalEmph?: string;
  subtextDelay?: number;
  phaseSwitchMs?: number;
  finalHoldMs?: number;
  loop?: boolean;
}

/* ------------------------------------------------------------------ *
 * Odometer: a true rolling counter. A single motion value climbs from
 * `from` to the target; each digit column is derived from that value at
 * its place (units, tens, hundreds…), so every wheel spins continuously
 * as the number counts up and they all settle together at the end.
 * ------------------------------------------------------------------ */

/** One digit wheel, positioned continuously from the shared count value. */
function RollingDigit({
  count,
  place,
}: {
  count: MotionValue<number>;
  place: number;
}) {
  // Fractional position within a 0–9 wheel for this place value. The strip
  // repeats a trailing "0" so the 9→0 wrap rolls seamlessly (both are "0").
  const y = useTransform(count, (v) => {
    const frac = (((v / place) % 10) + 10) % 10;
    return -frac * DIGIT_H;
  });
  return (
    <span
      className="relative block overflow-hidden tabular-nums"
      style={{ height: DIGIT_H }}
      aria-hidden="true"
    >
      <motion.span className="flex flex-col" style={{ y }}>
        {[...Array(10).keys(), 0].map((n, idx) => (
          <span
            key={idx}
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
  from,
  duration,
  reduced,
}: {
  value: string;
  from: number;
  duration: number;
  reduced: boolean | null;
}) {
  const target = Number(value);
  const count = useMotionValue(reduced ? target : from);

  React.useEffect(() => {
    if (reduced) {
      count.set(target);
      return;
    }
    count.set(from);
    const controls = animate(count, target, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [count, from, target, duration, reduced]);

  return (
    <div
      className="flex justify-center tracking-tight text-[#CEE2FF]"
      style={{
        fontSize: DIGIT_H * 0.9,
        lineHeight: 1,
        // Doto (black) for the counter; monospace fallback keeps digits aligned.
        fontFamily: '"Doto", ui-monospace, "SFMono-Regular", monospace',
        fontWeight: 900,
      }}
    >
      {/* Real value for assistive tech; the rolling wheels are decorative. */}
      <span className="sr-only">{value}</span>
      {value.split("").map((d, i) => {
        // Non-numeric characters (e.g. a comma) render statically.
        if (Number.isNaN(Number(d))) {
          return (
            <span key={i} aria-hidden="true" className="flex items-center">
              {d}
            </span>
          );
        }
        const place = Math.pow(10, value.length - 1 - i);
        return <RollingDigit key={i} count={count} place={place} />;
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
      from = DEFAULTS.from,
      countDuration = DEFAULTS.countDuration,
      unit = DEFAULTS.unit,
      finalLead = DEFAULTS.finalLead,
      finalEmph = DEFAULTS.finalEmph,
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
    // Bumping `cycle` remounts Phase 1 so its odometer replays the count on loop.
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
              <Odometer
                value={count}
                from={from}
                duration={countDuration}
                reduced={reduced}
              />
              <motion.p
                className="text-2xl font-bold uppercase tracking-wide text-[#CEE2FF] sm:text-3xl"
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
                <span className="text-[#CEE2FF]">{finalLead}</span>
                <span className="text-[#CEE2FF]">{finalEmph}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  },
);
StatReveal.displayName = "StatReveal";
