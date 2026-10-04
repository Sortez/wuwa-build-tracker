import { builds, echoSets, echoSetsById, weapons, weaponsById } from '../data';
import { rarityClass, stars } from '../lib/format';
import type { Character, CharacterProgress } from '../types';
import EchoSetIcon from './EchoSetIcon';
import IconSelect, { type IconOption } from './IconSelect';
import WeaponIcon from './WeaponIcon';

interface Props {
  character: Character;
  progress: CharacterProgress;
  onChange: (patch: Partial<CharacterProgress>) => void;
}

const WEAPON_SLOTS = [0, 1, 2] as const;
const ECHO_SLOTS = [0, 1] as const;

const WEAPON_LABELS = ['Primary (BiS)', 'Alternative', '4-star option'] as const;

const sortedWeapons = [...weapons].sort(
  (a, b) => b.rarity - a.rarity || a.name.localeCompare(b.name),
);
const sortedEchoSets = [...echoSets].sort((a, b) =>
  a.name.localeCompare(b.name),
);

export default function GearPanel({ character, progress, onChange }: Props) {
  const compatibleWeapons = sortedWeapons.filter(
    (weapon) => weapon.type === character.weaponType,
  );

  const weaponOptions: IconOption[] = compatibleWeapons.map((weapon) => ({
    id: weapon.id,
    label: weapon.name,
    meta: (
      <span className={`stars ${rarityClass(weapon.rarity)}`}>
        {stars(weapon.rarity)}
      </span>
    ),
    icon: <WeaponIcon weapon={weapon} size="md" />,
  }));

  const echoSetOptions: IconOption[] = sortedEchoSets.map((echoSet) => ({
    id: echoSet.id,
    label: echoSet.name,
    icon: <EchoSetIcon echoSet={echoSet} size="md" />,
  }));

  const setWeapon = (index: number, id: string | null) => {
    const next = [...progress.recommendedWeaponIds];
    next[index] = id;
    onChange({
      recommendedWeaponIds: [
        next[0] ?? null,
        next[1] ?? null,
        next[2] ?? null,
      ],
    });
  };

  const setEchoSet = (index: number, id: string | null) => {
    const next = [...progress.recommendedEchoSetIds];
    next[index] = id;
    onChange({ recommendedEchoSetIds: [next[0] ?? null, next[1] ?? null] });
  };

  const primaryEchoId = progress.recommendedEchoSetIds[0];
  const primaryEchoSet = primaryEchoId
    ? echoSetsById.get(primaryEchoId) ?? null
    : null;

  const build = builds[character.id];
  // Substats are a priority-ordered string; some entries miss the comma
  // between stats ("Energy Regen (18.3%) ATK (25.8%)"), so also split there.
  const substats = (build?.substats ?? '')
    .split(/,\s*|(?<=\))\s+(?=[A-Z])/)
    .map((stat) => stat.trim())
    .filter(Boolean);

  const applyRecommended = () => {
    if (!build) return;
    onChange({
      recommendedWeaponIds: [
        build.weaponIds[0] ?? null,
        build.weaponIds[1] ?? null,
        build.fourStarWeaponId ?? null,
      ],
      recommendedEchoSetIds: [
        build.echoSetIds[0] ?? null,
        build.echoSetIds[1] ?? null,
      ],
      mainEcho: build.mainEcho ?? progress.mainEcho,
      autoFilled: true,
    });
  };

  return (
    <section className="panel">
      <div className="panel-head gear-head">
        <h3 className="panel-title">Weapon &amp; Echoes</h3>
        {build && (
          <button
            type="button"
            className="ghost-button"
            onClick={applyRecommended}
          >
            Use recommended
          </button>
        )}
      </div>

      <div className="gear-block">
        <h4 className="section-subtitle">Recommended weapons</h4>
        <div className="gear-slots weapon-slots">
          {WEAPON_SLOTS.map((index) => {
            const weaponId = progress.recommendedWeaponIds[index] ?? null;
            const weapon = weaponId ? weaponsById.get(weaponId) ?? null : null;
            return (
              <div key={index} className="gear-slot">
                <span className="field-label tiny">
                  {WEAPON_LABELS[index]}
                </span>
                <IconSelect
                  options={weaponOptions}
                  value={weaponId}
                  onChange={(id) => setWeapon(index, id)}
                  ariaLabel="Weapon"
                />
                {weapon?.passive && (
                  <p className="muted small weapon-passive">{weapon.passive}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="gear-block">
        <h4 className="section-subtitle">Recommended echo sets</h4>
        <div className="gear-slots">
          {ECHO_SLOTS.map((index) => (
            <div key={index} className="gear-slot">
              <span className="field-label tiny">
                {index === 0 ? 'Primary (BiS)' : 'Alternative'}
              </span>
              <IconSelect
                options={echoSetOptions}
                value={progress.recommendedEchoSetIds[index] ?? null}
                onChange={(id) => setEchoSet(index, id)}
                ariaLabel="Echo set"
              />
            </div>
          ))}
        </div>

        {primaryEchoSet && (
          <div className="echo-detail">
            <p>
              <strong>{primaryEchoSet.name}</strong>
            </p>
            <p>
              <strong>2pc:</strong> {primaryEchoSet.twoPiece}
            </p>
            <p>
              <strong>5pc:</strong> {primaryEchoSet.fivePiece}
            </p>
          </div>
        )}

        {substats.length > 0 && (
          <>
            <h4 className="section-subtitle">Recommended substats</h4>
            <ol className="substat-list">
              {substats.map((stat, index) => (
                <li key={index} className="substat-chip">
                  <span className="substat-rank">{index + 1}</span>
                  {stat}
                </li>
              ))}
            </ol>
          </>
        )}

        <label className="select-field">
          <span className="field-label tiny">Main echo</span>
          <input
            type="text"
            value={progress.mainEcho ?? ''}
            placeholder="e.g. Jué"
            onChange={(event) =>
              onChange({ mainEcho: event.target.value || null })
            }
          />
        </label>
      </div>
    </section>
  );
}
