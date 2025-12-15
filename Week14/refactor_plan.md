# Week 14 Refactoring Plan

## 1. 現狀分析 (Current Status Analysis)
目前的 Canva Clone 專案雖然功能完整，但存在以下 "Code Smell" (程式碼異味) 與維護問題，適合進行重構：

*   **重複的 HTML 結構 (Code Duplication)**:
    *   側邊欄 (`Sidebar`) 和頂部導覽列 (`Top Header`) 的 HTML 程式碼重複出現在 `index.html`, `home.html`, `projects.html`, `templates.html`, `apps.html`, `profile.html` 等 6 個檔案中。
    *   **後果**: 若要新增一個選單項目，必須手動修改 6 個檔案，容易出錯且效率低。
*   **硬編碼的資料 (Hardcoded Data)**:
    *   範本卡片、專案卡片、應用程式列表都是直接寫死在 HTML 中。
    *   **後果**: 要新增或修改顯示內容時，需要深入 HTML 結構，不易管理。
*   **導覽狀態維護 (Navigation State)**:
    *   目前是手動在每個 HTML 檔案的對應 `<a>` 標籤上加上 `class="active"`。
    *   **解決**: 應由 JavaScript 根據當前網址自動判斷並設定。

## 2. 重構目標 (Refactoring Goals)
在維持 **HTML, CSS, JavaScript (Vanilla)** 的技術限制下，達成以下目標：
1.  **模組化 UI**: 將 Sidebar 與 Header 抽離，透過 JavaScript 動態載入。
2.  **資料驅動 (Data-Driven)**: 將卡片內容 (標題、圖片、描述) 抽離為 JSON 資料陣列，透過 JS 迴圈渲染。
3.  **自動化導覽狀態**: JS 自動偵測當前頁面，點亮對應的側邊欄圖示。
4.  **CSS 優化**: 確保所有顏色、間距都使用 CSS Variables，方便統一管理 (如已實作的 Dark Mode)。

## 3. 實作步驟 (Implementation Steps)

### Step 1: 建立元件載入機制 (Component Loader)
*   建立 `components.js`。
*   編寫 `renderSidebar()` 與 `renderHeader()` 函式。
*   利用 `innerHTML` 將標準結構注入到各頁面的佔位符 `<div id="sidebar-container"></div>` 中。

### Step 2: 資料結構化 (Data Structure)
*   建立 `data.js` (或在 script.js 中定義)。
*   定義資料陣列，例如：
    ```javascript
    const templates = [
        { title: "年度報告", type: "簡報", image: "assets/thumb_presentation.png" },
        // ...
    ];
    ```

### Step 3: 動態渲染頁面內容 (Dynamic Rendering)
*   修改 `templates.html`, `apps.html` 等，移除寫死的卡片 HTML，改為 `<div id="templates-grid"></div>`。
*   編寫渲染函式 `renderCards(data, containerId)` 來生成 HTML。

### Step 4: 清理 HTML 檔案 (Cleanup)
*   將所有重複的 Sidebar/Header HTML 刪除，替換為單一 JS 呼叫。

---

## 預計檔案變更
*   `index.html` 等所有頁面: 大幅減少 HTML 行數。
*   `script.js`: 新增元件渲染邏輯與資料。
*   `style.css`: 微調以支援動態插入的元素 (通常無需大改)。
