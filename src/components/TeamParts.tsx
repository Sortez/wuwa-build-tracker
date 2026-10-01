import { charactersById } from '../data';
import type { TeamMode } from '../types';
import CharacterAvatar from './CharacterAvatar';

export const MAX_TEAM_SIZE = 3;

export const MODE_META: Record<TeamMode, { label: string }> = {
  tower: { label: 'Tower of Adversity' },
  wastes: { label: 'Whimpering Wastes' },
};

/** Prydwen rating (5-11) to tier label, highest first. */
export const TIERS = [
  { label: 'T0', rating: 11 },
  { label: 'T0.5', rating: 10 },
  { label: 'T1', rating: 9 },
  { label: 'T1.5', rating: 8 },
  { label: 'T2', rating: 7 },
  { label: 'T3', rating: 6 },
  { label: 'T4', rating: 5 },
] as const;

export const tierKey = (label: string) => label.toLowerCase().replace('.', '-');

export function ratingTier(rating: number): string | null {
  return TIERS.find((tier) => tier.rating === rating)?.label ?? null;
}

export function ModeIcon({ mode }: { mode: TeamMode }) {
  if (mode === 'tower') {
    return (
      <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
        <path
          d="M8 1.6 11.8 5.2v9.2H4.2V5.2L8 1.6Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M6.6 14.4v-3.2a1.4 1.4 0 0 1 2.8 0v3.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
      <path
        d="M8 2.4a5 5 0 0 0-3.1 8.9v1.3a1.1 1.1 0 0 0 1.1 1.1h4a1.1 1.1 0 0 0 1.1-1.1v-1.3A5 5 0 0 0 8 2.4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="6.2" cy="6.9" r="1.05" fill="currentColor" />
      <circle cx="9.8" cy="6.9" r="1.05" fill="currentColor" />
    </svg>
  );
}

interface BadgeProps {
  mode?: TeamMode;
  onChange?: (mode: TeamMode) => void;
}

export function TeamModeBadge({ mode, onChange }: BadgeProps) {
  if (!mode) {
    if (!onChange) return null;
    return (
      <button
        type="button"
        className="mode-badge mode-none"
        onClick={() => onChange('tower')}
        title="Assign Tower of Adversity or Whimpering Wastes"
      >
        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
          <path
            d="M8 4v8M4 8h8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
        <span>Set mode</span>
      </button>
    );
  }

  const meta = MODE_META[mode];
  const content = (
    <>
      <ModeIcon mode={mode} />
      <span>{meta.label}</span>
    </>
  );

  if (!onChange) {
    return (
      <span className={`mode-badge mode-${mode}`} title={meta.label}>
        {content}
      </span>
    );
  }

  const next: TeamMode = mode === 'tower' ? 'wastes' : 'tower';
  return (
    <button
      type="button"
      className={`mode-badge mode-${mode}`}
      onClick={() => onChange(next)}
      title={`${meta.label} — click to switch to ${MODE_META[next].label}`}
    >
      {content}
    </button>
  );
}

interface RosterProps {
  characterIds: string[];
  size?: 'md' | 'xl';
  pad?: boolean;
  highlightId?: string;
}

export function TeamRoster({
  characterIds,
  size = 'xl',
  pad = true,
  highlightId,
}: RosterProps) {
  const emptySlots = pad ? Math.max(0, MAX_TEAM_SIZE - characterIds.length) : 0;

  return (
    <div className="team-roster">
      {characterIds.map((id) => {
        const member = charactersById.get(id);
        const highlight = highlightId === id;
        const slotClass = highlight ? 'team-slot team-slot-highlight' : 'team-slot';
        if (!member) {
          return (
            <span
              key={id}
              className={`${slotClass} avatar avatar-${size} avatar-unknown`}
              role="img"
              aria-label={id}
              title={id}
            >
              <span className="avatar-fallback">?</span>
            </span>
          );
        }
        return (
          <span
            key={id}
            className={slotClass}
            role="img"
            aria-label={member.name}
            title={member.name}
          >
            <CharacterAvatar character={member} size={size} />
          </span>
        );
      })}
      {Array.from({ length: emptySlots }).map((_, index) => (
        <span
          key={`empty-${index}`}
          className={`team-slot avatar avatar-${size} avatar-empty`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}
