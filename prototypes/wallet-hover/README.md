# Wallet hover — spring burst + levitation

Hover / focus / tap the wallet and:

1. **Card pop** — the inner cards spring up and fan out so all three colours show.
2. **Icon burst** — the crypto tokens spring from the wallet centre into an arch
   above it, scaling `0 → 1` and fading in.
3. **Levitation** — once they reach the arch, each token eases into a continuous,
   desynced up/down bob for as long as the hover is held.

All motion uses **Framer Motion spring physics** (stiffness / damping / mass) —
no linear or ease-in-out on the reveal — so it feels snappy and playful. The
burst→levitation handoff is done by nesting two motion layers: the outer layer
owns the spring burst, the inner layer owns the infinite bob.

## Run it

Just open `index.html` in a browser. No build step, no `npm install`, no network:
React + Framer Motion + htm are pre-bundled into `vendor.js`.

## Files

```
index.html   – markup + mount point (#root)
style.css    – resting layout only; Framer Motion owns every transform
app.js       – the animation (readable, data-driven) — edit this
vendor.js    – prebuilt React + Framer Motion + htm bundle (don't hand-edit)
assets/      – one SVG per layer
```

## Swap in your Figma SVGs

Drop your exports into `assets/` (or repoint the paths) — no code changes needed
if you keep the filenames. Everything is data-driven in `app.js`:

- **Cards** → the `CARDS` array. Each entry has its `src` and its `pop` hover
  transform `{ x, y, rotate }`. Resting position + stacking live in `style.css`
  (`.card--yellow/green/blue`).
- **Icons** → the `ICONS` array (`src` + native `size`). Add or remove entries
  freely; add a matching angle to `ICON_ANGLES` and the arch position is computed
  for you. Arch shape is the `ARCH` constant (`radius`, `centerY`).
- **Feel** → tune `SPRING_CARD` / `SPRING_ICON` (stiffness / damping / mass).

`prefers-reduced-motion` is respected: the reveal snaps instantly and the bob is
disabled.

## Rebuilding vendor.js (only if you change library versions)

```
npm install react@18.3.1 react-dom@18.3.1 framer-motion@11.11.17 htm@3.1.1 esbuild
# vendor-entry.js re-exports: React, createRoot, motion, useReducedMotion, html
esbuild vendor-entry.js --bundle --format=esm \
  --define:process.env.NODE_ENV='"production"' --outfile=vendor.js
```
