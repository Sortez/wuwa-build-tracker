---
name: WuWa Build Tracker
description: Convene Key Art. The selected Resonator stands full-body in an element-coloured light field; the build sits in an opaque dock beneath.
colors:
  ground: "#0a0912"
  ground-raised: "#14111f"
  panel-solid: "#13101d"
  panel: "rgba(19, 16, 29, 0.9)"
  panel-raised: "rgba(30, 24, 44, 0.72)"
  dock-panel: "rgba(19, 16, 29, 0.94)"
  input-well: "#0e0c17"
  hairline: "rgba(214, 200, 255, 0.11)"
  hairline-strong: "rgba(214, 200, 255, 0.26)"
  bone: "#f2eefa"
  dusk-lilac: "#a99cc0"
  resonance-lilac: "#c9b8ff"
  ink: "#0a0912"
  convene-gold: "#f4c977"
  signal-green: "#4ade80"
  signal-red: "#f87171"
  element-spectro: "#f5dc78"
  element-havoc: "#d08cf5"
  element-fusion: "#fb9263"
  element-glacio: "#67d5fa"
  element-aero: "#6ee7b7"
  element-electro: "#a78bfa"
  element-none: "#8c9bbd"
  rarity-4: "#c896f5"
  rarity-3: "#7cc4fa"
  rarity-2: "#6ee7b7"
  rarity-1: "#9aa5b1"
  tier-z: "#fb7185"
  tier-s: "#fb923c"
  tier-a: "#fde047"
  tier-b: "#a3e635"
  tier-c: "#38bdf8"
  tier-d: "#818cf8"
  tier-e: "#94a3b8"
typography:
  display:
    fontFamily: "'Big Shoulders Display', 'DM Sans', sans-serif"
    fontSize: "clamp(64px, 14cqi, 150px)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "0.005em"
  headline:
    fontFamily: "'Big Shoulders Display', 'DM Sans', sans-serif"
    fontSize: "56px"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "0.01em"
  numeral:
    fontFamily: "'Big Shoulders Display', 'DM Sans', sans-serif"
    fontSize: "34px"
    fontWeight: 800
    lineHeight: 1
  dock-value:
    fontFamily: "'Big Shoulders Display', 'DM Sans', sans-serif"
    fontSize: "22px"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "0.01em"
  brand:
    fontFamily: "'Big Shoulders Display', 'DM Sans', sans-serif"
    fontSize: "24px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "0.04em"
  title:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "tnum"
  label:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0.08em"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontSize: "11px"
    fontWeight: 500
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
  stage: "28px"
components:
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.dusk-lilac}"
    typography: "{typography.title}"
    rounded: "{rounded.pill}"
    padding: "7px 12px"
    height: "36px"
  tab-active:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
  button-primary:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  button-ghost:
    backgroundColor: "rgba(255, 255, 255, 0.025)"
    textColor: "{colors.dusk-lilac}"
    rounded: "{rounded.sm}"
    padding: "7px 12px"
  button-ghost-hover:
    backgroundColor: "rgba(214, 200, 255, 0.09)"
    textColor: "{colors.bone}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.dusk-lilac}"
    rounded: "{rounded.sm}"
    padding: "7px 12px"
  button-danger-hover:
    textColor: "{colors.signal-red}"
  input:
    backgroundColor: "{colors.input-well}"
    textColor: "{colors.bone}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
  panel:
    backgroundColor: "{colors.panel-solid}"
    rounded: "{rounded.lg}"
    padding: "20px"
  dock-card:
    backgroundColor: "{colors.dock-panel}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
  stage-tag:
    backgroundColor: "rgba(10, 9, 18, 0.78)"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    height: "30px"
  filter-chip-active:
    backgroundColor: "rgba(201, 184, 255, 0.14)"
    textColor: "{colors.bone}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  segment-active:
    backgroundColor: "rgba(201, 184, 255, 0.16)"
    textColor: "{colors.resonance-lilac}"
    rounded: "6px"
    padding: "8px 10px"
  owned-toggle-on:
    backgroundColor: "{colors.bone}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "7px 14px"
---

# Design System: WuWa Build Tracker

## Overview

**Creative North Star: "Convene Key Art"**

