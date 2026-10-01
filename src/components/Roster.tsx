import { useMemo, useState } from 'react';
import { characters } from '../data';
import { rarityClass, stars } from '../lib/format';
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
      <h2 className="panel-title">
        Roster <span className="muted small">({filtered.length})</span>
        <span className="roster-owned-count muted small">
          {ownedIds.size}/{characters.length} owned
        </span>
      </h2>

      <div className="roster-controls">
        <input
          type="search"
          placeholder="Search name, role, weapon..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          value={element}
          onChange={(event) =>
            setElement(event.target.value as 'all' | ElementName)
          }
        >
          <option value="all">All elements</option>
          {ELEMENTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <select
          value={ownedFilter}
          onChange={(event) => setOwnedFilter(event.target.value as OwnedFilter)}
        >
          <option value="all">Owned &amp; not owned</option>
          <option value="owned">Owned only</option>
          <option value="missing">Not owned only</option>
        </select>
      </div>

      <div className="roster-list">
        {filtered.map((character) => (
          <div key={character.id} className="roster-row">
            <button
              type="button"
              className={
                character.id === selectedId
                  ? 'roster-card selected'
                  : 'roster-card'
              }
              onClick={() => onSelect(character.id)}
            >
              <CharacterAvatar character={character} size="xl" />
              <span className="roster-info">
                <span className="roster-name">
                  <span className="roster-name-text">{character.name}</span>
                  <span
                    className={`stars roster-stars ${rarityClass(character.rarity)}`}
                  >
                    {stars(character.rarity)}
                  </span>
                </span>
                <span className="roster-meta">
                  {character.element} &middot; {character.role}
                </span>
              </span>
            </button>
            <OwnedToggle character={character} variant="compact" />
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="muted small">No characters match your filter.</p>
        )}
      </div>
    </aside>
  );
}
