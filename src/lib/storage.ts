import type {
  AppState,
  Character,
  CharacterBuild,
  CharacterProgress,
  SkillNode,
  SkillProgress,
} from '../types';

const STORAGE_KEY = 'wuwa-build-tracker:v1';
const STORE_FILE = 'wuwa-state.json';

/** True when running inside the Tauri desktop shell. */
export function isDesktop(): boolean {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
}

export function defaultSkillProgress(node: SkillNode): SkillProgress {
  return {
    level: node.defaultLevel,
    target: node.defaultTarget,
    priority: node.defaultPriority ?? 0,
  };
}

export function createDefaultProgress(character: Character): CharacterProgress {
  const skills: Record<string, SkillProgress> = {};
  for (const node of character.skills) {
    skills[node.id] = defaultSkillProgress(node);
  }
  return {
    currentLevel: 1,
    targetLevel: character.defaultTargetLevel ?? 90,
    skills,
    recommendedWeaponIds: [null, null, null],
    weaponLevel: 1,
    weaponTargetLevel: character.defaultTargetLevel ?? 90,
    recommendedEchoSetIds: [null, null],
    mainEcho: null,
    notes: '',
  };
}

/**
 * Merges stored progress over fresh defaults. Also migrates the old
 * single `weaponId` / `echoSetId` fields into the new slot arrays, and
 * auto-fills empty gear slots from the recommended build on first run.
 */
export function mergeProgress(
  character: Character,
  stored?: Partial<CharacterProgress>,
  build?: CharacterBuild,
): CharacterProgress {
  const defaults = createDefaultProgress(character);
  if (!stored) {
    return applyRecommended(defaults, build);
  }

  const legacy = stored as {
    weaponId?: string | null;
    echoSetId?: string | null;
  };
  const storedWeaponIds = Array.isArray(stored.recommendedWeaponIds)
    ? stored.recommendedWeaponIds
    : [legacy.weaponId ?? null, null];
  const weaponIds = [
    storedWeaponIds[0] ?? null,
    storedWeaponIds[1] ?? null,
    // The 4-star slot is newer than saved state, so seed it from the build
    // instead of leaving it empty for existing users.
    storedWeaponIds.length > 2
      ? storedWeaponIds[2] ?? null
      : build?.fourStarWeaponId ?? null,
  ];
  const echoIds = Array.isArray(stored.recommendedEchoSetIds)
    ? stored.recommendedEchoSetIds
    : [legacy.echoSetId ?? null, null];

  const merged: CharacterProgress = {
    ...defaults,
    ...stored,
    skills: { ...defaults.skills, ...(stored.skills ?? {}) },
    recommendedWeaponIds: weaponIds,
    recommendedEchoSetIds: [echoIds[0] ?? null, echoIds[1] ?? null],
    mainEcho: stored.mainEcho ?? defaults.mainEcho,
    notes: stored.notes ?? defaults.notes,
  };

  return applyRecommended(merged, build);
}

function applyRecommended(
  progress: CharacterProgress,
  build?: CharacterBuild,
): CharacterProgress {
  if (!build || progress.autoFilled) return progress;
  return {
    ...progress,
    recommendedWeaponIds: [
      progress.recommendedWeaponIds[0] ?? build.weaponIds[0] ?? null,
      progress.recommendedWeaponIds[1] ?? build.weaponIds[1] ?? null,
      progress.recommendedWeaponIds[2] ?? build.fourStarWeaponId ?? null,
    ],
    recommendedEchoSetIds: [
      progress.recommendedEchoSetIds[0] ?? build.echoSetIds[0] ?? null,
      progress.recommendedEchoSetIds[1] ?? build.echoSetIds[1] ?? null,
    ],
    mainEcho: progress.mainEcho ?? build.mainEcho ?? null,
    autoFilled: true,
  };
}

export function emptyState(): AppState {
  return { version: 1, characters: {}, myTeams: [] };
}

function normalize(parsed: Partial<AppState> | null | undefined): AppState {
  if (!parsed || typeof parsed !== 'object') return emptyState();
  return {
    version: 1,
    characters: parsed.characters ?? {},
    myTeams: parsed.myTeams ?? [],
  };
}

/**
 * Synchronous read of the legacy browser storage. Used directly on the web and
 * for one-time migration into the desktop JSON file.
 */
export function readLocalStorageState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return normalize(JSON.parse(raw) as Partial<AppState>);
  } catch {
    return emptyState();
  }
}

async function writeDesktopState(state: AppState): Promise<void> {
  const { load } = await import('@tauri-apps/plugin-store');
  const store = await load(STORE_FILE, { autoSave: false });
  await store.set('state', state);
  await store.save();
}

/**
 * Loads persisted state. On the desktop this reads the JSON file managed by the
 * store plugin in the app data directory (`%APPDATA%\com.wuwa.buildtracker`);
 * on the web it reads `localStorage`. Existing localStorage progress is copied
 * into the file the first time the desktop app runs.
 */
export async function loadState(): Promise<AppState> {
  if (!isDesktop()) return readLocalStorageState();

  const { load } = await import('@tauri-apps/plugin-store');
  const store = await load(STORE_FILE, { autoSave: false });
  const stored = await store.get<AppState>('state');
  if (stored) return normalize(stored);

  const legacy = readLocalStorageState();
  if (Object.keys(legacy.characters).length > 0 || legacy.myTeams.length > 0) {
    await writeDesktopState(legacy);
  }
  return legacy;
}

// Serialise desktop writes so rapid updates cannot interleave.
let saveQueue: Promise<void> = Promise.resolve();

export function saveState(state: AppState): Promise<void> {
  if (isDesktop()) {
    saveQueue = saveQueue
      .then(() => writeDesktopState(state))
      .catch(() => undefined);
    return saveQueue;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota / privacy-mode failures.
  }
  return Promise.resolve();
}
