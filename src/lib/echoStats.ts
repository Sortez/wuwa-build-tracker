import type { EchoCost, EchoSubstat, TrackedEcho } from '../types';

export const ECHO_COSTS: readonly EchoCost[] = [4, 3, 1];
export const MAX_ECHO_COST = 12;
export const ECHO_SLOT_COUNT = 5;
export const SUBSTAT_COUNT = 5;

/** Main stats an echo can roll, by cost. */
export const MAIN_STATS: Record<EchoCost, readonly string[]> = {
  1: ['HP%', 'ATK%', 'DEF%'],
  3: [
    'HP%',
    'ATK%',
    'DEF%',
    'Energy Regen',
    'Glacio DMG Bonus',
    'Fusion DMG Bonus',
    'Electro DMG Bonus',
    'Aero DMG Bonus',
    'Spectro DMG Bonus',
    'Havoc DMG Bonus',
  ],
  4: ['HP%', 'ATK%', 'DEF%', 'CRIT Rate', 'CRIT DMG', 'Healing Bonus'],
};

export interface SubstatDef {
  id: string;
  label: string;
  /** Every value the substat can roll. */
  values: readonly number[];
  percent: boolean;
}

const DMG_BONUS_ROLLS = [6.4, 7.1, 7.9, 8.6, 9.4, 10.1, 10.9, 11.6];

export const SUBSTATS: readonly SubstatDef[] = [
  { id: 'crit_rate', label: 'CRIT Rate', percent: true, values: [6.3, 6.9, 7.5, 8.1, 8.7, 9.3, 9.9, 10.5] },
  { id: 'crit_dmg', label: 'CRIT DMG', percent: true, values: [12.6, 13.8, 15, 16.2, 17.4, 18.6, 19.8, 21] },
  { id: 'atk_pct', label: 'ATK%', percent: true, values: DMG_BONUS_ROLLS },
  { id: 'hp_pct', label: 'HP%', percent: true, values: DMG_BONUS_ROLLS },
  { id: 'def_pct', label: 'DEF%', percent: true, values: [8.1, 9, 10, 10.9, 11.8, 12.8, 13.8, 14.7] },
  { id: 'energy_regen', label: 'Energy Regen', percent: true, values: [6.8, 7.6, 8.4, 9.2, 10, 10.8, 11.6, 12.4] },
  { id: 'basic_dmg', label: 'Basic Attack DMG Bonus', percent: true, values: DMG_BONUS_ROLLS },
  { id: 'heavy_dmg', label: 'Heavy Attack DMG Bonus', percent: true, values: DMG_BONUS_ROLLS },
  { id: 'skill_dmg', label: 'Resonance Skill DMG Bonus', percent: true, values: DMG_BONUS_ROLLS },
  { id: 'liberation_dmg', label: 'Resonance Liberation DMG Bonus', percent: true, values: DMG_BONUS_ROLLS },
  { id: 'atk_flat', label: 'ATK', percent: false, values: [30, 40, 50, 60] },
  { id: 'hp_flat', label: 'HP', percent: false, values: [320, 360, 390, 430, 470, 510, 540, 580] },
  { id: 'def_flat', label: 'DEF', percent: false, values: [40, 50, 60, 70] },
];

export const substatsById = new Map(SUBSTATS.map((def) => [def.id, def]));

export function formatSubstatValue(def: SubstatDef, value: number): string {
  return def.percent ? `${value}%` : String(value);
}

export function emptyEcho(): TrackedEcho {
  return {
    cost: null,
    mainStat: null,
    substats: Array.from({ length: SUBSTAT_COUNT }, () => ({
      stat: null,
      value: null,
    })),
  };
}

export function emptyEchoBuild(): TrackedEcho[] {
  return Array.from({ length: ECHO_SLOT_COUNT }, emptyEcho);
}

function normalizeSubstat(raw: Partial<EchoSubstat> | undefined): EchoSubstat {
  const def = raw?.stat ? substatsById.get(raw.stat) : undefined;
  if (!def) return { stat: null, value: null };
  const value =
    typeof raw?.value === 'number' && def.values.includes(raw.value)
      ? raw.value
      : null;
  return { stat: def.id, value };
}

function normalizeEcho(raw: Partial<TrackedEcho> | undefined): TrackedEcho {
  const cost = ECHO_COSTS.includes(raw?.cost as EchoCost)
    ? (raw!.cost as EchoCost)
    : null;
  const mainStat =
    cost && raw?.mainStat && MAIN_STATS[cost].includes(raw.mainStat)
      ? raw.mainStat
      : null;
  const rawSubs = Array.isArray(raw?.substats) ? raw!.substats : [];
  const seen = new Set<string>();
  const substats = Array.from({ length: SUBSTAT_COUNT }, (_, index) => {
    const sub = normalizeSubstat(rawSubs[index]);
    // An echo can't roll the same substat twice.
    if (sub.stat && seen.has(sub.stat)) return { stat: null, value: null };
    if (sub.stat) seen.add(sub.stat);
    return sub;
  });
  return { cost, mainStat, substats };
}

/** Pads/truncates stored data to 5 echoes and drops invalid combinations. */
export function normalizeEchoBuild(raw: unknown): TrackedEcho[] {
  const list = Array.isArray(raw) ? (raw as Partial<TrackedEcho>[]) : [];
  return Array.from({ length: ECHO_SLOT_COUNT }, (_, index) =>
    normalizeEcho(list[index]),
  );
}

export function totalEchoCost(build: TrackedEcho[]): number {
  return build.reduce((sum, echo) => sum + (echo.cost ?? 0), 0);
}
