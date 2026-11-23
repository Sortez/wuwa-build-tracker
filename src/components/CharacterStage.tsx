import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
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
 * Crisp geometric diagonal slash & orbital resonance linework behind the
 * character — clean graphic structure with zero cloudy radial fog.
 */
function StageBackdrop() {
  return (
    <svg
      className="stage-geometry"
      viewBox="0 0 1000 500"
      preserveAspectRatio="xMaxYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <g className="stage-slash-group">
        <polygon
          className="stage-slash-plane"
          points="560,0 1000,0 1000,500 420,500"
        />
        <polygon
          className="stage-slash-band"
          points="538,0 550,0 410,500 398,500"
        />
        <line
          className="stage-slash-edge"
          x1="560"
          y1="0"
          x2="420"
          y2="500"
          strokeWidth="1.75"
        />
        <line
          className="stage-slash-edge-sub"
          x1="528"
          y1="0"
          x2="388"
          y2="500"
          strokeWidth="1"
        />
      </g>
      <g className="stage-motif-rings">
        <circle
          cx="760"
          cy="236"
          r="196"
          stroke="currentColor"
          strokeOpacity="0.16"
          strokeWidth="1"
          strokeDasharray="3 7"
        />
        <circle
          cx="760"
          cy="236"
          r="142"
          stroke="currentColor"
          strokeOpacity="0.24"
          strokeWidth="1.2"
        />
        <ellipse
          cx="760"
          cy="236"
          rx="252"
          ry="82"
          transform="rotate(-22 760 236)"
          stroke="currentColor"
          strokeOpacity="0.34"
          strokeWidth="1.35"
        />
        <circle cx="954" cy="158" r="3.5" fill="currentColor" fillOpacity="0.8" />
        <circle cx="566" cy="314" r="2.5" fill="currentColor" fillOpacity="0.55" />
      </g>
      <path
        className="stage-motif-wave"
        d="M360 326 C 424 326, 444 286, 500 286 C 556 286, 572 348, 632 348 C 692 348, 710 264, 774 264 C 838 264, 860 338, 924 338 C 958 338, 978 324, 1000 324"
        stroke="currentColor"
        strokeOpacity="0.26"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
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
    <div className="stage-art-wrap" aria-hidden="true">
      <img
        className="stage-art"
        src={`/banners/${character.id}.webp`}
        alt=""
        onError={() => setFallback(true)}
      />
    </div>
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
  const goalPct =
    targets.length > 0 ? Math.round((metCount / targets.length) * 100) : 0;
  const allMet = targets.length > 0 && metCount === targets.length;

  const bestTeam = recommendedTeams
    .filter((team) => team.characterIds.includes(character.id))
    .sort((a, b) => b.ratings.tower - a.ratings.tower)[0];
  const bestTier = bestTeam ? ratingTier(bestTeam.ratings.tower) : null;

  return (
    <div key={character.id} className="stage-dock">
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
        <span className="dock-label">
          <span>Substat goals</span>
          {targets.length > 0 && (
            <span className={`dock-pct${allMet ? ' is-met' : ''}`}>
              {goalPct}%
            </span>
          )}
        </span>
        <span className={`dock-figure${allMet ? ' is-met' : ''}`}>
          {targets.length > 0 ? `${metCount} / ${targets.length}` : '—'}
        </span>
        <span
          className={`dock-bar${allMet ? ' is-met' : ''}`}
          role="progressbar"
          aria-label="Substat goals met"
          aria-valuemin={0}
          aria-valuemax={targets.length}
          aria-valuenow={metCount}
        >
          <span style={{ width: `${goalPct}%` }} />
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
  const stageRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (
      event.pointerType === 'touch' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const node = stageRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      node.style.setProperty('--stage-px', nx.toFixed(3));
      node.style.setProperty('--stage-py', ny.toFixed(3));
    });
  };

  const handlePointerLeave = () => {
    const node = stageRef.current;
    if (!node) return;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    node.style.setProperty('--stage-px', '0');
    node.style.setProperty('--stage-py', '0');
  };

  return (
    <header
      ref={stageRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`character-stage ${elementClass(character.element)}${
        progress ? '' : ' is-compact'
      }`}
    >
      <div className="stage-field" aria-hidden="true" />
      <StageBackdrop key={`backdrop-${character.id}`} />
      <div
        key={`watermark-${character.id}`}
        className="stage-watermark"
        aria-hidden="true"
      >
        {character.element}
      </div>
      <StageArt key={character.id} character={character} />

      <div key={`title-${character.id}`} className="stage-title">
        <span className={`stars stage-stars ${rarityClass(character.rarity)}`}>
          {stars(character.rarity)}
        </span>
        <h2 data-long={character.name.length > 9 || undefined}>
          {character.name}
        </h2>
        <p className="stage-tags">
          <span className="stage-tag stage-tag-element">
            <span
              className={`element-dot ${elementClass(character.element)}`}
              aria-hidden="true"
            />
            {character.element}
          </span>
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
