![書單管理介面預覽](./preview.png)

# 書單管理小工具

# Books Wish List

一個使用 HTML、CSS、JavaScript 與 Alpine.js 打造的簡潔互動式書單管理工具。  
前端改為 串接 Flask 後端 API（JWT 驗證）：登入後可讀寫個人清單，支援想讀/已讀互斥與收藏。

**v1.0.0**：使用 JSON Server 模擬假資料  
**v2.0.0**：串接 Flask 後端 API（JWT 驗證）

---

## 功能

- 瀏覽書籍封面、作者、主題標籤
- 點擊書籍展開完整描述內容
- 分頁切換：全部書籍 / 想讀清單 / 已讀清單
- 標記收藏功能（Favorite）
- 使用 icon 切換閱讀狀態
- 透過書名 / 作者查詢書籍
- 響應式排版

---

## 邏輯與資料流程（v2.0.0）

- 以首頁載入會檢查 localStorage 是否有 token → 呼叫 /users/check 驗證
  - 合法 → 進入書單頁
  - 不合法 / 過期 → 導回登入
- Axios 攔截 401：使用中途 token 過期會自動登出並跳回登入
- 書單切換採 樂觀 UI + 回滾（isPending 防重複點擊）
- 想讀/已讀為 互斥：前端只送目標清單的一個請求（POST 或 DELETE），後端保證互斥

---

## 使用技術

- HTML / CSS / JavaScript
- Tailwind CSS / DaisyUI
- Phosphor Icons（內嵌 SVG）
  - 採用 Phosphor Icons 內嵌 SVG 引入，方便搭配 Tailwind 工具類別調整樣式  
    （為了視覺風格一致性，未採用 DaisyUI 內建圖示）
- Alpine.js
- Git & GitHub（v1.0.0 JSON Server 版 → v2.0.0 Flask 版）

---

## 開始步驟

### v1.0.0

```bash
npm install     # 安裝依賴套件
npm run all     # 同時啟動前端與 JSON Server
```

啟動後包含：

- Vite 開發伺服器（預設 port：5173）
- JSON Server 假資料 API（預設 port：3002）

JSON Server 提供以下 API 路徑：

- /allBooksData
- /toReadBooksData
- /finishedBooksData
- /favoriteBooksData

### v2.0.0

#### 前端啟動

```bash
npm install     # 安裝依賴套件
npm run dev     # 啟動 Vite（預設 port：5173）
```

> 此版本前端直接串接 Flask API，不再使用 JSON Server。

#### 後端啟動

- 後端 repo：https://github.com/jiayichen6/book-wish-list-backend
- 啟動步驟請見後端 README：

---

## API 資料來源

- 書籍資料（書名、作者、主題、封面）：Open Library API
- 書籍描述資料（簡介文字）：Wikipedia REST API

> 兩個 API 的資料格式不同，因此描述需額外比對書名並整合。

---

## 專案說明

此專案為練習性質，練習重點：

- 強化 JavaScript 邏輯結構與模組化能力
- 熟悉 Alpine.js 的資料綁定與事件控制
- 練習外部 API 串接與資料整合
- 操作 DOM 並實作資料狀態同步畫面
