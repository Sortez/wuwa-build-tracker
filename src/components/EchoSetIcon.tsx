import { useEffect, useMemo, useState } from 'react';
import type { EchoSet } from '../types';

interface Props {
  echoSet: EchoSet | null;
  size?: 'sm' | 'md' | 'lg';
}

const EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg'];

export default function EchoSetIcon({ echoSet, size = 'md' }: Props) {
  const candidates = useMemo(
    () =>
      echoSet
        ? EXTENSIONS.map((extension) => `/echoes/${echoSet.id}.${extension}`)
        : [],
    [echoSet?.id],
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [echoSet?.id]);

  const src = candidates[index];

  if (!echoSet || !src) {
    return (
      <span className={`item-icon item-icon-${size} item-icon-empty`}>
        <span className="item-icon-fallback" aria-hidden="true">
          {echoSet ? echoSet.name[0] : '?'}
        </span>
      </span>
    );
  }

  return (
    <span className={`item-icon item-icon-${size}`} title={echoSet.name}>
      <img
        src={src}
        alt={echoSet.name}
        loading="lazy"
        onError={() => setIndex((current) => current + 1)}
      />
    </span>
  );
}
