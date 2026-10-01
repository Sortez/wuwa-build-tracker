import buildTablesJson from './buildTables.json';
import buildsJson from './builds.json';
import charactersJson from './characters.json';
import echoSetsJson from './echoSets.json';
import itemsJson from './items.json';
import teamsJson from './teams.json';
import weaponsJson from './weapons.json';
import type {
  BuildTables,
  Character,
  CharacterBuild,
  EchoSet,
  Item,
  RecommendedTeam,
  SkillNode,
  Weapon,
} from '../types';

/**
 * Roles used by the universal cost tables map to these placeholder item ids
 * unless a character overrides them with their own `materialMap`.
 */
const DEFAULT_MATERIAL_MAP: Record<string, string> = {
  common_t1: 'common_t1',
  common_t2: 'common_t2',
  common_t3: 'common_t3',
  common_t4: 'common_t4',
  boss: 'boss_sample',
  specialty: 'specialty_sample',
  skill_t1: 'skill_t1',
  skill_t2: 'skill_t2',
  skill_t3: 'skill_t3',
  skill_t4: 'skill_t4',
  weekly: 'weekly_sample',
  weapon_t1: 'weapon_t1',
  weapon_t2: 'weapon_t2',
  weapon_t3: 'weapon_t3',
  weapon_t4: 'weapon_t4',
};

type RawCharacter = Omit<Character, 'skills' | 'materialMap'> & {
  skills?: SkillNode[];
  materialMap?: Record<string, string>;
};

const defaultSkills = charactersJson.defaultSkills as unknown as SkillNode[];

export const characters: Character[] = (
  charactersJson.characters as unknown as RawCharacter[]
).map((character) => ({
  ...character,
  skills:
    character.skills && character.skills.length > 0
      ? character.skills
      : defaultSkills,
  materialMap: { ...DEFAULT_MATERIAL_MAP, ...character.materialMap },
}));

export const items: Item[] = itemsJson.items as unknown as Item[];
export const weapons: Weapon[] = weaponsJson.weapons as unknown as Weapon[];
export const echoSets: EchoSet[] = echoSetsJson.echoSets as unknown as EchoSet[];
export const recommendedTeams: RecommendedTeam[] =
  teamsJson.teams as unknown as RecommendedTeam[];

export const builds: Record<string, CharacterBuild> = (
  buildsJson as unknown as { builds: Record<string, CharacterBuild> }
).builds;
export const buildTables: BuildTables =
  buildTablesJson as unknown as BuildTables;

export const itemsById = new Map(items.map((item) => [item.id, item]));
export const weaponsById = new Map(weapons.map((weapon) => [weapon.id, weapon]));
export const echoSetsById = new Map(echoSets.map((set) => [set.id, set]));
export const charactersById = new Map(
  characters.map((character) => [character.id, character]),
);

export function characterName(id: string): string {
  return charactersById.get(id)?.name ?? id;
}
