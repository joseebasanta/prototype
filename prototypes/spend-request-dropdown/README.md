# Spend request — dropdown to container

A single card that morphs between two Figma states:

- **Collapsed ("Spend request")** — an avatar group + `@louissur and 4 others request spending` + chevron/close.
- **Expanded ("Container")** — a `Spending Request` title, a divider, and a list of five `$1200.00 · Chris Griffen · Marketing` rows, each with Approve / Reject.

## Interaction

- Click the **pill** or the **chevron** to expand — the header cross-fades from
  the avatar summary to the title, the chevron flips up, and the list grows in
  (`0fr → 1fr` auto height) with the rows staggering.
- Click the **chevron** again to collapse back to the pill.
- Click **✕** to dismiss; a *Reopen* chip restores the pill so the flow stays testable.
- **Approve / Reject** resolve a row in place.

## Notes

- Design tokens (colours, radii, type) are mapped 1:1 from the Figma file's
  variables at the top of `style.css`.
- Figma's illustrated avatars couldn't be downloaded (asset host blocked by the
  session's egress policy), so `assets/*.svg` are hand-built illustrations that
  match the personas, colours, and jewellery in the design.
- Plain HTML/CSS/JS, no dependencies. Open `index.html` directly.
