import { useState, useEffect } from 'react';
import AuthNavbar from '../Components/Navbar/AuthNavbar';
import styles from './SettingsPage.module.css';
import { Key, Eye, EyeOff, Save, CheckCircle2, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [hasExistingKey, setHasExistingKey] = useState(false);
  const [status, setStatus] = useState(null); // 'saved' | 'error' | null
  const [isSaving, setIsSaving] = useState(false);

  const isElectron = !!window.electronAPI?.isElectron;

  useEffect(() => {
    if (!isElectron) return;
    window.electronAPI.getApiKey().then(key => {
      setHasExistingKey(!!key);
    });
  }, [isElectron]);

  const handleSave = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    setIsSaving(true);
    setStatus(null);
    try {
      await window.electronAPI.setApiKey(trimmed);
      setHasExistingKey(true);
      setApiKey('');
      setStatus('saved');
    } catch {
      setStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
  };

  if (!isElectron) {
    return (
      <div className={styles.container}>
        <AuthNavbar />
        <main className={styles.main}>
          <div className={styles.card}>
            <div className={styles.webFallback}>
              <AlertCircle size={32} className={styles.webFallbackIcon} />
              <h2 className={styles.webFallbackTitle}>Desktop app only</h2>
              <p className={styles.webFallbackText}>
                API key management is handled through the desktop app. In the web
                deployment, set <code className={styles.code}>GEMINI_API_KEY</code> in{' '}
                <code className={styles.code}>backend/.env</code>.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AuthNavbar />

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Configure your API keys for the AI audit engine</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <Key size={18} />
            </div>
            <div>
              <h2 className={styles.cardTitle}>Gemini API Key</h2>
              <p className={styles.cardDesc}>Used by the browser-use agent to analyse pages</p>
            </div>
            <div className={`${styles.keyStatus} ${hasExistingKey ? styles.keyStatusOk : styles.keyStatusMissing}`}>
              {hasExistingKey ? (
                <><CheckCircle2 size={13} /> Configured</>
              ) : (
                <><AlertCircle size={13} /> Not set</>
              )}
            </div>
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.inputWrapper}>
              <input
                type={showKey ? 'text' : 'password'}
                className={styles.input}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={hasExistingKey ? 'Enter a new key to replace the current one' : 'AIza...'}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowKey(v => !v)}
                tabIndex={-1}
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!apiKey.trim() || isSaving}
            >
              {isSaving ? (
                <><RefreshCw size={15} className={styles.spinIcon} /> Saving…</>
              ) : (
                <><Save size={15} /> Save Key</>
              )}
            </button>
          </div>

          {status === 'saved' && (
            <div className={styles.statusSaved}>
              <CheckCircle2 size={14} />
              Key saved. The backend has restarted with the new key.
            </div>
          )}
          {status === 'error' && (
            <div className={styles.statusError}>
              <AlertCircle size={14} />
              Failed to save key. Check the Electron console for details.
            </div>
          )}

          <div className={styles.hint}>
            <span>Don't have a key?</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.hintLink}
            >
              Get one free from Google AI Studio
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className={styles.infoCard}>
          <p className={styles.infoText}>
            The key is stored in your local app data using <strong>electron-store</strong> and is
            never written to disk in plain text. It is injected into the backend process as an
            environment variable each time QAI starts.
          </p>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
