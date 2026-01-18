# 📦 如何安裝新的套件（Packages）

本文件說明如何在 EverShine 專案中安裝新的 npm 套件。

---

## 🚀 基本安裝指令

### 安裝生產環境套件（Production Dependencies）

套件會在 `package.json` 的 `dependencies` 區塊中：

```bash
npm install <套件名稱>
```

**範例**：
```bash
npm install axios
npm install date-fns
npm install zod
```

### 安裝開發環境套件（Development Dependencies）

套件會在 `package.json` 的 `devDependencies` 區塊中：

```bash
npm install --save-dev <套件名稱>
# 或簡寫
npm install -D <套件名稱>
```

**範例**：
```bash
npm install -D @types/node
npm install -D prettier
npm install -D vite-plugin-pwa
```

### 安裝特定版本

```bash
npm install <套件名稱>@<版本號>
```

**範例**：
```bash
npm install react@^19.2.1
npm install @supabase/supabase-js@^2.87.3
```

---

## 🔥 2025 年熱門套件推薦

### 資料驗證

```bash
npm install zod
```
- 強大的 TypeScript-first Schema 驗證
- 適合驗證表單、API 回應等

### HTTP 請求

```bash
npm install axios
# 或使用內建的 fetch（React 18+ 已支援）
```

### 日期處理

```bash
npm install date-fns
# 或
npm install dayjs  # 更輕量
```

### 狀態管理

```bash
npm install zustand  # 輕量級狀態管理
# 或
npm install @tanstack/react-query  # Server State 管理
```

### 表單處理

```bash
npm install react-hook-form
npm install @hookform/resolvers  # 配合 zod 使用
```

### UI 元件庫（可選）

```bash
npm install @radix-ui/react-dialog
npm install shadcn-ui  # 使用 shadcn/ui CLI
```

---

## 📋 安裝步驟

### 步驟 1：決定套件類型

- **生產環境**：應用程式執行時需要的套件
  - 例如：`axios`、`date-fns`、`zustand`
- **開發環境**：只有開發時需要的套件
  - 例如：`prettier`、`eslint-plugin-*`、型別定義 `@types/*`

### 步驟 2：搜尋套件

1. 前往 [npmjs.com](https://www.npmjs.com/) 搜尋
2. 檢查套件的：
   - 下載次數（Popularity）
   - 最後更新時間（Maintenance）
   - 文件完整性
   - 授權條款（License）

### 步驟 3：安裝套件

```bash
# 生產環境套件
npm install <套件名稱>

# 開發環境套件
npm install -D <套件名稱>
```

### 步驟 4：在程式碼中使用

```typescript
// 例如：安裝 zod 後
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});
```

### 步驟 5：更新 TypeScript 型別（如有需要）

如果是 JavaScript 套件，可能需要安裝型別定義：

```bash
npm install -D @types/<套件名稱>
```

**範例**：
```bash
npm install lodash
npm install -D @types/lodash
```

---

## ✅ 安裝後檢查

### 1. 確認 package.json 已更新

檢查 `package.json` 中的 `dependencies` 或 `devDependencies` 區塊。

### 2. 確認沒有衝突

```bash
npm install
```

如果安裝成功且沒有錯誤，表示沒有版本衝突。

### 3. 檢查安全性

```bash
npm audit
```

如果發現漏洞，執行：

```bash
npm audit fix
```

---

## ⚠️ 注意事項

### 1. 版本相容性

- **React 19**：確保套件支援 React 19
- **TypeScript 5.9**：確保套件有 TypeScript 支援
- **Node.js >= 20**：確保套件支援 Node 20+

### 2. 專案目前使用的技術

- **React 19.2.1**
- **TypeScript 5.9**
- **Vite 7.2.7**
- **Tailwind CSS 4.1**

安裝新套件時，請確保相容於這些版本。

### 3. 套件大小

使用 `bundle-size` 檢查套件大小，避免增加過多打包體積：

```bash
npm install -D bundle-size
```

### 4. 授權條款

確認套件的授權條款與專案相容（特別是商業用途）。

---

## 🔍 查詢已安裝的套件

### 列出所有套件

```bash
npm list
```

### 列出頂層套件（簡潔版）

```bash
npm list --depth=0
```

### 搜尋特定套件

```bash
npm list <套件名稱>
```

---

## 🗑️ 移除套件

### 移除套件

```bash
npm uninstall <套件名稱>
```

### 移除開發環境套件

```bash
npm uninstall -D <套件名稱>
```

---

## 📚 目前專案的關鍵套件

參考 `package.json`，專案目前使用的主要套件：

### 生產環境（Dependencies）

- `@supabase/supabase-js` - Supabase 客戶端
- `react` / `react-dom` - React 框架
- `react-router-dom` - 路由管理
- `framer-motion` - 動畫庫
- `chart.js` / `react-chartjs-2` - 圖表
- `browser-image-compression` - 圖片壓縮

### 開發環境（DevDependencies）

- `vite` - 建置工具
- `typescript` - TypeScript 編譯器
- `tailwindcss` - CSS 框架
- `eslint` - 程式碼檢查

---

## 💡 最佳實踐

1. **先搜尋再安裝**：確認套件品質和維護狀況
2. **固定版本**：避免自動更新造成破壞性變更
3. **定期更新**：每月執行 `npm outdated` 檢查過期套件
4. **安全性檢查**：安裝後執行 `npm audit`
5. **文件優先**：閱讀官方文件了解最佳使用方式

---

## 🔗 相關文件

- `package.json` - 查看目前安裝的套件
- `docs/SUPABASE_INTEGRATION_GUIDE.md` - Supabase 整合指南
- `ENV_SETUP.md` - 環境變數設定（某些套件需要）

---

**最後更新**：2025-01-11
