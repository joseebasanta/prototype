import * as React from "react";
import { createRoot } from "react-dom/client";
import { StatReveal } from "./StatReveal";

/** Demo: the full "795 million people → are going hungry." sequence, looping
 *  so the preview keeps replaying. Drop `loop` for the one-shot behaviour. */
function App() {
  return <StatReveal loop />;
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
