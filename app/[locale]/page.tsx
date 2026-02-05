import styles from './Dashboard.module.css';

export default function Home() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1 className={styles.title}>設計中心 (Design Hub)</h1>
      </header>

      <div className={styles.grid}>
        {/* AI Quick Actions */}
        <section className={`${styles.card} ${styles.col12}`} style={{ marginBottom: '2rem', background: 'linear-gradient(to right, #fbfbf9, #ffffff)' }}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>AI 智慧賦能 (AI Intelligence)</h2>
          </div>
          <div style={{ display: 'flex', gap: '2rem', padding: '0.5rem 0' }}>
            <a href="/projects/1" className={styles.aiActionBtn}>
              <div className={styles.aiIcon}>📐</div>
              <div className={styles.aiText}>
                <strong>AI 識圖自動估價</strong>
                <p>上傳平面圖，AI 自動提取工項與數量</p>
              </div>
            </a>
            <a href="/projects/1" className={styles.aiActionBtn}>
              <div className={styles.aiIcon}>🎨</div>
              <div className={styles.aiText}>
                <strong>AI 空間風格轉渲染</strong>
                <p>根據草稿生成高品質室內渲染圖</p>
              </div>
            </a>
          </div>
        </section>

        {/* Weekly Output */}
        <section className={`${styles.card} ${styles.col8}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>每週產出分析 (Weekly Output)</h2>
            <div className={styles.chartFilter}>每週數據 ˇ</div>
          </div>
          <div className={styles.chartPlaceholder}>
            {/* Simple SVG for the line chart */}
            <svg viewBox="0 0 800 200" className={styles.lineChart}>
              <path 
                d="M0,150 Q100,140 200,145 T400,100 T600,130 T800,50" 
                fill="none" 
                stroke="var(--accent-rose)" 
                strokeWidth="2" 
              />
              <circle cx="200" cy="145" r="3" fill="white" stroke="var(--accent-rose)" />
              <circle cx="400" cy="100" r="3" fill="white" stroke="var(--accent-rose)" />
              <circle cx="600" cy="130" r="3" fill="white" stroke="var(--accent-rose)" />
            </svg>
            <div className={styles.chartLabels}>
              <span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span><span>SUN</span>
            </div>
          </div>
        </section>

        {/* Inventory Health */}
        <section className={`${styles.card} ${styles.col4}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>專案健康度 (Project Health)</h2>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.donutContainer}>
            <div className={styles.donut}>
              <div className={styles.donutInner}>
                <span className={styles.donutVal}>10%</span>
                <span className={styles.donutUnit}>異常 (Error)</span>
              </div>
            </div>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={styles.dotRose}></span> 正常進度
              </div>
              <div className={styles.legendItem}>
                <span className={styles.dotGray}></span> 進度落後
              </div>
            </div>
          </div>
        </section>

        {/* Staff Metrics */}
        <section className={`${styles.card} ${styles.col4}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>團隊績效 (Team Metrics)</h2>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.staffList}>
            <div className={styles.staffItem}>
              <div className={styles.staffInfo}>
                <div className={styles.staffAvatar}>ER</div>
                <span>Elena Rossi</span>
              </div>
              <span className={styles.statPositive}>+12%</span>
            </div>
            <div className={styles.staffItem}>
              <div className={styles.staffInfo}>
                <div className={styles.staffAvatar}>JD</div>
                <span>Julien Dupont</span>
              </div>
              <span className={styles.statNeutral}>0%</span>
            </div>
            <div className={styles.staffItem}>
              <div className={styles.staffInfo}>
                <div className={styles.staffAvatar}>ML</div>
                <span>Marie Laurent</span>
              </div>
              <span className={styles.statNegative}>-4%</span>
            </div>
          </div>
        </section>

        {/* Top Services Demand */}
        <section className={`${styles.card} ${styles.col8}`}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>熱門工項需求 (Services Demand)</h2>
            <span className={styles.arrow}>›</span>
          </div>
          <div className={styles.barChart}>
            {[
              { label: '拆除工程', val: 40, color: 'var(--accent-sage)' },
              { label: '泥作工程', val: 75, color: 'var(--accent-rose)' },
              { label: '水電工程', val: 50, color: 'var(--accent-gray)' },
              { label: '木作工程', val: 90, color: 'var(--accent-sage)' },
              { label: '油漆工程', val: 30, color: 'var(--accent-gray)' },
            ].map((item, i) => (
              <div key={i} className={styles.barItem}>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ height: `${item.val}%`, backgroundColor: item.color }}></div>
                </div>
                <span className={styles.barLabel}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
