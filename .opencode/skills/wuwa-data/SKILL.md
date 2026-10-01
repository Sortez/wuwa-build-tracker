---
name: wuwa-data
description: Use when editing Wuthering Waves tracker data or cost logic in this repo. Covers src/data/*.json schemas (characters, weapons, echoSets, items, buildTables, teams), material roles, the cost engine in src/lib/costs.ts, localStorage progress, and dev commands.
---

# WuWa tracker data editing

Project is a React + Vite + TypeScript app. Game data lives in `src/data/*.json`
and is loaded/normalised in `src/data/index.ts`. UI components are in
`src/components/`.

## Commands

- Dev server: `npm run dev` (http://localhost:5173)
- Typecheck: `npm run typecheck`
- Build: `npm run build`

On this Windows machine Node is at `C:\Program Files\nodejs` and PowerShell may
block `npm.ps1`; if so use `npm.cmd` or prepend
`$env:Path = "C:\Program Files\nodejs;$env:Path"`.

## Data files

### src/data/characters.json
Shape: `{ "_note": string, "defaultSkills": SkillNode[], "characters": Character[] }`

`Character`:
- `id` (string, stable slug used for icon paths; actual files are `/characters/<id>.webp`, with png/jpg/jpeg fallbacks in `CharacterAvatar`)
- `name`, `rarity` (1-5), `element` (Spectro | Havoc | Fusion | Glacio | Aero | Electro)
- `weaponType` (Broadblade | Sword | Pistols | Gauntlets | Rectifier)
- `role` (free text, approximate)
- optional `icon` (URL/path override), `defaultTargetLevel`, `note`
- optional `skills` (overrides `defaultSkills`) and `materialMap`
- Do NOT add recommended weapons/echoes here; the user picks those in the UI.

`SkillNode`: `{ id, name, kind: "active"|"passive", costTable, maxLevel, defaultLevel, defaultTarget, defaultPriority?, note? }`

### src/data/weapons.json
`{ "_note": string, "weapons": Weapon[] }`
`Weapon`: `{ id, name, rarity, type, passive?, materialMap? }`. `type` uses the
same values as `Character.weaponType`. IDs are slugs of the name.

### src/data/echoSets.json
`{ "_note": string, "echoSets": EchoSet[] }`
`EchoSet`: `{ id, name, twoPiece, fivePiece }`.

### src/data/items.json
`{ "_note": string, "items": Item[] }`
`Item`: `{ id, name, category, rarity?, exp? }`. `category` is a display group
(e.g. Currency, EXP, Ascension, Skill, Weapon).

### src/data/buildTables.json
Universal cost tables (shared by all characters):
- `resonancePotions`: `{ id, exp }[]` (EXP potions, used greedily).
- `leveling.creditsPerExp`: number.
- `cumulativeExp`: `{ "<level>": totalExpToReachLevel }`, line-interpolated.
- `ascension`: `AscensionPhase[]` = `{ phase, fromCap, toCap, credits, materials: { role, amount }[] }`.
- `weaponAscension`: same shape as `ascension`.
- `skillTables`: `{ "<name>": SkillLevelCost[] }` where entry is `{ level, credits, materials }`.

### src/data/builds.json
`{ "_note": string, "builds": Record<characterId, CharacterBuild> }`
`CharacterBuild`: `{ weaponIds: string[], fourStarWeaponId?: string, echoSetIds:
string[], mainEcho?, substats? }`. `weaponIds` is ordered (BiS, alternative);
`fourStarWeaponId` is the recommended budget 4-star for that character. Used by
`mergeProgress` / `GearPanel` to fill the three weapon slots and two echo slots.

### src/data/teams.json
`{ "_note": string, "teams": RecommendedTeam[] }`
`RecommendedTeam`: `{ id, name, characterIds: string[], ratings: { tower: number, wastes: number } }`
(Prydwen 5-11 scale; `1` means not listed for that mode). Distinct from user-built
`Team` objects (`{ id, name, characterIds, note?, mode? }`) stored in `state.myTeams`.

## Material roles

Cost tables reference abstract roles, not item ids. `src/data/index.ts` defines
`DEFAULT_MATERIAL_MAP` mapping each role to a placeholder item id; a character
can override any role via its own `materialMap`. Roles: `common_t1..t4`,
`boss`, `specialty`, `skill_t1..t4`, `weekly`, `weapon_t1..t4`.

## Cost engine (src/lib/costs.ts)

- Remaining cost = cost(target) - cost(current), so tracking level updates totals.
- EXP: `levelExpBetween` uses interpolated `cumulativeExp`; `expToPotions` fills
  largest potions first (rounded up to the smallest on remainder).
- Ascension phase is included when `current <= phase.fromCap && target > phase.fromCap`.
- `computeLevelCost` (level + ascension), `computeSkillCost`, `computeCharacterCost`,
  `computeWeaponCost` (weapon ascension only). Skill costs are currently not shown
  in the UI but remain available.

## Progress storage

User progress is saved to `localStorage` key `wuwa-build-tracker:v1`.
`CharacterProgress` (src/types.ts) holds `currentLevel`, `targetLevel`, `skills`,
`recommendedWeaponIds` (3 slots, `[primary, alternative, 4-star option]`), `weaponLevel`,
`weaponTargetLevel`, `recommendedEchoSetIds` (2 slots), `mainEcho`, `notes`.
`src/lib/storage.ts` has `createDefaultProgress` and `mergeProgress` (migrates
old single `weaponId`/`echoSetId`). Reset button clears everything.

## Editing rules

- Keep JSON valid and keep the `_note` fields updated.
- After editing data or logic, run `npm run typecheck` (or `npm run build`).
- Numbers in `buildTables.json` and item names are placeholders; replace with
  real in-game values when available.
