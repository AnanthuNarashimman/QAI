import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import Navbar from '../Components/Navbar';
import { Star, StarHalf, Play, Zap, CheckCircle, Sparkles } from 'lucide-react';
import hero from "../assets/Hero.png";

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
      </main>
    </div>
  );
}

export default LandingPage;
