'use client';

import { useState } from 'react';
import styles from './Workflow.module.css';

interface WorkflowStage {
  id: string;
  name: string;
  role: string;
  description: string;
}

const initialStages: WorkflowStage[] = [
  { id: '1', name: '主管初審', role: 'MANAGER', description: '針對預算細項進行初步技術審查' },
  { id: '2', name: '老闆複審', role: 'BOSS', description: '高額案件最後確認' },
];

export default function WorkflowPage() {
  const [stages, setStages] = useState<WorkflowStage[]>(initialStages);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);

  const handleAddStage = (index: number) => {
    const newStage: WorkflowStage = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'New Stage',
      role: 'STAFF',
      description: 'Description here...'
    };
    const newStages = [...stages];
    newStages.splice(index + 1, 0, newStage);
    setStages(newStages);
    setSelectedStageId(newStage.id);
  };

  const handleDeleteStage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this stage?')) {
      setStages(stages.filter(s => s.id !== id));
      if (selectedStageId === id) setSelectedStageId(null);
    }
  };

  const selectedStage = stages.find(s => s.id === selectedStageId);

  const updateSelectedStage = (field: keyof WorkflowStage, value: string) => {
    if (!selectedStageId) return;
    setStages(stages.map(s => 
      s.id === selectedStageId ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Workflow Configurator</h1>
          <p className={styles.subtitle}>Define flexible approval stages for your estimations and contracts.</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryBtn}>Templates</button>
          <button className={styles.primaryBtn} onClick={() => alert('Workflow Saved!')}>Save Flow</button>
        </div>
      </header>

      <div className={styles.canvas}>
        <div className={styles.workflowContainer}>
          {/* Start Node */}
          <div className={styles.nodeStart}>
            <div className={styles.nodeCircle}></div>
            <span>Submission</span>
          </div>

          <div className={styles.connector}>
             <button className={styles.addStep} onClick={() => handleAddStage(-1)}>+</button>
          </div>

          {/* Dynamic Stages */}
          {stages.map((stage, index) => (
            <div key={stage.id} className={styles.stageWrapper}>
              <div 
                className={`${styles.nodeStage} ${selectedStageId === stage.id ? styles.active : ''}`}
                onClick={() => setSelectedStageId(stage.id)}
              >
                <div className={styles.nodeContent}>
                  <div className={styles.nodeHeader}>
                    <span className={styles.stepBadge}>Stage {index + 1}</span>
                    <button className={styles.deleteBtn} onClick={(e) => handleDeleteStage(stage.id, e)}>×</button>
                  </div>
                  <h3>{stage.name}</h3>
                  <div className={styles.roleTag}>{stage.role}</div>
                  <p>{stage.description}</p>
                </div>
              </div>
              <div className={styles.connector}>
                <button className={styles.addStep} onClick={() => handleAddStage(index)}>+</button>
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
          {selectedStage ? (
            <>
              <h3>Stage Details</h3>
              <div className={styles.formGroup}>
                <label>Stage Name</label>
                <input 
                  type="text" 
                  value={selectedStage.name} 
                  onChange={(e) => updateSelectedStage('name', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                  <label>Description</label>
                  <input 
                    type="text" 
                    value={selectedStage.description} 
                    onChange={(e) => updateSelectedStage('description', e.target.value)}
                  />
              </div>
              <div className={styles.formGroup}>
                <label>Assign to Role</label>
                <select 
                  value={selectedStage.role}
                  onChange={(e) => updateSelectedStage('role', e.target.value)}
                >
                  <option value="STAFF">STAFF</option>
                  <option value="MANAGER">MANAGER</option>
                  <option value="BOSS">BOSS</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Conditions</label>
                <div className={styles.condition}>Amount {'>'} $100,000</div>
              </div>
            </>
          ) : (
            <div className={styles.emptyPanel}>
              <p>Select a stage to edit its properties.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
