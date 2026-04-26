# Design System Strategy: The Curated Career Architect

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Digital Curator."** In a noisy job market, we move away from the cluttered, "spreadsheet-style" density of traditional job boards. Instead, we embrace a high-end editorial experience that feels like a bespoke consultancy.

The aesthetic leverages **Organic Functionalism**. We break the "standard SaaS" template by using intentional asymmetry, generous whitespace (using the `20` and `24` spacing tokens), and a hierarchy that prioritizes cognitive ease. By layering surfaces rather than boxing them in, we create a fluid, "tech-forward" environment that mirrors the precision of platforms like Linear and Vercel.

## 2. Color & Surface Architecture
We move beyond flat UI by treating the screen as a physical space with depth.

### The "No-Line" Rule
**Strict Mandate:** 1px solid borders are prohibited for sectioning content. To define boundaries, use background shifts. 
*   **Implementation:** Place a `surface-container-low` (#f0f3ff) module directly onto a `surface` (#f9f9ff) background. The shift in value is enough for the eye to perceive a container without the "visual noise" of a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, premium materials.
*   **Base:** `surface` (#f9f9ff)
*   **Sectioning:** `surface-container` (#e7eeff) for secondary layout areas.
*   **Elevated Content:** `surface-container-lowest` (#ffffff) for primary cards or interactive modules to make them "pop" against the tinted background.

### The Glass & Gradient Rule
For CTAs and Hero sections, we avoid flat fills.
*   **Primary Action:** Use a linear gradient from `primary` (#003c90) to `primary_container` (#0f52ba) at a 135-degree angle. This adds "soul" and a sense of forward motion.
*   **Floating Elements:** For navigation bars or hover-menus, use `surface_container_lowest` at 80% opacity with a `24px` backdrop-blur to create a "frosted glass" effect.

## 3. Typography: The Editorial Voice
We use **Inter** not just for legibility, but as a tool for authority.

*   **Display Scale:** Use `display-lg` (3.5rem) with a `tight` letter-spacing (-0.02em) for hero headlines. This creates a high-impact, editorial feel.
*   **The Narrative Lead:** Use `title-lg` (1.375rem) in `primary` (#003c90) for job titles. It provides enough weight to be the anchor of a card without needing bold strokes.
*   **Micro-Data:** Use `label-md` or `label-sm` in `secondary` (#555f71) for metadata (e.g., "Posted 2h ago"). This keeps the UI clean by de-emphasizing non-critical info.

## 4. Elevation & Depth
Depth is a functional tool, not a decoration.

*   **Tonal Layering:** Avoid shadows for static elements. Place a `surface-container-lowest` card on a `surface-container-high` background to create a "natural lift."
*   **Ambient Shadows:** For active states or floating modals, use an extra-diffused shadow: `0 20px 40px rgba(18, 28, 44, 0.06)`. Notice the shadow is tinted with the `on-surface` color (#121c2c) to appear natural.
*   **The "Ghost Border" Fallback:** If a layout requires a container edge for accessibility, use `outline-variant` (#c3c6d5) at **15% opacity**. It should be felt, not seen.

## 5. Components

### Job Cards & Content Modules
*   **Structure:** No borders. Use `surface-container-lowest` (#ffffff) with `xl` (0.75rem) rounded corners.
*   **Spacing:** Use `spacing-6` (2rem) for internal padding to give content room to breathe.
*   **Separation:** Forbid divider lines. Use `spacing-4` (1.4rem) of vertical whitespace to separate the "Company Name" from the "Job Description."

### Search Bars & Inputs
*   **Interaction:** The default state is a `surface-container-low` fill. On focus, transition to `surface-container-lowest` with a subtle `primary` (#003c90) "Ghost Border" at 20% opacity.
*   **Corners:** Use `full` (9999px) for search bars to signify "Search" as a global, fluid action.

### Filter Chips
*   **Default:** `surface-container-high` (#dee8ff) with `on-surface-variant` text.
*   **Active:** `primary` (#003c90) background with `on-primary` (#ffffff) text. No borders.
*   **Shape:** `md` (0.375rem) corners for a "tech-forward" geometric look.

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`). `xl` roundedness. Large horizontal padding (`spacing-5`).
*   **Secondary:** `surface-container-highest` background. No border. Text in `primary`.
*   **Tertiary:** Ghost style. No background. Only `primary` text. Use for low-priority actions like "Cancel" or "Skip."

### Educational Content Modules (Interview Prep)
*   Use a "Two-Tone" layout. A `surface-container-lowest` card for the text, paired with a `surface-variant` side-accent to house progress indicators or "Time to Read" labels.

## 6. Do’s and Don’ts

### Do
*   **Do** use `spacing-20` (7rem) between major sections to emphasize high-end quality.
*   **Do** use `primary_fixed` (#d9e2ff) as a subtle background highlight for "Featured" or "Applied" statuses.
*   **Do** use `on_surface_variant` (#434653) for body text to reduce eye strain compared to pure black.

### Don’t
*   **Don't** use 1px dividers. If you feel you need one, increase the whitespace (`spacing-8`) or change the background tone instead.
*   **Don't** use pure black (#000000) for shadows or text. It breaks the sophisticated navy-tonal palette.
*   **Don't** cram content. If a job card feels full, increase the card width or use an editorial "Read More" fade instead of shrinking the font size.