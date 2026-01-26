import { useState } from 'react';
import styles from './AgentPage.module.css';
import Navbar from '../Components/Navbar';
import { Sparkles, ChevronDown, Cpu, Check, Lock, PenLine, Globe, SwatchBook, BrainCog } from 'lucide-react';

function AgentPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className={styles.container}>
      <Navbar />

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
            />
            <span className={styles.inputIcon}>
              <PenLine size={20} />
            </span>
          </div>

          <div className={styles.workflowRow}>
            <span className={styles.workflowLabel}>Intent</span>
            <input
              type="text"
              className={styles.workflowInput}
              placeholder="Describe what your site should achieve and who it's for..."
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

            <button className={styles.createBtn}>
              <Sparkles size={16} />
              Start Audit
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className={styles.helpSection}>
          <span className={styles.helpText}>Need Inspiration?</span>
          <span className={styles.helpIcon}><Globe size={20} /></span>
          <a href="#" className={styles.helpLink}>Browse intent templates</a>
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
