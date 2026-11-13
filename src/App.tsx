import { useState } from 'react';
import { version } from '../package.json';
import { characters, weapons } from './data';
import { AppProvider, useApp } from './state';
import BackupControls from './components/BackupControls';
import CharactersIndexView from './components/CharactersIndexView';
import CharacterView from './components/CharacterView';
import Roster from './components/Roster';
import TeamsView from './components/TeamsView';
import UpdateBanner from './components/UpdateBanner';
import WeaponsView from './components/WeaponsView';

type Tab = 'roster' | 'characters' | 'weapons' | 'teams';

function OrbitalMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 32 32" width="24" height="24">
        <ellipse
          cx="16"
          cy="16"
          rx="13"
          ry="5.5"
          transform="rotate(-24 16 16)"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeWidth="1.4"
        />
        <circle
          cx="16"
          cy="16"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.22"
          strokeWidth="1"
        />
        <path
          d="M6.5 18.5c2.6 0 3.4-5.8 6.1-5.8s3.2 5.8 5.9 5.8 3.2-5.8 6-5.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.1"
          strokeLinecap="round"
        />
        <circle cx="25.5" cy="9.5" r="1.6" fill="currentColor" />
      </svg>
    </span>
  );
}

function Shell() {
  const { resetAll, ownedIds, state } = useApp();
  const [tab, setTab] = useState<Tab>('roster');
  const [selectedId, setSelectedId] = useState(characters[0]?.id ?? '');

  const selected =
    characters.find((character) => character.id === selectedId) ??
    characters[0];

  const openCharacterBuild = (id: string) => {
    setSelectedId(id);
    setTab('roster');
  };

  return (
    <div className="app">
      <div className="space-backdrop" aria-hidden="true">
        <div className="space-stars" />
        <div className="space-nebula space-nebula-1" />
        <div className="space-nebula space-nebula-2" />
      </div>

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="app-header">
        <div className="brand">
          <OrbitalMark />
          <div className="brand-text">
            <h1>
              WuWa <span className="brand-caption">Build Tracker</span>
            </h1>
            <p className="subtitle">Resonator &amp; Echo Planner</p>
          </div>
        </div>

        <nav className="tabs" aria-label="Workspace">
          <button
            type="button"
            className={tab === 'roster' ? 'tab active' : 'tab'}
            aria-current={tab === 'roster' ? 'page' : undefined}
            onClick={() => setTab('roster')}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <circle
                cx="8"
                cy="5.5"
                r="2.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              />
              <path
                d="M3.2 13.4a4.8 4.8 0 0 1 9.6 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
            <span>Resonators</span>
            <span className="tab-pill">
              {ownedIds.size}/{characters.length}
            </span>
          </button>
          <button
            type="button"
            className={tab === 'characters' ? 'tab active' : 'tab'}
            aria-current={tab === 'characters' ? 'page' : undefined}
            onClick={() => setTab('characters')}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M3 3.2h10v9.6H3z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 6.2h5M5.5 8.8h5M5.5 11.2h3"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            </svg>
            <span>Character Index</span>
            <span className="tab-pill">{characters.length}</span>
          </button>
          <button
            type="button"
            className={tab === 'weapons' ? 'tab active' : 'tab'}
            aria-current={tab === 'weapons' ? 'page' : undefined}
            onClick={() => setTab('weapons')}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M12.8 3.2 6.8 9.2M10.4 3.2h2.4v2.4M5 8.5l2.5 2.5M4.4 10.6 3.2 12.8l2.2-1.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.35"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Weapon Index</span>
            <span className="tab-pill">{weapons.length}</span>
          </button>
          <button
            type="button"
            className={tab === 'teams' ? 'tab active' : 'tab'}
            aria-current={tab === 'teams' ? 'page' : undefined}
            onClick={() => setTab('teams')}
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <circle
                cx="8"
                cy="8"
                r="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeDasharray="2.5 2"
              />
              <circle cx="8" cy="4.2" r="1.5" fill="currentColor" />
              <circle cx="4.6" cy="10.4" r="1.5" fill="currentColor" />
              <circle cx="11.4" cy="10.4" r="1.5" fill="currentColor" />
            </svg>
            <span>Teams</span>
            <span className="tab-pill">{state.myTeams.length}</span>
          </button>
        </nav>

        <div className="header-actions">
          <BackupControls />
          <button
            type="button"
            className="danger-button"
            onClick={() => {
              if (
                window.confirm(
                  'Reset all tracked progress? This cannot be undone.',
                )
              ) {
                resetAll();
              }
            }}
          >
            Reset
          </button>
        </div>
      </header>

      <UpdateBanner />

      <div className="app-main">
        {tab === 'roster' && (
          <div className="roster-layout">
            <Roster selectedId={selected?.id ?? ''} onSelect={setSelectedId} />
            {selected && <CharacterView character={selected} />}
          </div>
        )}
        {tab === 'characters' && (
          <CharactersIndexView onOpenBuild={openCharacterBuild} />
        )}
        {tab === 'weapons' && (
          <WeaponsView onSelectCharacter={openCharacterBuild} />
        )}
        {tab === 'teams' && <TeamsView />}
      </div>

      <footer className="app-footer muted tiny">
        <span>WuWa Build Tracker v{version}</span>
        <span>
          Unofficial fan project, not affiliated with Kuro Games. Game names and
          images belong to their respective owners.
        </span>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
