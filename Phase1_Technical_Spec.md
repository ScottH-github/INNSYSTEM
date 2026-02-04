# 相位 1 (Phase 1) 程式規格書文件

**專案名稱：** L'Atelier OS (Fusion Rosette)
**版本：** 1.0 (Phase 1 Completed)
**日期：** 2026-02-04
**狀態：** 已完工 (Verified)

---

## 1. 系統架構概覽 (System Architecture)

Phase 1 建構了系統的核心基礎設施，採用現代化的 Web 全端架構。

### 1.1 技術堆疊 (Tech Stack)
*   **前端框架**：Next.js 15 (App Router)
    *   **語言**：TypeScript 5.x
    *   **UI 庫**：Tailwind CSS (v3.4), CSS Modules
    *   **國際化**：i18n (next-intl)
*   **後端與 API**：Next.js Server Actions & API Routes
*   **資料庫 ORM**：Prisma Client (v5.x)
*   **資料庫**：PostgreSQL 14+
*   **認證授權**：NextAuth.js v5 (Google Provider)

### 1.2 目錄結構 (Directory Structure)
```
/app
  /[locale]          // i18n 路由根目錄
    /api             // 後端 API 端點
    /projects        // 專案管理頁面
    /clients         // 客戶管理頁面
    layout.tsx       // 全域佈局
    page.tsx         // 首頁
/components          // UI 元件庫
  /ui                // 基礎元件 (Button, Input...)
  Navbar.tsx         // 頂部導航
  Sidebar.tsx        // 側邊選單
/lib                 // 工具函式庫
  prisma.ts          // Prisma Client 單例
  auth.ts            // NextAuth 配置
  i18n.ts            // 語系配置
/prisma
  schema.prisma      // 資料庫模型定義
/messages            // 語系檔 (en.json, zh-TW.json)
```

---

## 2. 資料庫規格 (Database Schema)

Phase 1 實現了三個核心實體：使用者、客戶與專案。

### 2.1 使用者模型 (User)
負責系統登入與權限管理。
*   **`id`** (CUID): 主鍵
*   **`email`** (Unique): 登入信箱
*   **`googleId`** (Unique): Google OAuth ID
*   **`role`**: 角色 (ADMIN, BOSS, MANAGER, STAFF) - *預設 STAFF*
*   **`status`**: 帳號狀態 (ACTIVE, INACTIVE)

### 2.2 客戶模型 (Client)
管理業主資料，作為專案的歸屬對象。
*   **`id`** (CUID): 主鍵
*   **`name`**: 客戶姓名/名稱
*   **`phone`**: 聯絡電話
*   **`lineId`**: LINE ID
*   **`address`**: 通訊地址
*   **`preferredStyle`**: 風格偏好

### 2.3 專案模型 (Project)
系統的核心業務單元。
*   **`id`** (CUID): 主鍵
*   **`name`**: 專案名稱
*   **`status`**: 狀態 (DISCUSSING, DESIGNING, CONSTRUCTING...)
*   **`budget`**: 預算
*   **`area`**: 坪數
*   **關聯**：
    *   `clientId`: 關聯至 Client
    *   `designerId`: 關聯至 User (主責設計師)

---

## 3. API 介面規格 (API Specifications)

均採用 RESTful 風格，回傳 JSON 格式。

### 3.1 專案管理 API
*   **`GET /api/projects`**
    *   **用途**：取得專案列表
    *   **參數**：無 (未來支援 page, search)
    *   **回傳**：`Project[]` (含 Client 關聯資訊)
*   **`POST /api/projects`**
    *   **用途**：建立新專案
    *   **Body**：`{ name, clientName, ... }`
    *   **邏輯**：若 clientName 不存在，自動建立新 Client。

### 3.2 客戶 API
*   **`GET /api/clients`**
    *   **用途**：取得客戶列表
    *   **排序**：依 `createdAt` 降冪排列

---

## 4. 安全性與認證 (Security)

### 4.1 NextAuth.js 配置
*   **Provider**：Google
*   **Session Strategy**：JWT (JSON Web Token)
*   **保護機制**：`middleware.ts` 攔截所有 `/settings`, `/projects` 路徑，未登入者重導至登入頁。

### 4.2 環境變數
*   `DATABASE_URL`: PostgreSQL 連線字串
*   `AUTH_SECRET`: NextAuth 加密金鑰
*   `GOOGLE_CLIENT_ID`: OAuth 用戶端 ID
*   `GOOGLE_CLIENT_SECRET`: OAuth 用戶端密鑰

---

## 5. 國際化實作 (i18n)

*   **路由策略**：路徑前綴 (e.g., `/zh-TW/projects`, `/en/settings`)
*   **預設語系**：`zh-TW`
*   **Middleware**：自動偵測瀏覽器語系並重導。
