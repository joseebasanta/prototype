// Bundle entry for vendor.js — re-exports the animation stack as one local ESM
// module so app.js can `import { React, createRoot, motion, useReducedMotion, html }`.
// Rebuild with esbuild (see README) only if you change library versions.
import React from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "framer-motion";
import htm from "htm";
const html = htm.bind(React.createElement);
export { React, createRoot, motion, useReducedMotion, html };
