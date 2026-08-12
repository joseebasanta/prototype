import * as React from "react";
import { createRoot } from "react-dom/client";
import { WalletCard } from "./WalletCard";

/** Demo: the balance starts at $420.00 and rises continuously, softly, forever. */
function App() {
  return (
    <div className="page">
      <WalletCard balance={420} live rate={0.05} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
