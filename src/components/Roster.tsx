import { useMemo, useState } from 'react';
import { characters } from '../data';
import { rarityClass, stars } from '../lib/format';
import type { ElementName } from '../types';
import CharacterAvatar from './CharacterAvatar';

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

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return characters
      .filter((character) => {
        if (element !== 'all' && character.element !== element) return false;
        if (!needle) return true;
        return (
          character.name.toLowerCase().includes(needle) ||
          character.role.toLowerCase().includes(needle) ||
          character.weaponType.toLowerCase().includes(needle)
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [query, element]);

  return (
    <aside className="roster">
      <h2 className="panel-title">
        Roster <span className="muted small">({filtered.length})</span>
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
      </div>

      <div className="roster-list">
        {filtered.map((character) => (
          <button
            key={character.id}
            type="button"
            className={
              character.id === selectedId ? 'roster-card selected' : 'roster-card'
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
        ))}
        {filtered.length === 0 && (
          <p className="muted small">No characters match your filter.</p>
        )}
      </div>
    </aside>
  );
}
