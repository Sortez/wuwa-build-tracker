export type ElementName =
  | 'Spectro'
  | 'Havoc'
  | 'Fusion'
  | 'Glacio'
  | 'Aero'
  | 'Electro';

export type WeaponTypeName =
  | 'Broadblade'
  | 'Sword'
  | 'Pistols'
  | 'Gauntlets'
  | 'Rectifier';

/** A single item/resource in the game. */
export interface Item {
  id: string;
  name: string;
  /** Free-form grouping used by the UI, e.g. "EXP", "Ascension", "Skill", "Weapon". */
  category: string;
  /** 1-5 star rarity, used for sorting/colour only. */
  rarity?: number;
  /** EXP value, for EXP potions. */
  exp?: number;
}

/**
 * Materials in the cost tables are stored as abstract "roles" (e.g. `boss`,
 * `specialty`, `common_t1`). Each character maps those roles to concrete item
 * ids via `materialMap`. This lets the universal cost tables be shared by every
 * character while their specific drops differ.
 */
export interface RoleAmount {
  role: string;
  amount: number;
}

/** One ascension step. `fromCap` is the level cap you are breaking through. */
export interface AscensionPhase {
  phase: number;
  fromCap: number;
  toCap: number;
  credits: number;
  materials: RoleAmount[];
}

/** Cost to bring a skill node from `level - 1` to `level`. */
export interface SkillLevelCost {
  level: number;
  credits: number;
  materials: RoleAmount[];
}

export interface PotionDef {
  id: string;
  exp: number;
}

export interface BuildTables {
  _note?: string;
  resonancePotions: PotionDef[];
  leveling: {
    /** Shell credits paid per point of character EXP. */
    creditsPerExp: number;
  };
  /** level -> total EXP required to reach that level from level 1. Interpolated between entries. */
  cumulativeExp: Record<string, number>;
  ascension: AscensionPhase[];
  weaponAscension: AscensionPhase[];
  /** Named skill cost tables referenced by skill nodes, e.g. "active", "passive", "stat". */
  skillTables: Record<string, SkillLevelCost[]>;
}

export interface SkillNode {
  id: string;
  name: string;
  kind: 'active' | 'passive';
  costTable: string;
  maxLevel: number;
  defaultLevel: number;
  defaultTarget: number;
  /** 5 = highest priority, 0 = not flagged. */
  defaultPriority?: number;
  note?: string;
}

export interface Character {
  id: string;
  name: string;
  rarity: number;
  element: ElementName;
  weaponType: WeaponTypeName;
  role: string;
  /** Optional portrait URL or path. Defaults to /characters/<id>.png. */
  icon?: string;
  /** Maps abstract cost-table roles to concrete item ids. */
  materialMap: Record<string, string>;
  skills: SkillNode[];
  defaultTargetLevel?: number;
  note?: string;
}

export interface Weapon {
  id: string;
  name: string;
  rarity: number;
  type: WeaponTypeName;
  passive?: string;
  /** Optional icon URL or path. Defaults to /weapons/<id>.webp. */
  icon?: string;
  materialMap?: Record<string, string>;
}

export interface EchoSet {
  id: string;
  name: string;
  twoPiece: string;
  fivePiece: string;
}

export type TeamMode = 'tower' | 'wastes';

export interface Team {
  id: string;
  name: string;
  characterIds: string[];
  note?: string;
  /** Which endgame content the team is built for. */
  mode?: TeamMode;
}

/** A curated team from an external tier list, rated per endgame mode. */
export interface RecommendedTeam {
  id: string;
  name: string;
  characterIds: string[];
  /** Prydwen rating (5-11) per mode; 1 means not listed for that mode. */
  ratings: Record<TeamMode, number>;
}

/** A recommended weapon + Echo setup sourced from an external build guide. */
export interface CharacterBuild {
  /** Recommended weapon ids, ordered by priority. */
  weaponIds: string[];
  /** Best viable 4-star weapon for players without the 5-star picks. */
  fourStarWeaponId?: string;
  /** Recommended echo set ids, ordered by priority. */
  echoSetIds: string[];
  mainEcho?: string;
  substats?: string;
}

/** Per-skill progress state. */
export interface SkillProgress {
  level: number;
  target: number;
  priority: number;
}

export interface CharacterProgress {
  /** Whether the user has this character in their account. */
  owned?: boolean;
  currentLevel: number;
  targetLevel: number;
  skills: Record<string, SkillProgress>;
  /** Three recommended weapon slots: [primary/BiS, alternative, 4-star option]. */
  recommendedWeaponIds: (string | null)[];
  /** Level tracking for the primary recommended weapon. */
  weaponLevel: number;
  weaponTargetLevel: number;
  /** Two recommended echo set slots: [primary/BiS, alternative]. */
  recommendedEchoSetIds: (string | null)[];
  mainEcho: string | null;
  notes: string;
  /** True once the recommended gear has been auto-filled, so it isn't re-applied. */
  autoFilled?: boolean;
}

export interface AppState {
  version: number;
  characters: Record<string, CharacterProgress>;
  myTeams: Team[];
}
