import { useState } from 'react';
import { builds, recommendedTeams } from '../data';
import { useApp } from '../state';
import type { Character } from '../types';
import CharacterKitSection from './CharacterKitSection';
import CharacterStage from './CharacterStage';
import EchoBuildPanel from './EchoBuildPanel';
import GearPanel from './GearPanel';
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
  const [showKit, setShowKit] = useState(false);
  const progress = progressFor(character);

  const savedTeams = state.myTeams.filter((team) =>
    team.characterIds.includes(character.id),
  );
  const recommendedForChar = recommendedTeams.filter((team) =>
    team.characterIds.includes(character.id),
  );

  return (
    <main className="character-view" id="main">
      <CharacterStage character={character} progress={progress} />

      {(savedTeams.length > 0 || recommendedForChar.length > 0) && (
        <section className="panel">
          <div className="panel-head">
            <h3 className="panel-title">Teams</h3>
            <span className="muted tiny">
              {savedTeams.length + recommendedForChar.length} lineups
            </span>
          </div>

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

      <EchoBuildPanel
        echoBuild={progress.echoBuild}
        recommendedSubstats={builds[character.id]?.substats}
        onChange={(echoBuild) => updateCharacter(character.id, { echoBuild })}
      />

      {character.kit && (
        <section className="panel">
          <div className="panel-head gear-head">
            <div>
              <h3 className="panel-title">Skills &amp; Sequences</h3>
              <p className="muted tiny">
                {character.kit.skills.length} skills &middot;{' '}
                {character.kit.sequences.length} Resonance Chain nodes
              </p>
            </div>
            <button
              type="button"
              className="ghost-button"
              aria-expanded={showKit}
              onClick={() => setShowKit((current) => !current)}
            >
              {showKit ? 'Hide kit' : 'Read skills & sequences'}
            </button>
          </div>

          {showKit && (
            <CharacterKitSection
              key={character.id}
              kit={character.kit}
              compact
            />
          )}
        </section>
      )}
    </main>
  );
}
