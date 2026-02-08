import { useNavigate } from 'react-router-dom';
import styles from './HistoryPage.module.css';
import AuthNavbar from '../Components/Navbar/AuthNavbar';
import { History, Clock, FileText, TrendingUp } from 'lucide-react';

function HistoryPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <AuthNavbar />
      
      <div className={styles.content}>
        <div className={styles.comingSoonWrapper}>
          <div className={styles.iconCircle}>
            <History size={48} />
          </div>
          
          <h1 className={styles.title}>Audit History</h1>
          <p className={styles.subtitle}>
            Your complete audit history and reports will appear here
          </p>

          <div className={styles.featuresList}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <Clock size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>Timeline View</h3>
                <p>Browse all your audits chronologically</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <FileText size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>Detailed Reports</h3>
                <p>Access full audit reports with insights</p>
              </div>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <TrendingUp size={20} />
              </div>
              <div className={styles.featureText}>
                <h3>Progress Tracking</h3>
                <p>Monitor improvements over time</p>
              </div>
            </div>
          </div>

          <div className={styles.comingSoonBadge}>
            <span className={styles.pulse}></span>
            Coming Soon
          </div>

          <button 
            className={styles.backBtn}
            onClick={() => navigate('/agent')}
          >
            Start New Audit
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
