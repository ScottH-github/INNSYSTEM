# 相位 2 (Phase 2) 程式規格書文件 - AI Core Features

**專案名稱：** L'Atelier OS (Fusion Rosette)
**版本：** 1.0
**日期：** 2026-02-04
**狀態：** 已完工 (Verified)

---

## 1. 系統模組概覽 (Module Overview)

Phase 2 核心目標為實作「AI 視覺估價引擎」，整合平面圖圖像辨識與即時標註互動。

### 1.1 核心功能
*   **Nano Banana 模擬服務**：提供開發階段的快速 Mock AI 回應。
*   **OpenAI GPT-4o 整合**：生產環境真實圖像辨識。
*   **AI Annotator Canvas**：基於 HTML5 Canvas 的互動式標註介面。
*   **Auto Quotation Engine**：估價單自動生成邏輯。

---

## 2. AI 服務架構 (AI Architecture)

### 2.1 雙模引擎 (Dual-Engine Strategy)
*   **介面定義** (`DetectionResult`):
    ```typescript
    interface DetectionResult {
      label: string;      // 物件標籤 (e.g. window, door)
      confidence: number; // 信心分數 (0.0 - 1.0)
      box: {              // 邊框座標 (百分比)
        x: number; y: number; width: number; height: number;
      };
      estimatedPrice?: number;
    }
    ```
*   **路由設計** (`/api/ai/analyze`):
    *   接收 Base64 圖像。
    *   優先檢查 `OPENAI_API_KEY` 環境變數。
    *   若有 Key 則呼叫 GPT-4o Vision API。
    *   若無 Key 或 API 失敗，自動回退至 `NanoBanana` Mock 服務。

### 2.2 Prompt Engineering (GPT-4o)
*   **Role**: "Professional Interior Design Estimator"
*   **Task**: 分析平面圖並輸出 JSON 格式的物件列表。
*   **Output Format**: 強制 JSON Object 模式，確保解析穩定性。

---

## 3. 前端互動規格 (Frontend Interaction)

### 3.1 AIAnnotator Component
*   **路徑**: `components/AIAnnotator.tsx`
*   **技術**: React + HTML5 Canvas API
*   **功能**:
    1.  **Image Rendering**: 自動縮放圖片適應視窗。
    2.  **Bounding Box**: 繪製 AI 偵測到的物件紅框。
    3.  **Tooltip**: 滑鼠懸停顯示物件名稱與信心分數。
    4.  **Click Event**: 點擊框體觸發父層 `handleAIComplete`。

### 3.2 Quotation Generation
*   **路徑**: `lib/quotation-engine.ts`
*   **邏輯**:
    *   接收 `DetectionResult[]`。
    *   依據 `label` 查找 `ItemLibrary` (Phase 5 整合)。
    *   計算 `quantity` (預設 1 或依據 box area 估算)。
    *   產出 `QuotationItem[]` 供 React State 使用。

---

## 4. 資料庫變更 (Database Changes)

### 4.1 新增模型
*   **`Drawing`**: 儲存上傳的平面圖路徑與版本。
*   **`AIGenerationLog`**: 記錄 AI 呼叫歷程 (Prompt, Result, User Feedback) 以利未來微調。

---

## 5. API 規格詳細

### 5.1 分析端點
*   **`POST /api/ai/analyze`**
    *   **Body**: `{ image: "base64...", projectId: "..." }`
    *   **Response**: `{ detections: DetectionResult[], usage: { tokens: ... } }`

---
