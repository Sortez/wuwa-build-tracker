import { itemsById } from '../data';
import type {
  AscensionPhase,
  BuildTables,
  Character,
  CharacterProgress,
  RoleAmount,
  SkillLevelCost,
  Weapon,
} from '../types';

export interface CostLine {
  itemId: string;
  name: string;
  category: string;
  rarity?: number;
  amount: number;
}

export interface CostSummary {
  credits: number;
  materials: CostLine[];
}

export const EMPTY_COST: CostSummary = { credits: 0, materials: [] };

type Bucket = Map<string, number>;

function add(bucket: Bucket, itemId: string, amount: number): void {
  bucket.set(itemId, (bucket.get(itemId) ?? 0) + amount);
}

function mergeIntoTarget(target: Bucket, source: Bucket): void {
  for (const [itemId, amount] of source) add(target, itemId, amount);
}

function addMaterials(
  bucket: Bucket,
  materials: RoleAmount[],
  materialMap: Record<string, string>,
): void {
  for (const material of materials) {
    const itemId = materialMap[material.role];
    if (itemId) add(bucket, itemId, material.amount);
  }
}

function toSummary(credits: number, bucket: Bucket): CostSummary {
  const materials: CostLine[] = [...bucket.entries()]
    .map(([itemId, amount]) => {
      const item = itemsById.get(itemId);
      return {
        itemId,
        amount,
        name: item?.name ?? itemId,
        category: item?.category ?? 'Other',
        rarity: item?.rarity,
      };
    })
    .sort(
      (a, b) =>
        (b.rarity ?? 0) - (a.rarity ?? 0) || a.name.localeCompare(b.name),
    );
  return { credits, materials };
}

export function mergeSummaries(...summaries: CostSummary[]): CostSummary {
  let credits = 0;
  const bucket: Bucket = new Map();
  for (const summary of summaries) {
    credits += summary.credits;
    for (const line of summary.materials) add(bucket, line.itemId, line.amount);
  }
  return toSummary(credits, bucket);
}

/** Total character EXP required to travel from `current` to `target`. */
export function levelExpBetween(
  current: number,
  target: number,
  tables: BuildTables,
): number {
  return Math.max(
    0,
    cumulativeExpAt(target, tables) - cumulativeExpAt(current, tables),
  );
}

/** Cumulative EXP required to reach `level`, line-interpolated between table entries. */
export function cumulativeExpAt(level: number, tables: BuildTables): number {
  const entries = Object.entries(tables.cumulativeExp)
    .map(([key, value]) => [Number(key), value] as [number, number])
    .sort((a, b) => a[0] - b[0]);
  if (entries.length === 0) return 0;
  const [firstLevel, firstExp] = entries[0];
  const [lastLevel, lastExp] = entries[entries.length - 1];
  if (level <= firstLevel) return firstExp;
  if (level >= lastLevel) return lastExp;
  for (let i = 0; i < entries.length - 1; i += 1) {
    const [levelA, expA] = entries[i];
    const [levelB, expB] = entries[i + 1];
    if (level >= levelA && level <= levelB) {
      const ratio = (level - levelA) / (levelB - levelA);
      return expA + (expB - expA) * ratio;
    }
  }
  return lastExp;
}

/** Greedy conversion of EXP into the fewest potions (largest first, rounded up). */
export function expToPotions(exp: number, tables: BuildTables): Bucket {
  const bucket: Bucket = new Map();
  const potions = [...tables.resonancePotions].sort((a, b) => b.exp - a.exp);
  let remaining = Math.ceil(exp);
  for (const potion of potions) {
    if (potion.exp <= 0) continue;
    const count = Math.floor(remaining / potion.exp);
    if (count > 0) {
      add(bucket, potion.id, count);
      remaining -= count * potion.exp;
    }
  }
  if (remaining > 0 && potions.length > 0) {
    add(bucket, potions[potions.length - 1].id, 1);
  }
  return bucket;
}

function collectAscension(
  current: number,
  target: number,
  phases: AscensionPhase[],
  materialMap: Record<string, string>,
  state: { credits: number; bucket: Bucket },
): void {
  for (const phase of phases) {
    if (current <= phase.fromCap && target > phase.fromCap) {
      state.credits += phase.credits;
      addMaterials(state.bucket, phase.materials, materialMap);
    }
  }
}

/** Level + ascension cost for a character between their current and target level. */
export function computeLevelCost(
  character: Character,
  progress: CharacterProgress,
  tables: BuildTables,
): CostSummary {
  const bucket: Bucket = new Map();
  const exp = levelExpBetween(progress.currentLevel, progress.targetLevel, tables);
  let credits = Math.round(exp * tables.leveling.creditsPerExp);
  mergeIntoTarget(bucket, expToPotions(exp, tables));
  const state = { credits, bucket };
  collectAscension(
    progress.currentLevel,
    progress.targetLevel,
    tables.ascension,
    character.materialMap,
    state,
  );
  credits = state.credits;
  return toSummary(credits, bucket);
}

export function computeSkillCost(
  character: Character,
  progress: CharacterProgress,
  tables: BuildTables,
  options: { prioritizedOnly?: boolean } = {},
): CostSummary {
  const bucket: Bucket = new Map();
  let credits = 0;
  for (const node of character.skills) {
    const skillProgress = progress.skills[node.id];
    if (!skillProgress) continue;
    if (options.prioritizedOnly && skillProgress.priority <= 0) continue;
    const table: SkillLevelCost[] = tables.skillTables[node.costTable] ?? [];
    for (const entry of table) {
      if (entry.level > skillProgress.level && entry.level <= skillProgress.target) {
        credits += entry.credits;
        addMaterials(bucket, entry.materials, character.materialMap);
      }
    }
  }
  return toSummary(credits, bucket);
}

export function computeCharacterCost(
  character: Character,
  progress: CharacterProgress,
  tables: BuildTables,
): CostSummary {
  return mergeSummaries(
    computeLevelCost(character, progress, tables),
    computeSkillCost(character, progress, tables),
  );
}

export function computeWeaponCost(
  weapon: Weapon | null,
  current: number,
  target: number,
  tables: BuildTables,
): CostSummary {
  if (!weapon) return EMPTY_COST;
  const bucket: Bucket = new Map();
  const state = { credits: 0, bucket };
  collectAscension(
    current,
    target,
    tables.weaponAscension,
    weapon.materialMap ?? {},
    state,
  );
  return toSummary(state.credits, bucket);
}

export function totalUnits(summary: CostSummary): number {
  return summary.materials.reduce((sum, line) => sum + line.amount, 0);
}
