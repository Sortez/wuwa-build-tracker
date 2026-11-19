import { useState } from 'react';
import { bannerPhase, charactersById, weaponsById } from '../data';
import { elementClass } from '../lib/format';
import type { Banner, Character } from '../types';
import CharacterAvatar from './CharacterAvatar';
import OwnedToggle from './OwnedToggle';
import WeaponIcon from './WeaponIcon';

interface Props {
  onOpenBuild: (id: string) => void;
}

const DAY = 24 * 60 * 60 * 1000;

function formatDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

/** Whole days from today until the end date; 0 on the last day, negative once over. */
function daysUntil(date: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round(
    (new Date(`${date}T00:00:00`).getTime() - today.getTime()) / DAY,
  );
}

function timeLeft(date: string): string {
  const days = daysUntil(date);
  if (days < 0) return 'ended';
  if (days === 0) return 'last day';
  return days === 1 ? '1 day left' : `${days} days left`;
}

function resolve(ids: string[]): Character[] {
  return ids
    .map((id) => charactersById.get(id))
    .filter((character): character is Character => Boolean(character));
}

/**
 * Full-body render from /banners/<id>.webp; falls back to the roster portrait
 * so a new banner still shows art before its render is added.
 */
function BannerArt({ character }: { character: Character }) {
  const [fallback, setFallback] = useState(false);
  return (
    <img
      className={fallback ? 'banner-art is-fallback' : 'banner-art'}
      src={
        fallback
          ? `/characters/${character.id}.webp`
          : `/banners/${character.id}.webp`
      }
      alt=""
      onError={() => setFallback(true)}
    />
  );
}

function FeaturedBanner({
  banner,
  character,
  onOpenBuild,
}: {
  banner: Banner;
  character: Character;
  onOpenBuild: (id: string) => void;
}) {
  const weapon = banner.weaponId ? weaponsById.get(banner.weaponId) : undefined;

  return (
    <article
      className={`banner-hero ${elementClass(character.element)}${
        banner.isNew ? ' is-new' : ''
      }`}
    >
      <BannerArt character={character} />
      <div className="banner-copy">
        <h3 className="banner-title">{character.name}</h3>
        <p className="banner-meta">
          {banner.isNew && <span className="banner-new">New resonator</span>}
          <span className="banner-element">{character.element}</span>
          <span>{character.weaponType}</span>
        </p>
        <p className="banner-name">{banner.name}</p>
        <div className="banner-actions">
          <button
            type="button"
            className="primary-button"
            onClick={() => onOpenBuild(character.id)}
          >
            Plan build
          </button>
          <OwnedToggle character={character} />
        </div>
        {weapon && (
          <div className="banner-weapon">
            <WeaponIcon weapon={weapon} size="sm" />
            <span>
              <span className="banner-weapon-name">{weapon.name}</span>
              <span className="banner-weapon-type">Signature weapon banner</span>
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

function SelectorBanner({
  banner,
  options,
  onOpenBuild,
}: {
  banner: Banner;
  options: Character[];
  onOpenBuild: (id: string) => void;
}) {
  return (
    <section className="banner-selector" aria-label={banner.name}>
      <div className="banner-selector-head">
        <div>
          <h3 className="panel-title">{banner.name}</h3>
          <p className="muted tiny">Pick one returning resonator</p>
        </div>
        {banner.end && (
          <span className="banner-until">
            Until {formatDate(banner.end)}, {timeLeft(banner.end)}
          </span>
        )}
      </div>
      <div className="banner-tiles">
        {options.map((character) => (
          <article
            key={character.id}
            className={`banner-tile ${elementClass(character.element)}`}
          >
            <BannerArt character={character} />
            <button
              type="button"
              className="banner-tile-link"
              onClick={() => onOpenBuild(character.id)}
              aria-label={`Plan ${character.name}'s build`}
            />
            <div className="banner-tile-copy">
              <span className="banner-tile-name">{character.name}</span>
              <span className="banner-meta">
                <span className="banner-element">{character.element}</span>
                <span>{character.weaponType}</span>
              </span>
            </div>
            <OwnedToggle character={character} variant="compact" />
          </article>
        ))}
      </div>
    </section>
  );
}

export default function BannersView({ onOpenBuild }: Props) {
  const phase = bannerPhase;
  const fourStars = resolve(phase.fourStarCharacterIds);
  const fourStarWeapons = phase.fourStarWeaponIds
    .map((id) => weaponsById.get(id))
    .filter((weapon) => weapon !== undefined);
  const over = daysUntil(phase.end) < 0;

  const featured = phase.banners
    .map((banner) => ({ banner, characters: resolve(banner.characterIds) }))
    .filter(({ characters }) => characters.length > 0);
  const singles = featured.filter(({ characters }) => characters.length === 1);
  const selectors = featured.filter(({ characters }) => characters.length > 1);

  return (
    <main className="index-view banners-view" id="main">
      <header className="banners-head">
        <div>
          <h2 className="panel-title">
            Version {phase.version}, {phase.phase}
          </h2>
          <p className="muted tiny">
            {formatDate(phase.start)} to {formatDate(phase.end)},{' '}
            {phase.endTime}
          </p>
        </div>
        <span className={over ? 'banner-countdown over' : 'banner-countdown'}>
          {over
            ? 'This phase is over. Banner data needs an update.'
            : timeLeft(phase.end)}
        </span>
      </header>

      <div className="banner-heroes">
        {singles.map(({ banner, characters }) => (
          <FeaturedBanner
            key={banner.id}
            banner={banner}
            character={characters[0]}
            onOpenBuild={onOpenBuild}
          />
        ))}
      </div>

      {selectors.map(({ banner, characters }) => (
        <SelectorBanner
          key={banner.id}
          banner={banner}
          options={characters}
          onOpenBuild={onOpenBuild}
        />
      ))}

      {(fourStars.length > 0 || fourStarWeapons.length > 0) && (
        <section className="panel banner-four-panel">
          <div className="panel-head">
            <div>
              <h2 className="panel-title">Featured 4-stars</h2>
              <p className="muted tiny">
                Boosted on every limited banner this phase
              </p>
            </div>
          </div>
          <div className="banner-four-stars">
            {fourStars.map((character) => (
              <button
                type="button"
                key={character.id}
                className={`banner-four-star ${elementClass(character.element)}`}
                onClick={() => onOpenBuild(character.id)}
                title={`Plan ${character.name}'s build`}
              >
                <CharacterAvatar character={character} size="md" />
                <span>{character.name}</span>
              </button>
            ))}
            {fourStarWeapons.map((weapon) => (
              <span key={weapon.id} className="banner-four-star">
                <WeaponIcon weapon={weapon} size="sm" />
                <span>{weapon.name}</span>
              </span>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
