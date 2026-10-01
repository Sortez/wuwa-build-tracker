import { useEffect, useMemo, useState } from 'react';
import type { Weapon } from '../types';

interface Props {
  weapon: Weapon | null;
  size?: 'sm' | 'md' | 'lg';
}

const EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg'];

export default function WeaponIcon({ weapon, size = 'md' }: Props) {
  const candidates = useMemo(
    () =>
      weapon
        ? weapon.icon
          ? [weapon.icon]
          : EXTENSIONS.map((extension) => `/weapons/${weapon.id}.${extension}`)
        : [],
    [weapon?.id, weapon?.icon],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [weapon?.id, weapon?.icon]);

  const src = candidates[index];

  if (!weapon || !src) {
    return (
      <span className={`item-icon item-icon-${size} item-icon-empty`}>
        <span className="item-icon-fallback" aria-hidden="true">
          {weapon ? weapon.name[0] : '?'}
        </span>
      </span>
    );
  }

  return (
    <span className={`item-icon item-icon-${size}`} title={weapon.name}>
      <img
        src={src}
        alt={weapon.name}
        loading="lazy"
        onError={() => setIndex((current) => current + 1)}
      />
    </span>
  );
}
