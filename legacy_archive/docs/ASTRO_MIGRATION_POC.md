# Astro Migration Proof of Concept (PoC)

## 為什麼選擇 Astro？
Astro 是目前最適合「內容驅動型網站」（如 BNI 分會網站）的現代化框架。
它結合了靜態網站生成 (SSG) 的極致效能與現代化組件開發 (Component-based) 的便利性。

### 核心優勢
1.  **零 JavaScript 輸出 (Zero JS by default)**：除非必要，否則不會發送任何 JS 到瀏覽器，載入速度極快。
2.  **組件化開發**：不再使用字串拼接 HTML，而是使用類似 HTML 的 `.astro` 語法。
3.  **內建 TypeScript**：更好的代碼提示與錯誤檢查。
4.  **資源優化**：自動壓縮 CSS/JS，自動優化圖片。

---

## 代碼對比：會員卡片組件

### 1. 目前版本 (Vanilla JS)
**檔案**: `js/member-card-component.js`
需要手動處理字串拼接、變數插入、以及 `onerror` 等事件。

```javascript
export function createMemberCard(member) {
    const photoUrl = normalizePhotoPath(member.photo) || 'images/members/default.jpg';
    
    return `
        <div class="member-card collapsed" data-member-id="${member.id}">
            <div class="member-header">
                <div class="member-photo-container">
                    <img src="${photoUrl}" 
                         alt="${member.name}" 
                         onerror="this.src='...'">
                </div>
                <div class="member-basic-info">
                    <h3>${member.name}</h3>
                    <span>${member.industry}</span>
                </div>
            </div>
            <!-- 更多 HTML 字串拼接... -->
        </div>
    `;
}
```

### 2. 未來版本 (Astro)
**檔案**: `src/components/MemberCard.astro`
結構清晰，邏輯與視圖分離，語法高亮支援。

```astro
---
// Server-side Logic (Build time)
import { CONFIG } from '../config';
import type { Member } from '../types';

interface Props {
  member: Member;
}

const { member } = Astro.props;
const photoUrl = member.photo || CONFIG.PATHS.DEFAULT_MEMBER_PHOTO;
---

<div class="member-card collapsed" data-member-id={member.id} data-category={member.category}>
  <div class="member-header">
    <div class="member-photo-container">
      <img 
        src={photoUrl} 
        alt={member.name} 
        loading="lazy"
        width="100"
        height="100"
      />
    </div>
    <div class="member-basic-info">
      <h3 class="member-name">{member.name}</h3>
      <span class="member-industry">{member.industry}</span>
    </div>
    
    <button class="member-toggle-btn" aria-label="展開資訊">
      <span class="toggle-icon">▼</span>
    </button>
  </div>

  <div class="member-details">
    <p>{member.fullIntro}</p>
    
    {/* 條件渲染變得非常簡單 */}
    {member.services && (
      <div class="member-services">
        <h4>服務項目</h4>
        <ul>
          {member.services.map(service => (
            <li>{service}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>

<script>
  // Client-side Logic (只在瀏覽器執行)
  // Astro 會自動處理打包和作用域
  const buttons = document.querySelectorAll('.member-toggle-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // 處理點擊事件
    });
  });
</script>

<style>
  /* Scoped CSS - 只影響這個組件，不會污染全域 */
  .member-card {
    background: var(--glass-bg-medium);
    border: 1px solid var(--glass-border);
  }
</style>
```

## 遷移建議
如果您同意，我們可以開始逐步遷移：
1.  **Phase 1**: 初始化 Astro 專案，建立基礎 Layout (Header/Footer)。
2.  **Phase 2**: 遷移靜態頁面 (首頁, 關於我們)。
3.  **Phase 3**: 遷移數據驅動頁面 (會員列表, 引薦報告)，使用 Astro Content Collections 管理 JSON 數據。
4.  **Phase 4**: 部署與替換。

這將使代碼量減少約 **40%**，並大幅提升維護性。
