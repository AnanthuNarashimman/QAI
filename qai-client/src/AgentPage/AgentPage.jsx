import styles from './AgentPage.module.css';

function AgentPage() {
  const companyLogos = [
    { name: 'mapka', type: 'text' },
    { name: 'sendpilot', type: 'text', bold: true },
    { name: 'DINCER', type: 'dincer' },
    { name: 'doyO', type: 'text', script: true },
    { name: 'sigma', type: 'sigma' },
    { name: 'castra', type: 'text', bold: true },
    { name: 'FRONTWALKER', type: 'text', light: true },
  ];

  const categories = [
    { name: 'Featured', active: true },
    { name: 'Marketing', active: false },
    { name: 'Sales', active: false },
    { name: 'Development', active: false },
    { name: 'Research', active: false },
    { name: 'Productivity', active: false },
  ];

  return (
    <div className={styles.container}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <div className={styles.logo}>
            <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#059669"/>
              <path d="M2 17L12 22L22 17" stroke="#059669" strokeWidth="2"/>
              <path d="M2 12L12 17L22 12" stroke="#059669" strokeWidth="2"/>
            </svg>
            <span className={styles.logoText}>incredible</span>
          </div>
          <span className={styles.earlyAccess}>EARLY ACCESS</span>
        </div>

        <div className={styles.navCenter}>
          <button className={`${styles.navTab} ${styles.navTabActive}`}>
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            Workspace
          </button>
          <button className={styles.navTab}>
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/>
            </svg>
            Templates
          </button>
          <button className={styles.navTab}>
            <svg className={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
            </svg>
            Community
          </button>
        </div>

        <div className={styles.navRight}>
          <a href="#" className={styles.websiteLink}>
            Website
            <svg className={styles.externalIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </a>
          <button className={styles.getStartedBtn}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroTitle}>
            <span className={styles.orangeDot}></span>
            <h1>Let Incredible do your repetitive work</h1>
          </div>
          <p className={styles.heroSubtitle}>
            Describe what should happen automatically across your tools.
          </p>
        </div>

        {/* Workflow Builder Card */}
        <div className={styles.workflowCard}>
          <div className={styles.workflowRow}>
            <span className={styles.workflowLabel}>When</span>
            <input
              type="text"
              className={styles.workflowInput}
              defaultValue="a Stripe payment succeeds"
              readOnly
            />
            <button className={styles.editBtn}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          </div>

          <div className={styles.workflowRow}>
            <span className={styles.automaticallyLabel}>Automatically →</span>
            <input
              type="text"
              className={styles.workflowInput}
              defaultValue="log it in Google Sheets and send a receipt"
              readOnly
            />
            <button className={styles.editBtn}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </button>
          </div>

          <div className={styles.workflowActions}>
            <button className={styles.integrationsBtn}>
              <div className={styles.integrationIcons}>
                <span className={styles.integrationIcon} style={{backgroundColor: '#34A853'}}>+</span>
                <span className={styles.integrationIcon} style={{backgroundColor: '#4285F4'}}>
                  <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </span>
                <span className={styles.integrationIcon} style={{backgroundColor: '#0066FF'}}>
                  <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
                    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </span>
              </div>
              Integrations
            </button>

            <button className={styles.triggerBtn}>
              <svg className={styles.triggerIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
              </svg>
              When something happens
              <svg className={styles.chevronDown} viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </button>

            <button className={styles.createBtn}>
              <svg className={styles.sparkleIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2z"/>
              </svg>
              Create
            </button>
          </div>
        </div>

        {/* Help Section */}
        <div className={styles.helpSection}>
          <span className={styles.helpText}>Not sure where to start?</span>
          <span className={styles.helpIcon}>⌘</span>
          <a href="#" className={styles.helpLink}>Browse templates</a>
          <span className={styles.helpOr}>or</span>
          <span className={styles.helpIcon}>✨</span>
          <a href="#" className={styles.helpLink}>help me find a use-case</a>
        </div>

        {/* Trusted By Section */}
        <div className={styles.trustedSection}>
          <p className={styles.trustedTitle}>
            TRUSTED BY <span className={styles.trustedHighlight}>INCREDIBLE</span> COMPANIES
          </p>
          <div className={styles.logoGrid}>
            <span className={styles.companyLogo}>
              <span className={styles.logoPrefix}>◎</span>mapka
            </span>
            <span className={`${styles.companyLogo} ${styles.bold}`}>sendpilot</span>
            <span className={styles.companyLogo}>
              <svg className={styles.dincerArrow} viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className={styles.dincerText}>
                DINCER<br/>
                <span className={styles.dincerSub}>TECHNOLOGY</span>
              </span>
            </span>
            <span className={`${styles.companyLogo} ${styles.script}`}>doy<span className={styles.doyO}>O</span></span>
            <span className={styles.companyLogo}>
              <span className={styles.sigmaPlus}>+</span>
              <span className={styles.sigmaText}>sigma</span>
              <span className={styles.sigmaSub}>Design + Music</span>
            </span>
            <span className={`${styles.companyLogo} ${styles.bold}`}>castra</span>
            <span className={`${styles.companyLogo} ${styles.light}`}>FRONTWALKER</span>
          </div>
        </div>

        {/* Categories Section */}
        <div className={styles.categoriesSection}>
          <div className={styles.categoriesLeft}></div>
          <div className={styles.categoriesCenter}>
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`${styles.categoryBtn} ${cat.active ? styles.categoryActive : ''}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          <a href="#" className={styles.discoverMore}>
            Discover More
            <svg className={styles.arrowRight} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
            </svg>
          </a>
        </div>

        {/* Template Cards Preview */}
        <div className={styles.templateCardsPreview}>
          <div className={styles.templateCard}></div>
          <div className={styles.templateCard}></div>
          <div className={styles.templateCard}></div>
          <div className={styles.templateCard}></div>
        </div>
      </main>
    </div>
  );
}

export default AgentPage;
