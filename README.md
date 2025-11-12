# EverShine BNI 商會形象網站

專業的 BNI 商務引薦平台形象網站，採用星空霓彩配色與動態星雲視覺，對應最新會員資料與照片。

## 專案特色

- 單頁式響應式設計
- 星空霓彩主題、動態星雲背景
- 會員產業別篩選功能
- 關鍵數字動態展示
- 會員卡片包含服務項目、Hashtag 與社群連結

## 技術架構

- HTML5
- CSS3 (響應式設計)
- Vanilla JavaScript
- JSON 資料格式

## 最新更新（2025-11）

- 更新全站配色：`#005391`（背景）、`#4ca8df`（重點）、`#1d2f38`（輔色）與星雲粒子動畫。
- 會員資料新增欄位：
  - `services`：至多 4 項服務項目（自動由描述拆出，亦可手動維護）。
  - `hashtags`：預設以產業 + 品牌標籤組成，供前端顯示膠囊標籤。
  - `social`：社群/網站連結（含自動補齊 `https://`）。
- 新增 `data/photo-manifest.json`，記錄照片指派與缺漏名單；目前僅缺少 `簡若凱` 照片，其餘 58 位已對應。
- 將會員照片統一使用 `會員照片/正式會員-20251105T073702Z-1-001/正式會員/` 內的最新素材。

## 部署

本專案部署於 GitHub Pages：https://dreamone09.github.io/EverShine/

## 本地開發

直接開啟 `index.html` 即可在瀏覽器中預覽。

## 專案結構

```
EverShine/
├── index.html          # 主要單頁網站
├── css/
│   └── style.css       # 主樣式檔
├── js/
│   └── main.js         # 互動功能
├── data/
│   ├── members.json    # 會員資料（含 services/hashtags/social）
│   └── photo-manifest.json # 自動產生的照片對應清單
├── scripts/
│   └── update_members.py # 會員資料同步腳本
└── images/
    ├── members/        # 會員照片
    └── assets/         # 其他資源
└── 會員照片/           # 最新會員照片來源（以子資料夾分類）

## 資料維護流程

1. 將最新會員照片放入 `會員照片/正式會員-20251105T073702Z-1-001/正式會員/`。
2. 執行 `py scripts/update_members.py`（Windows）或 `python3 scripts/update_members.py`（macOS/Linux）：
   - 自動更新 `data/members.json` 照片路徑。
   - 從描述拆解服務項目並更新 Hashtag。
   - 產製 `data/photo-manifest.json` 供稽核。
3. 若有缺漏照片，於 `photo-manifest.json` 的 `skipped` 名單補齊後再執行一次腳本。

> 提醒：目前資料集中已移除「簡若凱」一筆無照片紀錄，若後續取得照片，可於 `data/members.json` 手動補回並重新執行腳本。
```

