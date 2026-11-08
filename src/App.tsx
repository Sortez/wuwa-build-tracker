import { useState } from 'react';
import { version } from '../package.json';
import { characters } from './data';
import { AppProvider, useApp } from './state';
import BackupControls from './components/BackupControls';
import CharacterView from './components/CharacterView';
import Roster from './components/Roster';
import TeamsView from './components/TeamsView';
import UpdateBanner from './components/UpdateBanner';

type Tab = 'roster' | 'teams';

function Shell() {
  const { resetAll, ownedIds, state } = useApp();
  const [tab, setTab] = useState<Tab>('roster');
  const [selectedId, setSelectedId] = useState(characters[0]?.id ?? '');

  const selected =
    characters.find((character) => character.id === selectedId) ??
    characters[0];

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">W<span>/</span></span>
          <div>
            <h1>WuWa<span className="brand-divider"> / </span><span className="brand-caption">Build Tracker</span></h1>
            <p className="subtitle">WUTHERING WAVES · YOUR PERSONAL FIELD GUIDE</p>
          </div>
        </div>
        <div className="header-actions">
          <BackupControls />
          <button
            type="button"
            className="danger-button"
            onClick={() => {
              if (window.confirm('Reset all tracked progress? This cannot be undone.')) resetAll();
            }}
          >
            Reset progress
          </button>
        </div>
      </header>

      <div className="workspace-bar">
          <nav className="tabs" aria-label="Workspace">
            <button
              type="button"
              className={tab === 'roster' ? 'tab active' : 'tab'}
              aria-current={tab === 'roster' ? 'page' : undefined}
              onClick={() => setTab('roster')}
            >
              <span className="tab-index">01</span> Resonators
            </button>
            <button
              type="button"
              className={tab === 'teams' ? 'tab active' : 'tab'}
              aria-current={tab === 'teams' ? 'page' : undefined}
              onClick={() => setTab('teams')}
            >
              <span className="tab-index">02</span> Teams
            </button>
          </nav>
          <div className="workspace-stats">
            <span><strong>{ownedIds.size}</strong> / {characters.length} collected</span>
            <span><strong>{state.myTeams.length}</strong> saved teams</span>
          </div>
      </div>

      <UpdateBanner />

      <div className="app-main">
        {tab === 'roster' ? (
          <div className="roster-layout">
            <Roster selectedId={selected?.id ?? ''} onSelect={setSelectedId} />
            {selected && <CharacterView character={selected} />}
          </div>
        ) : (
          <TeamsView />
        )}
      </div>

      <footer className="app-footer muted tiny">
        WuWa Build Tracker v{version} · Unofficial fan project, not affiliated
        with Kuro Games. Game names and images belong to their respective
        owners.
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
