import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <span className={styles.companyName}>INNSPACE OS</span>
        </div>
        
        <ul className={styles.navLinks}>
          <li><Link href="/" className={styles.link}>首頁</Link></li>
          <li><Link href="/products" className={styles.link}>產品</Link></li>
          <li><Link href="/about" className={styles.link}>關於我們</Link></li>
        </ul>

        <div className={styles.userSection}>
          <button className={styles.iconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </button>
          <button className={styles.iconBtn}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          <div className={styles.avatar}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
          </div>
          <form action={async () => {
            'use server';
            const { handleSignOut } = await import('@/lib/actions');
            await handleSignOut();
          }}>
            <button className={styles.iconBtn} title="Sign Out">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                   <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                   <polyline points="16 17 21 12 16 7"></polyline>
                   <line x1="21" y1="12" x2="9" y2="12"></line>
                 </svg>
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
