# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Rendered in a Tauri (WebView2) desktop window on Windows 10/11; the same build also runs in a browser. The design language is web, not native Windows.

## Users

Primarily the author, a Wuthering Waves player, and secondarily other players who install the app from the public GitHub releases. Users know the game's vocabulary (Resonators, Echoes, Convene, Sequences) and do not need it explained.

The typical scene is the app open beside the running game, in a second window or on a second monitor, for quick lookups and checking off progress while playing.

## Product Purpose

A build planner for Wuthering Waves: which characters you own, which weapons and Echo sets to aim for, how far each build is, which teams to run, and what is on the current Convene banners. Success means a player rarely needs to leave the app for a wiki or guide while building characters.

## Positioning

Everything in one place: builds, weapons, Echo sets, character kits (Skills and Resonance Chain), team tier lists, the player's own teams and the current banners, all in one window instead of across several wiki and guide pages, with the player's own progress next to the recommendations.

## Operating Context

- Used alongside the game, so lookups have to be quick and work at a glance; the window is often not the focus.
- Desktop window defaults to 1360×900, minimum 1024×680.
- Offline-first: no account, no server. State lives locally (`%APPDATA%\com.wuwa.buildtracker\wuwa-state.json` on desktop, `localStorage` on web) with Export/Import backup.
- Self-updates from GitHub Releases on startup.

## Capabilities and Constraints

- Tabs: Roster (owned characters and build progress), character Index (Skills, Resonance Chain S1–S6), Weapons (125 weapons, Lv. 90 stats), Teams (recommended lineups rated Z–E for Tower of Adversity and Whimpering Wastes, plus user teams), Banners (current Convene phase).
- Per character: primary, alternative and a budget 4-star weapon, Echo sets, main Echo, Echo substats.
- Recommendations come from Prydwen, through Version 3.7; banner data is updated per phase by hand.
- Game data is hand-maintained JSON in `src/data/`; material costs in `items.json` and `buildTables.json` are placeholders.
- English UI only.

## Brand Commitments

- Name: "WuWa Build Tracker". Unofficial fan project, not affiliated with Kuro Games; that disclaimer must stay.
- Game names and images belong to their owners; character, weapon, Echo and banner art comes from the game (`public/characters`, `public/weapons`, `public/echoes`, `public/banners`).
- Fonts are self-hosted for offline use; no runtime dependency on Google Fonts or other CDNs.

## Evidence on Hand

- App screenshot: `docs/preview.png`.
- Real game data for characters, weapons, Echo sets, builds and teams through Version 3.7.
- No user counts, testimonials or reviews exist; do not invent them.

## Product Principles

1. One window answers the question: prefer bringing information into the app over linking out.
2. Glanceable beside the game: the answer to a lookup should be readable in seconds, in a window that may not be focused.
3. The player's data is theirs: local, offline, exportable, never overwritten without their action.
4. Recommendations inform, the player decides: guide picks are suggestions next to the player's own choices, never forced on them.
