# Week 14 - Canva Clone Analysis

## 1. 頁面總覽 (Page Overview)
這是一個設計工具 (Canva) 的儀表板首頁 (Dashboard)。使用者可以在此開始新設計、搜尋範本或管理專案。
配色主要為背景淺色 (`#f5f5f5` 或純白)，搭配紫色品牌色 (`#8b3dff`) 和漸層 Banner。

## 2. 詳細區塊分析與按鈕功能 (Detailed Breakdown)

### A. 頂部促銷橫幅 (Top Promo Banner)
- **視覺**: 藍紫色流動漸層背景，裝飾有金色皇冠和星星圖示。
- **文字**: "獲得 Canva Pro 或 Canva - 商用版 的 3 個月半價優惠。"
- **按鈕 [查看優惠]**: 深色背景按鈕，點擊後跳轉到付費訂閱頁面。
- **按鈕 [X]**: 右上角關閉圖示，點擊後此橫幅消失，下方內容上移。

### B. 左側側邊欄 (Sidebar Navigation)
- **[漢堡選單]** (三條線): 收合/展開側邊欄文字，僅保留圖示。
- **[+ 建立] (Create)**: 紫色圓形按鈕，帶有十字圖示。這是最重要的行動呼籲 (CTA)，點擊開啟建立新設計的選單。
- **導覽連結**:
    - **[首頁] (Home)**: 目前所在頁面，Icon 為房子。
    - **[專案] (Projects)**: 資料夾 Icon，查看使用者過去的設計。
    - **[範本] (Templates)**: 查看所有設計範本。
    - **[品牌] (Brand)**: 皇冠圖示 (Pro 功能)，設定品牌顏色字體。
    - **[應用程式] (Apps)**: 查看擴充功能。
- **底部功能**:
    - [通知鈴鐺]: 查看訊息。
    - [使用者設定]: 圓形頭像。

### C. 主要內容區：英雄搜尋區 (Hero & Search)
- **標題**: "你今天要設計些什麼呢？" (Greeting)。
- **切換標籤 (Toggle Pills)**:
    - **[你的設計]**: 搜尋範圍切換為使用者檔案。
    - **[範本]**: (預設選中) 搜尋範圍為公開範本。
    - **[Canva AI]**: 切換到 AI 生成工具。
- **搜尋列 (Search Bar)**:
    - 佔據中央顯眼位置，白色背景，圓角。
    - **Icon**: 左側有放大鏡。
    - **Text**: "搜尋數百萬個範本"。
    - **Filter Icon**: 右側調整圖示，點擊開啟進階篩選 (顏色、風格)。
- **右側 [升級方案] 按鈕**: 白色背景，帶有金色皇冠，吸引免費此使用者升級。

### D. 快速建立列 (Quick Access Row)
- 位於搜尋列下方，一排圓形圖示，方便快速進入編輯器。
- **項目**:
    - [簡報] (Presentation) - 電視/投影幕圖示
    - [社群媒體] (Social Media) - 愛心對話框圖示
    - [影片] (Video) - 播放鍵圖示
    - [列印] (Print) - 印表機圖示
    - [文件] (Docs) - 文件圖示
    - [白板] (Whiteboard) - 四角框圖示
    - [試算表] (Spreadsheets)
    - [網站] (Websites)
    - [顯示更多] (...)
- **互動**: 點擊任一圖示，通常會展開其子類別 (例如點社群媒體會跳出 Instagram, FB 選項) 或直接開啟該類型的空白畫布。

### E. 探索範本 (Content Suggestions)
- **標題**: "探索範本"。
- **卡片展示**:
    - 顯示不同類別的預覽圖 (簡報、海報、履歷、電子郵件等)。
    - 這裡的排版類似 Netflix 的橫向捲動，或是 Grid 排列。

### F. 懸浮按鈕 (Floating Action Button)
- **[?] (Help)**: 右下角紫色圓形問號按鈕，點擊開啟客服或說明中心。

## 3. 實作待辦事項 (Implementation Todo)

### HTML 架構
- [x] `div.top-banner`: 包含文字、查看優惠 Btn、關閉 Btn。
- [x] `div.app-container`: 包裹 Sidebar 和 Main Content。
- [x] `aside.sidebar`: 包含 Logo (可能隱藏), Create Btn, Nav List。
- [x] `main.content`:
    - `header`: 搜尋列上方的 Top Bar (升級按鈕在此)。
    - `section.hero`: 標題 ("你今天...")、搜尋 Tab、搜尋 Input。
    - `nav.quick-icons`: 圓形圖示列表。
    - `section.templates`: "探索範本" 區塊。

### CSS 樣式
- [x] **Color Palette**:
    - BG: `#f5f5f5` (Main), `#ffffff` (Sidebar/Search)。
    - Purple: `#7d2ae8` (Create Btn, Highlight)。
    - Gradient: `linear-gradient(to right, #4f60f6, #b83af3)` (Banner)。
- [x] **Sidebar**: Flex Column, 固定寬度 (或 RWD)。
- [x] **Search Bar**: `box-shadow`, `border-radius: 24px`。
- [x] **Icons**: 尋找類似 FontAwesome 的圖示或使用 SVG。

### JavaScript 互動
- [x] **Banner Toggle**: 點擊 X 移除 `.top-banner`。
- [x] **Sidebar Select**: 點擊 Nav Item 變更 Active 狀態。
- [x] **Search Type**: 點擊 "你的設計" / "範本" 切換按鈕樣式。
- [x] **Hover Effects**: 按鈕和卡片的懸停放大效果。

## 4. 資源需求
- Icons: Material Icons 或 FontAwesome。
- Images: 需要一些範本的縮圖 (簡報封面、海報封面等)。
