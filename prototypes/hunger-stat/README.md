# Hunger stat

A **multi-stage typography reveal** on a royal-blue stage, built with **React + Framer Motion**
and styled with **Tailwind CSS**. Type: **Doto** (black) for the rolling number, **IBM Plex
Sans** for the copy (both via Google Fonts).

1. **Odometer** — the number `200` rolls up, slot-machine style: each digit is a masked
   `overflow-hidden` cell holding a `0–9` column that springs to its target
   (`type: "spring", damping: 20, stiffness: 100`), with a slight stagger per column.
2. **Subtext** — `million people` (green) fades in and slides up ~1.5s after the roll starts.
3. **Hand-off** — at ~3s the whole `200 / million people` group slides up and fades out while,
   simultaneously, the final line enters from below.
4. **Final message** — `are going hungry.` (`are going` white, `hungry.` green) slides up into
   place exactly as the first group exits.

`AnimatePresence` handles the mount/unmount of the two states; a single `step` state
(`1 → 2`, flipped by a `useEffect` timeout) drives the swap.

<!-- Preview: open index.html (uses the prebuilt dist/) -->

## Use it in your app

`StatReveal` is a self-contained, shadcn-idiomatic component (`forwardRef`, `className`
passthrough via `cn()`, spreads native `<div>` props). Copy `src/StatReveal.tsx` and
`src/lib/cn.ts` into your project.

```tsx
import { StatReveal } from "@/components/StatReveal";

<StatReveal />                       // one-shot: 200 → "are going hungry."
<StatReveal loop />                  // replay forever (used by the preview)
<StatReveal count="795" unit="Builders" finalLead="Forma " finalEmph="parte" />
```

### Props

| Prop            | Type      | Default            | Description                                                    |
| --------------- | --------- | ------------------ | -------------------------------------------------------------- |
| `count`         | `string`  | `"200"`            | Number the odometer rolls up to. Digits roll; other chars static. |
| `unit`          | `string`  | `"million people"` | Green emphasis line under the number (Phase 1).                |
| `finalLead`     | `string`  | `"are going "`     | White lead-in of the final message.                           |
| `finalEmph`     | `string`  | `"hungry."`        | Green word that closes the final message.                     |
| `digitStagger`  | `number`  | `0.12`             | Seconds each digit column lags behind the previous.           |
| `subtextDelay`  | `number`  | `1.5`              | Seconds after roll start before the subtext appears.          |
| `phaseSwitchMs` | `number`  | `3000`             | Milliseconds Phase 1 holds before it exits and Phase 2 enters. |
| `finalHoldMs`   | `number`  | `2600`             | Milliseconds Phase 2 holds before restarting (`loop` only).   |
| `loop`          | `boolean` | `false`            | Replay from the top forever.                                  |

Plus any `React.HTMLAttributes<HTMLDivElement>` (`className`, `style`, `id`, …).

### How the odometer works

Each digit is a fixed-height (`DIGIT_H` px) masked cell. Inside sits a vertical `0–9` column;
landing on digit `d` is just `animate={{ y: -d * DIGIT_H }}` under the spring. The columns share
one spring and are offset by `digitStagger` so they settle left-to-right. The real number is
also rendered `sr-only` for assistive tech, since the rolling columns are decorative.

Respects `prefers-reduced-motion` — the roll, the subtext, and the phase swap all snap into place
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
