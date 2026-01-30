import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styles from './AuditPage.module.css';
import Navbar from '../Components/Navbar';
import { ArrowLeft, Bot, Loader, ExternalLink, Square, CheckCircle2, Globe, Zap, Search, Compass, BrainCog, Play, MousePointerClick, Footprints, Hash } from 'lucide-react';

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
  const logsEndRef = useRef(null);
  const socketRef = useRef(null);

  const auditUrl = location.state?.url || 'https://cubeaisolutions.com';
  const maxPages = location.state?.max_pages || 3;
  const userIntent = location.state?.user_intent || '';

  // Derive pages analyzed from progress logs
  const pagesAnalyzed = logs.filter(l => l.type === 'progress').length;
  const progressPercent = maxPages > 0 ? Math.min((pagesAnalyzed / maxPages) * 100, 100) : 0;

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
      console.log('Results:', data.data);
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
    setIsStopped(true);
    setIsRunning(false);
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
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
