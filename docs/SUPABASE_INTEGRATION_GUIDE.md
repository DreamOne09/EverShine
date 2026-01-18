# 🔗 Supabase 整合指南

本文件說明 EverShine 專案如何與 Supabase 互動，包括連接設定、資料操作、安全性設定等。

---

## 📋 目錄

1. [連接設定](#連接設定)
2. [環境變數](#環境變數)
3. [資料表結構](#資料表結構)
4. [前端操作](#前端操作)
5. [後端腳本](#後端腳本)
6. [安全性設定](#安全性設定)
7. [常見操作](#常見操作)
8. [疑難排解](#疑難排解)

---

## 🔌 連接設定

### 前端連接（React）

專案使用 `src/lib/supabase.ts` 建立 Supabase 客戶端：

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!');
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**使用方式**：
```typescript
import { supabase } from '../lib/supabase';

// 查詢資料
const { data, error } = await supabase
    .from('members')
    .select('*');
```

### 後端腳本連接（Node.js）

後端腳本使用環境變數連接：

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## 🔐 環境變數

### 必要的環境變數

在 `.env` 檔案中設定：

```bash
# Supabase 連接資訊
VITE_SUPABASE_URL=https://你的專案ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的匿名金鑰

# 其他環境變數
VITE_TURNSTILE_SITE_KEY=機器人防護金鑰
GITHUB_TOKEN=GitHub 個人存取權杖（用於資料同步）
```

### 取得 Supabase 憑證

1. 前往 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇你的專案
3. **Settings** → **API**
4. 複製以下資訊：
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

⚠️ **安全性提醒**：
- `VITE_*` 變數會暴露在前端程式碼中
- 使用 `ANON_KEY` 已足夠，前端不需要 `SERVICE_ROLE_KEY`
- 永遠不要將 `SERVICE_ROLE_KEY` 放在前端程式碼中

---

## 📊 資料表結構

### 主要資料表

#### 1. `members` - 會員資料

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | BIGINT | 會員 ID（主鍵） |
| `name` | TEXT | 會員姓名 |
| `industry` | TEXT | 行業類別 |
| `photo` | TEXT | 照片 URL |
| `photoPosition` | TEXT | 照片位置（可選） |
| `category` | TEXT | 分類標籤 |
| `title` | TEXT | 職稱 |
| `company` | TEXT | 公司名稱 |
| `shortIntro` | TEXT | 簡短介紹 |
| `fullIntro` | TEXT | 完整介紹 |
| `services` | JSONB | 服務項目（陣列） |
| `hashtags` | JSONB | 標籤（陣列） |
| `links` | JSONB | 聯絡連結（物件） |
| `user_id` | UUID | 關聯的 Supabase Auth 使用者 ID |
| `is_admin` | BOOLEAN | 是否為管理員（預設 false） |
| `editCount` | INTEGER | 編輯次數 |
| `updatedAt` | TIMESTAMPTZ | 最後更新時間 |

#### 2. `referrals` - 引薦記錄

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | UUID | 引薦 ID（主鍵） |
| `title` | TEXT | 引薦標題 |
| `description` | TEXT | 引薦描述 |
| `referrer_name` | TEXT | 引薦人姓名 |
| `referee_name` | TEXT | 被引薦人姓名 |
| `amount` | TEXT | 引薦金額 |
| `amount_type` | TEXT | 金額類型（如 "TWD"） |
| `story` | TEXT | 引薦故事/見證 |
| `created_at` | TIMESTAMPTZ | 建立時間 |
| `updated_at` | TIMESTAMPTZ | 更新時間 |

#### 3. `homepage_stats` - 首頁統計

| 欄位 | 類型 | 說明 |
|------|------|------|
| `id` | UUID | 統計 ID（主鍵） |
| `total_referrals` | INTEGER | 總引薦數 |
| `total_amount` | TEXT | 總引薦金額 |
| `updated_at` | TIMESTAMPTZ | 更新時間 |

---

## 💻 前端操作

### 使用 Hooks

專案提供自訂 Hooks 簡化資料操作：

#### `useMembers` - 會員資料

```typescript
import { useMembers } from '../hooks/useMembers';

function MyComponent() {
    const { members, loading, error } = useMembers();
    
    if (loading) return <div>載入中...</div>;
    if (error) return <div>錯誤: {error}</div>;
    
    return (
        <div>
            {members.map(member => (
                <div key={member.id}>{member.name}</div>
            ))}
        </div>
    );
}
```

#### `useReferrals` - 引薦記錄

```typescript
import { useReferrals } from '../hooks/useReferrals';

function ReferralsComponent() {
    const { referrals, loading } = useReferrals();
    // ...
}
```

### 直接使用 Supabase Client

```typescript
import { supabase } from '../lib/supabase';

// 查詢所有會員
const { data: members, error } = await supabase
    .from('members')
    .select('*')
    .order('id', { ascending: true });

// 查詢特定會員
const { data: member, error } = await supabase
    .from('members')
    .select('*')
    .eq('id', 1)
    .single();

// 更新會員資料
const { error } = await supabase
    .from('members')
    .update({ name: '新姓名' })
    .eq('id', 1);

// 插入新會員（需要管理員權限）
const { data, error } = await supabase
    .from('members')
    .insert([{ name: '新會員', industry: '科技' }]);
```

---

## 🛠️ 後端腳本

### 腳本位置

所有 Supabase 操作腳本位於 `scripts/` 資料夾。

### 常用腳本

#### 1. 連線測試

```bash
node scripts/test_supabase_connection.js
```

驗證 Supabase 連線是否正常。

#### 2. 檢查資料

```bash
# 檢查會員資料
node scripts/analyze_data.js

# 檢查引薦記錄
node scripts/check_member_referrals.js

# 檢查照片 URL
node scripts/check_photos.js
```

#### 3. 資料同步

```bash
# 從生產環境同步資料
node scripts/sync-data.js
```

從 `evershine.tw` 下載最新的 `members.json` 和 `referrals.json`。

#### 4. 安全性檢查

```bash
# 檢查 Supabase 警告
node scripts/check_supabase_warnings.js

# 驗證安全性設定
node scripts/verify_security_setup.js
```

#### 5. 資料庫修復

```bash
# 執行 SQL 修復腳本（需要在 Supabase Dashboard 執行）
# 前往 Dashboard → SQL Editor → 執行以下檔案：
scripts/fix_supabase_security_warnings_safe.sql
scripts/fix_homepage_stats_rls.sql
```

### 建立新腳本

建立新腳本的範本：

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 錯誤: 缺少 Supabase 環境變數');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    try {
        // 你的程式碼
        console.log('✅ 完成');
    } catch (error) {
        console.error('❌ 錯誤:', error);
        process.exit(1);
    }
}

main();
```

---

## 🔒 安全性設定

### Row Level Security (RLS)

所有資料表都啟用了 RLS，確保資料安全：

#### `members` 表

- ✅ **SELECT**：公開讀取（所有使用者）
- ✅ **INSERT**：只允許管理員
- ✅ **UPDATE**：會員可更新自己的資料，管理員可更新任何資料
- ❌ **DELETE**：不允許（建議使用軟刪除）

#### `referrals` 表

- ✅ **SELECT**：公開讀取（所有使用者）
- ⚠️ **INSERT/UPDATE**：根據業務需求設定（可選：只允許管理員）

#### `homepage_stats` 表

- ✅ **SELECT**：公開讀取
- ✅ **INSERT/UPDATE**：只允許管理員

### 查看 RLS 政策

在 Supabase Dashboard：
1. **Authentication** → **Policies**
2. 選擇資料表查看政策

或使用 SQL：

```sql
SELECT * FROM pg_policies WHERE tablename = 'members';
```

### 修復 RLS 警告

如果出現 RLS 警告：

1. 檢查警告：`node scripts/check_supabase_warnings.js`
2. 執行修復腳本（在 Dashboard → SQL Editor）：
   - `scripts/fix_supabase_security_warnings_safe.sql`
   - `scripts/fix_homepage_stats_rls.sql`

詳細說明請參考：`docs/SUPABASE_SECURITY_FIX_GUIDE.md`

---

## 📝 常見操作

### 查詢操作

```typescript
// 1. 查詢所有記錄
const { data } = await supabase.from('members').select('*');

// 2. 條件查詢
const { data } = await supabase
    .from('members')
    .select('*')
    .eq('industry', '科技'); // 等於

// 3. 多條件查詢
const { data } = await supabase
    .from('members')
    .select('*')
    .eq('industry', '科技')
    .gte('id', 10); // 大於等於

// 4. 排序
const { data } = await supabase
    .from('members')
    .select('*')
    .order('id', { ascending: true });

// 5. 限制筆數
const { data } = await supabase
    .from('members')
    .select('*')
    .limit(10);

// 6. 單筆查詢
const { data } = await supabase
    .from('members')
    .select('*')
    .eq('id', 1)
    .single();
```

### 更新操作

```typescript
// 更新單筆記錄
const { error } = await supabase
    .from('members')
    .update({ name: '新姓名' })
    .eq('id', 1);

// 批量更新
const { error } = await supabase
    .from('members')
    .update({ industry: '新行業' })
    .in('id', [1, 2, 3]);
```

### 插入操作

```typescript
// 插入單筆記錄
const { data, error } = await supabase
    .from('members')
    .insert([{ name: '新會員', industry: '科技' }]);

// 批量插入
const { data, error } = await supabase
    .from('members')
    .insert([
        { name: '會員1', industry: '科技' },
        { name: '會員2', industry: '設計' }
    ]);
```

### 刪除操作

⚠️ **注意**：專案中不建議使用硬刪除，建議使用軟刪除（標記為已刪除）。

```typescript
// 刪除記錄（不推薦，需要確認權限）
const { error } = await supabase
    .from('members')
    .delete()
    .eq('id', 1);
```

### 即時訂閱（Realtime）

```typescript
// 訂閱資料表變更
const subscription = supabase
    .channel('members_changes')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'members' },
        (payload) => {
            console.log('資料變更:', payload);
        }
    )
    .subscribe();

// 取消訂閱
subscription.unsubscribe();
```

---

## 🔍 疑難排解

### 問題 1：無法連接 Supabase

**錯誤訊息**：`Missing Supabase environment variables`

**解決方法**：
1. 檢查 `.env` 檔案是否存在
2. 確認環境變數名稱正確：`VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
3. 確認變數值正確（複製自 Supabase Dashboard）

### 問題 2：權限不足

**錯誤訊息**：`new row violates row-level security policy`

**解決方法**：
1. 確認使用者已登入（`supabase.auth.getUser()`）
2. 確認 RLS 政策允許該操作
3. 檢查使用者是否為管理員（如果操作需要管理員權限）

### 問題 3：查詢結果為空

**可能原因**：
1. 資料表確實為空
2. RLS 政策過於嚴格
3. 查詢條件錯誤

**解決方法**：
1. 使用 Supabase Dashboard → Table Editor 確認資料存在
2. 檢查 RLS 政策（`Authentication` → `Policies`）
3. 使用 `scripts/analyze_data.js` 檢查資料

### 問題 4：照片無法顯示

**可能原因**：
1. Storage bucket 未設定為公開
2. URL 格式錯誤
3. 照片檔案不存在

**解決方法**：
1. 執行 `node scripts/check_storage.js` 檢查 Storage 設定
2. 執行 `node scripts/check_photos.js` 檢查照片 URL
3. 執行 `node scripts/audit_and_fix_photos.js` 修復照片問題

### 問題 5：環境變數在腳本中無法讀取

**錯誤訊息**：`process.env.VITE_SUPABASE_URL is undefined`

**解決方法**：
1. 確認使用 `dotenv` 載入 `.env` 檔案
2. 確認 `dotenv.config()` 的路徑正確
3. 確認 `.env` 檔案在專案根目錄

---

## 📚 相關文件

### Supabase 相關
- `docs/SUPABASE_SECURITY_FIX_GUIDE.md` - 安全性修復指南
- `docs/ALL_SUPABASE_WARNINGS_SUMMARY.md` - 警告總結
- `docs/FREE_TIER_PASSWORD_PROTECTION.md` - 密碼保護實作
- `docs/FREE_TIER_LIMITATIONS.md` - 免費版功能限制說明

### 環境與設定
- `ENV_SETUP.md` - 環境變數設定指南
- `SECURITY_CHECKLIST.md` - 安全性檢查清單
- `SECURITY_ACTION_ITEMS.md` - 後續行動清單

### 索引文件
- `README.md` - 專案主要 README
- `README_SECURITY.md` - 資安文件索引

---

## 🔗 外部資源

- [Supabase 官方文件](https://supabase.com/docs)
- [Supabase JS Client 文件](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security 文件](https://supabase.com/docs/guides/auth/row-level-security)

---

**最後更新**：2025-01-11  
**維護者**：EverShine 開發團隊
