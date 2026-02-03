'use client';

import { useState } from 'react';
import styles from './ProjectDetail.module.css';
import ProjectFinancials from '@/components/ProjectFinancials';

export default function ProjectDetail() {
  const [activeTab, setActiveTab] = useState<'estimation' | 'contract' | 'financials'>('estimation');

  return (
    <div className={styles.workspace}>
      <header className={styles.header}>
        <div className={styles.topInfo}>
          <div className={styles.breadcrumb}>
            <span>Projects</span> / <span>大安區王公館建案</span>
          </div>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'estimation' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('estimation')}
            >
              Estimation (AI)
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'contract' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('contract')}
            >
              Contract
            </button>
            <button 
              className={`${styles.tabBtn} ${activeTab === 'financials' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('financials')}
            >
              Financials
            </button>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.secondaryBtn}>Save Draft</button>
          <button className={styles.primaryBtn}>Submit for Review</button>
        </div>
      </header>

      <div className={styles.mainLayout}>
        {activeTab === 'estimation' && (
          <>
            {/* Left: AI Canvas */}
            <div className={styles.canvasContainer}>
              <div className={styles.canvasHeader}>
                <h3>Floor Plan Analysis</h3>
                <div className={styles.aiStatus}>
                  <span className={styles.pulse}></span> AI Vision Active
                </div>
              </div>
              <div className={styles.viewport}>
                <div className={styles.imageWrapper}>
                  <img src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?q=80&w=1000&auto=format&fit=crop" alt="Floor Plan" />
                  <div className={`${styles.detectionBox} ${styles.livingRoom}`} style={{ top: '20%', left: '15%', width: '40%', height: '35%' }}>
                    <span className={styles.boxLabel}>Living Room (12.5 Ping)</span>
                  </div>
                  <div className={`${styles.detectionBox} ${styles.kitchen}`} style={{ top: '60%', left: '15%', width: '25%', height: '25%' }}>
                    <span className={styles.boxLabel}>Kitchen</span>
                  </div>
                </div>
              </div>
              <div className={styles.canvasFooter}>
                <p>AI identified 12 items. Drag to adjust areas or right-click to add markers.</p>
              </div>
            </div>

            {/* Right: Estimation Editor */}
            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <h3>Automated Estimation</h3>
                <button className={styles.aiFixBtn}>🤖 AI Assistant</button>
              </div>
              
              <div className={styles.estimateContent}>
                <div className={styles.section}>
                  <div className={styles.sectionHead}>
                    <h4>1. 客廳工程</h4>
                    <span className={styles.sectionTotal}>$125,000</span>
                  </div>
                  <div className={styles.itemList}>
                    <div className={styles.item}>
                      <div className={styles.itemMain}>
                        <span className={styles.itemName}>平釘天花板 (中日矽酸鈣板)</span>
                        <span className={styles.itemSpec}>永新集成角材, 12.5 坪</span>
                      </div>
                      <span className={styles.itemPrice}>$43,750</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.editorFooter}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>$170,000</span>
                </div>
                <div className={styles.aiChat}>
                  <input type="text" placeholder="Ask AI to modify..." />
                  <button>➔</button>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'contract' && (
          <div className={styles.fullWidthContent}>
            <div className={styles.contractPreview}>
              <div className={styles.contractHeader}>
                <h3>Contract: #CTR-2026-001</h3>
                <span className={styles.statusBadge}>DRAFT</span>
              </div>
              <div className={styles.contractBody}>
                <p><strong>甲方：</strong> 王小明</p>
                <p><strong>乙方：</strong> L'Atelier 室內設計</p>
                <div className={styles.placeholderDoc}>
                  [ 合約條款預覽區域 ]
                  <br/>
                  根據估價單 #QT-2026-04 產生，總金額 $1,250,000
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className={styles.fullWidthContent}>
            <ProjectFinancials totalRevenue={1250000} totalExpenses={850000} />
          </div>
        )}
      </div>
    </div>
  );
}
