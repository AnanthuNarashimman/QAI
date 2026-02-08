import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AgentPage.module.css';
import AuthNavbar from '../Components/Navbar/AuthNavbar';
import { Sparkles, ChevronDown, Cpu, Check, Lock, PenLine, Globe, SwatchBook, BrainCog } from 'lucide-react';

function AgentPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [maxPages, setMaxPages] = useState(1);
  const [intent, setIntent] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Prefill intent if coming from ResourcesPage
  useEffect(() => {
    if (location.state?.prefilledIntent) {
      setIntent(location.state.prefilledIntent);
    }
  }, [location.state]);

  const handleStartAudit = () => {
    // Clear previous error
    setError('');

    // Validate inputs
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!intent.trim()) {
      setError('Please describe your site\'s intent');
      return;
    }

    // Navigate to audit page with form data
    navigate('/audit', {
      state: {
        url: url,
        max_pages: maxPages,
        user_intent: intent,
      },
    });
  };

  return (
    <div className={styles.container}>
      <AuthNavbar />

      {/* Hero Section */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroTitle}>
            <BrainCog size={32} className={styles.heroIcon} />
            <h1>Let our Agent audit your website</h1>
          </div>
          <p className={styles.heroSubtitle}>
            Describe your site's goal and watch AI analyze every page for design issues.
          </p>
        </div>

        {/* Workflow Builder Card */}
        <div className={styles.workflowCard}>
          <div className={styles.workflowRow}>
            <span className={styles.workflowLabel}>URL</span>
            <input
              type="text"
              className={styles.workflowInput}
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <span className={styles.inputIcon}>
              <PenLine size={20} />
            </span>
            <span className={styles.fieldDivider}></span>
            <span className={styles.workflowLabel}>Max Pages</span>
            <input
              type="number"
              min="1"
              max="5"
              value={maxPages}
              onChange={(e) => setMaxPages(parseInt(e.target.value) || 1)}
              className={styles.workflowInputCompact}
              placeholder="1-5"
            />
          </div>

          <div className={styles.workflowRow}>
            <span className={styles.workflowLabel}>Intent</span>
            <input
              type="text"
              className={styles.workflowInput}
              placeholder="Describe what your site should achieve and who it's for..."
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
            />
            <span className={styles.inputIcon}>
              <PenLine size={20} />
            </span>
          </div>

          <div className={styles.workflowActions}>
            <div className={styles.modelSelectWrapper}>
              <button
                className={styles.modelSelectBtn}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <Cpu size={16} className={styles.modelIcon} />
                <span>Gemini 3 Pro Preview</span>
                <ChevronDown size={16} className={`${styles.chevronIcon} ${isDropdownOpen ? styles.chevronRotated : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={`${styles.dropdownItem} ${styles.dropdownItemActive}`}>
                    <Cpu size={14} />
                    <span>Gemini 3 Pro Preview</span>
                    <Check size={14} className={styles.checkIcon} />
                  </div>
                  <div className={styles.dropdownDivider}></div>
                  <div className={`${styles.dropdownItem} ${styles.dropdownItemDisabled}`}>
                    <Lock size={14} />
                    <span>Multi-model support coming soon</span>
                  </div>
                </div>
              )}
            </div>

            <button className={styles.createBtn} onClick={handleStartAudit}>
              <Sparkles size={16} />
              Start Audit
            </button>
          </div>

          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className={styles.helpSection}>
          <span className={styles.helpText}>Need Inspiration?</span>
          <span className={styles.helpIcon}><Globe size={20} /></span>
          <button 
            onClick={() => navigate('/resources')} 
            className={styles.helpLink}
          >
            Browse intent templates
          </button>
          <span className={styles.helpOr}>or</span>
          <span className={styles.helpIcon}><SwatchBook size={20}/></span>
          <a href="#" className={styles.helpLink}>View example audits</a>
        </div>

        {/* Trusted By Section */}
        <div className={styles.trustedSection}>
          <p className={styles.trustedTitle}>
            POWERED BY <span className={styles.trustedHighlight}>GEMINI</span> AND <span className={styles.trustedHighlight}>BROWSER-USE</span>
          </p>
        </div>

      </main>
    </div>
  );
}

export default AgentPage;
