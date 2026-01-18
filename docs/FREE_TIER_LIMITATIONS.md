# 📋 Supabase 免費版功能限制說明

## 🔐 洩漏密碼保護

### 問題

**Supabase 免費版不提供洩漏密碼保護功能**

- ❌ 免費版（Free Tier）沒有此功能
- ✅ Pro 方案或以上才有此功能
- 這就是為什麼在 Dashboard 中找不到此設定的原因

### 解決方案

✅ **已在應用層面實作**

我們已經實作了替代方案：
- 使用 HaveIBeenPwned API（免費、公開的服務）
- 在註冊時自動檢查密碼是否洩漏
- 使用 k-anonymity 方法保護隱私

### 實作檔案

- `src/lib/passwordSecurity.ts` - 密碼安全檢查工具
- `src/pages/Login.tsx` - 已整合到註冊流程

### 功能對比

| 項目 | Supabase Pro | 我們的實作 |
|------|-------------|-----------|
| 檢查時機 | 註冊/更改密碼 | 註冊時 |
| 成本 | 需要 Pro 方案 | 免費 |
| 功能完整性 | ✅ | ✅ |
| 隱私保護 | ✅ | ✅ (k-anonymity) |

---

## 💡 其他可能的免費版限制

如果未來遇到其他功能限制，可以考慮：

1. **應用層面實作**（如密碼保護）
2. **使用第三方服務**（如 HaveIBeenPwned）
3. **升級到 Pro**（如果需要更多功能）

---

## 📝 相關文件

- `docs/FREE_TIER_PASSWORD_PROTECTION.md` - 詳細實作說明
- `src/lib/passwordSecurity.ts` - 實作程式碼

---

**最後更新**：2025-01-11
