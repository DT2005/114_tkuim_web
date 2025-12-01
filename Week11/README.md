# Week 11
## 1. 環境需求
* Node.js (建議 v18 以上)
* Docker Desktop (務必開啟)
* MongoDB Compass (用來檢查資料庫)
* VS Code (建議安裝 REST Client 套件以便測試)

## 2. 設定檔說明 (.env)
我在 `server/` 資料夾下有一個 `.env` 檔案，格式如下：

| 變數名稱 | 用途 | 範例值 |
| :--- | :--- | :--- |
| `PORT` | 伺服器跑在哪個 Port | `3001` |
| `MONGODB_URI` | 連線字串 (包含帳密) | `mongodb://week11-user:week11-pass@localhost:27017/week11?authSource=week11` |
| `ALLOWED_ORIGIN` | 允許前端連線的網址 | `http://localhost:5173` |

## 3. 啟動指令 (Step-by-Step)
### 啟動資料庫
請在專案最外層目錄 (包含 `docker-compose.yml` 的地方) 執行：
docker compose up -d

## 4. 測試方式
### 方法 A：API 功能測試 (使用 REST Client 或 Postman)
專案內附有 tests/api.http 檔案，若使用 VS Code 可直接點擊 Send Request。

#### 1. 建立報名 (測試 Email 唯一性，重複會報錯)
POST /api/signup

#### 2. 查詢清單 (測試分頁功能)
GET /api/signup?page=1&limit=10

#### 3. 更新學員資料
PATCH /api/signup/:id

#### 4. 刪除學員資料
DELETE /api/signup/:id

### 方法  B：MongoDB Shell 指令驗證 (作業要求)
請在終端機執行以下指令，直接驗證資料庫層面的實作：

#### 1. 進入資料庫 Shell
docker exec -it week11-mongo mongosh -u week11-user -p week11-pass week11

#### 2. 驗證分頁邏輯 (Skip / Limit) 模擬查詢第 2 頁，每頁 2 筆 (跳過前 2 筆)：
db.participants.find().sort({ createdAt: -1 }).skip(2).limit(2)

#### 3. 驗證唯一索引 確認 email_1 索引存在 (unique: true)：
db.participants.getIndexes()

## 5. 資料結構與截圖
本系統資料儲存於 participants 集合，欄位結構如下：

#### _id: 系統自動生成 ID
#### name: 姓名
#### email: 電子郵件 (唯一索引)
#### phone: 電話
#### createdAt: 建立時間
#### MongoDB Compass 截圖：db_screenshot.png 放於根目錄

## 6. 常見問題 (FAQ)
Q: 啟動後連不上資料庫 (Connection Refused)？
A: 檢查 Docker Desktop 是否運作中，並確認 docker ps 有看到 mongo 容器。

Q: 為什麼重複報名會回傳 400？
A: 這是系統設計的保護機制，API 會回傳「此 Email 已經報名過了」友善訊息。

Q: 測試檔 (.http) 無法執行？
A: 請確認 VS Code 已安裝 "REST Client" 擴充套件。
