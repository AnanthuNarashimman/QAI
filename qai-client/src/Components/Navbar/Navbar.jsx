import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { Shield, LogOut } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isProtectedRoute = ['/audit', '/agent'].includes(location.pathname);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        setIsScrolled(false);
      } else if (currentScrollY > lastScrollY) {
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY) {
        setIsScrolled(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <div className={`${styles.navLeft} ${isScrolled ? styles.hidden : ''}`}>
          <div className={styles.logo} onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            <Shield size={20} />
            <span className={styles.logoText}>VibeAudit</span>
          </div>
        </div>

        <div className={`${styles.logoMinimized} ${isScrolled ? styles.visible : ''}`} onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <Shield size={24} />
        </div>

        <div className={`${styles.navCenter} ${isScrolled ? styles.hidden : ''}`}>
          <button className={styles.navLink} onClick={() => scrollTo('how-it-works')}>
            How It Works
          </button>
          <button className={styles.navLink} onClick={() => scrollTo('features')}>
            Features
          </button>
          <button className={styles.navLink} onClick={() => scrollTo('get-involved')}>
            Get Involved
          </button>
          <button className={styles.navLink} onClick={() => scrollTo('contact')}>
            Contact
          </button>
        </div>

        <div className={`${styles.navRight} ${isScrolled ? styles.hidden : ''}`}>
          {isAuthenticated && isProtectedRoute ? (
            <button
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          ) : (
            <button
              className={styles.bookDemoBtn}
              onClick={() => navigate('/login')}
            >
              Get started
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
