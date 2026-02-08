import { useNavigate, useLocation } from 'react-router-dom';
import styles from './AuthNavbar.module.css';
import { Shield, LogOut, History, BookOpen } from 'lucide-react';

function AuthNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <div className={styles.navLeft}>
          <div className={styles.logo} onClick={() => navigate('/agent')}>
            <Shield size={22} />
            <span className={styles.logoText}>VibeAudit</span>
          </div>
        </div>

        <div className={styles.navCenter}>
          <button
            className={`${styles.navLink} ${isActive('/agent') || isActive('/audit') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/agent')}
          >
            Agent
          </button>
          <button className={styles.navLink} disabled>
            <History size={16} />
            History
          </button>
          <button
            className={`${styles.navLink} ${isActive('/resources') ? styles.navLinkActive : ''}`}
            onClick={() => navigate('/resources')}
          >
            <BookOpen size={16} />
            Resources
          </button>
        </div>

        <div className={styles.navRight}>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default AuthNavbar;
