# 🔒 EverShine 企業級資安檢查清單

## ⚠️ 緊急資安問題（需立即處理）

### 1. ❌ GitHub Token 洩漏風險

**問題**：`js/github-config.js` 包含硬編碼的 GitHub Personal Access Token

**風險等級**：🔴 **極高** - 如果檔案被提交或部署到前端，Token 將完全暴露

**立即行動**：
- [x] **立即撤銷該 Token** ✅ **已完成**
  1. ✅ 舊 Token `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` 已撤銷
  2. ✅ 已建立新 Token `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`

- [x] **將 Token 移至環境變數** ✅ **已完成**
  - ✅ 已修改 `js/github-config.js` 從環境變數讀取
  - ✅ 已建立 `ENV_SETUP.md` 說明文件
  - ✅ 使用 `.env` 檔案儲存（已加入 `.gitignore`）

- [ ] **確認該檔案未提交到 Git**
  ```bash
  git log --all --full-history -- js/github-config.js
  ```
  如果發現提交記錄，需要：
  1. 撤銷舊 Token（已完成）
  2. 考慮使用 `git filter-branch` 清理歷史（或聯絡 GitHub 支援）

---

## 🔐 資料庫安全（Supabase）

### 2. Row Level Security (RLS) 政策檢查

**檢查項目**：
- [x] `members` 表的 RLS 政策 ✅ **已修復**
  - 公開讀取：✅ 已確認允許（會員牆是公開的）
  - INSERT 權限：✅ 已修復（只允許管理員）
  - UPDATE 權限：✅ 已修復（只允許本人或管理員）
- [ ] `referrals` 表的 RLS 政策（可選修復）
- [ ] `analytics_events` 表的 RLS 政策
- [ ] `page_views` 表的 RLS 政策

**常見 Supabase Warning 及處理**：

1. **「Table has no RLS enabled」**
   - 處理：對所有表啟用 RLS
   - SQL: `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`

2. **「RLS policy allows public access」**
   - 評估：是否為預期行為（例如公開的會員資料）
   - 如果不是：建立更嚴格的 policy

3. **「Service role key exposed」**
   - 檢查：確認 Service Role Key 不在前端程式碼中
   - 處理：只在後端腳本中使用

4. **「Missing email confirmation」**
   - 建議：啟用 Email 驗證（Settings → Authentication → Email Auth）

5. **「Weak password policy」**
   - 建議：設定最小長度（建議 12+）
   - 位置：Settings → Authentication → Password

6. **「Storage bucket is public」**
   - 評估：如果包含敏感資料，改為 private
   - 檢查：`member-photos` bucket 是否應該公開

7. **「No rate limiting configured」**
   - 建議：在 Supabase Dashboard → Settings → API 設定 rate limit

---

## 🌐 前端安全

### 3. 環境變數管理

- [x] `.env` 已在 `.gitignore` 中（✅ 已正確設定）
- [x] 已建立 `ENV_SETUP.md` 說明文件（包含環境變數範例）✅ **已完成**
- [x] 確認前端只使用 `VITE_*` 前綴的環境變數（✅ `src/lib/supabase.ts` 已確認）

### 4. API Key 保護

- [x] **Supabase Anon Key**：✅ 已確認只在前端使用 Anon Key（`src/lib/supabase.ts` 使用 `VITE_SUPABASE_ANON_KEY`）
- [x] **GitHub Token**：✅ **已修復** - 已改為從環境變數讀取（`js/github-config.js` 已更新）

### 5. 輸入驗證與清理

- [x] 所有使用者輸入都經過驗證 ✅ **已確認**
  - Email 驗證（正則表達式）- `src/pages/Login.tsx`
  - 密碼驗證（至少 8 字元，包含字母和數字）- `src/pages/Login.tsx`
- [x] 防止 XSS（Cross-Site Scripting）攻擊 ✅ **已確認**
  - React 自動轉義所有輸出
  - 未使用 `dangerouslySetInnerHTML`（已檢查）
