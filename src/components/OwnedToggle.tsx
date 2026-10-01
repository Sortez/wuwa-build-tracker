import { useApp } from '../state';
import type { Character } from '../types';

interface Props {
  character: Character;
  /** Compact renders just the check circle (roster); full adds a label. */
  variant?: 'compact' | 'full';
}

export default function OwnedToggle({ character, variant = 'full' }: Props) {
  const { ownedIds, setOwned } = useApp();
  const owned = ownedIds.has(character.id);
  const label = owned
    ? `${character.name} is owned — click to unmark`
    : `Mark ${character.name} as owned`;

  return (
    <button
      type="button"
      className={`owned-toggle owned-${variant}${owned ? ' is-owned' : ''}`}
      aria-pressed={owned}
      aria-label={label}
      title={label}
      onClick={() => setOwned(character.id, !owned)}
    >
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
        <path
          d="M3.5 8.4 6.6 11.4 12.5 4.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {variant === 'full' && <span>{owned ? 'Owned' : 'Not owned'}</span>}
    </button>
  );
}
