# 相位 5 (Phase 5) 程式規格書文件 - Real Data Intelligence

**專案名稱：** L'Atelier OS (Fusion Rosette)
**版本：** 1.0
**日期：** 2026-02-04
**狀態：** 已完工 (Verified)

---

## 1. 系統模組概覽 (Module Overview)

Phase 5 完成了「真實數據整合」，將 Mock AI 替換為真實 API，並建立「工項資料庫」作為估價中樞。

### 1.1 核心功能
*   **Item Library CRUD**: 工項資料庫管理介面。
*   **Real AI Integration**: 串接 OpenAI API 進行真實圖像分析。
*   **Smart Pricing**: AI 辨識結果自動對應資料庫單價。

---

## 2. API 介面規格

### 2.1 工項資料庫 API
*   **`GET /api/library`**
    *   **回傳**: `ItemLibrary[]`
    *   **用途**: 前端快取標準工項列表，供 AI 估價引擎比對使用。
*   **`POST /api/library`**
    *   **Body**: `{ category, name, spec, unit, unitPrice }`
    *   **用途**: 新增標準工項。

### 2.2 智慧估價邏輯 (Smart Pricing Logic)
位於 `lib/quotation-engine.ts`:
1.  **Input**: AI 偵測標籤 (e.g., "Wall", "Floor")。
2.  **Matching**:
    *   遍歷 `LibraryItems`。
    *   關鍵字模糊比對 (Fuzzy Match)：`Item.name` contains `AI.label` (Case-insensitive)。
    *   若匹配成功 -> 使用資料庫 `unitPrice`。
    *   若匹配失敗 -> 使用 AI 預估價或預設值。

---

## 3. 前端實作

### 3.1 Library Settings
*   **路徑**: `app/[locale]/settings/library/page.tsx`
*   **功能**:
    *   表格列表展示所有工項。
    *   Modal 表單新增/編輯工項。
    *   即時寫入資料庫並更新 UI。

### 3.2 估價流程整合
在 `ProjectDetail` 頁面：
*   **Pre-fetch**: 頁面載入時 (`useEffect`) 預先抓取 `/api/library`。
*   **Context Passing**: 將 Library Data 傳入 `generateQuotationStart()` 函式。

---

## 4. 資料庫模型 (Prisma)

### 4.1 ItemLibrary
```prisma
model ItemLibrary {
  id        String   @id @default(cuid())
  category  String   // e.g. "Painting", "Flooring"
  name      String   // e.g. "Dulux Emulsion Paint"
  spec      String?  // e.g. "Three coats"
  unit      String   // e.g. "m2", "ping"
  unitPrice Float    // e.g. 1500
  createdAt DateTime @default(now())
}
```

---
