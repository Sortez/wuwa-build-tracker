---
name: WuWa Build Tracker
description: A dark, element-lit console for planning Wuthering Waves builds beside the game.
colors:
  void: "#050813"
  deep-hull: "#0a1022"
  panel: "rgba(12, 18, 36, 0.72)"
  panel-raised: "rgba(18, 27, 52, 0.72)"
  input-well: "rgba(8, 13, 28, 0.85)"
  hairline: "rgba(148, 178, 255, 0.13)"
  hairline-strong: "rgba(148, 178, 255, 0.28)"
  starlight: "#eef3ff"
  dusk-slate: "#8c9bbd"
  resonance-cyan: "#7dd3fc"
  resonance-cyan-deep: "#60a5fa"
  abyss-ink: "#041322"
  convene-gold: "#f4c977"
  signal-green: "#4ade80"
  signal-red: "#f87171"
  element-spectro: "#f5dc78"
  element-havoc: "#d08cf5"
  element-fusion: "#fb9263"
  element-glacio: "#67d5fa"
  element-aero: "#6ee7b7"
  element-electro: "#a78bfa"
  rarity-5: "#f4c977"
  rarity-4: "#c896f5"
  rarity-3: "#7cc4fa"
  tier-z: "#fb7185"
  tier-s: "#fb923c"
  tier-a: "#f4c977"
  tier-b: "#a3e635"
  tier-c: "#38bdf8"
  tier-d: "#818cf8"
  tier-e: "#94a3b8"
typography:
  display:
    fontFamily: "Outfit, DM Sans, sans-serif"
    fontSize: "38px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Outfit, DM Sans, sans-serif"
    fontSize: "26px"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "Outfit, DM Sans, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "DM Sans, -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  2xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.resonance-cyan}"
    textColor: "{colors.abyss-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "9px 16px"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.025)"
    textColor: "{colors.dusk-slate}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "7px 12px"
  button-ghost-hover:
    backgroundColor: "rgba(148, 178, 255, 0.09)"
    textColor: "{colors.starlight}"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.dusk-slate}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
  tab-active:
    backgroundColor: "rgba(125, 211, 252, 0.2)"
    textColor: "{colors.starlight}"
  input:
    backgroundColor: "{colors.input-well}"
    textColor: "{colors.starlight}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.lg}"
    padding: "20px"
  chip-filter:
    backgroundColor: "rgba(255, 255, 255, 0.025)"
    textColor: "{colors.dusk-slate}"
    rounded: "{rounded.sm}"
    height: "30px"
    padding: "0 10px"
  chip-filter-active:
    backgroundColor: "rgba(125, 211, 252, 0.14)"
    textColor: "{colors.starlight}"
  roster-card:
    backgroundColor: "rgba(255, 255, 255, 0.02)"
    textColor: "{colors.starlight}"
    rounded: "10px"
    padding: "7px 38px 7px 8px"
---

# Design System: WuWa Build Tracker

## Overview

**Creative North Star: "The Resonance Console"**

The tracker is an instrument, not a poster. It is a precise, dark control panel that sits beside the running game and lights up in the color of whatever Resonator is in focus. The near-black navy hull keeps the game's art and the six element colors as the brightest things on screen; everything else is quiet slate text, hairline borders and dim surfaces.

Information is dense because the window is often small and out of focus, but controls should feel soft and easy to hit rather than cramped. The current implementation leans on frosted glass, nebula backdrops and glows; the agreed direction is to pull that back. Glass stays on the top bar, content panels move toward solid surfaces, and glow only marks what is selected or active.

Character, weapon, Echo and banner art comes from the game and is the only imagery. The console frames it; it never competes with it.

**Key Characteristics:**
- Dark navy hull (`void`) with one cool accent (`resonance-cyan`) and gold reserved for Convene and 5-star rarity.
- Element color (`--el-color`) as a scoped variable that tints borders, avatars, selection and the character hero.
- Outfit for names and headings, DM Sans for everything read, JetBrains Mono for counts and numbers.
- Tabular numerals everywhere: stats, counts and costs line up.
- Hairline borders over shadows; depth comes from tonal steps.

## Colors

A cold night-console palette: navy neutrals, one cyan voice, and a fixed vocabulary of game-meaning colors (element, rarity, tier) that carry information, not decoration.

### Primary
- **Resonance Cyan** (`resonance-cyan`): the single interface accent. Focus rings, the active tab, active filters, the primary button (a gradient into `resonance-cyan-deep`) and the brand mark. Text on it is `abyss-ink`.

### Secondary
- **Convene Gold** (`convene-gold`): 5-star rarity stars, A-tier, "new resonator" and banner countdowns. It means "rare or time-limited"; never use it as a second general accent.

