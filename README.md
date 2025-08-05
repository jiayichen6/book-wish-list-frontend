![書單管理介面預覽](./preview.png)

# 書單管理小工具

# Books Wish List

一個使用 HTML、CSS、JavaScript 與 Alpine.js 打造的簡潔互動式書單管理工具。  
使用者可以瀏覽書籍清單、切換閱讀狀態，並標記收藏書籍。

---

## 功能

- 瀏覽書籍封面、作者、主題標籤
- 點擊書籍展開完整描述內容
- 分頁切換：全部書籍 / 想讀清單 / 已讀清單
- 標記收藏功能（Favorite）
- 使用 icon 切換閱讀狀態
- 響應式排版

---

## 邏輯與資料流程

- 以書名或作者名稱搜尋書籍
- 狀態變更後畫面與資料即時同步更新
- 整合來自兩個 API 的資料來源
- 自行撰寫邏輯合併描述資料（比對書名）

---

## 使用技術

- HTML / CSS / JavaScript
- Tailwind CSS / DaisyUI
- Phosphor Icons（內嵌 SVG）
  - 採用 Phosphor Icons 內嵌 SVG 引入，方便搭配 Tailwind 工具類別調整樣式  
    （為了視覺風格一致性，未採用 DaisyUI 內建圖示）
- Alpine.js
- JSON Server
- Git & GitHub

---

## 開始步驟

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

> npm run all 透過 concurrently 同時啟動兩個服務，已包含在 package.json。

## API 資料來源

- 書籍資料（書名、作者、主題、封面）：Open Library API
- 書籍描述資料（簡介文字）：Wikipedia REST API

> 兩個 API 的資料格式不同，因此描述需額外比對書名並整合。

## 專案說明

此專案為練習性質，練習重點：

- 強化 JavaScript 邏輯結構與模組化能力
- 熟悉 Alpine.js 的資料綁定與事件控制
- 練習外部 API 串接與資料整合
- 操作 DOM 並實作資料狀態同步畫面
