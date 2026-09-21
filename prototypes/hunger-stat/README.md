# Hunger stat

A **multi-stage typography reveal** on an off-white (`#F4F3F0`) stage with blue
(`#0066FF`) type, built with **React + Framer Motion**
and styled with **Tailwind CSS**. Type: **Silkscreen** (pixel) for the rolling number, **IBM
Plex Sans** for the copy (both via Google Fonts).

1. **Odometer** — a true rolling counter climbs from `from` (`173`) up to `200`: a single
   value counts up (easeOut, decelerating into the final number) and every digit wheel is
   derived from it at its place value, so units/tens/hundreds all spin continuously and
   settle together — no digit sits still.
2. **Subtext** — `BUILDERS` (bold, all-caps) fades in and slides up ~1.5s after the roll.
3. **Hand-off** — at ~3s the whole `200 / BUILDERS` group slides up and fades out while,
   simultaneously, the final line enters from below.
4. **Final message** — `Únetenos` slides up into place exactly as the first group exits.

Throughout, a subtle **twinkling cross-grid** (`TwinkleGrid`, canvas) sits behind the text: a
full-bleed field of tiny "+" marks that gently fade their opacity up and down out of phase, like
a faint animated cross-stitch texture. Kept deliberately low-opacity so it reads as texture, not
noise. Toggle with the `squares` prop; disabled under `prefers-reduced-motion` (drawn static).

`AnimatePresence` handles the mount/unmount of the two states; a single `step` state
(`1 → 2`, flipped by a `useEffect` timeout) drives the swap.

<!-- Preview: open index.html (uses the prebuilt dist/) -->

## Use it in your app

`StatReveal` is a self-contained, shadcn-idiomatic component (`forwardRef`, `className`
passthrough via `cn()`, spreads native `<div>` props). Copy `src/StatReveal.tsx` and
`src/lib/cn.ts` into your project.

```tsx
import { StatReveal } from "@/components/StatReveal";

<StatReveal />                       // one-shot: 200 BUILDERS → "Únetenos"
<StatReveal loop />                  // replay forever (used by the preview)
<StatReveal count="795" unit="million people" finalLead="are going " finalEmph="hungry." />
```

### Props

| Prop            | Type      | Default            | Description                                                    |
| --------------- | --------- | ------------------ | -------------------------------------------------------------- |
| `count`         | `string`  | `"200"`            | Number the counter climbs to. Digits roll; other chars static. |
| `from`          | `number`  | `173`              | Number the counter starts from before climbing to `count`.    |
| `countDuration` | `number`  | `1.8`              | Seconds the count-up takes (decelerates into the final number). |
| `unit`          | `string`  | `"BUILDERS"`       | Bold, all-caps line under the number (Phase 1).               |
| `finalLead`     | `string`  | `""`               | Lead-in of the final message.                                |
| `finalEmph`     | `string`  | `"Únetenos"`       | Word that closes the final message.                          |
| `subtextDelay`  | `number`  | `1.5`              | Seconds after count start before the subtext appears.         |
| `phaseSwitchMs` | `number`  | `3000`             | Milliseconds Phase 1 holds before it exits and Phase 2 enters. |
| `finalHoldMs`   | `number`  | `2600`             | Milliseconds Phase 2 holds before restarting (`loop` only).   |
| `loop`          | `boolean` | `false`            | Replay from the top forever.                                  |
| `squares`       | `boolean` | `true`             | Show the twinkling cross-grid background layer.               |

Plus any `React.HTMLAttributes<HTMLDivElement>` (`className`, `style`, `id`, …).

### How the odometer works

A single motion value counts from `from` to `count`. Each digit is a fixed-height (`DIGIT_H` px)
masked wheel of `0–9`; its vertical offset is derived continuously from that value at its place
(`(value / place) % 10`), so as the number climbs every wheel spins and they settle together. The
wheel strip repeats a trailing `0` so the 9→0 wrap rolls seamlessly. The real number is also
rendered `sr-only` for assistive tech, since the wheels are decorative.

Respects `prefers-reduced-motion` — the count, the subtext, and the phase swap all snap into place
instead of animating.

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

The demo harness (`src/main.tsx`) is only for the preview — the reusable piece is `StatReveal`.