The selected Resonator is the screen. Their full-body render stands on the right of a stage lit by their element colour, the way a Convene banner splash presents a character, and the name runs down the left at poster scale. The build is read from a dock of four opaque panels along the stage's bottom edge (weapon, Echo set, substat goals, best team), so one glance answers who is selected, which element, and how far along the build is. Everything around the stage (top bar, portrait panel, index views, team grids) is quiet dark furniture that lets the art be the loudest thing on screen.

The world is dark by commitment: a near-black violet ground with bone text and one lilac interface accent. Colour beyond that carries meaning only. Element hues light the stage and mark elements; rarity, tier and success or danger colours mark exactly those states. Depth comes from light (the element field) and from panel tone, not from glass: there is no frosted blur on any reading surface and no starfield backdrop. It is a desktop app window (default 1360x900, minimum 1024x680) that sits beside the running game, offline, with self-hosted fonts and art.

A condensed, heavy display face (Big Shoulders Display) owns names, the brand, dock values, tier letters and banner titles; a plain workhorse sans (DM Sans) carries everything that is read; a monospace (JetBrains Mono) carries counts and figures. Text never sits on art.

**Key Characteristics:**
- One stage per selected character: full-body art in an element-coloured radial light field, name at up to 150px.
- An opaque four-panel dock at the stage foot holds the build summary.
- Near-black violet ground (#0a0912), bone text, lilac accent; gold only for 5-star rarity and Convene.
- Opaque panels everywhere text is read; no backdrop blur, no starfield.
- Condensed display caps for names and figures over a quiet sans body.
- One entrance motion, on character switch; everything else is short state feedback.

## Colors

A near-black violet ground with bone text and a single cool lilac accent; every other hue is a meaning carrier, not decoration.

### Primary
- **Resonance Lilac** (`resonance-lilac`): the interface accent. Focus rings (2px outline, 2px offset), the input focus border with its 3px lilac halo, active segment and filter fills at 14 to 16% alpha, the primary gear slot label, rank and sequence badges, the Echo cost fill, and the fallback field colour when no element is set. It is an interface signal, never a fill for large areas.

### Secondary
- **Convene Gold** (`convene-gold`): 5-star rarity stars and the rarity-5 weapon top edge, the Banners tab countdown and the "new" banner marker. Nothing else.

### Element, Rarity and Tier Hues
- **Element hues** (`element-spectro`, `element-havoc`, `element-fusion`, `element-glacio`, `element-aero`, `element-electro`, `element-none`): set per character as `--el-color`. They light the stage field, colour the element tag and dot, tint the selected roster tile and its border, fill the dock progress bar, and frame the portrait fallback.
- **Rarity hues** (`rarity-4` to `rarity-1`, with gold for 5): star colour and the weapon card top edge.
- **Tier hues** (`tier-z` to `tier-e`): tier letters, tier rails and tier-group borders on the Teams view. Tier A is a lemon yellow (#fde047), kept clear of Convene Gold.

### Neutral
- **Ground** (`ground`): the app background and the bottom of every stage field gradient.
- **Ground Raised** (`ground-raised`): stage base, avatar wells, menu option backgrounds.
- **Panel** (`panel-solid`): the opaque surface of every panel, the roster panel and the compact Character Index header. Beside the stage the roster panel drops to 70% panel over the element wash, with a border mixed 26% toward the element.
- **Panel Raised** (`panel-raised`): nested cards inside panels (gear slots, team cards, kit cards, chips).
- **Dock Panel** (`dock-panel`): the dock cards on the stage and the copy panels on banner heroes and tiles, 94% opaque over light and art.
- **Input Well** (`input-well`): inputs, selects, segmented controls, pick chips.
- **Hairline / Hairline Strong** (`hairline`, `hairline-strong`): 1px lilac-tinted borders at rest and on hover.
- **Bone** (`bone`): all primary text, and the fill of the active tab, primary button and Owned toggle.
- **Dusk Lilac** (`dusk-lilac`): secondary text, labels, inactive tabs and controls.
- **Ink** (`ink`): text on bone or lilac fills.
- **Signal Green / Signal Red** (`signal-green`, `signal-red`): met goals and ready teams; over-cost, destructive hover and expired phases.

### Named Rules
**The Meaning-Only Colour Rule.** Beyond bone, lilac and the neutrals, a hue appears only when it says something: an element, a rarity, a tier, success or danger.

**The Gold Is Convene Rule.** Convene Gold marks 5-star rarity and the Convene banner phase. It is never a general highlight, a tier colour or a badge colour.

**The Element Owns the Stage Rule.** The selected character's element colour is the only large colour field on screen: a radial light (80% by 110% at 64%/42%; 72% at the centre, 34% at 32%, 10% at 62%, gone by 84%) behind the figure with a 40% light pool at its feet, plus a 24% element radial at the roster layout's top-left.

## Typography

**Display Font:** Big Shoulders Display (variable 700 to 900, self-hosted, falls back to DM Sans)
**Body Font:** DM Sans (variable 400 to 700, self-hosted, system sans fallback)
**Label/Mono Font:** JetBrains Mono (400 to 600, self-hosted)

**Character:** a tall condensed poster face for names and figures, set uppercase, against a calm geometric sans for everything read at length. The contrast is the Convene splash against a plain build sheet. Body text uses tabular numerals globally.

### Hierarchy
- **Display** (900, clamp(64px, 14cqi, 150px), 0.86, uppercase): the selected character's name on the stage, sized to the stage's inline-size container; it wraps only at spaces, never inside a word. Names over 9 characters (`data-long`) drop to clamp(52px, 9.5cqi, 108px).
- **Headline** (900, 56px, 0.9, uppercase): banner titles (80px for the new-character hero, 52px under 900px) and the Character Index header name (clamp(40px, 4vw, 56px), 0.92).
- **Numeral** (800, 34px, 1): the dock's substat figure (28px below 1180px); tier rail letters use the same size at 900.
- **Dock Value** (700, 22px, 1.05, uppercase, 2-line clamp): weapon and Echo set names in the dock; 16px below 1180px. Tier badges inside the dock use the display face at 16px.
- **Brand** (900, 24px, 0.04em, uppercase): the app name in the top bar.
- **Title** (600, 16px, -0.01em): panel titles; card headings run 14 to 15px at 600.
- **Body** (400, 14px, 1.5): base text. Secondary text steps to 13px and 12px; kit descriptions sit at 12.5px with 1.58 line height.
- **Label** (600, 12px, 0.08em, uppercase): the dock card labels (Weapon, Echo set, Substat goals, Best team). Form field labels use 12px 600 without case or tracking change.
- **Mono** (500, 11px): counts in tabs and panel heads, cost pills, rank badges, values inside dock metadata.

### Named Rules
**The Poster Face Rule.** Big Shoulders Display is for proper names, figures and tier letters, always uppercase. Sentences, labels and controls stay in DM Sans.

**The Counted in Mono Rule.** Every count, cost and ratio is set in JetBrains Mono or with tabular numerals, so numbers do not jitter as they change.

## Layout

A fixed-height desktop shell: a max-width 1580px column with 16px top and 24px side padding, a top bar (brand, pill tabs, Export/Import, then Reset set 16px apart), a main area that fills the window, and a one-line footer carrying the version and the unofficial-fan-project disclaimer. Inner views scroll; the window does not.

The Resonators tab is a two-column grid: a 312px portrait panel (search, element filter row, Owned/Missing segmented filter, then a 3-column grid of portrait tiles at a 374:440 ratio) and the character view, 18px apart. The stage is an inline-size container at least 500px tall (560px when it holds the fallback frame, above 1180px only) with 28px padding, a title area top-left (max 60% width), the Owned toggle top-right, and the dock across the bottom in four columns weighted 1 : 1 : 0.8 : 1.25 with 12px gaps.

Spacing runs on a 4px base: 4, 8, 12, 16, 20, 24 and 28px, with 12 and 16 doing most of the work between cards and sections.

Responsive behaviour (desktop window first; phones are not a target):
- **1320px:** the top bar becomes a grid; brand and actions on row one, tabs on their own row.
- **1180px:** the stage splits 0.62fr / 0.38fr; the left column stacks the Owned toggle, the title and the dock (2x2) so the right column keeps the figure or the fallback frame. The dock compacts: 10px 12px card padding, 8px gaps, 32px team portraits on one line, values at 16px.
- **1080px:** weapon gear slots go from three columns to two.
- **1000px:** the shell stops pinning height; the roster stacks above the character view with an auto-fill grid capped at 300px tall.
- **900px:** banner heroes stack to one column.
- **680px (web build only):** the top bar stacks brand, actions and tabs on three rows; the page scrolls as a whole; the roster returns to 3 columns and the other grids collapse to one.

## Elevation & Depth

Depth comes from light and tone, not from glass or heavy shadow. The stage is lit from within by its element field; panels are opaque tones a step above the ground with a 1px hairline, a faint 1px top-edge highlight and a small dark shadow. Floating menus get the one deep shadow. Nothing on a reading surface is blurred.

### Shadow Vocabulary
- **Top-edge highlight** (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05)`): on panels and nested cards, a hairline catch of light along the top edge.
- **Resting** (`box-shadow: 0 2px 8px rgba(4, 2, 10, 0.45)`): panels, the roster panel, weapon cards.
- **Floating** (`box-shadow: 0 22px 48px -20px rgba(4, 2, 10, 0.85), 0 4px 14px rgba(4, 2, 10, 0.5)`): the custom select menu.
- **Primary lift** (`box-shadow: 0 6px 14px -8px rgba(4, 2, 10, 0.9)`): the primary button only.
- **Card hover** (`box-shadow: 0 18px 34px -22px rgba(4, 2, 10, 0.9)` with a 2px rise): team cards on hover.

### Named Rules
**The Opaque Reading Surface Rule.** Text never sits directly on art. Every surface that carries text over the stage or a banner is an opaque or near-opaque dark panel: dock cards and banner copy at 94% with a hairline border, stage tags and the Owned toggle at 78% ground. No gradient shades stand in for a panel.

**The No Glass Rule.** No backdrop-filter anywhere, floating menus included; no frosted bars, no starfield, no decorative glows. Depth is the element light field plus tone steps.

## Shapes

Gently rounded, never sharp and never blobby: 8px for controls and inputs, 12px for nested cards and dock cards, 16px for panels, the stage and banner art frames. Anything that toggles or labels (tabs, primary button, Owned toggle, stage tags, filter chips, substat chips, builder slots) is a full pill. Borders are 1px lilac-tinted hairlines; selection is shown by tinting the fill and border toward the element or lilac, not by thickening. Portrait tiles crop the art top-centred at 10px radius. The full-body render is masked to fade out between 62% and 86% of its height so it dissolves into the dock area instead of being cut.

## Components

### Buttons
- **Shape:** pill for primary (999px); 8px for ghost and danger.
- **Primary:** bone fill with ink text, 700 weight, 13px, padding 9px 18px, with the primary lift shadow. Hover brightens 6%; disabled drops to 38% opacity.
- **Ghost:** near-transparent fill, hairline border, dusk-lilac text at 12px 600, padding 7px 12px. Hover turns text bone, border strong, fill a 9% lilac wash.
- **Danger:** ghost-shaped and quiet at rest; on hover the text, border (55%) and a 10% fill turn signal red. In the top bar it sits 16px apart from Export and Import.
- **Press:** every button scales to 0.98 on press; colour transitions run 180ms.

### Tabs
- **Style:** pills 36px tall, padding 7px 12px, DM Sans 14px 600, dusk-lilac text, each with a small mono count.
- **Active:** bone fill with ink text and icon, the same treatment as the primary button.
- **Hover:** bone text over a 7% lilac wash.

### Chips and Filters
- **Element filter:** a row of 34px squares at 8px radius, each holding its element dot; the active one tints border (70%) and fill (16%) with its element colour.
- **Segmented filters (Owned/Missing, modes):** a 3px-padded input well with 6px-radius segments; active is a 16% lilac fill with lilac text (modes use a solid lilac fill with ink text).
- **Category chips:** pills on the input well, 12px 600; active is a 14% lilac fill with a 55% lilac border and bone text.
- **Substat chips:** pills whose fill grows left to right with progress as a lilac gradient; met chips turn green.

### Cards / Containers
- **Panel:** opaque panel tone, 16px radius, 20px padding, hairline border, top-edge highlight plus the resting shadow.
- **Nested cards** (gear slots, team cards, kit cards, character teams): raised panel tone, 12px radius, 14 to 15px padding, hairline border.
- **Weapon cards:** panel at 16px radius with a 2px top edge in the weapon's rarity colour.
- **Tier groups:** a 82px rail with the tier letter in the display face, tinted 3 to 7% toward the tier colour.

### Inputs / Fields
- **Style:** input well fill, 1px hairline, 8px radius, padding 8px 10px; search adds a leading icon and a round clear button.
- **Hover / Focus:** hover strengthens the hairline; focus sets a lilac border and a 3px lilac halo at 14%.
- **Custom select:** the same trigger with an item icon; its menu floats 6px below at 12px radius with the floating shadow.

### Navigation
- **Top bar:** brand mark (40px rounded square, lilac glyph on a soft lilac radial) beside the brand in the display face; pill tabs; header actions on the right. A hairline separates it from the main area. Below 1320px the tabs drop to their own row.

### Portrait Panel (signature)
A 312px opaque panel with search, element filter, owned filter and a 3-column grid of portrait tiles (portrait and name only). Beside the stage it sits at 70% panel over the 24% element wash with an element-tinted border. Once the player has marked any character owned, missing characters dim to 42% opacity with 70% greyscale. The selected tile takes a 16% element fill and a 70% element border. A round 22px Owned check sits on each tile's top-right corner with a 34px hit area.

### Character Stage and Dock (signature)
The stage is a 16px-radius block on the raised ground, at least 500px tall, holding three layers: the element light field (a bright radial at 64%/42%, a floor glow at the base, and a vertical fade from a 10% element tint into the ground), the art, and the content grid. The full-body render stands right-aligned at 128% of stage height, masked to fade at its base. The 13 characters without a full-body render show their portrait in one designed fallback: a framed 374:512 panel with a 2px element border on a 22% element tint, set 28px from the top, 178px from the right and clear of the dock (bottom at dock height plus 44px); below 1180px it moves into the right column. Over the field on the left, in a title area capped at 60% width, sit the rarity stars, the display name and three stage tags (element, weapon type, role) as 78% ground pills; the Owned toggle sits top-right. The dock runs along the foot: four opaque dock cards with uppercase labels, an icon plus display-face value (700, 22px, uppercase), and mono metadata; the progress card shows a large numeral and a 6px element-coloured bar.

**Motion:** the art (or fallback frame) enters on character switch with one 320ms slide of 24px from the right plus a fade, eased `cubic-bezier(0.16, 1, 0.3, 1)`. The element field crossfades over 320ms. Under `prefers-reduced-motion: reduce` all transitions and animations collapse to 0.01ms and smooth scrolling is off.

### Banner Heroes
Banners tab heroes reuse the stage language: element radial field, full-body art bleeding off the right edge, display-face title (56px, 80px for the new character), gold countdown. Hero copy sits on a 94% panel (hairline border, 12px radius, 20px inset, max 58% wide); tile copy on the same panel at 8px radius along the tile foot. No gradient shades or text-shadow behind banner text.

## Do's and Don'ts

### Do:
- **Do** give the selected character the stage: full-body art in its element light field, the name in Big Shoulders Display at clamp(64px, 14cqi, 150px), the build in the dock.
- **Do** put every piece of text that overlaps the stage or a banner on an opaque or near-opaque dark surface (dock cards and banner copy at 94%, tags and toggles at 78% ground).
- **Do** use one lilac accent (#c9b8ff) for focus, active and selected states, and bone fills with ink text for the single active choice (active tab, primary button, Owned on).
- **Do** use element, rarity and tier colours only to say element, rarity and tier.
- **Do** keep panels opaque with a 1px hairline and tone steps for depth; radii 8 / 12 / 16px and pills for toggles and tags.
- **Do** set counts and figures in JetBrains Mono or tabular numerals.
- **Do** keep motion to the single 320ms stage entrance and 180ms state feedback, and honour prefers-reduced-motion.
- **Do** use the framed portrait fallback for any character without a full-body render, never a cropped half figure.

### Don't:
- **Don't** put backdrop-filter blur or frosted glass on panels, bars or menus, and don't bring back the starfield backdrop or decorative glows.
- **Don't** set text directly on character art.
- **Don't** use Convene Gold (#f4c977) for anything except 5-star rarity and the Convene phase; not for tiers, badges or highlights.
- **Don't** use a light theme; the dark ground is a user commitment.
- **Don't** set sentences, labels or controls in the display face, or set names in it without uppercase.
- **Don't** imitate Kuro's in-game menu chrome; keep the own type, own dock layout and standard web controls.
- **Don't** load fonts or art from the network; everything ships self-hosted for offline use.
