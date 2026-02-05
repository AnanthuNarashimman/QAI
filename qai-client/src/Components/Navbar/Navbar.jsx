import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { Shield, ChevronDown } from 'lucide-react';

function Navbar() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setIsScrolled(false);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsScrolled(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up
        setIsScrolled(false);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <div className={`${styles.navLeft} ${isScrolled ? styles.hidden : ''}`}>
          <div className={styles.logo} onClick={() => navigate('/')}>
            <Shield size={20} />
            <span className={styles.logoText}>VibeAudit</span>
          </div>
        </div>

        <div className={`${styles.logoMinimized} ${isScrolled ? styles.visible : ''}`} onClick={() => navigate('/')}>
          <Shield size={24} />
        </div>

        <div className={`${styles.navCenter} ${isScrolled ? styles.hidden : ''}`}>
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

        <div className={`${styles.navRight} ${isScrolled ? styles.hidden : ''}`}>
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
