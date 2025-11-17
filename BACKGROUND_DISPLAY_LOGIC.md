# 星空背景顯示邏輯說明

## 背景層級結構（從後到前）

```
┌─────────────────────────────────────┐
│  body (背景: #000 黑色)             │  ← 最底層
├─────────────────────────────────────┤
│  Canvas 星空 (z-index: -3)         │  ← Hero區塊專用
│  - 1500顆星星（帶光暈）             │
│  - 8個星雲（飄移動畫）               │
├─────────────────────────────────────┤
│  CSS 星空容器 (z-index: -1)         │  ← 其他區塊專用
│  └─ .starry-sky                     │
│     ├─ 靜態星星層 (4層，9000顆)     │
│     └─ 移動星星層 (2層，1000顆)     │
├─────────────────────────────────────┤
│  流星 (z-index: 100)                │  ← 最上層背景
│  - 5-10顆，360度隨機方向            │
├─────────────────────────────────────┤
│  內容區塊 (z-index: 1+)             │  ← 所有section內容
│  - Hero: z-index: 10                │
│  - 其他section: z-index: 1          │
├─────────────────────────────────────┤
│  導航欄 (z-index: 1000)             │  ← 最上層
└─────────────────────────────────────┘
```

## 顯示邏輯詳解

### 1. Hero 區塊（首屏）

**背景組成：**
- **Canvas 星空** (`#starrySkyCanvas`)
  - `z-index: -3`（最底層）
  - `position: fixed`（固定位置）
  - 繪製約1500顆星星（帶光暈效果）
  - 8個星雲（緩慢飄移）
  - 星星有閃爍動畫

**Hero 內容：**
- `.hero-background`：地球背景圖片 (`z-index: 0`)
- `.hero-content`：文字內容 (`z-index: 10`)

**視覺效果：**
- 黑色背景 → Canvas星空 → 地球圖片 → Hero文字內容

### 2. 其他區塊（Hero 以外）

**背景組成：**
- **CSS 星空容器** (`.starry-background-container`)
  - `z-index: -1`
  - `position: fixed`（固定位置，覆蓋整個頁面）
  - `background: transparent`（透明，讓星星顯示）

**CSS 星空內容：**
- **靜態星星層** (`.static-stars-layer`)
  - 4層，共9000顆星星
  - 使用 `box-shadow` 生成（性能優化）
  - 每層有不同的閃爍動畫速度（3s, 4s, 5s, 6s）
  - 雙層光暈效果（核心 + 外層光暈）
  - `z-index: 1`（在容器內）

- **移動星星層** (`.moving-stars-layer`)
  - 2層，共1000顆星星
  - 從右下到左上的緩慢移動動畫
  - `z-index: 1`（在容器內）

- **流星** (`.shooting-star`)
  - `z-index: 100`（在CSS星空容器之上，但在內容之下）
  - 5-10顆，360度隨機方向
  - 符合物理定律的拖曳尾巴

**內容區塊：**
- 所有 `section:not(.hero)` 的 `z-index: 1`
- 確保內容顯示在星空背景之上

**視覺效果：**
- 黑色背景 → CSS星空（靜態+移動星星） → 流星 → 內容區塊

## 關鍵 CSS 設定

### 背景層級

```css
/* 最底層：body 黑色背景 */
body {
    background-color: #000;
}

/* Canvas 星空（Hero專用） */
#starrySkyCanvas {
    z-index: -3;
    position: fixed;
    background: transparent;
}

/* CSS 星空容器（其他區塊） */
.starry-background-container {
    z-index: -1;
    position: fixed;
    background: transparent;  /* 重要：必須透明 */
}

/* 星星層（在容器內） */
.static-stars-layer,
.moving-stars-layer {
    z-index: 1;  /* 在容器內相對定位 */
    background: transparent;
    /* 星星通過 box-shadow 生成 */
}

/* 流星（在容器之上，內容之下） */
.shooting-star {
    z-index: 100;
    position: fixed;
}

/* 內容區塊（在背景之上） */
section:not(.hero) {
    z-index: 1;
    background: transparent;  /* 重要：必須透明 */
    background-color: transparent;
}
```

## 星星生成邏輯

### CSS 星星（使用 box-shadow）

```javascript
// 每個星星層生成 box-shadow
layer.style.boxShadow = `
    100px 200px 0 0 rgba(255, 255, 255, 0.8),
    100px 200px 5px rgba(255, 255, 255, 0.5),
    300px 400px 0 0 rgba(200, 230, 255, 0.7),
    ...
