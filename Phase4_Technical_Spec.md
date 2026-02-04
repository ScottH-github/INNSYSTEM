# 相位 4 (Phase 4) 程式規格書文件 - Deployment & Production

**專案名稱：** L'Atelier OS (Fusion Rosette)
**版本：** 1.0
**日期：** 2026-02-04
**狀態：** 已完工 (Verified)

---

## 1. 部署架構 (Deployment Architecture)

Phase 4 確保應用程式能從開發環境 (Development) 順利過渡至生產環境 (Production)。

### 1.1 運行環境需求
*   **Node.js**: v18.17.0 或以上 (推薦 v20 LTS)。
*   **Database**: PostgreSQL 14+ (需支援連線池 Connection Pooling)。
*   **Package Manager**: npm 9+ 或 yarn / pnpm。

### 1.2 構建流程 (Build Pipeline)
1.  **Prisma Generation**: `npx prisma generate` (建立 Type-safe Client)。
2.  **Linting**: `npm run lint` (檢查代碼品質)。
3.  **Build**: `npm run build` (Next.js 編譯優化)。
    *   產出物：`.next/` 目錄 (Server-side bundles & Static assets)。
4.  **Database Migration**: `npx prisma migrate deploy` (同步 Schema)。

---

## 2. 環境變數配置 (.env)

| 變數名稱 | 說明 | 範例/備註 |
| :--- | :--- | :--- |
| **DATABASE_URL** | DB 連線字串 | `postgresql://user:pass@host:5432/db` |
| **AUTH_SECRET** | NextAuth 加密鑰 | `openssl rand -base64 32` 生成 |
| **AUTH_URL** | App 根網址 | 生產環境需設為真實 Domain |
| **OPENAI_API_KEY** | AI 服務金鑰 | `sk-...` (Phase 2/5 必須) |
| **GOOGLE_CLIENT_ID** | OAuth ID | Google Cloud Console 申請 |
| **GOOGLE_CLIENT_SECRET**| OAuth Secret | Google Cloud Console 申請 |

---

## 3. Next.js 配置 (next.config.ts)

*   **Output**: Standalone 模式 (推薦 Docker 部署)。
*   **Images**: 允許外部圖片網域 (如 `lh3.googleusercontent.com` 用於頭像)。
*   **i18n**: 整合 `next-intl` Plugin。

```typescript
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Config here...
};

export default withNextIntl(nextConfig);
```

---

## 4. 生產環境優化

### 4.1 靜態資源快取
*   Next.js Image Optimization 自動處理圖片壓縮 (WebP/AVIF)。
*   字體優化：使用 `next/font/google` 預先載入 Inter 字體。

### 4.2 錯誤邊界 (Error Boundaries)
*   **Global Error**: `app/global-error.tsx` 捕捉根層級錯誤。
*   **Not Found**: `app/not-found.tsx` 自定義 404 頁面。

---
