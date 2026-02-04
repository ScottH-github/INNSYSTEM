'use client';

import { useState } from 'react';
import styles from './ProjectDetail.module.css';
import ProjectFinancials from '@/components/ProjectFinancials';

import AIAnnotator from '@/components/AIAnnotator';
import ContractPreview from '@/components/contract/ContractPreview';

import { generateQuotationStart, QuotationItem } from '@/lib/quotation-engine';

export default function ProjectDetail() {
  const [activeTab, setActiveTab] = useState<'estimation' | 'contract' | 'financials'>('estimation');
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [libraryItems, setLibraryItems] = useState<any[]>([]);

  // Phase 5: Fetch Item Library
  useState(() => {
    fetch('/api/library')
      .then(res => res.json())
      .then(data => setLibraryItems(data))
      .catch(err => console.error(err));
  });

  const handleAIComplete = (data: any) => {
    if (data.detections) {
      // Pass libraryItems to the generator
      const newItems = generateQuotationStart(data.detections, libraryItems);
      setQuotationItems(newItems);
    }
  };

  const totalAmount = quotationItems.reduce((sum, item) => sum + item.totalPrice, 0);


  return (
    <div className={styles.workspace}>
// ...
      <div className={styles.mainLayout}>
        {activeTab === 'estimation' && (
          <>

            {/* Left: AI Canvas */}
            <div className={styles.canvasContainer}>
              <div className={styles.canvasHeader}>
                <h3>Floor Plan Analysis</h3>
              </div>
              <div className={styles.viewport}>
                <AIAnnotator 
                  initialImage={null} 
                  onAnalysisComplete={handleAIComplete}
                />
              </div>
            </div>

            {/* Right: Estimation Editor */}
            <div className={styles.editorContainer}>
              <div className={styles.editorHeader}>
                <h3>Automated Estimation</h3>
                <button className={styles.aiFixBtn}>🤖 AI Assistant</button>
              </div>
              
              <div className={styles.estimateContent}>
                {quotationItems.length === 0 ? (
                  <div style={{padding: '2rem', textAlign: 'center', color: '#888'}}>
                    Analyzing floor plan... Results will appear here.
                  </div>
                ) : (
                  <div className={styles.section}>
                    <div className={styles.sectionHead}>
                      <h4>AI Generated Items</h4>
                      <span className={styles.sectionTotal}>${totalAmount.toLocaleString()}</span>
                    </div>
                    <div className={styles.itemList}>
                      {quotationItems.map(item => (
                        <div key={item.id} className={styles.item}>
                          <div className={styles.itemMain}>
                            <span className={styles.itemName}>{item.name}</span>
                            <span className={styles.itemSpec}>{item.specification}, {item.quantity} {item.unit}</span>
                          </div>
                          <span className={styles.itemPrice}>${item.totalPrice.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.editorFooter}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span>${totalAmount.toLocaleString()}</span>
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
            <div className={styles.contractToolbar} style={{marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem'}}>
               <span className={styles.statusBadge}>DRAFT</span>
               <button className={styles.secondaryBtn} onClick={() => window.print()}>🖨️ Print / Export PDF</button>
            </div>
            <div className={styles.contractScroll}>
              <ContractPreview 
                project={{
                   name: '大安區王公館建案',
                   clientName: '王小明',
                   address: '台北市大安區和平東路二段',
                   date: new Date().toLocaleDateString()
                }}
                items={quotationItems.length > 0 ? quotationItems : [
                  {id: 'demo1', category: '拆除工程', name: '全室拆除', specification: '含清運', quantity: 1, unit: '式', unitPrice: 85000, totalPrice: 85000}
                ]}
                totalAmount={quotationItems.length > 0 ? totalAmount : 85000}
              />
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
