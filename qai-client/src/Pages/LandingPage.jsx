import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import Navbar from '../Components/Navbar';
import {
  Star, StarHalf, Play, Zap, CheckCircle,
  MousePointerClick, Palette, AlertTriangle, Lightbulb,
  TrendingUp, Minus, Globe
} from 'lucide-react';
import hero from "../assets/Hero.png";

import sc1 from "../assets/SC1.png";
import sc2 from "../assets/sc2.png";
import sc3 from "../assets/sc3.png";
import sc4 from "../assets/sc4.png";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Navbar />

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.heroLeft}>
              <h1 className={styles.heroTitle}>
                Put your <span className={styles.titleHighlight}>website</span> <span className={styles.titleAccent}>first</span>
              </h1>
              <p className={styles.heroSubtitle}>
                Fast, AI-powered and intelligent - turn design chaos into
                clarity and streamline your audits with automated
                quality analysis powered by Gemini.
              </p>

              <div className={styles.heroBtns}>
                <button className={styles.getStartedBtn} onClick={() => navigate('/agent')}>
                  Get started
                </button>
                <button className={styles.watchDemoBtn}>
                  <Play size={16} />
                  Watch demo
                </button>
              </div>

              {/* Stats */}
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>98.5%</div>
                  <div className={styles.statLabel}>Issue detection rate</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statValue}>~5min</div>
                  <div className={styles.statLabel}>Average audit time</div>
                </div>
              </div>

              {/* Rating */}
              <div className={styles.rating}>
                <div className={styles.stars}>
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <Star size={18} fill="currentColor" />
                  <StarHalf size={18} fill="currentColor" />
                  <span className={styles.ratingValue}>4.5</span>
                </div>
                <span className={styles.ratingLabel}>Average user rating</span>
              </div>
            </div>

            {/* Right side - Hero Image */}
            <div className={styles.heroRight}>
              <div className={styles.heroImageWrapper}>
                <img
                  src={hero}
                  alt="VibeAudit platform showing BFS crawling, structured analysis, and audit results"
                  className={styles.heroImage}
                />
                
                {/* Floating Elements */}
                <div className={styles.floater1}>
                  <div className={styles.floaterIcon}>
                    <Zap size={20} strokeWidth={2.5} />
                  </div>
                  <div className={styles.floaterText}>
                    <div className={styles.floaterTitle}>Automated Audits</div>
                    <div className={styles.floaterSubtitle}>Saves hours of work</div>
                  </div>
                </div>

                <div className={styles.floater2}>
                  <div className={styles.floaterIcon}>
                    <CheckCircle size={20} strokeWidth={2.5} />
                  </div>
                  <div className={styles.floaterText}>
                    <div className={styles.floaterTitle}>100% Accurate</div>
                    <div className={styles.floaterSubtitle}>AI-powered insights</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.howItWorks}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>How It Works</span>
            <h2 className={styles.sectionTitle}>Four steps to a perfect audit</h2>
            <p className={styles.sectionSubtitle}>
              Our AI-powered agent handles the heavy lifting while you focus on what matters
            </p>
          </div>

          <div className={styles.stepsContainer}>
            {/* Step 1 - Configure */}
            <div className={styles.stepCard}>
              <div className={styles.stepInfo}>
                <div className={styles.stepNumber}>
                  <span>01</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Configure Your Audit</h3>
                  <p className={styles.stepDescription}>
                    Enter your website URL, set the maximum number of pages to crawl, and describe your site's purpose and target audience. Our AI uses this context to provide relevant, actionable feedback.
                  </p>
                </div>
              </div>
              <div className={styles.stepImageWrapper}>
                <img src={sc1} alt="Agent configuration page" className={styles.stepImage} />
              </div>
            </div>

            {/* Connector 1: right to left */}
            <div className={styles.stepConnector}>
              <svg viewBox="0 0 500 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 350,0 C 350,50 150,30 150,80" className={styles.connectorPath} />
                <polygon points="145,72 150,84 158,74" className={styles.connectorArrow} />
              </svg>
            </div>

            {/* Step 2 - Watch AI */}
            <div className={`${styles.stepCard} ${styles.stepCardReverse}`}>
              <div className={styles.stepInfo}>
                <div className={styles.stepNumber}>
                  <span>02</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Watch AI in Action</h3>
                  <p className={styles.stepDescription}>
                    See real-time logs as our agent navigates your website, analyzing layouts, checking accessibility, and identifying design issues. Track progress with a live timeline of agent activity.
                  </p>
                </div>
              </div>
              <div className={styles.stepImageWrapper}>
                <img src={sc2} alt="Audit in progress" className={styles.stepImage} />
              </div>
            </div>

            {/* Connector 2: left to right */}
            <div className={styles.stepConnector}>
              <svg viewBox="0 0 500 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 150,0 C 150,50 350,30 350,80" className={styles.connectorPath} />
                <polygon points="342,74 350,84 355,72" className={styles.connectorArrow} />
              </svg>
            </div>

            {/* Step 3 - Get Report */}
            <div className={styles.stepCard}>
              <div className={styles.stepInfo}>
                <div className={styles.stepNumber}>
                  <span>03</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Get Your Report</h3>
                  <p className={styles.stepDescription}>
                    Review a comprehensive report with all findings, severity ratings, and actionable recommendations organized by category and priority.
                  </p>
                </div>
              </div>
              <div className={styles.stepImageWrapper}>
                <img src={sc3} alt="Generated report" className={styles.stepImage} />
              </div>
            </div>

            {/* Connector 3: right to left */}
            <div className={styles.stepConnector}>
              <svg viewBox="0 0 500 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 350,0 C 350,50 150,30 150,80" className={styles.connectorPath} />
                <polygon points="145,72 150,84 158,74" className={styles.connectorArrow} />
              </svg>
            </div>

            {/* Step 4 - Download PDF */}
            <div className={`${styles.stepCard} ${styles.stepCardReverse}`}>
              <div className={styles.stepInfo}>
                <div className={styles.stepNumber}>
                  <span>04</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Download Report as PDF</h3>
                  <p className={styles.stepDescription}>
                    Export your audit results as a professionally formatted PDF. Share it with your team, stakeholders, or use it as a roadmap for improvements.
                  </p>
                </div>
              </div>
              <div className={styles.stepImageWrapper}>
                <img src={sc4} alt="Download report as PDF" className={styles.stepImage} />
              </div>
            </div>
          </div>
        </section>

        {/* Features / Insights Section */}
        <section className={styles.features}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Features</span>
            <h2 className={styles.sectionTitle}>Discover actionable insights</h2>
            <p className={styles.sectionSubtitle}>
              Every audit delivers a rich, detailed report packed with scores, issues, and recommendations
            </p>
          </div>

          <div className={styles.featuresGrid}>

            {/* Feature 1: Score Overview */}
            <div className={styles.featureBlock}>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>At-a-Glance Scoring</h3>
                <p className={styles.featureDescription}>
                  Instantly understand your site's health with overall scores,
                  individual category gauges, and letter grades — all calculated
                  from real page analysis.
                </p>
                <ul className={styles.featureList}>
                  <li>Overall score with progress bar</li>
                  <li>CTA effectiveness &amp; theme consistency gauges</li>
                  <li>A-F letter grading per category</li>
                </ul>
              </div>
              <div className={styles.featureVisual}>
                {/* Mock Overall Bar */}
                <div className={styles.mockSection}>
                  <div className={styles.mockOverallBar}>
                    <div className={styles.mockOverallBarInfo}>
                      <span className={styles.mockOverallBarLabel}>Overall</span>
                      <span className={styles.mockOverallBarValue} style={{ color: '#f59e0b' }}>69 / 100</span>
                    </div>
                    <div className={styles.mockOverallBarTrack}>
                      <div className={styles.mockOverallBarFill} style={{ width: '69%', background: '#f59e0b' }} />
                    </div>
                  </div>

                  {/* Mock Gauge Cards */}
                  <div className={styles.mockScoresRow}>
                    <div className={styles.mockGaugeCard}>
                      <div className={styles.mockGaugeHeader}>
                        <div className={styles.mockGaugeIcon} style={{ background: 'rgba(74, 222, 128, 0.1)' }}>
                          <MousePointerClick size={16} color="#4ade80" />
                        </div>
                        <div className={styles.mockGaugeMeta}>
                          <span className={styles.mockGaugeName}>CTA Score</span>
                          <span className={styles.mockGaugeIssues}>3 issues found</span>
                        </div>
                        <span className={styles.mockGaugeGrade} style={{ color: '#4ade80' }}>B+</span>
                      </div>
                      <div className={styles.mockGaugeVisual}>
                        <svg width="120" height="120" viewBox="0 0 150 150">
                          <circle cx="75" cy="75" r="58" fill="none" stroke="rgba(0,180,216,0.08)" strokeWidth="10" />
                          <circle cx="75" cy="75" r="58" fill="none" stroke="#4ade80" strokeWidth="10"
                            strokeDasharray="364.42" strokeDashoffset="65.60"
                            strokeLinecap="round" transform="rotate(-90 75 75)" />
                          <text x="75" y="70" textAnchor="middle" className={styles.mockGaugeScore}>82</text>
                          <text x="75" y="88" textAnchor="middle" className={styles.mockGaugeLabel}>/ 100</text>
                        </svg>
                      </div>
                      <div className={styles.mockGaugeSummary}>
                        <TrendingUp size={13} color="#4ade80" />
                        <span style={{ color: '#4ade80' }}>Good</span>
                      </div>
                    </div>

                    <div className={styles.mockGaugeCard}>
                      <div className={styles.mockGaugeHeader}>
                        <div className={styles.mockGaugeIcon} style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                          <Palette size={16} color="#f59e0b" />
                        </div>
                        <div className={styles.mockGaugeMeta}>
                          <span className={styles.mockGaugeName}>Theme Score</span>
                          <span className={styles.mockGaugeIssues}>5 issues found</span>
                        </div>
                        <span className={styles.mockGaugeGrade} style={{ color: '#f59e0b' }}>C</span>
                      </div>
                      <div className={styles.mockGaugeVisual}>
                        <svg width="120" height="120" viewBox="0 0 150 150">
                          <circle cx="75" cy="75" r="58" fill="none" stroke="rgba(0,180,216,0.08)" strokeWidth="10" />
                          <circle cx="75" cy="75" r="58" fill="none" stroke="#f59e0b" strokeWidth="10"
                            strokeDasharray="364.42" strokeDashoffset="160.34"
                            strokeLinecap="round" transform="rotate(-90 75 75)" />
                          <text x="75" y="70" textAnchor="middle" className={styles.mockGaugeScore}>56</text>
                          <text x="75" y="88" textAnchor="middle" className={styles.mockGaugeLabel}>/ 100</text>
                        </svg>
                      </div>
                      <div className={styles.mockGaugeSummary}>
                        <Minus size={13} color="#f59e0b" />
                        <span style={{ color: '#f59e0b' }}>Needs Work</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: CTA Efficiency */}
            <div className={`${styles.featureBlock} ${styles.featureBlockReverse}`}>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>CTA Efficiency Analysis</h3>
                <p className={styles.featureDescription}>
                  Every call-to-action is evaluated for visibility, contrast, copy clarity,
                  and placement — so you never lose conversions to poor UX.
                </p>
                <ul className={styles.featureList}>
                  <li>Contrast ratio checks against WCAG standards</li>
                  <li>Copy effectiveness scoring</li>
                  <li>Placement &amp; visibility analysis</li>
                </ul>
              </div>
              <div className={styles.featureVisual}>
                <div className={styles.mockSection}>
                  <div className={styles.mockSectionTitle}>
                    <MousePointerClick size={15} color="#00B4D8" />
                    CTA Issues
                    <span className={styles.mockCount}>(3)</span>
                  </div>

                  <div className={styles.mockIssueCard}>
                    <div className={styles.mockIssueBadge}>
                      <MousePointerClick size={14} />
                      <span>hero-cta-button</span>
                    </div>
                    <div className={styles.mockIssueBody}>
                      <div className={styles.mockIssueBlock} style={{ background: 'rgba(245, 158, 11, 0.05)', borderLeftColor: 'rgba(245, 158, 11, 0.5)' }}>
                        <span className={styles.mockIssueLabel} style={{ color: 'rgba(245, 158, 11, 0.8)' }}>
                          <AlertTriangle size={11} /> Issue
                        </span>
                        <p className={styles.mockIssueText}>
                          CTA button has low contrast ratio (2.8:1) against the background and uses vague copy &quot;Click Here&quot; — does not communicate value.
                        </p>
                      </div>
                      <div className={styles.mockIssueBlock} style={{ background: 'rgba(74, 222, 128, 0.05)', borderLeftColor: 'rgba(74, 222, 128, 0.5)' }}>
                        <span className={styles.mockIssueLabel} style={{ color: 'rgba(74, 222, 128, 0.8)' }}>
                          <Lightbulb size={11} /> Recommendation
                        </span>
                        <p className={styles.mockIssueText}>
                          Increase contrast to at least 4.5:1 and use action-oriented copy like &quot;Start Free Trial&quot; or &quot;Get Started Today&quot;.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.mockIssueCard}>
                    <div className={styles.mockIssueBadge}>
                      <MousePointerClick size={14} />
                      <span>pricing-signup-btn</span>
                    </div>
                    <div className={styles.mockIssueBody}>
                      <div className={styles.mockIssueBlock} style={{ background: 'rgba(245, 158, 11, 0.05)', borderLeftColor: 'rgba(245, 158, 11, 0.5)' }}>
                        <span className={styles.mockIssueLabel} style={{ color: 'rgba(245, 158, 11, 0.8)' }}>
                          <AlertTriangle size={11} /> Issue
                        </span>
                        <p className={styles.mockIssueText}>
                          Sign-up button is below the fold on mobile viewports and competes with 3 other CTAs in the same section.
                        </p>
                      </div>
                      <div className={styles.mockIssueBlock} style={{ background: 'rgba(74, 222, 128, 0.05)', borderLeftColor: 'rgba(74, 222, 128, 0.5)' }}>
                        <span className={styles.mockIssueLabel} style={{ color: 'rgba(74, 222, 128, 0.8)' }}>
                          <Lightbulb size={11} /> Recommendation
                        </span>
                        <p className={styles.mockIssueText}>
                          Make the primary CTA sticky on mobile and reduce competing actions to a single clear choice.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Theme Consistency */}
            <div className={styles.featureBlock}>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Theme Consistency Review</h3>
                <p className={styles.featureDescription}>
                  Fonts, colors, spacing, and visual hierarchy are checked across
                  every page to ensure a cohesive, professional design system.
                </p>
                <ul className={styles.featureList}>
                  <li>Font weight &amp; typography consistency</li>
                  <li>Color palette adherence</li>
                  <li>Spacing &amp; layout uniformity</li>
                </ul>
              </div>
              <div className={styles.featureVisual}>
                <div className={styles.mockSection}>
                  <div className={styles.mockSectionTitle}>
                    <Palette size={15} color="#00B4D8" />
                    Theme Issues
                    <span className={styles.mockCount}>(5)</span>
                  </div>

                  <div className={styles.mockIssueCard}>
                    <div className={styles.mockIssueBadge}>
                      <Palette size={14} />
                      <span>nav-section</span>
                    </div>
                    <div className={styles.mockIssueBody}>
                      <div className={styles.mockIssueBlock} style={{ background: 'rgba(245, 158, 11, 0.05)', borderLeftColor: 'rgba(245, 158, 11, 0.5)' }}>
                        <span className={styles.mockIssueLabel} style={{ color: 'rgba(245, 158, 11, 0.8)' }}>
                          <AlertTriangle size={11} /> Issue
                        </span>
                        <p className={styles.mockIssueText}>
                          Navigation uses 4 different font weights inconsistently, breaking visual hierarchy and reducing scanability.
                        </p>
                      </div>
                      <div className={styles.mockIssueBlock} style={{ background: 'rgba(74, 222, 128, 0.05)', borderLeftColor: 'rgba(74, 222, 128, 0.5)' }}>
                        <span className={styles.mockIssueLabel} style={{ color: 'rgba(74, 222, 128, 0.8)' }}>
                          <Lightbulb size={11} /> Recommendation
                        </span>
                        <p className={styles.mockIssueText}>
                          Standardize to 2 font weights — regular for links, semibold for the active state.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles.mockIssueCard}>
                    <div className={styles.mockIssueBadge}>
                      <Palette size={14} />
                      <span>footer-section</span>
                    </div>
                    <div className={styles.mockIssueBody}>
                      <div className={styles.mockIssueBlock} style={{ background: 'rgba(245, 158, 11, 0.05)', borderLeftColor: 'rgba(245, 158, 11, 0.5)' }}>
                        <span className={styles.mockIssueLabel} style={{ color: 'rgba(245, 158, 11, 0.8)' }}>
                          <AlertTriangle size={11} /> Issue
                        </span>
                        <p className={styles.mockIssueText}>
                          Footer background (#1a1a2e) clashes with the light color palette used across the rest of the site.
                        </p>
                      </div>
                      <div className={styles.mockIssueBlock} style={{ background: 'rgba(74, 222, 128, 0.05)', borderLeftColor: 'rgba(74, 222, 128, 0.5)' }}>
                        <span className={styles.mockIssueLabel} style={{ color: 'rgba(74, 222, 128, 0.8)' }}>
                          <Lightbulb size={11} /> Recommendation
                        </span>
                        <p className={styles.mockIssueText}>
                          Use a softer dark shade or match the site&apos;s neutral palette for a smoother visual transition.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Page-by-Page Breakdown */}
            <div className={`${styles.featureBlock} ${styles.featureBlockReverse}`}>
              <div className={styles.featureText}>
                <h3 className={styles.featureTitle}>Page-by-Page Breakdown</h3>
                <p className={styles.featureDescription}>
                  Each crawled page gets its own detailed analysis with individual
                  CTA and theme scores, so you know exactly where to focus.
                </p>
                <ul className={styles.featureList}>
                  <li>Individual page scoring</li>
                  <li>CTA count per page</li>
                  <li>Multi-page comparison at a glance</li>
                </ul>
              </div>
              <div className={styles.featureVisual}>
                <div className={styles.mockSection}>
                  <div className={styles.mockSectionTitle}>
                    <Globe size={15} color="#00B4D8" />
                    Page-by-Page Breakdown
                  </div>
                  <div className={styles.mockPageCard}>
                    <div className={styles.mockPageHeader}>
                      <Globe size={13} color="#00B4D8" />
                      <span className={styles.mockPageUrl}>example.com/</span>
                    </div>
                    <div className={styles.mockPageScores}>
                      <span className={styles.mockMiniScore}>CTA: <b style={{ color: '#4ade80' }}>85</b></span>
                      <span className={styles.mockMiniScore}>Theme: <b style={{ color: '#f59e0b' }}>62</b></span>
                      <span className={styles.mockMiniScore}>CTAs Found: <b>4</b></span>
                    </div>
                  </div>
                  <div className={styles.mockPageCard}>
                    <div className={styles.mockPageHeader}>
                      <Globe size={13} color="#00B4D8" />
                      <span className={styles.mockPageUrl}>example.com/pricing</span>
                    </div>
                    <div className={styles.mockPageScores}>
                      <span className={styles.mockMiniScore}>CTA: <b style={{ color: '#4ade80' }}>78</b></span>
                      <span className={styles.mockMiniScore}>Theme: <b style={{ color: '#f59e0b' }}>51</b></span>
                      <span className={styles.mockMiniScore}>CTAs Found: <b>6</b></span>
                    </div>
                  </div>
                  <div className={styles.mockPageCard}>
                    <div className={styles.mockPageHeader}>
                      <Globe size={13} color="#00B4D8" />
                      <span className={styles.mockPageUrl}>example.com/about</span>
                    </div>
                    <div className={styles.mockPageScores}>
                      <span className={styles.mockMiniScore}>CTA: <b style={{ color: '#ef4444' }}>34</b></span>
                      <span className={styles.mockMiniScore}>Theme: <b style={{ color: '#4ade80' }}>71</b></span>
                      <span className={styles.mockMiniScore}>CTAs Found: <b>1</b></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
