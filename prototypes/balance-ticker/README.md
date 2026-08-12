# Balance ticker

A rapid, **easeOut count-up** for a currency balance, built with **React + Framer Motion**.
The value races from `0` to the target and decelerates to a clean stop; the currency symbol
and decimal separator stay fixed, so only the digits cycle (no horizontal layout shift).

<!-- Preview: open index.html (uses the prebuilt dist/) -->

## Use it in your app

`BalanceTicker` is a self-contained, shadcn-idiomatic component (`forwardRef`, `className`
passthrough via `cn()`, spreads native `<span>` props). Copy `src/BalanceTicker.tsx` and
`src/lib/cn.ts` into your project.

```tsx
import { BalanceTicker } from "@/components/BalanceTicker";

<BalanceTicker balance={420} className="text-white text-2xl font-bold" />
```

### Props

| Prop          | Type      | Default | Description                                                        |
| ------------- | --------- | ------- | ------------------------------------------------------------------ |
| `balance`     | `number`  | —       | Target amount, e.g. `420` or `420.5`. Dynamic — re-animates.       |
| `duration`    | `number`  | `1.6`   | Count duration in seconds.                                         |
| `decimals`    | `number`  | `2`     | Fractional digits shown.                                           |
| `currency`    | `string`  | `"$"`   | Leading symbol, rendered static.                                   |
| `separator`   | `string`  | `"."`   | Decimal separator, rendered static.                                |
| `startOnView` | `boolean` | `true`  | Start when scrolled into view; `false` starts immediately on mount. |
| `live`        | `boolean` | `false` | Start at `balance` and rise continuously forever (no target).       |
| `rate`        | `number`  | `0.2`   | Units per second while `live`.                                      |

Plus any `React.HTMLAttributes<HTMLSpanElement>` (`className`, `style`, `id`, …).

### Live mode

Instead of counting up to a target once, `live` makes the value start at `balance` and rise
continuously — soft and smooth via a per-frame `useAnimationFrame` increment:

```tsx
<BalanceTicker balance={420} live rate={0.2} className="text-white" />
```

At the default `rate` of `0.2`/s it stays a 3-digit `$4xx` for ~48 min before it would reach
`$1000` and widen the integer slot by one digit.

### How the "no shift" works

The integer sits in a fixed-width, right-aligned slot sized to the target's digit count (in
`ch`, under `font-variant-numeric: tabular-nums`). Its right edge is pinned, so the `$` (left)
and `.` (right) never move as digits fill in. Want leading zeros instead of the small early gap
(`$007.00` → `$420.00`)? `padStart` the integer inside the `useTransform` and drop the
`min-width`.

Respects `prefers-reduced-motion` (snaps straight to the final value) and avoids React
re-renders during counting by rendering the Framer Motion `MotionValue` directly.

> Note: no thousands grouping and positive amounts assumed — both easy to add in the
> `useTransform` formatter if you need them.

## Preview locally

`index.html` loads the prebuilt bundle in `dist/`, so it opens directly in a browser with no
build step:

```
open index.html
```

## Rebuild

```
npm install
node build.mjs   # → dist/styles.css (Tailwind CLI) + dist/bundle.js (esbuild, React + Framer Motion inlined)
```

The demo harness (`src/main.tsx`, `src/WalletCard.tsx`) is only for the preview — the reusable
piece is `BalanceTicker`.
