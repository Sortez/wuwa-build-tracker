import { useMemo, useState } from 'react';
import { characters } from '../data';
import { elementClass, rarityClass, stars } from '../lib/format';
import { useApp } from '../state';
import type { ElementName } from '../types';
import CharacterAvatar from './CharacterAvatar';
import OwnedToggle from './OwnedToggle';

type OwnedFilter = 'all' | 'owned' | 'missing';

interface Props {
  selectedId: string;
  onSelect: (id: string) => void;
}

const ELEMENTS: ElementName[] = [
  'Spectro',
  'Havoc',
  'Fusion',
  'Glacio',
  'Aero',
  'Electro',
];

const OWNED_OPTIONS: { value: OwnedFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'owned', label: 'Owned' },
  { value: 'missing', label: 'Missing' },
];

export default function Roster({ selectedId, onSelect }: Props) {
  const [query, setQuery] = useState('');
  const [element, setElement] = useState<'all' | ElementName>('all');
  const [ownedFilter, setOwnedFilter] = useState<OwnedFilter>('all');
  const { ownedIds } = useApp();

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return characters
      .filter((character) => {
        if (element !== 'all' && character.element !== element) return false;
        if (
          ownedFilter !== 'all' &&
          ownedIds.has(character.id) !== (ownedFilter === 'owned')
        ) {
          return false;
        }
        if (!needle) return true;
        return (
          character.name.toLowerCase().includes(needle) ||
          character.role.toLowerCase().includes(needle) ||
          character.weaponType.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, element, ownedFilter, ownedIds]);

  return (
    <aside className="roster">
      <div className="roster-head">
        <h2 className="panel-title">
          Resonators
          <span className="roster-count">{filtered.length}</span>
        </h2>
        <span className="roster-owned-count">
          {ownedIds.size}/{characters.length} owned
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
            aria-label="Search resonators"
            placeholder="Search name, role, weapon..."
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
          className="segmented-filter"
          role="group"
          aria-label="Filter by ownership"
        >
          {OWNED_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`seg-btn${ownedFilter === option.value ? ' active' : ''}`}
              aria-pressed={ownedFilter === option.value}
              onClick={() => setOwnedFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="roster-list">
        {filtered.map((character) => {
          const isSelected = character.id === selectedId;
          return (
            <div key={character.id} className="roster-row">
              <button
                type="button"
                className={`roster-card ${elementClass(character.element)}${
                  isSelected ? ' selected' : ''
                }`}
                onClick={() => onSelect(character.id)}
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
                      {character.element} &middot; {character.role}
                    </span>
                  </span>
                </span>
              </button>
              <OwnedToggle character={character} variant="compact" />
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
  );
}
