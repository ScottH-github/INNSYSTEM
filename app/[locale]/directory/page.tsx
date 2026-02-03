import styles from './Directory.module.css';

const vendors = [
  { id: '1', name: 'Craft & Hew', type: '木作工程', rating: 5, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CH', color: '#c29d9d' },
  { id: '2', name: 'Volt Solutions', type: '水電工程', rating: 4, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=VS', color: '#9ca89c' },
  { id: '3', name: 'Wilse Beriton', type: '石材供應', rating: 5, avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=WB', color: '#b5b5b5' },
];

export default function DirectoryPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Vendor Directory</h1>
        <div className={styles.filters}>
          <button className={`${styles.filterChip} ${styles.active}`}>All</button>
          <button className={styles.filterChip}>Woodwork</button>
          <button className={styles.filterChip}>Electrical</button>
          <button className={styles.filterChip}>Stones</button>
        </div>
      </header>

      <div className={styles.grid}>
        {vendors.map((v) => (
          <div key={v.id} className={styles.card}>
            <div className={styles.cardHeader} style={{ backgroundColor: v.color }}>
              <div className={styles.avatar}>
                <img src={v.avatar} alt={v.name} />
              </div>
            </div>
            <div className={styles.cardBody}>
              <h3>{v.name}</h3>
              <div className={styles.rating}>
                {'★'.repeat(v.rating)}{'☆'.repeat(5 - v.rating)}
              </div>
              <p className={styles.type}>{v.type}</p>
              <div className={styles.services}>
                <span>🪚</span> <span>⚡</span> <span>🪨</span>
              </div>
              <button className={styles.catalogBtn}>View Catalog</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
