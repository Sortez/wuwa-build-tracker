import { builds, recommendedTeams, weaponsById } from '../data';
import {
  MAX_ECHO_COST,
  parseRecommendedSubstats,
  substatTotals,
  totalEchoCost,
} from '../lib/echoStats';
import { elementClass, rarityClass, stars } from '../lib/format';
import { useApp } from '../state';
import type { Character } from '../types';
import CharacterAvatar from './CharacterAvatar';
import EchoBuildPanel from './EchoBuildPanel';
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

  const build = builds[character.id];
  const primaryWeaponId = progress.recommendedWeaponIds[0];
  const primaryWeapon = primaryWeaponId
    ? weaponsById.get(primaryWeaponId)
    : null;
  const echoCost = totalEchoCost(progress.echoBuild);
  const totals = substatTotals(progress.echoBuild);
  const targets = parseRecommendedSubstats(build?.substats).filter(
    (entry): entry is typeof entry & { statId: string; target: number } =>
      Boolean(entry.statId && entry.target !== undefined),
  );
  const metCount = targets.filter(
    (entry) => (totals.get(entry.statId) ?? 0) >= entry.target,
  ).length;

  return (
    <main className="character-view" id="main">
      <header
        className={`character-header ${elementClass(character.element)}`}
      >
        <div className="character-aura" aria-hidden="true" />
        <div className="character-title">
          <CharacterAvatar character={character} size="lg" />
          <div>
            <div className="character-name-row">
              <h2>{character.name}</h2>
              <span className={`stars ${rarityClass(character.rarity)}`}>
                {stars(character.rarity)}
              </span>
            </div>
            <p className="character-tags">
              <span className="tag-element">
                <span
                  className={`element-dot ${elementClass(character.element)}`}
                  aria-hidden="true"
                />
                {character.element}
              </span>
              <span>{character.weaponType}</span>
              <span>{character.role}</span>
            </p>
          </div>
        </div>

        <div className="character-header-right">
          <OwnedToggle character={character} />
          <div className="hero-telemetry">
            <div className="telemetry-item">
              <span className="telemetry-label">Primary weapon</span>
              <span className="telemetry-value">
                {primaryWeapon?.name ?? 'Not set'}
              </span>
            </div>
            <div className="telemetry-item">
              <span className="telemetry-label">Echo cost</span>
              <span
                className={`telemetry-value mono${
                  echoCost > MAX_ECHO_COST ? ' over' : ''
                }`}
              >
                {echoCost} / {MAX_ECHO_COST}
              </span>
            </div>
            {targets.length > 0 && (
              <div className="telemetry-item">
                <span className="telemetry-label">Substat goals</span>
                <span
                  className={`telemetry-value mono${
                    metCount === targets.length ? ' met' : ''
                  }`}
                >
                  {metCount} / {targets.length}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

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
    </main>
  );
}
