# 🚀 資安快速參考指南

## ⚡ 5 分鐘快速檢查

### 1. 檢查 GitHub Token 是否安全

```bash
# 檢查是否有硬編碼的 Token
grep -r "ghp_" src/ js/ --exclude-dir=node_modules

# 應該沒有結果（除了 js/github-config.js 中的範例註解）
```

### 2. 檢查環境變數

```bash
# 確認 .env 檔案存在且不在 Git 中
git check-ignore .env

# 應該返回: .env
```

### 3. 檢查 Supabase RLS 政策

在 Supabase Dashboard → SQL Editor 執行：

```sql
-- 查看 members 表的政策
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'members' 
  AND schemaname = 'public'
ORDER BY cmd, policyname;
```

**預期結果**：
- INSERT: `Only admins can insert members`
- UPDATE: `Users can update own profile` 和 `Admins can update any member`
- SELECT: `Enable read access for all users` 或類似

---

## 🔧 常用修復指令

### 修復 Members 表 RLS（如果被還原）

```sql
-- 執行 scripts/fix_supabase_security_warnings_safe.sql
-- 或在 Supabase Dashboard → SQL Editor 執行該檔案內容
```

### 檢查依賴項漏洞

```bash
npm audit
npm audit fix
```

### 檢查環境變數設定

```bash
# 確認必要變數是否存在
cat .env | grep -E "VITE_SUPABASE_URL|VITE_SUPABASE_ANON_KEY|GITHUB_TOKEN"
```

---

## 📋 檢查清單（每月執行一次）

- [ ] 執行 `npm audit` 檢查依賴項漏洞
- [ ] 檢查 Supabase Dashboard 的安全警告
- [ ] 確認沒有新的硬編碼機密資訊
- [ ] 檢查 RLS 政策是否仍然正確
- [ ] 確認備份策略正常運作

---

## 🆘 緊急處理

### 如果發現 Token 洩漏

1. **立即撤銷 Token**
   - GitHub: https://github.com/settings/tokens
   - Supabase: Dashboard → Settings → API

2. **建立新 Token**
   - 使用最小必要權限

3. **更新環境變數**
   - 更新 `.env` 檔案
   - 重新部署應用

4. **檢查 Git 歷史**
   ```bash
   git log --all --full-history -- "*.env" "*.config.js"
   ```

### 如果 RLS 政策被意外修改

1. **檢查當前政策**
   ```sql
   SELECT * FROM pg_policies WHERE tablename = 'members';
   ```

2. **還原政策**
   - 執行 `scripts/fix_supabase_security_warnings_safe.sql`
   - 或參考 Git 歷史

---

## 📞 相關文件索引

| 文件 | 用途 |
|------|------|
| `SECURITY_CHECKLIST.md` | 完整資安檢查清單 |
| `SECURITY_ACTION_ITEMS.md` | 後續行動清單 |
| `ENV_SETUP.md` | 環境變數設定 |
| `docs/SECURITY_FIX_SUMMARY.md` | 修復總結報告 |
| `docs/SUPABASE_SECURITY_FIX_GUIDE.md` | Supabase 修復指南 |
| `docs/RLS_POLICIES_STATUS.md` | RLS 政策狀態 |

---

**最後更新**：2025-01-11
