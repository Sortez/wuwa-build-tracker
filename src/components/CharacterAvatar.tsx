import { useEffect, useMemo, useState } from 'react';
import { elementClass } from '../lib/format';
import type { Character } from '../types';

interface Props {
  character: Character;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];

function initials(name: string): string {
  return name
    .split(/[\s:]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export default function CharacterAvatar({ character, size = 'md' }: Props) {
  const candidates = useMemo(
    () =>
      character.icon
        ? [character.icon]
        : EXTENSIONS.map((extension) => `/characters/${character.id}.${extension}`),
    [character.id, character.icon],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [character.id, character.icon]);

  const src = candidates[index];
  const showFallback = !src;

  return (
    <span
      className={`avatar avatar-${size} ${elementClass(character.element)}`}
      title={character.name}
    >
      {showFallback ? (
        <span className="avatar-fallback">{initials(character.name)}</span>
      ) : (
        <img
          src={src}
          alt={character.name}
          loading="lazy"
          onError={() => setIndex((current) => current + 1)}
        />
      )}
    </span>
  );
}
