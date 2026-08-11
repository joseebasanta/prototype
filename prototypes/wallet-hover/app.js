/* =========================================================================
   Wallet hover — animation logic (React + Framer Motion, no build step)

   The whole animation stack (React, Framer Motion, htm) is pre-bundled into a
   single local file — vendor.js — so just open index.html in a browser: no
   build step, no npm install, no network. Framer Motion is used deliberately
   for its REAL spring solver (stiffness / damping / mass) and its ability to
   hand a spring-driven "burst" off to a continuous infinite "levitation" loop.

   Everything visual is data-driven:
     • CARDS  — the coloured stack inside the wallet
     • ICONS  — the crypto badges that burst into an arch
   Swap in your own Figma SVGs by editing the `src` paths (and, if the artwork
   size differs, the `size` field for icons). Tune the motion in one place via
   the SPRING_* / FAN geometry constants below.
   ========================================================================= */

// React + Framer Motion + htm, pre-bundled into one local file (see vendor.js).
// This keeps the prototype build-free AND network-free — open index.html and go.
// `html` is a pre-bound htm tagged-template (htm.bind(React.createElement)).
import { React, createRoot, motion, useReducedMotion, html } from "./vendor.js";

/* -------------------------------------------------------------------------
   1. MOTION TUNING — spring physics + geometry all live here
   ------------------------------------------------------------------------- */

// Snappy, bouncy pop for the card stack.
const SPRING_CARD = { type: "spring", stiffness: 380, damping: 16, mass: 0.9 };
// Slightly looser / bouncier burst for the icons.
const SPRING_ICON = { type: "spring", stiffness: 340, damping: 14, mass: 0.7 };

// Wallet-local coordinate origin (matches the 200×126 back panel).
const WALLET_CENTER_X = 100;
const ICON_REST_Y = 30;          // icons rest tucked ~30px inside the top

// Arch the icons fan into, expressed as a circle above the wallet.
const ARCH = { radius: 104, centerY: 12 };   // centreY in wallet coords
// One entry per icon → its angle along the arch (deg, 0 = straight up).
const ICON_ANGLES = [-58, -20, 20, 58];

/* -------------------------------------------------------------------------
   2. DATA — swap these paths for your own SVG exports
   ------------------------------------------------------------------------- */

// Cards: `pop` is the hover transform (relative to the resting CSS position).
const CARDS = [
  { id: "yellow", src: "assets/card-yellow.svg", cls: "card--yellow", pop: { x: -22, y: -48, rotate: -8 } },
  { id: "green",  src: "assets/card-green.svg",  cls: "card--green",  pop: { x:   0, y: -58, rotate:  0 } },
  { id: "blue",   src: "assets/card-blue.svg",   cls: "card--blue",   pop: { x:  22, y: -48, rotate:  8 } },
];

// Icons: order controls arch placement (paired with ICON_ANGLES).
const ICONS = [
  { id: "usdt", src: "assets/token-usdt.svg", size: 42 },
  { id: "usdc", src: "assets/token-usdc.svg", size: 32 },
  { id: "dai",  src: "assets/token-dai.svg",  size: 24 },
  { id: "deel", src: "assets/token-deel.svg", size: 42 },
].map((icon, i) => {
  // Resolve each icon's arch target from its angle. The size cancels out of
  // the offset maths, so `x`/`y` are pure transform deltas from the anchor.
  const t = (ICON_ANGLES[i] * Math.PI) / 180;
  const archX = WALLET_CENTER_X + ARCH.radius * Math.sin(t);
  const archY = ARCH.centerY - ARCH.radius * Math.cos(t);   // negative = above
  return { ...icon, x: archX - WALLET_CENTER_X, y: archY - ICON_REST_Y };
});

/* -------------------------------------------------------------------------
   3. COMPONENTS
   ------------------------------------------------------------------------- */

// A single crypto badge. Two nested layers keep concerns separate:
//   • outer  → the spring BURST from centre to its arch position (+ scale/fade)
//   • inner  → the continuous LEVITATION bob, started once hovered
function Icon({ icon, index, open, reduce }) {
  const restLeft = 130 - icon.size / 2;   // 130 = scene centre X (wallet centre)
  const restTop = 184 - icon.size / 2;    // 184 = scene Y of the resting anchor

  const burstTransition = reduce
    ? { duration: 0.001 }
    : { ...SPRING_ICON, delay: 0.05 + index * 0.05 };   // stagger the burst

  // Gentle, per-icon-desynced infinite bob — only while hovered.
  const bob = open && !reduce
    ? { y: [0, -7, 0] }
    : { y: 0 };
  const bobTransition = open && !reduce
    ? { duration: 2.4 + index * 0.25, repeat: Infinity, ease: "easeInOut", delay: 0.35 + index * 0.12 }
    : { duration: 0.2 };

  return html`
    <${motion.div}
      className="icon-anchor"
      style=${{ left: restLeft + "px", top: restTop + "px", width: icon.size + "px", height: icon.size + "px" }}
      initial=${false}
      animate=${open ? "burst" : "rest"}
      variants=${{
        rest:  { x: 0, y: 0, scale: 0, opacity: 0 },
        burst: { x: icon.x, y: icon.y, scale: 1, opacity: 1 },
      }}
      transition=${burstTransition}
    >
      <${motion.div} className="icon-bob" animate=${bob} transition=${bobTransition}>
        <img src=${icon.src} width=${icon.size} height=${icon.size} alt="" />
      <//>
    <//>
  `;
}

// The wallet + its interactive hover state.
function Wallet() {
  const [open, setOpen] = React.useState(false);
  const reduce = useReducedMotion();

  // Parent variants drive a child stagger for the card pop.
  const cardsParent = {
    rest: {},
    pop: { transition: { staggerChildren: reduce ? 0 : 0.04 } },
  };

  return html`
    <div className="scene">
      ${ICONS.map((icon, i) => html`
        <${Icon} key=${icon.id} icon=${icon} index=${i} open=${open} reduce=${reduce} />
      `)}

      <${motion.div}
        className="wallet"
        role="button"
        tabIndex=${0}
        aria-label="Wallet — hover to reveal cards and crypto tokens"
        onHoverStart=${() => setOpen(true)}
        onHoverEnd=${() => setOpen(false)}
        onFocus=${() => setOpen(true)}
        onBlur=${() => setOpen(false)}
        onTap=${(e) => { if (e.pointerType === "touch") setOpen((o) => !o); }}
      >
        <img className="wallet-back" src="assets/wallet-back.svg" alt="" aria-hidden="true" />

        <${motion.div}
          className="cards"
          initial=${false}
          animate=${open ? "pop" : "rest"}
          variants=${cardsParent}
        >
          ${CARDS.map((card) => html`
            <${motion.img}
              key=${card.id}
              className=${"card " + card.cls}
              src=${card.src}
              alt=""
              variants=${{ rest: { x: 0, y: 0, rotate: 0 }, pop: card.pop }}
              transition=${reduce ? { duration: 0.001 } : SPRING_CARD}
            />
          `)}
        <//>

        <img className="wallet-front" src="assets/wallet-front.svg" alt="" aria-hidden="true" />

        <div className="balance">
          <div className="balance__amount">$420.00</div>
          <div className="balance__label">Total Balance</div>
        </div>
      <//>
    </div>
  `;
}

createRoot(document.getElementById("root")).render(html`<${Wallet} />`);
