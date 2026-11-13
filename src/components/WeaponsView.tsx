import { useMemo, useState } from 'react';
import { builds, characters, weapons } from '../data';
import { elementClass, rarityClass, stars } from '../lib/format';
import type { Character, WeaponTypeName } from '../types';
import CharacterAvatar from './CharacterAvatar';
import WeaponIcon from './WeaponIcon';

interface Props {
  onSelectCharacter: (id: string) => void;
}

const WEAPON_CATEGORIES: ('all' | WeaponTypeName)[] = [
  'all',
  'Broadblade',
  'Sword',
  'Pistols',
  'Gauntlets',
  'Rectifier',
];

const RARITIES = ['all', 5, 4, 3, 2, 1] as const;
type RarityFilter = (typeof RARITIES)[number];

export default function WeaponsView({ onSelectCharacter }: Props) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | WeaponTypeName>('all');
  const [rarity, setRarity] = useState<RarityFilter>('all');

  const recommendedUsers = useMemo(() => {
    const map = new Map<string, Character[]>();
    for (const char of characters) {
      const build = builds[char.id];
      if (!build) continue;
      const ids = new Set<string>([
        ...build.weaponIds,
        ...(build.fourStarWeaponId ? [build.fourStarWeaponId] : []),
      ]);
      for (const weaponId of ids) {
        const list = map.get(weaponId);
        if (list) list.push(char);
        else map.set(weaponId, [char]);
      }
    }
    return map;
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    counts.set('all', weapons.length);
    for (const w of weapons) {
      counts.set(w.type, (counts.get(w.type) ?? 0) + 1);
    }
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return [...weapons]
      .filter((weapon) => {
        if (category !== 'all' && weapon.type !== category) return false;
        if (rarity !== 'all' && weapon.rarity !== rarity) return false;
        if (!needle) return true;
        return (
          weapon.name.toLowerCase().includes(needle) ||
          weapon.type.toLowerCase().includes(needle) ||
          (weapon.substat?.label.toLowerCase().includes(needle) ?? false) ||
          (weapon.passive?.toLowerCase().includes(needle) ?? false)
        );
      })
      .sort((a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name));
  }, [query, category, rarity]);

  return (
    <main className="index-view weapons-view" id="main">
      <section className="panel index-toolbar-panel">
        <div className="panel-head">
          <div>
            <h2 className="panel-title">Weapon Index</h2>
            <p className="muted tiny">
              Lv. 90 base stats, passives &amp; recommended resonators
            </p>
          </div>
          <span className="roster-count">
            {filtered.length} / {weapons.length} weapons
          </span>
        </div>

        <div className="index-filters">
          <div className="search-field index-search">
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
              aria-label="Search weapons"
              placeholder="Search name, substat (CRIT, Energy Regen...), or passive..."
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
            className="category-pill-bar"
            role="group"
            aria-label="Filter by weapon category"
          >
            {WEAPON_CATEGORIES.map((option) => (
              <button
                key={option}
                type="button"
                className={`cat-pill${category === option ? ' active' : ''}`}
                aria-pressed={category === option}
                onClick={() => setCategory(option)}
              >
                <span>{option === 'all' ? 'All types' : option}</span>
                <span className="cat-pill-count">
                  {categoryCounts.get(option) ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div
            className="category-pill-bar rarity-pill-bar"
            role="group"
            aria-label="Filter by rarity"
          >
            {RARITIES.map((option) => (
              <button
                key={option}
                type="button"
                className={`cat-pill${rarity === option ? ' active' : ''}`}
                aria-pressed={rarity === option}
                onClick={() => setRarity(option)}
              >
                {option === 'all' ? (
                  'All rarities'
                ) : (
                  <span className={rarityClass(option)}>{option}★</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {filtered.length === 0 ? (
        <section className="panel">
          <p className="muted small roster-empty">
            No weapons match your current filters.
          </p>
        </section>
      ) : (
        <div className="weapons-grid">
          {filtered.map((weapon) => {
            const users = recommendedUsers.get(weapon.id) ?? [];
            return (
              <article
                key={weapon.id}
                className={`weapon-card weapon-rarity-${weapon.rarity}`}
              >
                <header className="weapon-card-head">
                  <WeaponIcon weapon={weapon} size="md" />
                  <div className="weapon-card-title">
                    <div className="weapon-card-name-row">
                      <h3>{weapon.name}</h3>
                      <span className="weapon-type-tag">{weapon.type}</span>
                    </div>
                    <span className={`stars ${rarityClass(weapon.rarity)}`}>
                      {stars(weapon.rarity)}
                    </span>
                  </div>
                </header>

                {(weapon.atk !== undefined || weapon.substat) && (
                  <div className="weapon-stats">
                    <span className="stat-pill stat-pill-lv">Lv. 90</span>
                    {weapon.atk !== undefined && (
                      <span className="stat-pill">
                        ATK <strong>{weapon.atk}</strong>
                      </span>
                    )}
                    {weapon.substat && (
                      <span className="stat-pill">
                        {weapon.substat.label}{' '}
                        <strong>{weapon.substat.value}</strong>
                      </span>
                    )}
                  </div>
                )}

                {weapon.passive && (
                  <p className="muted small weapon-passive">
                    {weapon.passive}
                  </p>
                )}

                {users.length > 0 && (
                  <footer className="weapon-users">
                    <span className="weapon-users-label">Used by</span>
                    <div className="weapon-users-list">
                      {users.map((char) => (
                        <button
                          key={char.id}
                          type="button"
                          className={`weapon-user-chip ${elementClass(
                            char.element,
                          )}`}
                          title={`Open ${char.name} build`}
                          onClick={() => onSelectCharacter(char.id)}
                        >
                          <CharacterAvatar character={char} size="sm" />
                          <span>{char.name}</span>
                        </button>
                      ))}
                    </div>
                  </footer>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
