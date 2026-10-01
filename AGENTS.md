# Agent Guide

React + Vite + TypeScript single-page app (Wuthering Waves build planner). No backend, no tests, no lint; all user state lives in browser `localStorage`.

## Commands

- `npm run dev` — Vite dev server at `http://localhost:5173` (auto-opens a browser).
- `npm run typecheck` — `tsc --noEmit`, the primary verification step.
- `npm run build` — runs `tsc --noEmit` first, then `vite build` into `dist/` (gitignored).
- There is no test or lint script; don't invent one. `npm run typecheck` is the check to run after edits.
- TypeScript is strict plus `noUnusedLocals` / `noUnusedParameters`, so unused locals/params fail typecheck and build. Leading `_` only exempts parameters, not locals.
- Windows: if PowerShell blocks `npm.ps1`, use `npm.cmd`. `start-wuwa.cmd` prepends `C:\Program Files\nodejs` to PATH, installs deps when `node_modules` is absent, and runs the dev server.

## Architecture

- Entry: `src/main.tsx` → `src/App.tsx` (tabs: roster/characters and teams).
- `src/state.tsx` is the single app context (`useApp`) and owns every mutation plus persistence. Components read/write only through `useApp`; don't add parallel state.
- `src/data/index.ts` imports and normalizes all `src/data/*.json`, applies `DEFAULT_MATERIAL_MAP`, and exposes typed arrays, `*ById` maps, and `builds`/`buildTables`. Import from `../data`, not the raw JSON, in components.
- `src/lib/costs.ts` is the only cost engine; `src/types.ts` holds all shared types.

## Data and cost model

- `src/data/*.json` is the editable game-data source. Keep `_note` fields valid and current. `items.json` and `buildTables.json` values are placeholders; `characters.json`, `weapons.json`, `echoSets.json`, `builds.json`, and `teams.json` are sourced through Version 3.7.
- Detailed JSON schemas, material roles, and cost-engine semantics are in `.opencode/skills/wuwa-data/SKILL.md` — load that skill before editing data or `costs.ts` instead of guessing shapes.
- Cost tables reference abstract roles (`boss`, `specialty`, `common_t1`…), resolved per character/weapon through `materialMap`.
- `builds.json` holds per-character recommended weapon/echo picks, including `fourStarWeaponId`, a viable budget 4-star weapon for every character. `mergeProgress` auto-fills empty gear slots from it once and sets `autoFilled`, so it never overwrites user edits; `GearPanel`'s "Use recommended" re-applies on demand.
- Two distinct team shapes: `teams.json` is `RecommendedTeam[]` (Prydwen `ratings.tower` / `ratings.wastes`); user teams in `state.myTeams` are `Team` with a `mode`. Don't conflate them.
- Progress is stored under localStorage key `wuwa-build-tracker:v1`; `mergeProgress` also migrates legacy single `weaponId` / `echoSetId` fields.

## Assets

- Icons live in `public/characters`, `public/weapons`, and `public/echoes` as `<id>.webp`, where `id` matches the data slug. Icon components try png/jpg/jpeg/webp and fall back to initials, so a missing file degrades gracefully.

## Desktop app (Tauri)

- `src-tauri/` wraps the built `dist/` in a native WebView2 window. Native plugins: `store` (persistence), `updater` + `process` (self-update and relaunch); permissions live in `src-tauri/capabilities/default.json`. Add plugins/IPC sparingly.
- Self-update: `src/components/UpdateBanner.tsx` checks `https://github.com/Sortez/wuwa-build-tracker/releases/latest/download/latest.json` on desktop startup. Bundles are signed with the minisign key at `%USERPROFILE%\.tauri\wuwa-build-tracker.key` (no password, never commit it; the public key is in `tauri.conf.json`). `scripts/tauri.ps1` loads it automatically. Losing that key means installed apps can no longer verify updates.
- Releasing: `npm run release -- <x.y.z> ["notes"]` (`scripts/release.ps1`) bumps the version in `package.json`, `tauri.conf.json` and `Cargo.toml`, builds, writes `release/latest.json`, commits + pushes everything, and runs `gh release create v<x.y.z>`. The version must increase or the updater sees nothing new. Only the NSIS target is built.
- Toolchain is installed: Rust (rustup) + VS Build Tools 2022 (VCTools workload, which includes the Windows SDK); WebView2 ships with Windows. `npx tauri info` may still report MSVC missing because it doesn't recognize the separate VS 2026 preview install — trust a successful build over that report.
- `npm run desktop:dev` — starts `dev:desktop` (Vite on 5173, no browser) and opens the desktop window. This is the way to run the desktop app.
- `npm run desktop:build` — runs `npm run build`, then bundles installers under `src-tauri/target/release/bundle/`.
- Both go through `scripts/tauri.ps1`, which imports the Build Tools 2022 `vcvars64` environment first. This is required: rustc mis-detects the VS 2026 preview (compiler present but SDK not linked) and otherwise fails with `LNK1104: cannot open file 'msvcrt.lib'`. Only call `npm run tauri -- <args>` directly if the MSVC env is already loaded.
- `npm run dev` opens a browser; `npm run dev:desktop` is the same server without auto-opening and is what Tauri starts. `strictPort: true` means port 5173 must be free or dev fails.
- `vite.config.ts` ignores `**/src-tauri/**` to avoid reload loops; keep that.
- Window title/size and the bundle identifier (`com.wuwa.buildtracker`) live in `src-tauri/tauri.conf.json`. Icons are generated with `npx tauri icon app-icon.png` (source kept at the repo root).
- Persistence is runtime-dependent: the web build uses `localStorage` (`wuwa-build-tracker:v1`); the desktop build writes JSON to `%APPDATA%\com.wuwa.buildtracker\wuwa-state.json` via the store plugin, migrating existing localStorage data on first run. `loadState` is async on desktop, so `state.tsx` shows a loading screen until it resolves.
- Fonts are self-hosted for offline use: `src/fonts.css` plus `public/fonts/*.woff2` (latin/latin-ext variable subsets). Don't re-add the Google Fonts `<link>` to `index.html`.
