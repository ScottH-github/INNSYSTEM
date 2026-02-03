'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AIAnnotator.module.css';
import { DetectionResult } from '@/lib/ai/nano-banana';

interface AIAnnotatorProps {
  initialImage: string | null;
  onAnalysisComplete?: (results: any) => void;
}

export default function AIAnnotator({ initialImage, onAnalysisComplete }: AIAnnotatorProps) {
  const [image, setImage] = useState<string | null>(initialImage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState<DetectionResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    // const previewUrl = URL.createObjectURL(file);
    // setImage(previewUrl); 
    // ^ No, wait for API to generic standardized base64 or URL

    setIsAnalyzing(true);
    setDetections([]);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      if (data.imageUrl) {
        setImage(data.imageUrl);
        setDetections(data.detections);
        if (onAnalysisComplete) onAnalysisComplete(data);
      }
    } catch (err) {
      console.error(err);
      alert('Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainStage}>
        {image ? (
          <div className={styles.imageWrapper}>
            <img src={image} alt="Floor Plan" className={styles.floorPlan} />
            {detections.map(det => (
              <div
                key={det.id}
                className={styles.detectionBox}
                style={{
                  left: `${det.box.x}%`,
                  top: `${det.box.y}%`,
                  width: `${det.box.width}%`,
                  height: `${det.box.height}%`,
                }}
              >
                <div className={styles.label}>
                  {det.label} <span className={styles.confidence}>{Math.round(det.confidence * 100)}%</span>
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className={styles.scanningOverlay}>
                 <div className={styles.scanLine}></div>
                 <div className={styles.scanText}>AI Analysis in Progress...</div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState} onClick={() => fileInputRef.current?.click()}>
            <div className={styles.uploadIcon}>☁️</div>
            <h3>Upload Floor Plan</h3>
            <p>Drag & drop or Click to browse</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          hidden 
          accept="image/*" 
          onChange={handleUpload} 
        />
      </div>
      
      <div className={styles.sidebar}>
        <h3>AI Insights</h3>
        {isAnalyzing ? (
           <div className={styles.loadingList}>
             <div className={styles.skeleton}></div>
             <div className={styles.skeleton}></div>
             <div className={styles.skeleton}></div>
           </div>
        ) : detections.length > 0 ? (
          <div className={styles.resultsList}>
            <div className={styles.summaryCard}>
              <h4>Detected Objects</h4>
              <span className={styles.countBadge}>{detections.length} items</span>
            </div>
            {detections.map(det => (
              <div key={det.id} className={styles.resultItem}>
                 <div className={styles.resultIcon}>
                   {det.label === 'window' ? '🪟' : det.label === 'sofa' ? '🛋️' : '📦'}
                 </div>
                 <div className={styles.resultInfo}>
                   <div className={styles.resultName}>{det.label.toUpperCase()}</div>
                   <div className={styles.resultMeta}>Est. ${det.estimatedPrice?.toLocaleString()}</div>
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.placeholderText}>
            Upload a floor plan to see AI detection results and cost estimation.
          </div>
        )}
      </div>
    </div>
  );
}
