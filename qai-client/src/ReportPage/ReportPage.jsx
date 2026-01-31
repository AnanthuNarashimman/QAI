import { useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import styles from './ReportPage.module.css';
import Navbar from '../Components/Navbar';
import {
  Globe, Download, ArrowLeft, AlertTriangle, Lightbulb,
  MousePointerClick, Palette, Target, Users, Hash, Calendar,
  Briefcase, MessageSquare
} from 'lucide-react';

const MOCK_DATA = {
  audit_config: {
    website_type: 'Corporate IT',
    target_audience: 'Potential clients',
    theme_description: 'Corporate blue, professional, technical',
    inferred_tone: 'Technical and professional',
    primary_goal: 'Contact us',
  },
  base_domain: 'cubeaisolutions.com',
  total_pages_analyzed: 1,
  urls_analyzed: ['https://cubeaisolutions.com'],
  results: [
    {
      page_number: 1,
      url: 'https://cubeaisolutions.com',
      validation: {
        values: [
          {
            ctas_found: 28,
            cta_score: 45.0,
            cta_thoughts: [
              {
                element_name: "Header Button 'Get Started'",
                issues: "The text 'Get Started' is generic and appears repeatedly. It does not explicitly align with the user's primary goal of 'Contact us'.",
                recommendations: "Rename to 'Contact Us', 'Talk to an Expert', or 'Request Consultation' to be more direct.",
              },
              {
                element_name: 'Service Cards (AIMA, AIDA, VisionAI)',
                issues: "The 'Get Details' CTAs are small text links that blend into the content. They lack the visual weight of buttons, reducing click-through probability.",
                recommendations: 'Convert these text links into outlined or secondary style buttons to make them stand out.',
              },
              {
                element_name: 'Product Cards (iSpeak, Andromeda, etc.)',
                issues: 'There are NO Call-to-Actions on the product cards. Users have no direct way to learn more or request a demo for a specific product.',
                recommendations: "Add a primary button (e.g., 'Request Demo' or 'Learn More') to every product card.",
              },
              {
                element_name: 'Culture Section',
                issues: "The section describes 'People First' values but offers no path for potential candidates to apply. It is a dead end.",
                recommendations: "Add a 'Join Our Team' or 'View Careers' button.",
              },
              {
                element_name: 'Blog Cards (Insights)',
                issues: "The blog cards lack a visible 'Read More' button or link, relying on the user knowing the whole card is clickable.",
                recommendations: "Add a visible 'Read Article' text link or button to improve affordance.",
              },
            ],
            theme_score: 72.0,
            theme_thoughts: [
              {
                element_name: "Hero Headline 'Transform'",
                issues: "The cyan text color used for 'Transform' has low contrast against the white background, making it harder to read.",
                recommendations: 'Darken the cyan shade to meet WCAG accessibility standards for contrast.',
              },
              {
                element_name: 'About Section Service Pill',
                issues: "The text 'Artificial Intelligence...' is truncated with an ellipsis, hiding the full service name.",
                recommendations: 'Increase the width of the text container or adjust the font size to display the full text.',
              },
              {
                element_name: 'Tech Solution Card (Services)',
                issues: 'The card is aligned to the left with a large, empty white space to its right, creating a feeling of broken or missing content.',
                recommendations: 'Center the card if it is a single item, or add a visual graphic to the right side to balance the layout.',
              },
              {
                element_name: 'Projects Stats Text',
                issues: "Grammar error in the statistic label: '150+ AI Product Solution'. It should be plural.",
                recommendations: "Change text to '150+ AI Product Solutions'.",
              },
              {
                element_name: 'Blog List (Insights)',
                issues: 'The blog posts are not sorted chronologically. An August 2025 post appears before a December 2025 post.',
                recommendations: 'Sort the blog posts by date, displaying the most recent (December) first.',
              },
            ],
          },
        ],
      },
    },
  ],
};

function scoreColor(score) {
  if (score >= 70) return '#4ade80';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function ScoreGauge({ score, label }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className={styles.gaugeContainer}>
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke="rgba(0,180,216,0.1)" strokeWidth="10"
        />
        <circle
          cx="70" cy="70" r={radius}
          fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
        <text x="70" y="66" textAnchor="middle" className={styles.gaugeScore}>
          {Math.round(score)}
        </text>
        <text x="70" y="84" textAnchor="middle" className={styles.gaugeLabel}>
          / 100
        </text>
      </svg>
      <span className={styles.gaugeName}>{label}</span>
    </div>
  );
}

function IssueCard({ elementName, issues, recommendations, type }) {
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
      <div className={styles.issueBody}>
        <div className={styles.issueSection}>
          <span className={`${styles.issueSectionLabel} ${styles.issueLabelWarn}`}>
            <AlertTriangle size={12} /> Issue
          </span>
          <p className={styles.issueSectionText}>{issues}</p>
        </div>
        <div className={styles.issueSection}>
          <span className={`${styles.issueSectionLabel} ${styles.issueLabelFix}`}>
            <Lightbulb size={12} /> Recommendation
          </span>
          <p className={styles.issueSectionText}>{recommendations}</p>
        </div>
      </div>
    </div>
  );
}

function ReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef(null);

  // Use passed state or fall back to mock data for design preview
  const reportData = location.state?.results || MOCK_DATA;

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

  const allCtaThoughts = allValues.flatMap(v => v.cta_thoughts || []);
  const allThemeThoughts = allValues.flatMap(v => v.theme_thoughts || []);

  const handleDownloadPDF = () => {
    const element = reportRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${reportData.base_domain}-audit-report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
    };
    html2pdf().set(opt).from(element).save();
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
            <div className={styles.scoresRow}>
              <ScoreGauge score={avgCtaScore} label="CTA Score" />
              <ScoreGauge score={avgThemeScore} label="Theme Score" />
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
                  />
                ))}
              </div>
            </section>
          )}

        </div>
      </main>
    </div>
  );
}

export default ReportPage;
