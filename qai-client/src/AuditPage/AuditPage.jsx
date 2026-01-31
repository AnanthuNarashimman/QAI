import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styles from './AuditPage.module.css';
import Navbar from '../Components/Navbar';
import { Bot, Loader, ExternalLink, Square, CheckCircle2, Globe, Zap, Search, Compass, BrainCog, Play, Hash, AlertTriangle, X, PenTool, FileText } from 'lucide-react';

function getProgressIcon(message) {
  if (message.includes('Page 1')) return <Compass size={14} />;
  if (message.includes('Page 2')) return <Search size={14} />;
  return <Globe size={14} />;
}

function AuditPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [isStopped, setIsStopped] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [showStopModal, setShowStopModal] = useState(false);
  const [auditResults, setAuditResults] = useState(null);
  const logsEndRef = useRef(null);
  const socketRef = useRef(null);

  const auditUrl = location.state?.url;
  const maxPages = location.state?.max_pages || 3;
  const userIntent = location.state?.user_intent || '';

  // Redirect to home if no state was passed (direct navigation to /audit)
  if (!auditUrl) {
    return <Navigate to="/" replace />;
  }

  // Derive progress: each completed page = full segment, current page gets partial fill from steps
  const pagesStarted = logs.filter(l => l.type === 'progress').length;
  const pagesCompleted = logs.filter(l => l.message && l.message.includes('analysis complete')).length;
  const stepsInCurrentPage = (() => {
    // Count steps since the last 'progress' log
    const lastProgressIdx = logs.map((l, i) => l.type === 'progress' ? i : -1).filter(i => i >= 0).pop() ?? -1;
    return logs.slice(lastProgressIdx + 1).filter(l => l.type === 'step').length;
  })();
  // Each page is one segment. Within a segment, steps fill it gradually (cap at ~8 steps estimate)
  const completedPercent = (pagesCompleted / maxPages) * 100;
  const currentPagePercent = pagesStarted > pagesCompleted
    ? (Math.min(stepsInCurrentPage / 8, 0.9) / maxPages) * 100
    : 0;
  const progressPercent = maxPages > 0 ? Math.min(completedPercent + currentPagePercent, 100) : 0;

  // Connect to WebSocket on mount
  useEffect(() => {
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.on('connect', () => {
      setLogs(prev => [...prev, { message: 'Connected to server', type: 'success' }]);

      // Start analysis
      socket.emit('start_analysis', {
        url: auditUrl,
        max_pages: maxPages,
        user_intent: userIntent,
      });
    });

    socket.on('log', (data) => {
      setLogs(prev => [...prev, data]);
    });

    socket.on('complete', (data) => {
      setLogs(prev => [...prev, { message: 'Analysis complete!', type: 'success' }]);
      setAuditResults(data.data);
      setIsRunning(false);
    });

    socket.on('error', (data) => {
      setLogs(prev => [...prev, { message: `Error: ${data.message}`, type: 'error' }]);
      setIsRunning(false);
    });

    socket.on('connect_error', () => {
      setLogs(prev => [...prev, { message: 'Failed to connect to backend', type: 'error' }]);
      setIsRunning(false);
    });

    socket.on('disconnect', () => {
      setIsRunning(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [auditUrl, maxPages, userIntent]);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleStop = () => {
    setShowStopModal(true);
  };

  const confirmStop = () => {
    setShowStopModal(false);
    setIsStopped(true);
    setIsRunning(false);
    setLogs(prev => [...prev, { message: 'Agent stopped by user', type: 'stopped' }]);
    if (socketRef.current) {
      socketRef.current.emit('stop_analysis');
      socketRef.current.disconnect();
    }
  };

  const cancelStop = () => {
    setShowStopModal(false);
  };

  const isLastLog = (index) => index === logs.length - 1 && isRunning;

  const renderLogItem = (log, index) => {
    if (log.type === 'divider') return null;

    const last = isLastLog(index);

    // Step counter — "Step 3"
    if (log.type === 'step') {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={`${styles.timelineDot} ${styles.dotLarge} ${last ? styles.dotPulse : ''}`} />
            <span className={styles.timelineLine} />
          </div>
          <div className={styles.stepBadge}>
            <Hash size={12} />
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // Thought bubble — agent's next goal/intent
    if (log.type === 'thought') {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={styles.subDash} />
          </div>
          <div className={styles.thoughtBubble}>
            <BrainCog size={13} className={styles.thoughtIcon} />
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // Action — what the agent is doing
    if (log.type === 'action') {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={styles.subDash} />
          </div>
          <div className={styles.actionLine}>
            <Play size={10} className={styles.actionIcon} />
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // Result — outcome of an action (e.g. "Scrolled down 788px")
    if (log.type === 'result') {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={styles.subDash} />
          </div>
          <div className={styles.resultLine}>
            <CheckCircle2 size={10} className={styles.resultIcon} />
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // URL chip — navigated to a URL
    if (log.type === 'url') {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={styles.subDash} />
          </div>
          <div className={styles.urlChip}>
            <Globe size={11} />
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // Progress card — page-level progress from bfs_crawler
    if (log.type === 'progress') {
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

    // Success badge
    if (log.type === 'success') {
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

    // Stopped badge
    if (log.type === 'stopped') {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={`${styles.timelineDot} ${styles.dotStopped}`} />
          </div>
          <div className={styles.stoppedBadge}>
            <Square size={11} />
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // Error badge
    if (log.type === 'error') {
      return (
        <div key={index} className={styles.timelineItem}>
          <div className={styles.timelineDotColumn}>
            <span className={`${styles.timelineDot} ${styles.dotError}`} />
            {index < logs.length - 1 && <span className={styles.timelineLine} />}
          </div>
          <div className={styles.errorBadge}>
            <span>{log.message}</span>
          </div>
        </div>
      );
    }

    // Default info line
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
        <div className={styles.topBar}>
          <div className={`${styles.statusBadge} ${isStopped ? styles.statusStopped : ''}`}>
            {isRunning ? (
              <>
                <span className={styles.pulseDot} />
                <span>Agent Running</span>
              </>
            ) : isStopped ? (
              <>
                <span className={styles.stoppedDot} />
                <span>Stopped</span>
              </>
            ) : (
              <>
                <span className={styles.doneDot} />
                <span>Complete</span>
              </>
            )}
          </div>

          <a href={auditUrl} target="_blank" rel="noopener noreferrer" className={styles.urlDisplay}>
            {auditUrl}
            <ExternalLink size={12} />
          </a>
        </div>

        <div className={styles.splitLayout}>
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

          <div className={styles.rightPanel}>
            <div className={styles.previewCard}>
              <div className={styles.macWindow}>
                <div className={styles.macTitleBar}>
                  <span className={`${styles.macDot} ${styles.macDotRed}`} />
                  <span className={`${styles.macDot} ${styles.macDotYellow}`} />
                  <span className={`${styles.macDot} ${styles.macDotGreen}`} />
                  <span className={styles.macTitle}>Website Audit</span>
                </div>
                <div className={`${styles.macBody} ${isStopped ? styles.macBodyStopped : ''}`}>
                  {/* Nav skeleton */}
                  <div className={styles.skelNav}>
                    <div className={`${styles.skelBlock} ${styles.skelLogo}`} />
                    <div className={styles.skelNavLinks}>
                      <div className={`${styles.skelBlock} ${styles.skelNavLink}`} />
                      <div className={`${styles.skelBlock} ${styles.skelNavLink}`} />
                      <div className={`${styles.skelBlock} ${styles.skelNavLink}`} />
                      <div className={`${styles.skelBlock} ${styles.skelNavBtn}`} />
                    </div>
                  </div>
                  {/* Hero skeleton */}
                  <div className={styles.skelHero}>
                    <div className={`${styles.skelBlock} ${styles.skelHeading}`} />
                    <div className={`${styles.skelBlock} ${styles.skelSubheading}`} />
                    <div className={styles.skelHeroBtns}>
                      <div className={`${styles.skelBlock} ${styles.skelBtn}`} />
                      <div className={`${styles.skelBlock} ${styles.skelBtnOutline}`} />
                    </div>
                  </div>
                  {/* Cards skeleton */}
                  <div className={styles.skelCards}>
                    <div className={styles.skelCard}>
                      <div className={`${styles.skelBlock} ${styles.skelCardImg}`} />
                      <div className={`${styles.skelBlock} ${styles.skelCardTitle}`} />
                      <div className={`${styles.skelBlock} ${styles.skelCardText}`} />
                    </div>
                    <div className={styles.skelCard}>
                      <div className={`${styles.skelBlock} ${styles.skelCardImg}`} />
                      <div className={`${styles.skelBlock} ${styles.skelCardTitle}`} />
                      <div className={`${styles.skelBlock} ${styles.skelCardText}`} />
                    </div>
                    <div className={styles.skelCard}>
                      <div className={`${styles.skelBlock} ${styles.skelCardImg}`} />
                      <div className={`${styles.skelBlock} ${styles.skelCardTitle}`} />
                      <div className={`${styles.skelBlock} ${styles.skelCardText}`} />
                    </div>
                  </div>
                  {/* Footer skeleton */}
                  <div className={styles.skelFooter}>
                    <div className={`${styles.skelBlock} ${styles.skelFooterLine}`} />
                  </div>
                  {/* Animated pen cursor */}
                  {!isStopped && (
                    <div className={styles.penCursor}>
                      <PenTool size={18} />
                    </div>
                  )}
                  {/* Stopped overlay */}
                  {isStopped && (
                    <div className={styles.stoppedOverlay}>
                      <Square size={28} />
                      <span>Stopped</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.previewFooter}>
              <div className={styles.footerProgress}>
                <div className={styles.footerProgressBar}>
                  <div
                    className={styles.footerProgressFill}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className={styles.footerProgressText}>
                  Page {pagesStarted || 0} of {maxPages}
                </span>
              </div>
              <div className={styles.footerButtons}>
                {auditResults && !isStopped && (
                  <button
                    className={styles.generateReportBtn}
                    onClick={() => navigate('/report', { state: { results: auditResults } })}
                  >
                    <FileText size={14} />
                    <span>Generate Report</span>
                  </button>
                )}
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
        </div>
      </main>

      {showStopModal && (
        <div className={styles.modalBackdrop} onClick={cancelStop}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={cancelStop}>
              <X size={16} />
            </button>
            <div className={styles.modalIcon}>
              <AlertTriangle size={28} />
            </div>
            <h3 className={styles.modalTitle}>Stop Agent?</h3>
            <p className={styles.modalText}>
              This will stop the audit immediately and discard all findings collected so far. This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalCancelBtn} onClick={cancelStop}>
                Continue Audit
              </button>
              <button className={styles.modalConfirmBtn} onClick={confirmStop}>
                <Square size={14} />
                Stop Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AuditPage;
