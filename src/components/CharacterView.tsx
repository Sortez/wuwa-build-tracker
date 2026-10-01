import { recommendedTeams } from '../data';
import { rarityClass, stars } from '../lib/format';
import { useApp } from '../state';
import type { Character } from '../types';
import CharacterAvatar from './CharacterAvatar';
import GearPanel from './GearPanel';
import OwnedToggle from './OwnedToggle';
import {
  ModeIcon,
  ratingTier,
  ReadyBadge,
  TeamModeBadge,
  TeamRoster,
  tierKey,
} from './TeamParts';

interface Props {
  character: Character;
}

export default function CharacterView({ character }: Props) {
  const { state, ownedIds, progressFor, updateCharacter } = useApp();
  const progress = progressFor(character);

  const savedTeams = state.myTeams.filter((team) =>
    team.characterIds.includes(character.id),
  );
  const recommendedForChar = recommendedTeams.filter((team) =>
    team.characterIds.includes(character.id),
  );

  return (
    <main className="character-view" id="main">
      <header className="character-header">
        <div className="character-title">
          <CharacterAvatar character={character} size="lg" />
          <div>
            <h2>
              {character.name}{' '}
              <span className={`stars ${rarityClass(character.rarity)}`}>
                {stars(character.rarity)}
              </span>
            </h2>
            <p className="muted">
              {character.element} &middot; {character.weaponType} &middot;{' '}
              {character.role}
            </p>
          </div>
        </div>
        <OwnedToggle character={character} />
      </header>

      {(savedTeams.length > 0 || recommendedForChar.length > 0) && (
        <section className="panel">
          <h3 className="panel-title">Teams</h3>

          {savedTeams.length > 0 && (
            <div className="team-section">
              <h4 className="section-subtitle">Saved</h4>
              <div className="character-team-list">
                {savedTeams.map((team) => (
                  <article key={team.id} className="character-team">
                    <div className="character-team-head">
                      <span className="character-team-name">{team.name}</span>
                      <TeamModeBadge mode={team.mode} />
                    </div>
                    <TeamRoster
                      characterIds={team.characterIds}
                      size="xl"
                      pad={false}
                      highlightId={character.id}
                    />
                  </article>
                ))}
              </div>
            </div>
          )}

          {recommendedForChar.length > 0 && (
            <div className="team-section">
              <h4 className="section-subtitle">Recommended</h4>
              <div className="character-team-list">
                {recommendedForChar.map((team) => {
                  const tower = ratingTier(team.ratings.tower);
                  const wastes = ratingTier(team.ratings.wastes);
                  return (
                    <article key={team.id} className="character-team">
                      <div className="character-team-head">
                        <span className="character-team-name">{team.name}</span>
                        <span className="character-team-tiers">
                          {tower && (
                            <span
                              className={`tier-badge tier-${tierKey(tower)}`}
                              title={`Tower of Adversity · ${tower}`}
                            >
                              <ModeIcon mode="tower" />
                              {tower}
                            </span>
                          )}
                          {wastes && (
                            <span
                              className={`tier-badge tier-${tierKey(wastes)}`}
                              title={`Whimpering Wastes · ${wastes}`}
                            >
                              <ModeIcon mode="wastes" />
                              {wastes}
                            </span>
                          )}
                          {ownedIds.size > 0 &&
                            team.characterIds.every((id) => ownedIds.has(id)) && (
                              <ReadyBadge />
                            )}
                        </span>
                      </div>
                      <TeamRoster
                        characterIds={team.characterIds}
                        size="xl"
                        pad={false}
                        highlightId={character.id}
                      />
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      <GearPanel
        character={character}
        progress={progress}
        onChange={(patch) => updateCharacter(character.id, patch)}
      />
    </main>
  );
}
