import styles from './AiLab.module.css';

export default function AiLabPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI 空間風格轉渲染 (Design Lab)</h1>
        <p className={styles.subtitle}>將手繪草稿一鍵轉換為高質感的 3D 擬真渲染圖。</p>
      </header>

      <div className={styles.workspace}>
        {/* Left: Input */}
        <div className={styles.inputPanel}>
          <div className={styles.uploader}>
            <div className={styles.uploadIcon}>🖌️</div>
            <h3>上傳手繪草稿</h3>
            <p>PNG, JPG (最大 10MB)</p>
            <button className={styles.uploadBtn}>選擇檔案</button>
          </div>
          
          <div className={styles.settings}>
            <label>設計風格 (Design Style)</label>
            <div className={styles.styleGrid}>
              <div className={`${styles.styleCard} ${styles.active}`}>
                <div className={styles.styleIcon}>❄️</div>
                <span>北歐風 (Nordic)</span>
              </div>
              <div className={styles.styleCard}>
                <div className={styles.styleIcon}>🏗️</div>
                <span>工業風 (Industrial)</span>
              </div>
              <div className={styles.styleCard}>
                <div className={styles.styleIcon}>🍱</div>
                <span>日式 (Japandi)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Output */}
        <div className={styles.outputPanel}>
          <div className={styles.resultContainer}>
            <img src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop" alt="AI Generated Rendering" />
            <div className={styles.overlay}>
              <div className={styles.progressLabel}>
                <span className={styles.dot}></span> 高擬真 3D 渲染預覽 (Gemini Nano)
              </div>
            </div>
          </div>
          <button className={styles.generateBtn}>立即生成 (Generate)</button>
        </div>
      </div>
    </div>
  );
}
