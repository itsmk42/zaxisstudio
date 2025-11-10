# Zaxis Studio — Wellness Palette Style Guide

This style guide documents the cohesive color scheme for the homepage and general UI, aligned with a gentle, inviting wellness aesthetic.

## Palette

- Cool Gray — `#F5F7FA`
  - Role: Primary page background, surface wash
- Soft Green — `#E8F5E9`
  - Role: Accent backgrounds for badges, secondary buttons, decorative elements
- Pale Blue — `#E3F2FD`
  - Role: Accent backgrounds for info highlights, secondary buttons
- Light Pink — `#FCE4EC`
  - Role: Accent backgrounds for gentle highlights, promotional tags
- Deep Brown — `#5D4037`
  - Role: Primary CTAs, navigation emphasis, headings, important text
- Blue-Gray — `#607D8B`
  - Role: Primary body text, icons, secondary CTAs

### Derived Tokens
- `--bg-primary` → `#F5F7FA`
- `--text-primary` → `#607D8B`
- `--text-strong` → `#5D4037`
- `--accent-green` → `#E8F5E9`
- `--accent-blue` → `#E3F2FD`
- `--accent-pink` → `#FCE4EC`
- `--border` → `#CBD5E1` (soft slate border)

## Usage Guidelines

- Backgrounds: Use `--bg-primary` for the site’s main background.
- Navigation: Use `--text-strong` for brand and nav links; keep background matte (`rgba(255,255,255,0.85)`) over `--bg-primary`.
- CTAs: Use deep brown (`.btn.primary`, `.btn.buy-now`) for high-importance actions; blue-gray for secondary strong actions.
- Secondary accents: Use `.btn.accent-green`, `.btn.accent-blue`, `.btn.accent-pink` for gentle accents; pair with `--text-strong` for legibility.
- Typography: Primary text uses `--text-primary`; headings/important text use `--text-strong`.
- Cards: Keep white surfaces with soft slate borders for a satin finish; avoid glossy shadows.
- Gradients/Overlays: Apply subtle overlays and soft shadows (low opacity, neutral hue) to create depth.

## Accessibility

- Contrast: Ensure text on accent backgrounds uses `--text-strong` (deep brown) for WCAG AA compliance against light accents.
- Background vs text: `#607D8B` (blue-gray) on `#F5F7FA` (cool gray) meets AA for body text.
- Focus: Use visible focus rings (e.g., `outline: 2px solid #3b82f6`) on interactive elements.

## CSS Entrypoints

The palette is defined in `app/globals.css` with CSS variables; components use classes:
- Buttons: `.btn`, `.btn.primary`, `.btn.buy-now`, `.btn.accent-green`, `.btn.accent-blue`, `.btn.accent-pink`
- Text helpers: `.text-secondary` (muted), prices use `--text-strong`
- Hero overlays leverage palette tones at low opacity for subtle motion.

## Examples

- Primary CTA: `<a class="btn primary">Buy Now</a>`
- Secondary action: `<a class="btn accent-blue">View</a>`
- Decorative tag: `<span class="btn accent-pink">New</span>`

## Notes

- Maintain matte/satin finishes; avoid glossy/glassmorphism effects.
- Prefer low-opacity, low-contrast shadows for depth.
- Keep color usage consistent across components to reinforce hierarchy.
