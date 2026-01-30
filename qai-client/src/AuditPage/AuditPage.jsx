import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './AuditPage.module.css';
import Navbar from '../Components/Navbar';
import { ArrowLeft, Bot, Loader, ExternalLink, Square, CheckCircle2, Globe, Zap, Search, Compass } from 'lucide-react';

// Mock log data to preview the design
const MOCK_LOGS = [
  { message: 'Connecting to server...', type: 'info' },
  { message: 'URL is reachable. Starting analysis...', type: 'success' },
  { message: 'Parsing user intent...', type: 'info' },
  { message: 'Intent parsed successfully', type: 'success' },
  { message: 'Starting BFS Crawler', type: 'info' },
  { message: 'Base URL: https://cubeaisolutions.com', type: 'info' },
  { message: 'Max Pages: 3', type: 'info' },
  { message: 'Analyzing Page 1/3', type: 'progress' },
  { message: 'URL: https://cubeaisolutions.com', type: 'url' },
  { message: 'Extracting navigation links...', type: 'info' },
  { message: 'Step 1: Navigate to https://cubeaisolutions.com', type: 'agent' },
  { message: 'Navigated to https://cubeaisolutions.com', type: 'agent' },
  { message: 'Step 2: Scrolling through all sections', type: 'agent' },
  { message: 'Eval: Successfully navigated. Page content is visible.', type: 'agent' },
  { message: 'Memory: Page loaded. Need to scroll through all sections.', type: 'agent' },
  { message: 'Next goal: Scroll down to reveal all content.', type: 'agent' },
  { message: 'Scrolled down 10 pages', type: 'agent' },
  { message: 'Step 3: Extracting links from page', type: 'agent' },
  { message: 'Eval: Successfully scrolled. Identifying all links.', type: 'agent' },
  { message: 'Extracting all anchor tags with href and text', type: 'agent' },
  { message: 'Found 24 links', type: 'success' },
  { message: 'Added 8 new links to queue', type: 'success' },
  { message: 'Validating CTA and theme...', type: 'info' },
  { message: 'Step 1: Navigate to page for UI/UX audit', type: 'agent' },
  { message: 'Navigated to https://cubeaisolutions.com', type: 'agent' },
  { message: 'Step 2: Analyzing Hero section - viewport 1', type: 'agent' },
  { message: 'Found CTAs: "Get Started", "Learn More"', type: 'agent' },
  { message: 'Checking typography hierarchy and contrast...', type: 'agent' },
  { message: 'Step 3: Analyzing Services section - viewport 2', type: 'agent' },
  { message: 'Found CTAs: "Get Details" x6', type: 'agent' },
  { message: 'Checking icon consistency and spacing...', type: 'agent' },
  { message: 'Page 1 analysis complete', type: 'success' },
  { message: 'Analyzing Page 2/3', type: 'progress' },
  { message: 'URL: https://cubeaisolutions.com/services', type: 'url' },
  { message: 'Extracting navigation links...', type: 'info' },
  { message: 'Step 1: Navigate to services page', type: 'agent' },
  { message: 'Navigated to https://cubeaisolutions.com/services', type: 'agent' },
  { message: 'Step 2: Scrolling through services page', type: 'agent' },
  { message: 'Scrolled down 5 pages', type: 'agent' },
  { message: 'Found 12 links', type: 'success' },
  { message: 'Page 2 analysis complete', type: 'success' },
];

// Helper to pick an icon for progress items
function getProgressIcon(message) {
  if (message.includes('Page 1')) return <Compass size={14} />;
  if (message.includes('Page 2')) return <Search size={14} />;
  return <Globe size={14} />;
}

function AuditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const logsEndRef = useRef(null);

  const auditUrl = location.state?.url || 'https://cubeaisolutions.com';
  const maxPages = location.state?.max_pages || 3;

  // Derive pages analyzed from logs
  const pagesAnalyzed = logs.filter(l => l.type === 'progress').length;

  // Simulate logs streaming in one by one
  useEffect(() => {
    if (isStopped || currentLogIndex >= MOCK_LOGS.length) return;

    const delay = MOCK_LOGS[currentLogIndex].type === 'progress' ? 800 :
                  MOCK_LOGS[currentLogIndex].type === 'agent' ? Math.random() * 250 + 150 :
                  Math.random() * 300 + 100;

    const timer = setTimeout(() => {
      setLogs(prev => [...prev, MOCK_LOGS[currentLogIndex]]);
      setCurrentLogIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentLogIndex, isStopped]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const isRunning = !isStopped && currentLogIndex < MOCK_LOGS.length;
  const progressPercent = maxPages > 0 ? Math.min((pagesAnalyzed / maxPages) * 100, 100) : 0;

  const handleStop = () => {
    setIsStopped(true);
  };

  const isLastLog = (index) => index === logs.length - 1 && isRunning;

  // Group agent logs that appear consecutively under a parent
  const renderLogItem = (log, index) => {
    if (log.type === 'divider') return null;

    const isAgent = log.type === 'agent';
    const isProgress = log.type === 'progress';
    const isUrl = log.type === 'url';
    const isSuccess = log.type === 'success';
    const last = isLastLog(index);

    // Progress items — section card
    if (isProgress) {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={`${styles.timelineDot} ${styles.dotLarge} ${last ? styles.dotPulse : ''}`} />
            <span className={styles.timelineLine} />
          </div>
          <div className={styles.progressCard}>
            <span className={styles.progressCardIcon}>{getProgressIcon(log.message)}</span>
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // Success items — subtle badge
    if (isSuccess) {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={`${styles.timelineDot} ${styles.dotSuccess} ${last ? styles.dotPulse : ''}`} />
            {index < logs.length - 1 && <span className={styles.timelineLine} />}
          </div>
          <div className={styles.successBadge}>
            <CheckCircle2 size={12} />
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // URL items — link chip
    if (isUrl) {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={`${styles.timelineDot} ${last ? styles.dotPulse : ''}`} />
            {index < logs.length - 1 && <span className={styles.timelineLine} />}
          </div>
          <div className={styles.urlChip}>
            <Globe size={11} />
            <span>{log.message.replace('URL: ', '')}</span>
          </div>
        </div>
      );
    }

    // Agent sub-items — grouped appearance
    if (isAgent) {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={styles.subDash} />
          </div>
          <div className={styles.agentLine}>
            {log.message}
          </div>
        </div>
      );
    }

    // Info items — default
    return (
      <div key={index} className={styles.timelineItem}>
        <div className={styles.timelineDotColumn}>
          <span className={`${styles.timelineDot} ${last ? styles.dotPulse : ''}`} />
          {index < logs.length - 1 && <span className={styles.timelineLine} />}
        </div>
        <div className={styles.infoLine}>
          <Zap size={12} className={styles.infoIcon} />
          <span>{log.message}</span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        {/* Top bar */}
        <div className={styles.topBar}>
          <button className={styles.backBtn} onClick={() => navigate('/')}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div className={styles.statusBadge}>
            {isRunning ? (
              <>
                <span className={styles.pulseDot} />
                <span>Agent Running</span>
              </>
            ) : (
              <>
                <span className={styles.doneDot} />
                <span>{isStopped ? 'Stopped' : 'Complete'}</span>
              </>
            )}
          </div>

          <a href={auditUrl} target="_blank" rel="noopener noreferrer" className={styles.urlDisplay}>
            {auditUrl}
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Split layout */}
        <div className={styles.splitLayout}>

          {/* Left Panel - Timeline Feed */}
          <div className={styles.leftPanel}>
            <div className={styles.panelHeader}>
              <Bot size={16} />
              <span>Agent Activity</span>
            </div>
            <div className={styles.timelineContent}>
              {logs.map((log, index) => renderLogItem(log, index))}

              {isRunning && (
                <div className={styles.timelineItem}>
                  <div className={styles.timelineDotColumn}>
                    <span className={`${styles.timelineDot} ${styles.dotPulse}`} />
                  </div>
                  <div className={styles.infoLine}>
                    <Loader size={12} className={styles.inlineSpinner} />
                  </div>
                </div>
              )}

              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Right Panel - Website Preview */}
          <div className={styles.rightPanel}>
            <div className={styles.previewCard}>
              <div className={styles.previewContainer}>
                <iframe
                  src={auditUrl}
                  className={`${styles.previewFrame} ${isRunning ? styles.blurred : ''}`}
                  title="Website Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
                {isRunning && (
                  <div className={styles.overlay}>
                    <div className={styles.overlayContent}>
                      <Loader size={28} className={styles.overlaySpinner} />
                      <span className={styles.overlayText}>Analyzing...</span>
                      <span className={styles.overlaySubtext}>
                        Agent is auditing this page
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer card below iframe */}
            <div className={styles.previewFooter}>
              <div className={styles.footerProgress}>
                <div className={styles.footerProgressBar}>
                  <div
                    className={styles.footerProgressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className={styles.footerProgressText}>
                  Page {pagesAnalyzed} of {maxPages}
                </span>
              </div>
              <button
                className={`${styles.stopBtn} ${!isRunning ? styles.stopBtnDisabled : ''}`}
                onClick={handleStop}
                disabled={!isRunning}
              >
                <Square size={14} />
                <span>{isRunning ? 'Stop Agent' : (isStopped ? 'Stopped' : 'Done')}</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuditPage;
