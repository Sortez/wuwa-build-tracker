import { useMemo, useState } from 'react';
import { characters } from '../data';
import { elementClass, rarityClass, stars } from '../lib/format';
import type { ElementName, WeaponTypeName } from '../types';
import CharacterAvatar from './CharacterAvatar';
import CharacterKitSection from './CharacterKitSection';

interface Props {
  onOpenBuild: (id: string) => void;
}

const ELEMENTS: ElementName[] = [
  'Spectro',
  'Havoc',
  'Fusion',
  'Glacio',
  'Aero',
  'Electro',
];

const WEAPON_TYPES: ('all' | WeaponTypeName)[] = [
  'all',
  'Broadblade',
  'Sword',
  'Pistols',
  'Gauntlets',
  'Rectifier',
];

const RARITIES = ['all', 5, 4] as const;
type RarityFilter = (typeof RARITIES)[number];

export default function CharactersIndexView({ onOpenBuild }: Props) {
  const [selectedId, setSelectedId] = useState(characters[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [element, setElement] = useState<'all' | ElementName>('all');
  const [weaponType, setWeaponType] = useState<'all' | WeaponTypeName>('all');
  const [rarity, setRarity] = useState<RarityFilter>('all');

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return characters
      .filter((character) => {
        if (element !== 'all' && character.element !== element) return false;
        if (weaponType !== 'all' && character.weaponType !== weaponType) {
          return false;
        }
        if (rarity !== 'all' && character.rarity !== rarity) return false;
        if (!needle) return true;
        return (
          character.name.toLowerCase().includes(needle) ||
          character.role.toLowerCase().includes(needle) ||
          character.weaponType.toLowerCase().includes(needle) ||
          character.element.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, element, weaponType, rarity]);

  const selected =
    characters.find((character) => character.id === selectedId) ??
    filtered[0] ??
    characters[0];

  return (
    <div className="roster-layout characters-index-layout">
      <aside className="roster">
        <div className="roster-head">
          <h2 className="panel-title">
            Character Index
            <span className="roster-count">{filtered.length}</span>
          </h2>
          <span className="roster-owned-count">
            {characters.length} total
          </span>
        </div>

        <div className="roster-controls">
          <div className="search-field">
            <svg
              className="search-icon"
              viewBox="0 0 16 16"
              width="14"
              height="14"
              aria-hidden="true"
            >
              <circle
                cx="7"
                cy="7"
                r="4.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="m10.5 10.5 3 3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              aria-label="Search character index"
              placeholder="Search name, element, weapon..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="search-clear"
                aria-label="Clear search"
                onClick={() => setQuery('')}
              >
                ×
              </button>
            )}
          </div>

          <div
            className="element-filter-bar"
            role="group"
            aria-label="Filter by element"
          >
            <button
              type="button"
              className={`el-pill${element === 'all' ? ' active' : ''}`}
              aria-pressed={element === 'all'}
              onClick={() => setElement('all')}
            >
              All
            </button>
            {ELEMENTS.map((option) => (
              <button
                key={option}
                type="button"
                className={`el-pill el-pill-orb ${elementClass(option)}${
                  element === option ? ' active' : ''
                }`}
                aria-label={option}
                aria-pressed={element === option}
                title={option}
                onClick={() =>
                  setElement((current) => (current === option ? 'all' : option))
                }
              >
                <span className={`element-dot ${elementClass(option)}`} />
              </button>
            ))}
          </div>

          <div
            className="category-pill-bar compact"
            role="group"
            aria-label="Filter by weapon type"
          >
            {WEAPON_TYPES.map((option) => (
              <button
                key={option}
                type="button"
                className={`cat-pill${weaponType === option ? ' active' : ''}`}
                aria-pressed={weaponType === option}
                onClick={() => setWeaponType(option)}
              >
                {option === 'all' ? 'All weapons' : option}
              </button>
            ))}
          </div>

          <div
            className="segmented-filter"
            role="group"
            aria-label="Filter by rarity"
          >
            {RARITIES.map((option) => (
              <button
                key={option}
                type="button"
                className={`seg-btn${rarity === option ? ' active' : ''}`}
                aria-pressed={rarity === option}
                onClick={() => setRarity(option)}
              >
                {option === 'all' ? 'All ★' : `${option}★`}
              </button>
            ))}
          </div>
        </div>

        <div className="roster-list">
          {filtered.map((character) => {
            const isSelected = selected?.id === character.id;
            return (
              <div key={character.id} className="roster-row">
                <button
                  type="button"
                  className={`roster-card roster-card-index ${elementClass(
                    character.element,
                  )}${isSelected ? ' selected' : ''}`}
                  onClick={() => setSelectedId(character.id)}
                  aria-pressed={isSelected}
                >
                  <CharacterAvatar character={character} size="xl" />
                  <span className="roster-info">
                    <span className="roster-name">
                      <span className="roster-name-text">{character.name}</span>
                      <span
                        className={`stars roster-stars ${rarityClass(
                          character.rarity,
                        )}`}
                      >
                        {stars(character.rarity)}
                      </span>
                    </span>
                    <span className="roster-meta">
                      <span
                        className={`element-dot ${elementClass(
                          character.element,
                        )}`}
                        aria-hidden="true"
                      />
                      <span>
                        {character.element} &middot; {character.weaponType}
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="muted small roster-empty">
              No resonators match your filter.
            </p>
          )}
        </div>
      </aside>

      {selected && (
        <main className="character-view" id="main">
          <header
            className={`character-header ${elementClass(selected.element)}`}
          >
            <div className="character-aura" aria-hidden="true" />
            <div className="character-title">
              <CharacterAvatar character={selected} size="lg" />
              <div>
                <div className="character-name-row">
                  <h2>{selected.name}</h2>
                  <span className={`stars ${rarityClass(selected.rarity)}`}>
                    {stars(selected.rarity)}
                  </span>
                </div>
                <p className="character-tags">
                  <span className="tag-element">
                    <span
                      className={`element-dot ${elementClass(selected.element)}`}
                      aria-hidden="true"
                    />
                    {selected.element}
                  </span>
                  <span>{selected.weaponType}</span>
                  <span>{selected.role}</span>
                </p>
              </div>
            </div>

            <div className="character-header-right">
              <button
                type="button"
                className="primary-button"
                onClick={() => onOpenBuild(selected.id)}
              >
                Plan Build &rarr;
              </button>
            </div>
          </header>

          <CharacterKitSection key={selected.id} kit={selected.kit} />
        </main>
      )}
    </div>
  );
}
