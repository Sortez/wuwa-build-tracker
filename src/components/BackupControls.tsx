import { useRef } from 'react';
import { parseBackup, serializeBackup } from '../lib/storage';
import { useApp } from '../state';

// Chromium (and so WebView2 on the desktop) has a native save dialog; other
// browsers fall back to a regular download.
type SaveFilePicker = (options: {
  suggestedName: string;
  types: { description: string; accept: Record<string, string[]> }[];
}) => Promise<{
  createWritable: () => Promise<{
    write: (data: string) => Promise<void>;
    close: () => Promise<void>;
  }>;
}>;

function backupFileName(): string {
  const date = new Date().toISOString().slice(0, 10);
  return `wuwa-build-tracker-backup-${date}.json`;
}

async function saveTextFile(name: string, text: string): Promise<void> {
  const picker = (window as { showSaveFilePicker?: SaveFilePicker })
    .showSaveFilePicker;
  if (picker) {
    const handle = await picker({
      suggestedName: name,
      types: [
        {
          description: 'WuWa Build Tracker backup',
          accept: { 'application/json': ['.json'] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(text);
    await writable.close();
    return;
  }
  const url = URL.createObjectURL(
    new Blob([text], { type: 'application/json' }),
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

export default function BackupControls() {
  const { state, replaceAll } = useApp();
  const fileInput = useRef<HTMLInputElement>(null);

  async function exportBackup() {
    try {
      await saveTextFile(backupFileName(), serializeBackup(state));
    } catch (error) {
      // Closing the save dialog is not an error worth reporting.
      if (error instanceof DOMException && error.name === 'AbortError') return;
      console.error('Backup export failed', error);
      window.alert('Could not save the backup file.');
    }
  }

  async function importBackup(file: File) {
    let next;
    try {
      next = parseBackup(await file.text());
    } catch {
      window.alert('This file is not a WuWa Build Tracker backup.');
      return;
    }
    if (
      window.confirm(
        'Replace all current progress and teams with this backup? This cannot be undone.',
      )
    ) {
      replaceAll(next);
    }
  }

  return (
    <>
      <button type="button" className="ghost-button" onClick={exportBackup}>
        Export backup
      </button>
      <button
        type="button"
        className="ghost-button"
        onClick={() => fileInput.current?.click()}
      >
        Import backup
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".json,application/json"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          // Reset so picking the same file again still fires onChange.
          event.target.value = '';
          if (file) void importBackup(file);
        }}
      />
    </>
  );
}
