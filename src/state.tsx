import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { builds, characters, charactersById } from './data';
import {
  createDefaultProgress,
  emptyState,
  isDesktop,
  loadState,
  mergeProgress,
  readLocalStorageState,
  saveState,
} from './lib/storage';
import type {
  AppState,
  Character,
  CharacterProgress,
  SkillProgress,
  Team,
  TeamMode,
} from './types';

interface AppContextValue {
  state: AppState;
  /** Ids of characters the user marked as owned. */
  ownedIds: ReadonlySet<string>;
  setOwned: (id: string, owned: boolean) => void;
  progressFor: (character: Character) => CharacterProgress;
  updateCharacter: (id: string, patch: Partial<CharacterProgress>) => void;
  updateSkill: (
    characterId: string,
    nodeId: string,
    patch: Partial<SkillProgress>,
  ) => void;
  addTeam: (team: Team) => void;
  removeTeam: (id: string) => void;
  setTeamMode: (id: string, mode: TeamMode) => void;
  resetAll: () => void;
  /** Replaces all progress, e.g. when restoring a backup. */
  replaceAll: (next: AppState) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function seedState(base: AppState): AppState {
  const seeded: Record<string, CharacterProgress> = { ...base.characters };
  for (const character of characters) {
    seeded[character.id] = mergeProgress(
      character,
      base.characters[character.id],
      builds[character.id],
    );
  }
  return { ...base, characters: seeded };
}

function withProgress(
  state: AppState,
  characterId: string,
): CharacterProgress {
  const existing = state.characters[characterId];
  if (existing) return existing;
  const character = charactersById.get(characterId);
  if (!character) {
    return createDefaultProgress({
      id: characterId,
      name: characterId,
      rarity: 1,
      element: 'Spectro',
      weaponType: 'Sword',
      role: '',
      materialMap: {},
      skills: [],
    });
  }
  return createDefaultProgress(character);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const desktop = isDesktop();
  // On the web, localStorage is synchronous, so seed immediately. On the
  // desktop, start empty and fill in once the JSON file has been read.
  const [state, setState] = useState<AppState>(() =>
    desktop ? emptyState() : seedState(readLocalStorageState()),
  );
  const [ready, setReady] = useState(!desktop);

  useEffect(() => {
    if (!desktop) return;
    let alive = true;
    loadState().then((loaded) => {
      if (!alive) return;
      setState(seedState(loaded));
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [desktop]);

  useEffect(() => {
    if (!ready) return;
    void saveState(state);
  }, [state, ready]);

  const value = useMemo<AppContextValue>(() => {
    const updateCharacter = (id: string, patch: Partial<CharacterProgress>) =>
      setState((current) => {
        const previous = withProgress(current, id);
        return {
          ...current,
          characters: {
            ...current.characters,
            [id]: { ...previous, ...patch },
          },
        };
      });
    return {
      state,
      ownedIds: new Set(
        Object.entries(state.characters)
          .filter(([, progress]) => progress.owned)
          .map(([id]) => id),
      ),
      setOwned: (id, owned) => updateCharacter(id, { owned }),
      progressFor: (character) => withProgress(state, character.id),
      updateCharacter,
      updateSkill: (characterId, nodeId, patch) =>
        setState((current) => {
          const previous = withProgress(current, characterId);
          const previousSkill = previous.skills[nodeId] ?? {
            level: 0,
            target: 0,
            priority: 0,
          };
          return {
            ...current,
            characters: {
              ...current.characters,
              [characterId]: {
                ...previous,
                skills: {
                  ...previous.skills,
                  [nodeId]: { ...previousSkill, ...patch },
                },
              },
            },
          };
        }),
      addTeam: (team) =>
        setState((current) => ({
          ...current,
          myTeams: [...current.myTeams, team],
        })),
      removeTeam: (id) =>
        setState((current) => ({
          ...current,
          myTeams: current.myTeams.filter((team) => team.id !== id),
        })),
      setTeamMode: (id, mode) =>
        setState((current) => ({
          ...current,
          myTeams: current.myTeams.map((team) =>
            team.id === id ? { ...team, mode } : team,
          ),
        })),
      resetAll: () => setState(() => ({ version: 1, characters: {}, myTeams: [] })),
      replaceAll: (next) => setState(() => seedState(next)),
    };
  }, [state]);

  if (!ready) {
    return (
      <div className="app-loading" role="status">
        Loading build tracker…
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
