# 相位 3 (Phase 3) 程式規格書文件 - Workflows & Contracts

**專案名稱：** L'Atelier OS (Fusion Rosette)
**版本：** 1.0
**日期：** 2026-02-04
**狀態：** 已完工 (Verified)

---

## 1. 系統模組概覽 (Module Overview)

Phase 3 專注於業務邏輯的深化，包含「彈性審核流程」配置與「合約文件」的自動生成。

### 1.1 核心功能
*   **Workflow Configurator**: 動態配置專案審核關卡。
*   **Contract Engine**: 估價單轉合約邏輯。
*   **PDF Generation**: 前端列印友善 (Print-friendly) 樣式表。

---

## 2. 工作流引擎 (Workflow Engine)

### 2.1 設定介面
*   **路徑**: `app/[locale]/settings/workflow/page.tsx`
*   **功能**:
    *   管理 `WorkflowStage` (主管初審、老闆複審)。
    *   定義每個階段的 `Role` (MANAGER, BOSS) 與權限。
    *   CRUD 操作：動態新增/刪除/排序審核節點。
*   **狀態管理**: 使用 React 狀態管理暫存設定，透過 Server Actions 寫入 `ApprovalWorkflow` table。

### 2.2 資料庫模型
*   **`ApprovalWorkflow`**: 定義流程範本。
*   **`WorkflowStep`**: 定義具體的關卡與順序 (`stepOrder`)。
*   **`ApprovalRecord`**: 記錄實際專案中的簽核歷程 (Approver, Status, Comment)。

---

## 3. 合約生成系統 (Contract System)

### 3.1 合約預覽元件
*   **路徑**: `components/contract/ContractPreview.tsx`
*   **特性**:
    *   **所見即所得 (WYSIWYG)**: 右側即時預覽，資料與左側估價單同步。
    *   **動態條款**: 根據總金額自動計算付款階段 (30%, 30%, 30%, 10%)。
    *   **CSS Print Media Query**: 
        ```css
        @media print {
          .no-print { display: none; }
          .contract-page { width: 100%; border: none; }
        }
        ```

### 3.2 資料流轉
1.  **Quotation Approved**: 當估價單狀態變更為 `APPROVED`。
2.  **Generate Contract**: 系統自動建立 `Contract` 記錄 (Status: DRAFT)。
3.  **Assign ID**: 自動生成合約編號 (e.g., `CTR-{YR}-{SEQ}`).

---

## 4. 前端路由與權限

### 4.1 設定頁面保護
*   `/settings/workflow` 僅限 `ADMIN` 或 `BOSS` 角色存取。
*   透過 `middleware.ts` 結合 `auth.ts` 驗證 User Role。

### 4.2 專案內頁整合
*   **Tabs UI**: 在 Project Detail 頁面新增 `Estimation | Contract | Financials` 分頁切換。
*   **Contract Tab**: 僅在估價單有項目時啟用 (Conditional Rendering)。

---
