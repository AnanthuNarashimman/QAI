import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import styles from './ReportPage.module.css';
import Navbar from '../Components/Navbar';
import {
  Globe, Download, ArrowLeft, AlertTriangle, Lightbulb,
  MousePointerClick, Palette, Target, Users, Hash, Calendar,
  Briefcase, MessageSquare, TrendingUp, TrendingDown, Minus,
  ImageIcon
} from 'lucide-react';

function scoreColor(score) {
  if (score >= 70) return '#4ade80';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function scoreGrade(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C+';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

function scoreSummary(score) {
  if (score >= 70) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Critical';
}

function ScoreGauge({ score, label, icon, issueCount }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);
  const grade = scoreGrade(score);
  const summary = scoreSummary(score);
  const TrendIcon = score >= 70 ? TrendingUp : score >= 40 ? Minus : TrendingDown;

  return (
    <div className={styles.gaugeCard}>
      <div className={styles.gaugeCardHeader}>
        <div className={styles.gaugeIconWrap} style={{ background: `${color}15` }}>
          {icon}
        </div>
        <div className={styles.gaugeCardMeta}>
          <span className={styles.gaugeName}>{label}</span>
          <span className={styles.gaugeIssueCount}>{issueCount} issue{issueCount !== 1 ? 's' : ''} found</span>
        </div>
        <span className={styles.gaugeGrade} style={{ color }}>{grade}</span>
      </div>
      <div className={styles.gaugeVisual}>
        <svg width="150" height="150" viewBox="0 0 150 150">
          <circle
            cx="75" cy="75" r={radius}
            fill="none" stroke="rgba(0,180,216,0.08)" strokeWidth="11"
          />
          <circle
            cx="75" cy="75" r={radius}
            fill="none" stroke={color} strokeWidth="11"
            strokeDasharray={circumference} strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 75 75)"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
          <text x="75" y="70" textAnchor="middle" className={styles.gaugeScore}>
            {Math.round(score)}
          </text>
          <text x="75" y="88" textAnchor="middle" className={styles.gaugeLabel}>
            / 100
          </text>
        </svg>
      </div>
      <div className={styles.gaugeSummaryRow}>
        <TrendIcon size={14} style={{ color }} />
        <span className={styles.gaugeSummaryText} style={{ color }}>{summary}</span>
      </div>
    </div>
  );
}