### Tertiary
- **Element colors** (`element-spectro` … `element-electro`): applied through the `.el-*` classes as `--el-color`. They tint avatar borders, the selected roster card, the character hero aura, element pills and dots. Neutral fallback is `dusk-slate`.
- **Tier colors** (`tier-z` … `tier-e`): only on tier letters and tier rails in team lists.
- **Rarity colors** (`rarity-5/4/3`): only on star rows.

### Neutral
- **Void** (`void`): the page background, with a slight top-down navy gradient.
- **Deep Hull** (`deep-hull`): avatar wells and solid fills behind art.
- **Panel / Panel Raised** (`panel`, `panel-raised`): content surfaces and selected or nested surfaces.
- **Input Well** (`input-well`): inputs, selects and segmented controls, a step darker than the panel.
- **Hairline / Hairline Strong** (`hairline`, `hairline-strong`): resting and hover borders.
- **Starlight** (`starlight`): primary text.
- **Dusk Slate** (`dusk-slate`): secondary text, labels, inactive tabs and icons.
- **Signal Green / Signal Red** (`signal-green`, `signal-red`): "build ready" and destructive hover only.

### Named Rules
**The Meaning-Only Color Rule.** Element, tier and rarity colors appear only where they encode that fact. Never borrow Havoc purple or Z-tier pink to decorate an unrelated control.

**The One Voice Rule.** Cyan is the only interface accent. If a screen needs a second emphasis, use weight or `starlight` text, not a new hue.

## Typography

**Display Font:** Outfit (with DM Sans, sans-serif)
**Body Font:** DM Sans (with -apple-system, BlinkMacSystemFont, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace, monospace)

**Character:** Outfit's geometric caps give names and headings a clean game-UI edge; DM Sans stays neutral and legible at small sizes; the mono face makes counts and stat values read as data. All three are self-hosted in `public/fonts`.

### Hierarchy
- **Display** (700, 38px, scaling down to 26px in the character hero via `clamp(26px, 2.8vw, 38px)`; 54px for a new-resonator banner): Resonator names in the character hero and banner titles. One per view.
- **Headline** (700, 26px): tier letters in the tier rail.
- **Title** (600, 16px): panel titles. Section subtitles use 600 at 13px in `dusk-slate`.
- **Body** (400, 14px, 1.5): descriptions, skill and passive text, weapon effects.
- **Label** (600, 12px): field labels, ghost buttons, roster names at 13px. Tabs use Outfit 600 at 13px.
- **Mono** (500, 11px): counts in tabs ("8/61"), stat values, version numbers.

### Named Rules
**The Tabular Rule.** Body text sets `font-variant-numeric: tabular-nums`. Any new number display (stats, costs, counts) must keep columns aligned.

**The Readable-Floor Rule.** Running text never goes below 12px. 11px is reserved for mono counts and star rows; 9–10px is not used for new work.

## Layout

The app fills the window and never scrolls the page: `body` is `overflow: hidden`, and each region scrolls on its own. The shell is a column (top bar, main, footer) inside a centered container (max 1580px, padding 16px 24px 12px, gap 14px).

- **Roster tab:** a fixed-width sidebar (search, element filter, owned filter, scrolling roster list) beside a scrolling character workspace (hero, teams, gear, Echoes).
- **Index tabs and Teams:** a filter row above a scrolling grid of cards; Teams groups cards into tier rows with a colored rail on the left.
- **Banners:** a full-width hero for the featured banner, then a two-column row of banner cards with full-body art on the right.

Default desktop window is 1360×900 (minimum 1024×680). Breakpoints at 1080px, 900px and 680px collapse the sidebar layout and stack grids; the 680px step serves the web build only.

Spacing is currently ad hoc (2–24px). New work should snap to the `spacing` scale (4, 8, 12, 16, 20, 24) and lean roomy: 16–20px inside panels, 12px between cards.

## Elevation & Depth

Depth is mostly tonal: `void` → `panel` → `panel-raised`, separated by hairline borders. The current build also layers frosted glass (`backdrop-filter: blur(16–18px) saturate(135–140%)`) on the top bar, panels and hero, over a starfield and two blurred nebulas. The direction is to keep the backdrop subtle, keep glass on the top bar only, and give content panels solid fills so text over them reads cleanly.

