import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.css';
import {
  Shield, Eye, EyeOff, LogIn, Info,
  Zap, CheckCircle, ShoppingCart, Image,
  BarChart3, Newspaper, ArrowLeft
} from 'lucide-react';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const validUsername = import.meta.env.VITE_AUTH_USERNAME;
    const validPassword = import.meta.env.VITE_AUTH_PASSWORD;
    
    if (username === validUsername && password === validPassword) {
      localStorage.setItem('isAuthenticated', 'true');
      navigate('/agent');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      {/* Left Panel - Visuals */}
      <div className={styles.leftPanel}>
        <div className={styles.leftContent}>
          <div className={styles.leftLogo}>
            <Shield size={28} />
            <span>VibeAudit</span>
          </div>

          <div className={styles.leftHero}>
            <h1 className={styles.leftTitle}>
              AI-powered<br />website audits
            </h1>
            <p className={styles.leftSubtitle}>
              Turn design chaos into clarity with automated quality analysis.
            </p>
          </div>

          {/* Floating Illustration Cards */}
          <div className={styles.illustrations}>
            {/* E-commerce mockup */}
            <div className={`${styles.illustrationCard} ${styles.card1}`}>
              <div className={styles.cardDots}>
                <span /><span /><span />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardUrl}>
                  <ShoppingCart size={10} color="#10b981" />
                  <span>shop.example.com</span>
                </div>
                <div className={styles.ecommerceGrid}>
                  <div className={`${styles.productCard} ${styles.product1}`}>
                    <div className={styles.productImg} />
                    <div className={styles.productBar} />
                  </div>
                  <div className={`${styles.productCard} ${styles.product2}`}>
                    <div className={styles.productImg} />
                    <div className={styles.productBar} />
                  </div>
                </div>
                <div className={styles.themePill} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  E-commerce
                </div>
              </div>
            </div>

            {/* Portfolio/Creative mockup */}
            <div className={`${styles.illustrationCard} ${styles.card2}`}>
              <div className={styles.cardDots}>
                <span /><span /><span />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardUrl}>
                  <Image size={10} color="#a855f7" />
                  <span>portfolio.design</span>
                </div>
                <div className={styles.galleryGrid}>
                  <div className={`${styles.galleryItem} ${styles.gallery1}`} />
                  <div className={`${styles.galleryItem} ${styles.gallery2}`} />
                  <div className={`${styles.galleryItem} ${styles.gallery3}`} />
                  <div className={`${styles.galleryItem} ${styles.gallery4}`} />
                </div>
                <div className={styles.themePill} style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
                  Portfolio
                </div>
              </div>
            </div>

            {/* SaaS Dashboard mockup */}
            <div className={`${styles.illustrationCard} ${styles.card3}`}>
              <div className={styles.cardDots}>
                <span /><span /><span />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardUrl}>
                  <BarChart3 size={10} color="#3b82f6" />
                  <span>dashboard.app</span>
                </div>
                <div className={styles.dashboardContent}>
                  <div className={styles.dashMetrics}>
                    <div className={`${styles.metricBox} ${styles.metric1}`}>
                      <div className={styles.metricValue}>24K</div>
                    </div>
                    <div className={`${styles.metricBox} ${styles.metric2}`}>
                      <div className={styles.metricValue}>67%</div>
                    </div>
                  </div>
                  <div className={styles.chartArea}>
                    <div className={styles.chartBar} style={{ height: '40%' }} />
                    <div className={styles.chartBar} style={{ height: '70%' }} />
                    <div className={styles.chartBar} style={{ height: '55%' }} />
                    <div className={styles.chartBar} style={{ height: '85%' }} />
                  </div>
                </div>
                <div className={styles.themePill} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                  SaaS
                </div>
              </div>
            </div>

            {/* Blog mockup */}
            <div className={`${styles.illustrationCard} ${styles.card4}`}>
              <div className={styles.cardDots}>
                <span /><span /><span />
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardUrl}>
                  <Newspaper size={10} color="#ef4444" />
                  <span>blog.news.com</span>
                </div>
                <div className={styles.blogLayout}>
                  <div className={styles.blogHero} />
                  <div className={styles.blogMeta}>
                    <div className={styles.blogLine} />
                    <div className={styles.blogLineShort} />
                  </div>
                </div>
                <div className={styles.themePill} style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                  Blog
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div className={`${styles.badge} ${styles.badge1}`}>
              <Zap size={14} />
              <span>AI-Powered</span>
            </div>

            <div className={`${styles.badge} ${styles.badge2}`}>
              <CheckCircle size={14} />
              <span>98.5% Accuracy</span>
            </div>
          </div>
        </div>

        {/* Background grid pattern */}
        <div className={styles.leftGrid} />
      </div>

      {/* Right Panel - Form */}
      <div className={styles.rightPanel}>
        <button className={styles.backButton} onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          Back to Home
        </button>
        
        <div className={styles.formWrapper}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Welcome back</h2>
            <p className={styles.formSubtitle}>Sign in to start auditing</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={styles.input}
                  required
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <button type="submit" className={styles.submitBtn}>
              <LogIn size={18} />
              Sign In
            </button>
          </form>

          <div className={styles.infoBanner}>
            <Info size={16} />
            <span>Use the credentials provided in the hackathon submission document.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
