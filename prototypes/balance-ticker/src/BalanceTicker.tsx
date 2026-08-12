import * as React from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { cn } from "./lib/cn";

export interface BalanceTickerProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Target amount to count up to, e.g. 420 or 420.5. Dynamic — re-animates on change. */
  balance: number;
  /** Count duration in seconds. */
  duration?: number;
  /** Fractional digits to show. */
  decimals?: number;
  /** Leading symbol, rendered static. */
  currency?: string;
  /** Decimal separator, rendered static. */
  separator?: string;
  /** Start when scrolled into view (default) instead of immediately on mount. */
  startOnView?: boolean;
}

/**
 * Rapid, easeOut count-up for a currency balance — fast then decelerating to a
 * clean stop. The `currency` symbol and `separator` stay fixed; only the digits
 * cycle, and the integer sits in a fixed-width tabular slot so nothing shifts
 * horizontally as it grows.
 *
 * @example
 * <BalanceTicker balance={420} className="text-white text-2xl" />
 */
export const BalanceTicker = React.forwardRef<HTMLSpanElement, BalanceTickerProps>(
  (
    {
      balance,
      duration = 1.6,
      decimals = 2,
      currency = "$",
      separator = ".",
      startOnView = true,
      className,
      ...props
    },
    ref,
  ) => {
    const count = useMotionValue(0);
    const prefersReduced = useReducedMotion();

    const localRef = React.useRef<HTMLSpanElement>(null);
    React.useImperativeHandle(ref, () => localRef.current as HTMLSpanElement);
    const inView = useInView(localRef, { once: true, amount: 0.5 });

    // Derive both parts from the SAME rounded string so they never disagree at
    // rounding boundaries (e.g. 419.996 → "420" / "00", never "419" / "00").
    const format = React.useCallback(
      (v: number) => Math.abs(v).toFixed(decimals).split("."),
      [decimals],
    );
    const intText = useTransform(count, (v) => format(v)[0]);
    const decText = useTransform(count, (v) => format(v)[1] ?? "");

    React.useEffect(() => {
      if (startOnView && !inView) return;
      if (prefersReduced) {
        count.set(balance);
        return;
      }
      const controls = animate(count, balance, { duration, ease: "easeOut" });
      return () => controls.stop();
    }, [balance, duration, inView, startOnView, prefersReduced, count]);

    // Fixed-width slots (in ch, under tabular-nums) keep the symbol + separator
    // pinned while the digits fill in from the right.
    const intDigits = Math.max(1, Math.floor(Math.abs(balance)).toString().length);
    const tnum: React.CSSProperties = { fontVariantNumeric: "tabular-nums" };

    return (
      <span
        ref={localRef}
        className={cn(
          "inline-flex items-baseline font-bold tracking-tight tabular-nums",
          className,
        )}
        style={tnum}
        {...props}
      >
        <span aria-hidden="true">{currency}</span>
        <motion.span
          style={{
            ...tnum,
            display: "inline-block",
            textAlign: "right",
            minWidth: `${intDigits}ch`,
          }}
        >
          {intText}
        </motion.span>
        {decimals > 0 && (
          <>
            <span aria-hidden="true">{separator}</span>
            <motion.span
              style={{
                ...tnum,
                display: "inline-block",
                textAlign: "left",
                minWidth: `${decimals}ch`,
              }}
            >
              {decText}
            </motion.span>
          </>
        )}
      </span>
    );
  },
);
BalanceTicker.displayName = "BalanceTicker";
