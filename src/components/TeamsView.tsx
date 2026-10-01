import { useState } from 'react';
import { characters, charactersById, recommendedTeams } from '../data';
import { elementClass } from '../lib/format';
import type { RecommendedTeam, Team, TeamMode } from '../types';
import { useApp } from '../state';
import CharacterAvatar from './CharacterAvatar';
import {
  MAX_TEAM_SIZE,
  MODE_META,
  ModeIcon,
  TeamModeBadge,
  TeamRoster,
  TIERS,
  tierKey,
} from './TeamParts';

function ModePicker({
  value,
  onChange,
}: {
  value: TeamMode;
  onChange: (mode: TeamMode) => void;
}) {
  return (
    <div className="mode-picker" role="group" aria-label="Content mode">
      {(Object.keys(MODE_META) as TeamMode[]).map((option) => (
        <button
          key={option}
          type="button"
          className={value === option ? 'mode-option active' : 'mode-option'}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          <ModeIcon mode={option} />
          <span>{MODE_META[option].label}</span>
        </button>
      ))}
    </div>
  );
}

function RecommendedCard({
  team,
  tier,
}: {
  team: RecommendedTeam;
  tier: string;
}) {
  const lead = charactersById.get(team.characterIds[0]);
  return (
    <article className="team-card">
      <span
        className={
          lead ? `team-glow ${elementClass(lead.element)}` : 'team-glow el-none'
        }
        aria-hidden="true"
      />
      <header className="team-card-head">
        <div className="team-card-heading">
          <h4>{team.name}</h4>
          <span className={`tier-badge tier-${tierKey(tier)}`}>{tier}</span>
        </div>
      </header>
      <TeamRoster characterIds={team.characterIds} />
    </article>
  );
}

function TeamCard({
  team,
  onRemove,
  onModeChange,
}: {
  team: Team;
  onRemove: () => void;
  onModeChange: (mode: TeamMode) => void;
}) {
  const lead = charactersById.get(team.characterIds[0]);
  return (
    <article className="team-card">
      <span
        className={
          lead ? `team-glow ${elementClass(lead.element)}` : 'team-glow el-none'
        }
        aria-hidden="true"
      />
      <header className="team-card-head">
        <div className="team-card-heading">
          <h4>{team.name}</h4>
          <TeamModeBadge mode={team.mode} onChange={onModeChange} />
        </div>
        <button
          type="button"
          className="icon-button"
          onClick={onRemove}
          aria-label={`Remove ${team.name}`}
          title="Remove team"
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </header>
      <TeamRoster characterIds={team.characterIds} />
      {team.note && <p className="team-note">{team.note}</p>}
    </article>
  );
}

export default function TeamsView() {
  const { state, addTeam, removeTeam, setTeamMode } = useApp();
  const [name, setName] = useState('');
  const [members, setMembers] = useState<string[]>([]);
  const [mode, setMode] = useState<TeamMode>('tower');
  const [recommendedMode, setRecommendedMode] = useState<TeamMode>('tower');

  const toggleMember = (id: string) => {
    setMembers((current) => {
      if (current.includes(id)) {
        return current.filter((member) => member !== id);
      }
      if (current.length >= MAX_TEAM_SIZE) return current;
      return [...current, id];
    });
  };

  const submit = () => {
    if (!name.trim() || members.length === 0) return;
    const team: Team = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      characterIds: members,
      note: 'Custom team',
      mode,
    };
    addTeam(team);
    setName('');
    setMembers([]);
    setMode('tower');
  };

  return (
    <div className="teams-view">
      <section className="panel">
        <div className="panel-head recommended-head">
          <div>
            <h3 className="panel-title">Recommended teams</h3>
            <p className="muted tiny">
              Prydwen tier list &middot; {MODE_META[recommendedMode].label}
            </p>
          </div>
          <ModePicker value={recommendedMode} onChange={setRecommendedMode} />
        </div>

        {TIERS.map(({ label, rating }) => {
          const list = recommendedTeams.filter(
            (team) => team.ratings[recommendedMode] === rating,
          );
          if (list.length === 0) return null;
          return (
            <div key={label} className="tier-group">
              <h4 className="tier-group-head">
                <span className={`tier-badge tier-${tierKey(label)}`}>
                  {label}
                </span>
                <span className="muted tiny">{list.length} teams</span>
              </h4>
              <div className="team-grid">
                {list.map((team) => (
                  <RecommendedCard key={team.id} team={team} tier={label} />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3 className="panel-title">My teams</h3>
          <span className="muted small">{state.myTeams.length} saved</span>
        </div>

        {state.myTeams.length === 0 ? (
          <div className="empty-teams">
            <p className="empty-teams-title">No saved teams yet</p>
            <p className="muted small">
              Pick up to three characters and name the team below.
            </p>
          </div>
        ) : (
          <div className="team-grid">
            {state.myTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onRemove={() => removeTeam(team.id)}
                onModeChange={(next) => setTeamMode(team.id, next)}
              />
            ))}
          </div>
        )}

        <div className="team-builder">
          <h4 className="section-subtitle">Create a team</h4>

          <div className="team-builder-row">
            <label className="select-field">
              <span className="field-label tiny">Team name</span>
              <input
                type="text"
                value={name}
                placeholder="e.g. Havoc Hypercarry"
                onChange={(event) => setName(event.target.value)}
              />
            </label>

            <div className="mode-field">
              <span className="field-label tiny">Used for</span>
              <ModePicker value={mode} onChange={setMode} />
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={submit}
              disabled={!name.trim() || members.length === 0}
            >
              Add team ({members.length}/{MAX_TEAM_SIZE})
            </button>
          </div>

          <div className="team-picker">
            {characters.map((character) => {
              const active = members.includes(character.id);
              const disabled = !active && members.length >= MAX_TEAM_SIZE;
              return (
                <button
                  key={character.id}
                  type="button"
                  className={active ? 'pick-chip active' : 'pick-chip'}
                  disabled={disabled}
                  aria-pressed={active}
                  title={character.name}
                  onClick={() => toggleMember(character.id)}
                >
                  <CharacterAvatar character={character} size="md" />
                  <span className="pick-name">{character.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