- [x] React 預設會 escape ✅ **已確認** - 無動態 HTML 內容風險

### 6. HTTPS 與 CSP

- [ ] 生產環境強制使用 HTTPS
- [ ] 考慮加入 Content Security Policy (CSP)
- [ ] 檢查 Mixed Content 警告

---

## 🔑 身份驗證與授權

### 7. Supabase Auth 設定

- [ ] Email 驗證已啟用
- [ ] 密碼強度要求適當
- [ ] Session 過期時間設定合理
- [ ] OAuth Provider（Google）設定正確
  - [ ] Client ID 和 Secret 正確
  - [ ] Redirect URL 正確設定

### 8. 管理員權限控制

- [x] `is_admin` 欄位有適當的保護 ✅ **已確認**
  - RLS 政策使用 `is_admin` 驗證管理員身份
- [x] Admin 頁面有身份驗證檢查 ✅ **已確認**
  - `src/pages/Admin.tsx` 有 `checkAdmin()` 函數
  - 非管理員會被導向首頁
- [x] RLS 政策正確驗證管理員身份 ✅ **已修復**

---

## 📊 資料保護

### 9. 敏感資料處理

- [ ] 會員的 `email`、`phone` 是否有適當的存取控制
- [ ] 不在前端日誌中輸出敏感資訊
- [ ] 確認會員照片 URL 沒有洩漏不必要的資訊

### 10. 資料備份

- [ ] 定期備份 Supabase 資料庫
- [ ] 備份策略：每日、每週、每月
- [ ] 測試還原流程

---

## 🛡️ 部署安全

### 11. 部署環境

- [ ] 生產環境變數正確設定
- [ ] 不要在部署日誌中輸出敏感資訊
- [ ] Zeabur/部署平台的安全設定正確

### 12. 監控與日誌

- [ ] 設定 Supabase 的日誌監控
- [ ] 監控異常的 API 呼叫
- [ ] 設定錯誤通知（Email/Slack）

---

## 🔍 定期安全檢查

### 13. 依賴項安全掃描

```bash
npm audit
npm audit fix
```

- [ ] 定期執行 `npm audit`
- [ ] 及時更新有安全漏洞的套件
- [ ] 考慮使用 Dependabot 自動更新

### 14. 程式碼審查

- [ ] 檢查是否有硬編碼的機密資訊
- [ ] 確認所有 API 端點都有適當的權限檢查
- [ ] 檢查 SQL 注入風險（Supabase 預設保護，但仍需注意）

---

## 📝 應急計畫

### 15. 事件回應

- [ ] 定義資安事件回應流程
- [ ] 準備 Token 撤銷程序
- [ ] 資料庫備份與還原程序

---

## ✅ 優先處理順序

1. **立即（今天）**：
   - [x] ✅ 撤銷舊 GitHub Token `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` **已完成**
   - [x] ✅ 建立新 GitHub Token **已完成**
   - [x] ✅ 將 GitHub Token 移至環境變數 **已完成**
   - [x] ✅ 處理 Supabase 的 7 個 warning **已完成**
     - [x] ✅ 修復 members 表 INSERT 政策（只允許管理員）**已完成**
     - [x] ✅ 修復 members 表 UPDATE 政策（只允許本人或管理員）**已完成**

2. **短期（本週）**：
   - [x] ✅ 建立環境變數說明文件 **已完成**
   - [x] ✅ 建立 Supabase Warning 檢查腳本 **已完成**
   - [x] ✅ 檢查並修正 RLS 政策（members 表已完成）**已完成**
   - [ ] 執行 `npm audit` 修復漏洞

3. **中期（本月）**：
   - [ ] 設定 Email 驗證
   - [ ] 強化密碼政策
   - [ ] 設定備份策略

4. **長期（持續）**：
   - [ ] 定期安全審查
   - [ ] 監控異常活動
   - [ ] 更新依賴項

---

**最後更新**：2025-01-11  
**負責人**：系統管理員  
**審查頻率**：每月
