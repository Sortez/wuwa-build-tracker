import {
  ECHO_COSTS,
  emptyEcho,
  emptyEchoBuild,
  formatSubstatValue,
  MAIN_STATS,
  mainStatLabel,
  MAX_ECHO_COST,
  parseRecommendedSubstats,
  SUBSTATS,
  substatsById,
  substatTotals,
  totalEchoCost,
} from '../lib/echoStats';
import type { EchoCost, EchoSubstat, TrackedEcho } from '../types';

interface Props {
  echoBuild: TrackedEcho[];
  /** The build guide's recommended substat string, if any. */
  recommendedSubstats?: string;
  onChange: (echoBuild: TrackedEcho[]) => void;
}

export default function EchoBuildPanel({
  echoBuild,
  recommendedSubstats,
  onChange,
}: Props) {
  const total = totalEchoCost(echoBuild);
  const totals = substatTotals(echoBuild);
  const targets = new Map<string, number>();
  for (const entry of parseRecommendedSubstats(recommendedSubstats)) {
    if (entry.statId && entry.target !== undefined) {
      targets.set(entry.statId, entry.target);
    }
  }
  const metCount = [...targets].filter(
    ([id, target]) => (totals.get(id) ?? 0) >= target,
  ).length;
  const allMet = targets.size > 0 && metCount === targets.size;
  // Recommended stats first (in guide order), then any other rolled stats.
  const summaryIds = [
    ...targets.keys(),
    ...SUBSTATS.map((def) => def.id).filter(
      (id) => !targets.has(id) && totals.has(id),
    ),
  ];

  const updateEcho = (index: number, patch: Partial<TrackedEcho>) =>
    onChange(
      echoBuild.map((echo, i) => (i === index ? { ...echo, ...patch } : echo)),
    );

  const setCost = (index: number, cost: EchoCost | null) => {
    const { mainStat } = echoBuild[index];
    updateEcho(index, {
      cost,
      mainStat:
        cost && mainStat && MAIN_STATS[cost].includes(mainStat) ? mainStat : null,
    });
  };

  const setSubstat = (
    echoIndex: number,
    subIndex: number,
    patch: Partial<EchoSubstat>,
  ) =>
    updateEcho(echoIndex, {
      substats: echoBuild[echoIndex].substats.map((sub, i) =>
        i === subIndex ? { ...sub, ...patch } : sub,
      ),
    });

  return (
    <section className="panel">
      <div className="panel-head gear-head">
        <h3 className="panel-title">My echo build</h3>
        <div className="echo-build-actions">
          {targets.size > 0 && (
            <span
              className={`echo-goal-badge${allMet ? ' met' : ''}`}
              title="Recommended substat totals reached by your echoes"
            >
              {allMet
                ? '✓ Recommended stats met'
                : `Recommended ${metCount} / ${targets.size}`}
            </span>
          )}
          <span
            className={`echo-cost-total${total > MAX_ECHO_COST ? ' over' : ''}`}
            title={
              total > MAX_ECHO_COST
                ? `Total cost exceeds the limit of ${MAX_ECHO_COST}`
                : undefined
            }
          >
            Cost {total} / {MAX_ECHO_COST}
          </span>
          <button
            type="button"
            className="ghost-button"
            onClick={() => onChange(emptyEchoBuild())}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="echo-cards">
        {echoBuild.map((echo, echoIndex) => {
          const usedStats = new Set(
            echo.substats.map((sub) => sub.stat).filter(Boolean),
          );
          return (
            <div key={echoIndex} className="gear-slot echo-card">
              <div className="echo-card-head">
                <span className="field-label tiny">Echo {echoIndex + 1}</span>
                <button
                  type="button"
                  className="echo-card-clear"
                  onClick={() => updateEcho(echoIndex, emptyEcho())}
                  aria-label={`Clear echo ${echoIndex + 1}`}
                  title="Clear this echo"
                >
                  ×
                </button>
              </div>

              <div className="echo-main-row select-field">
                <select
                  value={echo.cost ?? ''}
                  onChange={(event) =>
                    setCost(
                      echoIndex,
                      event.target.value
                        ? (Number(event.target.value) as EchoCost)
                        : null,
                    )
                  }
                  aria-label="Echo cost"
                >
                  <option value="">Cost…</option>
                  {ECHO_COSTS.map((cost) => (
                    <option key={cost} value={cost}>
                      {cost} Cost
                    </option>
                  ))}
                </select>
                <select
                  value={echo.mainStat ?? ''}
                  disabled={!echo.cost}
                  onChange={(event) =>
                    updateEcho(echoIndex, {
                      mainStat: event.target.value || null,
                    })
                  }
                  aria-label="Main stat"
                >
                  <option value="">Main stat…</option>
                  {echo.cost &&
                    MAIN_STATS[echo.cost].map((stat) => (
                      <option key={stat} value={stat}>
                        {mainStatLabel(echo.cost!, stat)}
                      </option>
                    ))}
                </select>
              </div>

              <span className="field-label tiny">Substats</span>
              <div className="echo-subs">
                {echo.substats.map((sub, subIndex) => {
                  const def = sub.stat ? substatsById.get(sub.stat) : undefined;
                  return (
                    <div key={subIndex} className="echo-sub-row select-field">
                      <select
                        value={sub.stat ?? ''}
                        onChange={(event) =>
                          setSubstat(echoIndex, subIndex, {
                            stat: event.target.value || null,
                            value: null,
                          })
                        }
                        aria-label={`Substat ${subIndex + 1}`}
                      >
                        <option value="">—</option>
                        {SUBSTATS.filter(
                          (option) =>
                            option.id === sub.stat || !usedStats.has(option.id),
                        ).map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <select
                        value={sub.value ?? ''}
                        disabled={!def}
                        onChange={(event) =>
                          setSubstat(echoIndex, subIndex, {
                            value: event.target.value
                              ? Number(event.target.value)
                              : null,
                          })
                        }
                        aria-label={`Substat ${subIndex + 1} value`}
                      >
                        <option value="">—</option>
                        {def?.values.map((value) => (
                          <option key={value} value={value}>
                            {formatSubstatValue(def, value)}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {summaryIds.length > 0 && (
        <div className="gear-block">
          <h4 className="section-subtitle">Substat totals</h4>
          <ul className="substat-list">
            {summaryIds.map((id) => {
              const def = substatsById.get(id)!;
              const current = totals.get(id) ?? 0;
              const target = targets.get(id);
              const met = target !== undefined && current >= target;
              return (
                <li
                  key={id}
                  className={`substat-chip${met ? ' met' : ''}${
                    target === undefined ? ' extra' : ''
                  }`}
                >
                  {met && <span className="substat-rank">✓</span>}
                  {def.label}
                  <span className="substat-progress">
                    {formatSubstatValue(def, current)}
                    {target !== undefined && ` / ${target}%`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
