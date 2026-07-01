---
name: Premium Editorial Organic
colors:
  surface: '#fff9eb'
  surface-dim: '#e0dac7'
  surface-bright: '#fff9eb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e0'
  surface-container: '#f4eedb'
  surface-container-high: '#efe8d5'
  surface-container-highest: '#e9e2d0'
  on-surface: '#1e1c10'
  on-surface-variant: '#42493e'
  inverse-surface: '#333024'
  inverse-on-surface: '#f7f0de'
  outline: '#72796e'
  outline-variant: '#c2c9bb'
  surface-tint: '#3b6934'
  primary: '#154212'
  on-primary: '#ffffff'
  primary-container: '#2d5a27'
  on-primary-container: '#9dd090'
  inverse-primary: '#a1d494'
  secondary: '#625e50'
  on-secondary: '#ffffff'
  secondary-container: '#e9e2d0'
  on-secondary-container: '#686456'
  tertiary: '#582d21'
  on-tertiary: '#ffffff'
  tertiary-container: '#744336'
  on-tertiary-container: '#f5b3a1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#bcf0ae'
  primary-fixed-dim: '#a1d494'
  on-primary-fixed: '#002201'
  on-primary-fixed-variant: '#23501e'
  secondary-fixed: '#e9e2d0'
  secondary-fixed-dim: '#ccc6b5'
  on-secondary-fixed: '#1e1c11'
  on-secondary-fixed-variant: '#4a473a'
  tertiary-fixed: '#ffdbd1'
  tertiary-fixed-dim: '#f9b7a5'
  on-tertiary-fixed: '#341007'
  on-tertiary-fixed-variant: '#693a2e'
  background: '#fff9eb'
  on-background: '#1e1c10'
  surface-variant: '#e9e2d0'
typography:
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  container-max: 1024px
---

## Brand & Style
The design system embodies a synthesis of biological forms and scholarly precision. The brand personality is **nurturing, intelligent, and archival**, targeting an audience that values depth, quiet contemplation, and the tactile quality of a well-curated library.

The visual style is a sophisticated blend of **Minimalism** and **Tactile Editorial**. It rejects the sterile, high-blue-light aesthetic of modern SaaS in favor of a "sun-drenched" cream atmosphere. The UI simulates the experience of a digital field guide, using intentional whitespace and a structured grid to present information as if it were a high-end physical publication. The emotional response should be one of calm, authority, and intellectual curiosity.

## Colors
The color strategy is rooted in a "paper and ink" philosophy. The **Warm Neutral Base (#FDF6E3)** serves as the foundational "paper" tone, reducing eye strain and providing a heritage feel.

- **Primary Green (#2D5A27):** A deep forest green reserved for high-emphasis actions and branding. It represents growth and logical structure.
- **Secondary Taupe (#625E50):** Used for structural elements, secondary actions, and subdued metadata.
- **Tertiary Terracotta (#E3A392):** An accent hue for specific highlights, alerts, or botanical indicators.
- **Surface Strategy:** Use `surface-container` (#EFE9D6) to create subtle distinction between the background and nested content areas without relying on shadows.

## Typography
This design system utilizes a strict **Dual-Typography** approach to maintain an editorial hierarchy.

- **Serif (Playfair Display):** Mandatory for all headlines, section titles, and large numerical data. This font provides the "heritage" and "scholarly" character.
- **Sans-Serif (Hanken Grotesk):** Used for all functional UI elements, body copy, and metadata. It provides a clean, modern counterpoint to the serif headers.
- **Scale:** Maintain generous line heights (1.5x+ for body copy) to ensure the scholarly archive remains accessible and pleasant for long-form reading.

## Layout & Spacing
The layout philosophy is **narrative-driven**, prioritizing a focused, center-aligned column that mimics a magazine spread or an open ledger.

- **Grid:** On desktop, use a 12-column grid with a fixed maximum container width of `1024px` to prevent line lengths from becoming unreadable.
- **Margins:** Large outer margins (`64px` on desktop) are critical to achieving the premium, airy feel of this design system.
- **Reflow:** On mobile, margins reduce to `16px`, but the single-column focus remains absolute. Sidebars should be avoided in favor of stacked sections or clean, bottom-sheet navigation.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layering** and **Low-contrast Outlines**, rather than traditional light physics.

- **Zero Shadows:** CSS drop shadows are strictly prohibited. The UI should appear as a flat, physical sheet of paper or vellum.
- **Layering:** Hierarchy is created by placing elements on a slightly darker surface (`#EFE9D6`) against the main background (`#FDF6E3`).
- **Borders:** Use subtle 1px borders using the Secondary Taupe at 20% opacity (`#625E5033`). This provides structural definition without introducing visual "weight" or digital artifacts.

## Shapes
The shape language is **balanced and organic**. While the grid is rigid and scholarly, the corners are softened to feel approachable and biological.

- **Corner Radius:** Standard UI elements like cards and buttons use a `0.5rem` (8px) radius. 
- **Image Treatment:** Photographs and illustrations should maintain the `rounded-lg` (1rem) setting, evoking the look of mounted specimens or pasted photos in an archival journal.

## Components
Consistent styling across components reinforces the premium, archival nature of the design system.

- **Buttons:** 
    - **Primary:** Solid `#2D5A27` with White text. Heavy, authoritative, and focused.
    - **Secondary:** Solid `#625E50` with White text for neutral actions.
    - **Tertiary:** Solid `#E3A392` with Dark text (`#1E1C10`) for specialized accent actions.
- **Cards:** Must rest flat. Use the 20% opacity Taupe border for definition. Internal padding should be generous (minimum `24px`).
- **Input Fields:** Use the `surface-container-low` color for the field background with a subtle bottom-border or full 1px border. Focus states should switch the border to Primary Green.
- **Chips/Pills:** Use `label-md` typography (all-caps with tracking). Use Terracotta backgrounds for biological or status highlights to ensure they catch the eye without breaking the scholarly tone.
- **Lists:** Use horizontal separators (1px, 10% opacity Taupe) between items to maintain the feel of a ledger.