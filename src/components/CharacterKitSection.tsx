import { useState } from 'react';
import type { CharacterKit } from '../types';

interface Props {
  kit?: CharacterKit;
  /** Optional section filter mode. */
  defaultTab?: 'both' | 'skills' | 'sequences';
  /** Compact toggles whether section header controls are shown inline. */
  compact?: boolean;
}

type KitFilter = 'both' | 'skills' | 'sequences';

function FormattedDescription({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="kit-desc">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="kit-spacer" />;
        if (trimmed.startsWith('## ')) {
          return (
            <h5 key={index} className="skill-subheading">
              {trimmed.slice(3)}
            </h5>
          );
        }
        return <p key={index}>{trimmed}</p>;
      })}
    </div>
  );
}

export default function CharacterKitSection({
  kit,
  defaultTab = 'both',
  compact = false,
}: Props) {
  const [section, setSection] = useState<KitFilter>(defaultTab);
  const [activeSkillIndex, setActiveSkillIndex] = useState(0);

  if (!kit || (kit.skills.length === 0 && kit.sequences.length === 0)) {
    return (
      <section className="panel">
        <p className="muted small">
          Skill and sequence details are not available for this resonator yet.
        </p>
      </section>
    );
  }

  const showSkills = section === 'both' || section === 'skills';
  const showSequences = section === 'both' || section === 'sequences';
  const safeSkillIndex =
    activeSkillIndex < kit.skills.length ? activeSkillIndex : 0;
  const activeSkill = kit.skills[safeSkillIndex];

  return (
    <div className="kit-wrapper">
      <div className="kit-toolbar">
        <div
          className="segmented-filter kit-section-tabs"
          role="group"
          aria-label="Kit section"
        >
          {(
            [
              { id: 'both', label: 'All' },
              { id: 'skills', label: `Skills (${kit.skills.length})` },
              {
                id: 'sequences',
                label: `Sequences (${kit.sequences.length})`,
              },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              className={`seg-btn${section === option.id ? ' active' : ''}`}
              aria-pressed={section === option.id}
              onClick={() => setSection(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {showSkills && kit.skills.length > 0 && (
        <section className="panel kit-panel">
          <div className="panel-head">
            <h3 className="panel-title">Skills &amp; Passives</h3>
            <span className="muted tiny">
              {kit.skills.length} abilities
            </span>
          </div>

          {compact ? (
            <div className="kit-skill-tabs-layout">
              <div
                className="kit-skill-pills"
                role="tablist"
                aria-label="Character skills"
              >
                {kit.skills.map((skill, index) => (
                  <button
                    key={`${skill.name}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={safeSkillIndex === index}
                    className={`kit-skill-pill${
                      safeSkillIndex === index ? ' active' : ''
                    }`}
                    onClick={() => setActiveSkillIndex(index)}
                  >
                    <span className="kit-skill-pill-type">{skill.type}</span>
                    <span className="kit-skill-pill-name">{skill.name}</span>
                  </button>
                ))}
              </div>
              {activeSkill && (
                <article className="kit-skill-card kit-skill-card-featured">
                  <header className="kit-skill-head">
                    <span className="kit-type-badge">{activeSkill.type}</span>
                    <h4>{activeSkill.name}</h4>
                  </header>
                  <FormattedDescription text={activeSkill.description} />
                </article>
              )}
            </div>
          ) : (
            <div className="kit-skill-grid">
              {kit.skills.map((skill, index) => (
                <article
                  key={`${skill.name}-${index}`}
                  className="kit-skill-card"
                >
                  <header className="kit-skill-head">
                    <span className="kit-type-badge">{skill.type}</span>
                    <h4>{skill.name}</h4>
                  </header>
                  <FormattedDescription text={skill.description} />
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {showSequences && kit.sequences.length > 0 && (
        <section className="panel kit-panel">
          <div className="panel-head">
            <h3 className="panel-title">Resonance Chain</h3>
            <span className="muted tiny">Sequences S1 &ndash; S6</span>
          </div>

          <div className="sequence-grid">
            {kit.sequences.map((seq) => (
              <article key={seq.index} className="sequence-card">
                <header className="sequence-head">
                  <span className="sequence-badge">S{seq.index}</span>
                  <h4>{seq.name}</h4>
                </header>
                <FormattedDescription text={seq.description} />
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
