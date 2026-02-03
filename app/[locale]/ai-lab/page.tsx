import styles from './AiLab.module.css';

export default function AiLabPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>AI Design Lab</h1>
        <p className={styles.subtitle}>Transform your sketches into high-fidelity interior renderings.</p>
      </header>

      <div className={styles.workspace}>
        {/* Left: Input */}
        <div className={styles.inputPanel}>
          <div className={styles.uploader}>
            <div className={styles.uploadIcon}>🖌️</div>
            <h3>Upload Hand-Drawn Sketch</h3>
            <p>PNG, JPG up to 10MB</p>
            <button className={styles.uploadBtn}>Select File</button>
          </div>
          
          <div className={styles.settings}>
            <label>Design Style</label>
            <div className={styles.styleGrid}>
              <div className={`${styles.styleCard} ${styles.active}`}>
                <div className={styles.styleIcon}>❄️</div>
                <span>Nordic</span>
              </div>
              <div className={styles.styleCard}>
                <div className={styles.styleIcon}>🏗️</div>
                <span>Industrial</span>
              </div>
              <div className={styles.styleCard}>
                <div className={styles.styleIcon}>🍱</div>
                <span>Japandi</span>
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
                <span className={styles.dot}></span> High-Fidelity 3D Rendering (Gemini Nano Banana 2.5)
              </div>
            </div>
          </div>
          <button className={styles.generateBtn}>Generate Masterpiece</button>
        </div>
      </div>
    </div>
  );
}
