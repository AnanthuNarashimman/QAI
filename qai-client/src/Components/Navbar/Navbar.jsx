import { useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { Shield, ChevronDown } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <div className={styles.navLeft}>
          <div className={styles.logo} onClick={() => navigate('/')}>
            <Shield size={20} />
            <span className={styles.logoText}>VibeAudit</span>
          </div>
        </div>

        <div className={styles.navCenter}>
          <button className={styles.navLink}>
            Product
            <ChevronDown size={14} />
          </button>
          <button className={styles.navLink} onClick={() => navigate('/agent')}>
            Why us
          </button>
          <button className={styles.navLink}>
            About us
          </button>
          <button className={styles.navLink}>
            Resources
          </button>
        </div>

        <div className={styles.navRight}>
          <button
            className={styles.bookDemoBtn}
            onClick={() => navigate('/agent')}
          >
            Get started
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
