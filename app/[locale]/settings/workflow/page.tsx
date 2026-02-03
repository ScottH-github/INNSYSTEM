import styles from './Workflow.module.css';

const stages = [
  { id: '1', name: '主管初審', role: 'MANAGER', description: '針對預算細項進行初步技術審查' },
  { id: '2', name: '老闆複審', role: 'BOSS', description: '高額案件最後確認' },
];

export default function WorkflowPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Workflow Configurator</h1>
          <p className={styles.subtitle}>Define flexible approval stages for your estimations and contracts.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryBtn}>Templates</button>
          <button className={styles.primaryBtn}>Save Flow</button>
        </div>
      </header>

      <div className={styles.canvas}>
        <div className={styles.workflowContainer}>
          {/* Start Node */}
          <div className={styles.nodeStart}>
            <div className={styles.nodeCircle}></div>
            <span>Submission</span>
          </div>

          <div className={styles.connector}></div>

          {/* Dynamic Stages */}
          {stages.map((stage, index) => (
            <div key={stage.id} className={styles.stageWrapper}>
              <div className={styles.nodeStage}>
                <div className={styles.nodeContent}>
                  <div className={styles.nodeHeader}>
                    <span className={styles.stepBadge}>Stage {index + 1}</span>
                    <button className={styles.deleteBtn}>×</button>
                  </div>
                  <h3>{stage.name}</h3>
                  <div className={styles.roleTag}>{stage.role}</div>
                  <p>{stage.description}</p>
                </div>
              </div>
              <div className={styles.connector}>
                <button className={styles.addStep}>+</button>
              </div>
            </div>
          ))}

          {/* End Node */}
          <div className={styles.nodeEnd}>
            <div className={styles.nodeCircle}></div>
            <span>Approved</span>
          </div>
        </div>

        {/* Sidebar Info */}
        <aside className={styles.configPanel}>
          <h3>Stage Details</h3>
          <div className={styles.formGroup}>
            <label>Stage Name</label>
            <input type="text" defaultValue="主管初審" />
          </div>
          <div className={styles.formGroup}>
            <label>Assign to Role</label>
            <select>
              <option>MANAGER</option>
              <option>BOSS</option>
              <option>ADMIN</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Conditions</label>
            <div className={styles.condition}>Amount {'>'} $100,000</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
