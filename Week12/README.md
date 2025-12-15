# Week 12 課堂筆記

這週的練習主要是包含前後端跟資料庫的整合，這邊簡單紀錄一下怎麼把專案跑起來。

## 啟動方式 (怎麼跑)

這個專案分成資料庫、後端伺服器、前端網頁三個部分，記得都要開喔！

1. **資料庫 (MongoDB)**
   - 進到 `Week12/docker` 資料夾。
   - 打開終端機 (Terminal) 執行指令：`docker-compose up -d`
   - 這樣資料庫就會在背景跑著了。

2. **後端 (Server)**
   - 進到 `Week12/server` 資料夾。
   - 先安裝需要的套件：`npm install`
   - 啟動伺服器：`npm start` (或是 `node index.js`)
   - 看到類似 "Server is running on port 3001" 就代表成功了。

3. **前端 (Client)**
   - 直接進到 `Week12/client` 資料夾。
   - 用瀏覽器 (Chrome 或 Edge) 打開 `login.html` 或 `signup_form.html` 就可以使用了。

## 測試方式

你可以用兩種方式來測試這個功能：

1. **用 Postman 測 API**
   - 把 `Week12.postman_collection.json` 匯入到 Postman 裡。
   - 裡面已經設定好「註冊」、「登入」跟「測試權限」的 API，可以直接發送請求看看有沒有回應。

2. **用網頁測**
   - 打開 `signup_form.html` 試試看註冊一個新帳號。
   - 註冊完跳轉到 `login.html` 登入看看。

## 帳號列表 (常用的)

這邊列幾個設定檔或 Postman 裡用到的帳號資訊，方便測試用：

*   **資料庫管理員 (連進 MongoDB 用的)**
    *   帳號：`week12-admin`
    *   密碼：`week12-pass`

*   **測試用 App 帳號 (參考 Postman)**
    *   管理員：`admin@test.com` / 密碼 `123` (如果還沒註冊要先註冊)
    *   一般學生：`user@test.com` / 密碼 `456` (如果還沒註冊要先註冊)
