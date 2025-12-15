# Canva Clone (Week 14)

##Features (功能特色)

*   **Responsive Dashboard (響應式儀表板)**:
    *   **Home (首頁)**: 包含問候語、搜尋列與快速建立設計的圖示。
    *   **Projects (專案)**: 資料夾檢視與近期設計列表，包含篩選功能。
    *   **Templates (範本)**: 分類好的範本展示區，支援標籤導覽。
    *   **Apps (應用程式)**: 模擬應用程式市集介面。
*   **Design Editor (設計編輯器)**: 模擬的設計工作區 (`editor.html`)，包含左側工具列、素材面板與可縮放的畫布區域。
*   **Dynamic Components (動態元件)**: 側邊欄 (Sidebar) 與頂部導覽列 (Header) 透過 JavaScript 動態渲染，確保跨頁面的一致性與維護便利性。
*   **Theme System (主題系統)**:
    *   支援 **淺色 (Light)** 與 **深色 (Dark)** 模式。
    *   主題設定會自動儲存於 `localStorage`。
    *   可在 **Profile (個人首頁)** 頁面進行切換。
*   **Interactive UI**:
    *   豐富的懸停效果 (Hover effects)、漸層色彩與微互動。
    *   自動偵測網址並高亮側邊欄的當前位置。

## Technology (使用技術)

*   **HTML5**: 語意化標籤結構。
*   **CSS3**: 使用 CSS Variables (變數) 管理色彩系統，Flexbox 與 Grid 佈局，以及 CSS 漸層。
*   **JavaScript (ES6+)**: 負責元件注入 (Component Injection)、DOM 操作、路由狀態判斷與主題切換邏輯。
*   **Icons**: Google Material Icons (Outlined).

## Project Structure (專案結構)

```text
Week14/
├── index.html        # 入口頁面
├── home.html         # 主要儀表板 (Dashboard)
├── projects.html     # 專案管理頁面
├── templates.html    # 範本瀏覽頁面
├── apps.html         # 應用程式市集
├── profile.html      # 個人設定與主題切換
├── editor.html       # 設計編輯器介面
├── script.js         # 核心邏輯：元件載入、導覽狀態、主題控制
├── style.css         # 全域樣式表 (含 Dark Mode設定)
└── assets/           # 圖片資源
```

## How to Run (如何執行)

1.  直接使用瀏覽器 (Chrome/Edge/Firefox) 開啟 `home.html` 或 `index.html`。
2.  透過左側側邊欄切換不同頁面。
3.  點擊「建立設計」按鈕可進入模擬編輯器。
4.  點擊右上角使用者頭像 (U) -> 進入個人首頁切換 **深色模式**。

## Refactoring Notes (重構筆記)

本專案採用了模組化架構，將 **Sidebar** 與 **Header** 的 HTML 結構從各個頁面中移除，改由 `script.js` 在網頁載入時動態生成。這解決了程式碼重複 (Duplication) 的問題，若未來需要修改選單內容，僅需調整 JavaScript 檔案即可同步更新至所有頁面。

---
