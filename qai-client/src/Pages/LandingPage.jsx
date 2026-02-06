import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import Navbar from '../Components/Navbar';
import { Star, StarHalf, Play, Zap, CheckCircle } from 'lucide-react';
import hero from "../assets/Hero.png";

import sc1 from "../assets/SC1.png";
import sc2 from "../assets/sc2.png";
import sc3 from "../assets/sc3.png";

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
            <h2 className={styles.sectionTitle}>Three steps to a perfect audit</h2>
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

            {/* Step 3 - Get Report */}
            <div className={styles.stepCard}>
              <div className={styles.stepInfo}>
                <div className={styles.stepNumber}>
                  <span>03</span>
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>Get Your Report</h3>
                  <p className={styles.stepDescription}>
                    Download a comprehensive PDF report with all findings, severity ratings, and actionable recommendations. Share with your team or use it as a roadmap for improvements.
                  </p>
                </div>
              </div>
              <div className={styles.stepImageWrapper}>
                <img src={sc3} alt="Generated report" className={styles.stepImage} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;
