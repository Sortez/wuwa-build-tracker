---
version: 1
slug: "src-app-tsx"
primary_target: "src/App.tsx"
related_targets: ["src/styles.css"]
---

# Surface brief: WuWa Build Tracker app shell (all tabs)

Scope: the whole app (Resonators, Character Index, Weapon Index, Teams, Banners). Mode: Operate. Replacement visual world; replaces the current "Resonance Console" DESIGN.md at finish.

Audience and job: WuWa players, mostly the author, with the app beside the running game; quick lookups and progress checks, sometimes longer planning.
User answers (2026-11-19): success = nicer to look at; keep = dark theme; wrong = too plain. Chosen card: Convene Key Art (my pick), over the rolled Art Book Plates.
Constraints: offline, self-hosted fonts and art, 1360×900 default window (min 1024×680), standard controls, unofficial-fan-project disclaimer stays.

## Direction contract

THESIS: The selected Resonator is the screen. Their full-body art stands in an element-coloured light field, like their banner splash, and the build sits on top in a dock. It refuses the category's grey card grid with thumbnails.

OWN-WORLD: Near-black violet ground (#0a0912), and the selected character's element colour as a radial light field that owns the workspace. Gold (#f4c977) only for rarity. A condensed display face for names (Big Shoulders Display, self-hosted) over a workhorse body face. Readable dark panels (no blur), pill tabs, 12–14px radius.

STORY: The player sees who is selected and which element at a glance, reads weapon, Echo set, build progress and best team from the dock without scrolling, and switches character from a portrait rail.

FIRST VIEWPORT: Top bar: brand, pill tabs, Export/Import, Reset set apart. Left: a portrait rail (owned full colour, missing dimmed). Centre-right: full-body art in an element light field. Left over the field: rarity, name at about 150px, element/weapon/role tags. Top-right: Owned toggle. Bottom: a four-panel dock (weapon, Echo set, build progress, best team) on opaque dark panels.

FORM: Convene Key Art, #1 of my ordered list (IMPECCABLE'S PICK), seed:b0bc6457cd081cca. Code-led build; the sketch at .impeccable/mocks/decision/model-pick.html is the composition to match.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Unresolved

- Art (decided 2026-11-19): 48 of 61 characters have a full-body render in public/banners (encore.moe RolePortrait; all four Rover forms use the male Rover render, the user's choice). The other 13 (Augusta, Denia, Galbrena, Hiyuki, Iuno, Jingran, Lucilla, Lucy, Qingxiao, Rebecca, Suisui, Suoming, Yangyang: Xuanling) have no full-body art from any usable source yet; the user chose one designed fallback for all 13 (square portrait large in the element light field) over half-figure crops. Re-run the encore.moe download later to replace fallbacks as renders appear.
- Readability beside the game: text never sits directly on art; every reading surface is an opaque panel.
- Must not imitate Kuro's own menu chrome: own type, own dock layout, standard web controls.
