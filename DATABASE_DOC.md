# 室內設計公司應用系統 - 資料庫文件

**版本：** 1.0  
**日期：** 2026-02-04  
**技術架構：** Prisma ORM / PostgreSQL

---

## 1. 系統概述
本資料庫設計旨在支撐室內設計公司的核心營運需求，包含專案管理、動態審核流程、圖檔版本控制、AI 繪圖記錄、財務管理及工班/廠商調度。

---

## 2. 模組詳解

### 2.1 人員與權限 (Users & Auth)
管理系統使用者、角色及登入資訊。

| 資料表 | 欄位 | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **User** | id | String (CUID) | 主鍵 |
| | email | String | 電子信箱 (唯一) |
| | name | String | 姓名 |
| | passwordHash | String | 密碼雜湊 (Google 登入時為空) |
| | googleId | String | Google OAuth 唯一識別碼 |
| | avatar | String | 頭像 URL |
| | role | Enum (Role) | 角色 (ADMIN, BOSS, MANAGER, STAFF) |
| | status | Enum (Status) | 狀態 (ACTIVE, INACTIVE) |
| **ContactLog** | id | String | 主鍵 |
| | clientId | String | 關聯客戶 |
| | type | String | 聯絡類型 (MEETING, CALL, etc.) |
| | subject | String | 主旨 |
| | createdAt | DateTime | 記錄時間 |

### 2.2 客戶與專案 (Clients & Projects)
核心業務實體。

| 資料表 | 欄位 | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **Client** | id | String (CUID) | 主鍵 |
| | name | String | 客戶名稱 |
| | phone/email | String | 聯絡資訊 |
| | preferredStyle | String | 設計風格偏好 |
| **Project** | id | String (CUID) | 主鍵 |
| | name | String | 專案名稱 (如：信義區王公館) |
| | area | Float | 坪數 |
| | budget | Float | 預算範圍 |
| | status | Enum (Status) | 專案階段 (洽談、設計、施工、完工) |
| | clientId | String | 關聯客戶 |
| | designerId | String | 指派設計師 |
| | managerId | String | 指派專案經理 |
| **Contract** | id | String | 合約主鍵 |
| | contractNo | String | 合約編號 (唯一) |
| | quotationId | String | 關聯估價單 |
| | status | Enum | 合約狀態 (DRAFT, SIGNED, etc.) |
| | signedAt | DateTime | 簽署日期 |

### 2.3 彈性審核流程 (Dynamic Workflow)
支援自定義層級的審核系統。

| 資料表 | 欄位 | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **ApprovalWorkflow** | id | String | 流程模板主鍵 |
| | name | String | 流程名稱 (如：百萬級估價審核) |
| **WorkflowStep** | id | String | 步驟主鍵 |
| | workflowId | String | 所屬流程 |
| | stepOrder | Int | 審核順序 (1, 2, 3...) |
| | requiredRole | Enum (Role) | 必備審核角色 |
| | requiredUserId | String | 指定審核人員 ID |
| **ApprovalRecord** | id | String | 審核操作明細主鍵 |
| | quotationId | String | 被審核的估價單 |
| | status | Enum | 操作結果 (APPROVED, REJECTED) |
| | comment | String | 審核評語 |

### 2.4 圖檔與 AI (Drawings & AI)
管理設計內容與 AI 繪圖歷程。

| 資料表 | 欄位 | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **Drawing** | id | String | 主鍵 |
| | type | Enum | 類型 (FLOOR_PLAN, CONSTRUCTION, RENDER) |
| | filePath | String | 雲端/本地儲存路徑 |
| | version | Int | 版本號 (預設為 1) |
| **AIGenerationLog** | id | String | 主鍵 |
| | promptText | String | 生成使用的 Prompt |
| | generatedPath | String | AI 生成圖結果路徑 |
| | parameters | Json | AI 模型參數 (Seed, CFG 等) |

### 2.5 估價、工班與財務 (ERP Business)

| 資料表 | 欄位 | 類型 | 說明 |
| :--- | :--- | :--- | :--- |
| **Quotation** | id | String | 主鍵 |
| | totalAmount | Float | 總金額 |
| | currentStepOrder | Int | 目前進行到第幾層審核 |
| **QuotationItem** | id | String | 主鍵 |
| | category | String | 工種 (木作、水電等) |
| | amount | Float | 數量 * 單價 |
| **WorkCrew** | id | String | 工班負責與聯絡資訊 |
| **Vendor** | id | String | 廠商基本資料與付款帳戶 |
| **FinanceRecord** | id | String | 財務流水帳：收入 (INCOME) / 支出 (EXPENSE) |
| | quotationId | String | 關聯估價單 (用於算出單筆毛利) |
| **Schedule** | id | String | 工班排程時間區間與狀態 |

---

## 3. 列舉值定義 (Enums Reference)

- **Role**: `ADMIN`, `BOSS`, `MANAGER`, `STAFF`
- **ProjectStatus**: `DISCUSSING`, `DESIGNING`, `CONSTRUCTING`, `COMPLETED`, `CLOSED`
- **QuotationStatus**: `DRAFT`, `PENDING` (審核中), `APPROVED`, `REJECTED`, `CONTRACTED`
- **DrawingType**: `FLOOR_PLAN`, `CONSTRUCTION`, `RENDER`
- **FinanceType**: `INCOME`, `EXPENSE`

---

## 4. 關鍵設計決策
1.  **彈性審核機制**：透過 `WorkflowStep.stepOrder` 與 `Quotation.currentStepOrder` 的比對，實踐橫向擴展的審核流，不論未來是三關還是五關皆可適應。
2.  **資料完整性**：關鍵財務資料 (`QuotationItem`) 使用 CUID 確保唯一性，並透過 `onDelete: Cascade` 在估價單刪除時自動清理細項。
3.  **效能考量**：大部分索引建立於 ID 與 Email 上，並在專案、客戶等高頻率查詢欄位預留了關聯結構以利 Join 操作。
