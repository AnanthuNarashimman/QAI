import styles from './Navbar.module.css';
import {Bot, ClipboardClock, LibraryBig, Shield} from 'lucide-react';

function Navbar() {
  return (
    <nav className={styles.nav}>
      <div className={styles.navLeft}>
        <div className={styles.logo}>
          <Shield size={22} />
          <span className={styles.logoText}>VibeAudit</span>
        </div>
      </div>

      <div className={styles.navCenter}>
        <button className={`${styles.navTab} ${styles.navTabActive}`}>
          <Bot size={21}/>
          Agent
        </button>
        <button className={styles.navTab}>
          <ClipboardClock size={20}/>
          History
        </button>
        <button className={styles.navTab}>
          <LibraryBig size={20} />
          Resources
        </button>
      </div>

      <div className={styles.navRight}>
        <button className={styles.getStartedBtn}>Contact</button>
      </div>
    </nav>
  );
}

export default Navbar;