`;
```

**為什麼使用 box-shadow？**
- 性能優化：一個元素可以生成數千個星星點
- 減少 DOM 元素：9000顆星星只需要4個div元素
- GPU 加速：box-shadow 由瀏覽器優化渲染

### Canvas 星星（Hero區塊）

```javascript
// 使用 Canvas API 繪製
ctx.arc(x, y, size, 0, Math.PI * 2);
ctx.fillStyle = `rgba(255, 255, 255, opacity)`;
ctx.fill();
```

## 初始化流程

1. **DOM 載入完成**
   ```javascript
   document.addEventListener('DOMContentLoaded', () => {
       starrySkyManager.init();
   });
   ```

2. **初始化 Canvas 星空**
   - 創建 Canvas 元素
   - 生成星星和星雲
   - 開始動畫循環

3. **初始化 CSS 星空**
   - 創建 `.starry-background-container`
   - 創建 `.starry-sky`
   - 創建星星層（4層靜態 + 2層移動）
   - 插入到 DOM（`document.body.firstChild`）
   - 使用 `requestAnimationFrame` 確保 DOM 已插入
   - 生成星星的 `box-shadow`

4. **創建流星**
   - 生成 5-10 顆流星
   - 設置隨機位置、方向、速度

## 診斷檢查清單

如果星星不顯示，請檢查：

### ✅ 1. DOM 元素是否存在
```javascript
// 在瀏覽器控制台執行
document.querySelector('.starry-background-container')
document.querySelectorAll('.static-stars-layer')
```

### ✅ 2. box-shadow 是否生成
```javascript
// 檢查第一層靜態星星
const layer = document.querySelector('.static-stars-layer.static-stars0');
console.log(layer.style.boxShadow);
// 應該看到類似：100px 200px 0 0 rgba(255, 255, 255, 0.8), ...
```

### ✅ 3. z-index 層級是否正確
- Canvas: `-3`
- CSS星空容器: `-1`
- 內容區塊: `1+`
- 流星: `100`

### ✅ 4. 背景是否透明
- `.starry-background-container`: `background: transparent`
- `section`: `background: transparent`
- `body`: `background-color: #000`（必須是黑色）

### ✅ 5. 元素是否可見
```javascript
const container = document.querySelector('.starry-background-container');
console.log({
    display: window.getComputedStyle(container).display,
    visibility: window.getComputedStyle(container).visibility,
    opacity: window.getComputedStyle(container).opacity,
    zIndex: window.getComputedStyle(container).zIndex
});
```

### ✅ 6. 控制台訊息
查看是否有：
- `星空背景：初始化完成`
- `星空背景：已生成 X 層靜態星星和 Y 層移動星星`

## 預期視覺效果

### Hero 區塊
- 黑色背景
- Canvas 繪製的星星和星雲（帶光暈、閃爍）
- 地球背景圖片（半透明）
- Hero 文字內容

### 其他區塊
- 黑色背景
- **滿天星點**：9000顆靜態星星（會閃爍，帶光暈）
- **移動星星**：1000顆緩慢移動的星星
- **流星**：5-10顆隨機方向的流星（帶拖曳尾巴）
- 內容區塊（玻璃態卡片效果）

## 性能考量

1. **CSS 星星**：使用 `box-shadow`，一個元素生成數千個星星
2. **Canvas 星星**：使用 `requestAnimationFrame` 優化動畫
3. **流星**：使用 CSS 動畫而非 JavaScript
4. **視窗大小變化**：防抖處理，250ms 後才重新生成

## 常見問題

### Q: 為什麼看不到星星？
A: 檢查：
1. 瀏覽器控制台是否有錯誤
2. `.starry-background-container` 是否存在
3. `box-shadow` 是否已生成
4. `z-index` 是否正確
5. 背景是否為透明

### Q: 星星太少了？
A: 調整 `StarrySkyConfig` 中的 `count` 參數：
```javascript
staticStars: [
    { count: 3000 },  // 增加這個數字
    { count: 2500 },
    ...
]
```

### Q: 星星不閃爍？
A: 檢查 CSS 動畫是否正常：
```css
@keyframes starTwinkle {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
}
```

### Q: 流星不顯示？
A: 檢查：
1. `.shooting-star` 元素是否存在
2. `z-index: 100` 是否正確
3. CSS 動畫是否正常運行

