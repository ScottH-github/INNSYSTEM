import styles from './ProjectFinancials.module.css';

interface ProjectFinancialsProps {
  totalRevenue: number;
  totalExpenses: number;
}

export default function ProjectFinancials({ totalRevenue, totalExpenses }: ProjectFinancialsProps) {
  const profit = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h3>Financial Analytics (P&L)</h3>
        <div className={styles.profitBadge} style={{ color: margin > 30 ? '#10b981' : '#f59e0b' }}>
          {margin.toFixed(1)}% Margin
        </div>
      </header>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Revenue</span>
          <span className={styles.statValue}>${totalRevenue.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Total Expenses</span>
          <span className={styles.statValue}>${totalExpenses.toLocaleString()}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Net Profit</span>
          <span className={`${styles.statValue} ${profit >= 0 ? styles.positive : styles.negative}`}>
            ${profit.toLocaleString()}
          </span>
        </div>
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartCard}>
          <h4>Expense Breakdown</h4>
          <div className={styles.mockBarChart}>
            <div className={styles.barItem}><div className={styles.barFill} style={{ height: '70%', background: '#c29d9d' }}></div><span>木作</span></div>
            <div className={styles.barItem}><div className={styles.barFill} style={{ height: '40%', background: '#9ca89c' }}></div><span>水電</span></div>
            <div className={styles.barItem}><div className={styles.barFill} style={{ height: '20%', background: '#b5b5b5' }}></div><span>石材</span></div>
          </div>
        </div>
        
        <div className={styles.chartCard}>
          <h4>Profit Health</h4>
          <div className={styles.gaugeContainer}>
            <div className={styles.gauge}>
              <div className={styles.gaugeOverlay} style={{ transform: `rotate(${margin * 1.8}deg)` }}></div>
            </div>
            <div className={styles.gaugeLabel}>Target: 35%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
