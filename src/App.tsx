import { useState } from 'react';
import { version } from '../package.json';
import { characters } from './data';
import { AppProvider, useApp } from './state';
import CharacterView from './components/CharacterView';
import Roster from './components/Roster';
import TeamsView from './components/TeamsView';
import UpdateBanner from './components/UpdateBanner';

type Tab = 'roster' | 'teams';

function Shell() {
  const { resetAll } = useApp();
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
        <div>
          <h1>WuWa Build Tracker</h1>
          <p className="subtitle">
            Track levels, skills, gear and teams.
          </p>
        </div>
        <div className="header-actions">
          <nav className="tabs">
            <button
              type="button"
              className={tab === 'roster' ? 'tab active' : 'tab'}
              onClick={() => setTab('roster')}
            >
              Characters
            </button>
            <button
              type="button"
              className={tab === 'teams' ? 'tab active' : 'tab'}
              onClick={() => setTab('teams')}
            >
              Teams
            </button>
          </nav>
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
            Reset progress
          </button>
        </div>
      </header>

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