### Shadow Vocabulary
- **Glass highlight** (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06)`): a 1px top sheen on panels and the top bar.
- **Resting lift** (`box-shadow: 0 2px 8px rgba(2, 5, 16, 0.45)`): panels and the top bar.
- **Overlay** (`box-shadow: 0 22px 48px -20px rgba(2, 6, 20, 0.85), 0 4px 14px rgba(2, 6, 20, 0.5)`): dropdowns and floating menus.
- **Selection glow** (`box-shadow: 0 0 22px -10px var(--el-color)`): the selected roster card, active tab and element-tinted selection.

### Named Rules
**The One Glass Rule.** Only the top bar (and floating menus, which sit over moving content) is frosted. New panels use a solid `panel` fill, and existing panels move to solid fills when they are touched.

**The Glow-Means-Selected Rule.** A glow says "this is the active or selected item". No glow on resting cards, headings or decoration.

## Shapes

Gently rounded, never sharp, never bubbly. Controls and inputs use 8px (`sm`), cards and avatars 10–12px (`md`), panels and the top bar 16px (`lg`). Tabs, the tab rail and counters are full pills (999px). Element dots are circles. Borders are 1px hairlines; avatars use a 1.5px border tinted by element color. Empty avatar slots use a dashed `hairline-strong` border.

## Components

### Buttons
Soft, clear and easy to hit.
- **Shape:** gently rounded (8px).
- **Primary:** a cyan gradient (`resonance-cyan` to `resonance-cyan-deep`, 135°) with `abyss-ink` text, Outfit 700 at 13px, padding 9px 16px. One per region ("Plan build", "Use recommended").
- **Ghost:** almost transparent fill, hairline border, `dusk-slate` text, 600 at 12px; on hover the text turns `starlight`, the border strengthens and the fill tints blue. Used for Export, Import, Reset and secondary actions.
- **Danger:** looks like ghost at rest; on hover it turns `signal-red` with a 10% red tint.
- **Icon button:** 28px square, transparent; hover shows the danger treatment (it is used for remove actions).
- **Press:** every button scales to 0.98 on press; transitions are 140–200ms ease.
- **Direction:** new controls should be at least 32px tall.

### Chips
- **Element filter:** 30px tall, 8px radius, hairline border. Each holds an element-colored dot; when active, the border and fill take that element's color at 70% / 16%.
- **Segmented filter:** three equal buttons in an `input-well` trough (All / Owned / Missing); the active one gets a cyan tint and cyan text.

### Cards / Containers
- **Corner Style:** 16px for panels, 10–12px for cards inside them.
- **Background:** `panel` for panels, a 2% white wash for list cards, `panel-raised` for nested cards.
- **Shadow Strategy:** glass highlight and resting lift on panels only; see Elevation.
- **Border:** 1px `hairline`, `hairline-strong` on hover.
- **Internal Padding:** 20px panels; 7–8px roster cards (aim for roomier in new work).

### Inputs / Fields
- **Style:** `input-well` fill, 1px hairline, 8px radius, padding 8px 10px; labels sit above in 600 at 12px `dusk-slate`.
- **Focus:** border turns `resonance-cyan` with a 3px cyan ring at 14% opacity. Global `:focus-visible` is a 2px cyan outline offset by 2px.
- **Custom select (IconSelect):** the same well, with the item's icon, name, stars and stat inline; the menu uses the overlay shadow.

### Navigation
A pill rail of tabs in the top bar: Resonators, Character Index, Weapon Index, Teams, Banners. Each tab has an icon, an Outfit 600 label at 13px and a mono count. Inactive tabs are `dusk-slate`; hover lifts the text to `starlight`; the active tab gets a cyan-to-indigo tinted fill, a cyan border and a selection glow. A skip link appears on keyboard focus.

### Character Hero (signature)
The top of the character workspace: a large portrait avatar (92×104px) with an element-colored shadow, the name in Display type, stars, element, weapon type and role, plus summary stat tiles (primary weapon, Echo cost, substat goals). A soft radial aura in the character's element color sits behind it. This is the one place where element color washes a surface.

### Roster Card (signature)
A row in the sidebar: portrait (46×50px), name with rarity stars, element dot, element and role, and an owned toggle on the right. When selected it gets an element-tinted gradient, an element border and the selection glow.

### Tier Rail (signature)
In Teams, each tier group has a left rail with the tier letter in Headline type in its tier color and a mono count, next to a grid of team cards with three avatar slots each.

## Do's and Don'ts

### Do:
- **Do** let game art and element color be the brightest things on screen; keep chrome in navy, slate and hairlines.
- **Do** scope element tinting through `--el-color` and `color-mix()` instead of hard-coding element hexes in new rules.
- **Do** use `tabular-nums` and the mono face for counts and stat values.
- **Do** give new controls at least 32px height and 16–20px panel padding.
- **Do** keep a visible `:focus-visible` ring (2px cyan, 2px offset) on every interactive element.
- **Do** honor `prefers-reduced-motion`: the existing media query cuts animations and transitions to near zero.

### Don't:
- **Don't** add new frosted-glass panels; glass belongs to the top bar only.
- **Don't** add glows to elements that are not selected or active.
- **Don't** use element, tier or rarity colors outside their meaning.
- **Don't** introduce a second interface accent alongside `resonance-cyan`; gold stays reserved for rarity and Convene.
- **Don't** set running text below 12px.
- **Don't** load fonts or assets from a CDN; everything ships in `public/` for offline use.
