import type { ElementName } from '../types';

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

const ELEMENT_CLASS: Record<ElementName, string> = {
  Spectro: 'el-spectro',
  Havoc: 'el-havoc',
  Fusion: 'el-fusion',
  Glacio: 'el-glacio',
  Aero: 'el-aero',
  Electro: 'el-electro',
};

export function elementClass(element: ElementName): string {
  return ELEMENT_CLASS[element] ?? 'el-none';
}

export function rarityClass(rarity: number): string {
  return `rarity-${Math.min(5, Math.max(1, rarity))}`;
}

export function stars(rarity: number): string {
  return '\u2605'.repeat(Math.min(5, Math.max(1, rarity)));
}

export function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(max, Math.max(min, value));
}
