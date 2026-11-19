import { type ReactNode, useEffect, useState } from 'react';
import { builds, echoSetsById, recommendedTeams, weaponsById } from '../data';
import {
  MAX_ECHO_COST,
  parseRecommendedSubstats,
  substatTotals,
  totalEchoCost,
} from '../lib/echoStats';
import { elementClass, rarityClass, stars } from '../lib/format';
import type { Character, CharacterProgress } from '../types';
import EchoSetIcon from './EchoSetIcon';
import OwnedToggle from './OwnedToggle';
import { ratingTier, TeamRoster, tierKey } from './TeamParts';
import WeaponIcon from './WeaponIcon';

interface Props {
  character: Character;
  /** With progress the stage shows the build dock; without it, `actions`. */
  progress?: CharacterProgress;
  actions?: ReactNode;
}

/**
 * Full-body render from /banners/<id>.webp. Characters without one get their
 * roster portrait in a framed fallback, so every stage still has art.
 */
function StageArt({ character }: { character: Character }) {
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    setFallback(false);
  }, [character.id]);

  if (fallback) {
    return (
      <div className="stage-art-frame" aria-hidden="true">
        <img src={`/characters/${character.id}.webp`} alt="" />
      </div>
    );
  }

  return (
    <img
      className="stage-art"
      src={`/banners/${character.id}.webp`}
      alt=""
      aria-hidden="true"
      onError={() => setFallback(true)}
    />
  );
}

function StageDock({
  character,
  progress,
}: {
  character: Character;
  progress: CharacterProgress;
}) {
  const build = builds[character.id];

  const weaponId = progress.recommendedWeaponIds[0];
  const weapon = weaponId ? weaponsById.get(weaponId) ?? null : null;
  const echoSetId = progress.recommendedEchoSetIds[0];
  const echoSet = echoSetId ? echoSetsById.get(echoSetId) ?? null : null;

  const echoCost = totalEchoCost(progress.echoBuild);
  const totals = substatTotals(progress.echoBuild);
  const targets = parseRecommendedSubstats(build?.substats).filter(
    (entry): entry is typeof entry & { statId: string; target: number } =>
      Boolean(entry.statId && entry.target !== undefined),
  );
  const metCount = targets.filter(
    (entry) => (totals.get(entry.statId) ?? 0) >= entry.target,
  ).length;
  const goalShare = targets.length > 0 ? metCount / targets.length : 0;

  const bestTeam = recommendedTeams
    .filter((team) => team.characterIds.includes(character.id))
    .sort((a, b) => b.ratings.tower - a.ratings.tower)[0];
  const bestTier = bestTeam ? ratingTier(bestTeam.ratings.tower) : null;

  return (
      <div className="stage-dock">
        <section className="dock-card" aria-label="Primary weapon">
          <span className="dock-label">Weapon</span>
          <div className="dock-item">
            <WeaponIcon weapon={weapon} size="md" />
            <span className="dock-value">{weapon?.name ?? 'Not set'}</span>
          </div>
          {weapon?.atk !== undefined && (
            <span className="dock-meta">
              Lv. 90 ATK <b>{weapon.atk}</b>
            </span>
          )}
        </section>

        <section className="dock-card" aria-label="Echo set">
          <span className="dock-label">Echo set</span>
          <div className="dock-item">
            <EchoSetIcon echoSet={echoSet} size="md" />
            <span className="dock-value">{echoSet?.name ?? 'Not set'}</span>
          </div>
          <span
            className={`dock-meta${echoCost > MAX_ECHO_COST ? ' is-over' : ''}`}
          >
            Echo cost{' '}
            <b>
              {echoCost} / {MAX_ECHO_COST}
            </b>
          </span>
        </section>

        <section className="dock-card" aria-label="Build progress">
          <span className="dock-label">Substat goals</span>
          <span
            className={`dock-figure${
              targets.length > 0 && metCount === targets.length ? ' is-met' : ''
            }`}
          >
            {targets.length > 0 ? `${metCount} / ${targets.length}` : '—'}
          </span>
          <span
            className="dock-bar"
            role="progressbar"
            aria-label="Substat goals met"
            aria-valuemin={0}
            aria-valuemax={targets.length}
            aria-valuenow={metCount}
          >
            <span style={{ width: `${Math.round(goalShare * 100)}%` }} />
          </span>
        </section>

        <section className="dock-card dock-card-team" aria-label="Best team">
          <span className="dock-label">
            Best team
            {bestTier && (
              <span className={`tier-badge tier-${tierKey(bestTier)}`}>
                {bestTier}
              </span>
            )}
          </span>
          {bestTeam ? (
            <>
              <span className="dock-value">{bestTeam.name}</span>
              <TeamRoster
                characterIds={bestTeam.characterIds}
                size="md"
                pad={false}
                highlightId={character.id}
              />
            </>
          ) : (
            <span className="dock-meta">No recommended team yet</span>
          )}
        </section>
      </div>
  );
}

export default function CharacterStage({ character, progress, actions }: Props) {
  return (
    <header
      className={`character-stage ${elementClass(character.element)}${
        progress ? '' : ' is-compact'
      }`}
    >
      <div className="stage-field" aria-hidden="true" />
      <StageArt key={character.id} character={character} />

      <div className="stage-title">
        <span className={`stars stage-stars ${rarityClass(character.rarity)}`}>
          {stars(character.rarity)}
        </span>
        <h2 data-long={character.name.length > 9 || undefined}>
          {character.name}
        </h2>
        <p className="stage-tags">
          <span className="stage-tag stage-tag-element">{character.element}</span>
          <span className="stage-tag">{character.weaponType}</span>
          <span className="stage-tag">{character.role}</span>
        </p>
      </div>

      <div className="stage-owned">
        <OwnedToggle character={character} />
      </div>

      {progress ? (
        <StageDock character={character} progress={progress} />
      ) : (
        actions && <div className="stage-actions">{actions}</div>
      )}
    </header>
  );
}
