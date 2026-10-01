import { useEffect, useState } from 'react';
import type { Update } from '@tauri-apps/plugin-updater';
import { isDesktop } from '../lib/storage';

type Status = 'idle' | 'available' | 'installing' | 'error';

/**
 * Desktop only: checks the GitHub release feed once on startup and offers to
 * install a newer version. Failures (offline, no release yet) stay silent.
 */
export default function UpdateBanner() {
  const [update, setUpdate] = useState<Update | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState<number | null>(null);

  useEffect(() => {
    if (!isDesktop()) return;
    let cancelled = false;
    (async () => {
      try {
        const { check } = await import('@tauri-apps/plugin-updater');
        const found = await check();
        if (!cancelled && found) {
          setUpdate(found);
          setStatus('available');
        }
      } catch (error) {
        console.warn('Update check failed', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!update || status === 'idle') return null;

  async function install() {
    if (!update) return;
    setStatus('installing');
    let total = 0;
    let received = 0;
    try {
      await update.downloadAndInstall((event) => {
        if (event.event === 'Started') {
          total = event.data.contentLength ?? 0;
        } else if (event.event === 'Progress') {
          received += event.data.chunkLength;
          if (total > 0) setProgress(Math.round((received / total) * 100));
        }
      });
      const { relaunch } = await import('@tauri-apps/plugin-process');
      await relaunch();
    } catch (error) {
      console.error('Update failed', error);
      setStatus('error');
    }
  }

  return (
    <div className="update-banner" role="status">
      <span>
        {status === 'error'
          ? 'Update failed. Please try again later.'
          : status === 'installing'
            ? `Installing version ${update.version}${progress !== null ? ` (${progress}%)` : ''}…`
            : `Version ${update.version} is available (you have ${update.currentVersion}).`}
      </span>
      {status === 'available' && (
        <div className="update-actions">
          <button type="button" className="primary-button" onClick={install}>
            Update now
          </button>
          <button
            type="button"
            className="ghost-button"
            onClick={() => setStatus('idle')}
          >
            Later
          </button>
        </div>
      )}
    </div>
  );
}
