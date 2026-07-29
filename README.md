# prototype

Figma designs turned into working animated prototypes.

## Workflow

1. Share a Figma link (or select a frame/component) for a design.
2. Claude pulls the design context from Figma and builds a working prototype — HTML/CSS/JS by default, or a small framework/animation library (GSAP, Framer Motion, etc.) if the animation calls for it.
3. Open the prototype locally to preview, then iterate.

## Structure

Each design gets its own self-contained folder under `prototypes/`:

```
prototypes/
  <design-name>/
    index.html
    style.css
    script.js
    ...
```

Open any prototype directly in a browser, e.g.:

```
open prototypes/<design-name>/index.html
```
