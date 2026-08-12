import * as React from "react";
import { createRoot } from "react-dom/client";
import { WalletCard } from "./WalletCard";

/** Small demo harness: shows the count-up, plus a replay and a dynamic-prop swap. */
function App() {
  const [balance, setBalance] = React.useState(420);
  const [runKey, setRunKey] = React.useState(0);

  const run = (next: number) => {
    setBalance(next);
    setRunKey((k) => k + 1);
  };

  return (
    <div className="page">
      <header className="page__head">
        <p className="eyebrow">Micro-interaction · Prototype</p>
        <h1>Balance ticker</h1>
        <p className="hint">
          The total balance counts up on mount — fast, then easing to a clean stop. The{" "}
          <b>$</b> and <b>.</b> stay fixed; only the digits cycle.
        </p>
      </header>

      {/* key remounts the card so each run restarts the count from $0.00 */}
      <WalletCard key={`${runKey}-${balance}`} balance={balance} />

      <div className="controls" role="group" aria-label="Demo controls">
        <button type="button" onClick={() => run(balance)}>
          Replay
        </button>
        <button type="button" onClick={() => run(420)} data-active={balance === 420}>
          $420.00
        </button>
        <button type="button" onClick={() => run(1337.5)} data-active={balance === 1337.5}>
          $1337.50
        </button>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
