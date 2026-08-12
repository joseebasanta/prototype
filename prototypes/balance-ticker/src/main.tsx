import * as React from "react";
import { createRoot } from "react-dom/client";
import { WalletCard } from "./WalletCard";

/** Demo: the balance starts at $420.00 and rises continuously, softly, forever. */
function App() {
  return (
    <div className="page">
      <header className="page__head">
        <p className="eyebrow">Micro-interaction · Prototype</p>
        <h1>Balance ticker</h1>
        <p className="hint">
          The total balance ticks upward continuously — soft and steady, like the card wave. The{" "}
          <b>$</b> and <b>.</b> stay fixed; only the digits move.
        </p>
      </header>

      <WalletCard balance={420} live />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