function IssueCard({ elementName, issues, recommendations, type, screenshot }) {
  const icon = type === 'cta'
    ? <MousePointerClick size={16} />
    : <Palette size={16} />;

  return (
    <div className={styles.issueCard}>
      <div className={styles.issueCardHeader}>
        <div className={styles.issueElementBadge}>
          {icon}
          <span>{elementName}</span>
        </div>
      </div>

      <div className={styles.issueCardLayout}>
        {/* Left: text */}
        <div className={styles.issueBody}>
          <div className={`${styles.issueSection} ${styles.issueHighlight}`}>
            <span className={`${styles.issueSectionLabel} ${styles.issueLabelWarn}`}>
              <AlertTriangle size={12} /> Issue
            </span>
            <p className={styles.issueSectionText}>{issues}</p>
          </div>
          <div className={`${styles.issueSection} ${styles.recommendHighlight}`}>
            <span className={`${styles.issueSectionLabel} ${styles.issueLabelFix}`}>
              <Lightbulb size={12} /> Recommendation
            </span>
            <p className={styles.issueSectionText}>{recommendations}</p>
          </div>
        </div>

        {/* Right: screenshot or placeholder */}
        {screenshot ? (
          <div className={styles.screenshotWrap}>
            <img
              src={`data:image/jpeg;base64,${screenshot}`}
              alt={`Screenshot for ${elementName}`}
              className={styles.screenshotImage}
            />
          </div>
        ) : (
          <div className={styles.screenshotPlaceholder}>
            <ImageIcon size={24} strokeWidth={1.5} />
            <span>Screenshot</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);

  const reportData = location.state?.results;

  // Redirect back if no data was passed
  if (!reportData) {
    return (
      <div className={styles.container}>
        <Navbar />
        <main className={styles.main}>
          <p>No report data available.</p>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={15} /> Go Back
          </button>
        </main>
      </div>
    );
  }

  const auditConfig = reportData.audit_config || {};
  const allValues = reportData.results.flatMap(r =>
    r.validation?.values || []
  );

  const avgCtaScore = allValues.length > 0
    ? allValues.reduce((s, v) => s + v.cta_score, 0) / allValues.length
    : 0;
  const avgThemeScore = allValues.length > 0
    ? allValues.reduce((s, v) => s + v.theme_score, 0) / allValues.length
    : 0;

  // Build thoughts with per-viewport screenshot mapped via viewport_number
  const allCtaThoughts = reportData.results.flatMap(r => {
    const screenshots = r.screenshots || {};
    return (r.validation?.values || []).flatMap(v =>
      (v.cta_thoughts || []).map(t => ({
        ...t,
        screenshot: screenshots[t.viewport_number] || null,
      }))
    );
  });
  const allThemeThoughts = reportData.results.flatMap(r => {
    const screenshots = r.screenshots || {};
    return (r.validation?.values || []).flatMap(v =>
      (v.theme_thoughts || []).map(t => ({
        ...t,
        screenshot: screenshots[t.viewport_number] || null,
      }))
    );
  });

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    // Add class that flattens layouts for html2canvas compatibility
    element.classList.add(styles.pdfRendering);

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${reportData.base_domain}-audit-report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: [`.${styles.issueCard}`, `.${styles.gaugeCard}`, `.${styles.reportFooter}`] },
    };

    html2pdf().set(opt).from(element).save().then(() => {
      element.classList.remove(styles.pdfRendering);
    });
  };

  const auditDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        <div className={styles.reportContent} ref={reportRef}>

          {/* ── HEADER ── */}
          <div className={styles.reportHeader}>
            <div className={styles.headerLeft}>
              <h1 className={styles.siteTitle}>{reportData.base_domain}</h1>
              <span className={styles.auditDate}>
                <Calendar size={12} /> {auditDate}
              </span>
              <div className={styles.configTags}>
                {auditConfig.website_type && (
                  <span className={styles.configTag}>
                    <Briefcase size={11} /> {auditConfig.website_type}
                  </span>
                )}
                {auditConfig.target_audience && (
                  <span className={styles.configTag}>
                    <Users size={11} /> {auditConfig.target_audience}
                  </span>
                )}
                {auditConfig.primary_goal && (
                  <span className={styles.configTag}>
                    <Target size={11} /> {auditConfig.primary_goal}
                  </span>
                )}
                {auditConfig.inferred_tone && (
                  <span className={styles.configTag}>
                    <MessageSquare size={11} /> {auditConfig.inferred_tone}
                  </span>
                )}
                <span className={styles.configTag}>
                  <Hash size={11} /> {reportData.total_pages_analyzed} page{reportData.total_pages_analyzed !== 1 ? 's' : ''} analyzed
                </span>
              </div>
            </div>
            <div className={styles.headerRight}>
              <button className={styles.downloadBtn} onClick={handleDownloadPDF}>
                <Download size={15} /> Download PDF
              </button>
              <button className={styles.backBtn} onClick={() => navigate(-1)}>
                <ArrowLeft size={15} /> Back
              </button>
            </div>
          </div>

          {/* ── OVERALL SCORES ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Overall Scores</h2>

            {/* Overall combined score bar */}
            <div className={styles.overallBar}>
              <div className={styles.overallBarInfo}>
                <span className={styles.overallBarLabel}>Overall</span>
                <span className={styles.overallBarValue} style={{ color: scoreColor((avgCtaScore + avgThemeScore) / 2) }}>
                  {Math.round((avgCtaScore + avgThemeScore) / 2)} / 100
                </span>
              </div>
              <div className={styles.overallBarTrack}>
                <div
                  className={styles.overallBarFill}
                  style={{
                    width: `${(avgCtaScore + avgThemeScore) / 2}%`,
                    background: scoreColor((avgCtaScore + avgThemeScore) / 2),
                  }}
                />
              </div>
            </div>

            <div className={styles.scoresRow}>
              <ScoreGauge
                score={avgCtaScore}
                label="CTA Score"
                icon={<MousePointerClick size={18} />}
                issueCount={allCtaThoughts.length}
              />
              <ScoreGauge
                score={avgThemeScore}
                label="Theme Score"
                icon={<Palette size={18} />}
                issueCount={allThemeThoughts.length}
              />
            </div>
          </section>

          {/* ── PAGE-BY-PAGE BREAKDOWN ── */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <Globe size={18} /> Page-by-Page Breakdown
            </h2>
            {reportData.results.map((page, i) => {
              const val = page.validation?.values?.[0];
              if (!val) return null;
              return (
                <div key={i} className={styles.pageCard}>
                  <div className={styles.pageCardHeader}>
                    <Globe size={14} />
                    <a href={page.url} target="_blank" rel="noopener noreferrer" className={styles.pageUrl}>
                      {page.url}
                    </a>
                  </div>
                  <div className={styles.pageScores}>
                    <div className={styles.pageMiniScore}>
                      <span className={styles.pageMiniScoreLabel}>CTA:</span>
                      <span style={{ color: scoreColor(val.cta_score) }}>{val.cta_score}</span>
                    </div>
                    <div className={styles.pageMiniScore}>
                      <span className={styles.pageMiniScoreLabel}>Theme:</span>
                      <span style={{ color: scoreColor(val.theme_score) }}>{val.theme_score}</span>
                    </div>
                    <div className={styles.pageMiniScore}>
                      <span className={styles.pageMiniScoreLabel}>CTAs Found:</span>
                      <span>{val.ctas_found}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </section>

          {/* ── CTA ISSUES ── */}
          {allCtaThoughts.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <MousePointerClick size={18} /> CTA Issues
                <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(26,26,46,0.4)', marginLeft: 4 }}>
                  ({allCtaThoughts.length})
                </span>
              </h2>
              <div className={styles.issueGrid}>
                {allCtaThoughts.map((t, i) => (
                  <IssueCard
                    key={i}
                    elementName={t.element_name}
                    issues={t.issues}
                    recommendations={t.recommendations}
                    type="cta"
                    screenshot={t.screenshot}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── THEME ISSUES ── */}
          {allThemeThoughts.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <Palette size={18} /> Theme Issues
                <span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(26,26,46,0.4)', marginLeft: 4 }}>
                  ({allThemeThoughts.length})
                </span>
              </h2>
              <div className={styles.issueGrid}>
                {allThemeThoughts.map((t, i) => (
                  <IssueCard
                    key={i}
                    elementName={t.element_name}
                    issues={t.issues}
                    recommendations={t.recommendations}
                    type="theme"
                    screenshot={t.screenshot}
                  />
                ))}
              </div>
            </section>
          )}

          {/* ── FOOTER ── */}
          <footer className={styles.reportFooter}>
            <div className={styles.footerBrand}>
              <span className={styles.footerLogo}>VibeAudit</span>
              <span className={styles.footerDot} />
              <span className={styles.footerTagline}>AI-Powered UX Audit</span>
            </div>
            <p className={styles.footerNote}>
              This report was automatically generated by the VibeAudit Agent.
              Scores and recommendations are based on automated analysis and may require human review.
            </p>
            <span className={styles.footerDate}>{auditDate}</span>
          </footer>

        </div>
      </main>
    </div>
  );
}

export default ReportPage;
