# 🧠 KidsLab 學習實驗室

一個為孩子打造的互動式學習網頁平台。  
結合遊戲化設計、簡潔介面與積分機制，讓學習變得更有趣！

---

## 📂 專案架構

```bash
KidsLab/
│
├── index.html                # 首頁入口
│
├── KidsLabTheme.css          # 主題樣式（共用色系、字體與按鈕設計）
│
├── /DailyTask/               # Hunter 每日任務系統
│   ├── index.html
│   ├── main.js
│   ├── tasks.js
│   ├── avatar.png
│   └── background.png
│
├── /ZhuyinPractice/          # ㄅㄆㄇ 注音拼讀練習
│   ├── index.html
│   ├── words.js
│   ├── zhuyin-all.js
│   └── ...
│
└── /MathPractice/            # 數學練習區
    ├── split-practice.html   # 數字分解練習
    └── ...
🎯 每日任務（DailyTask）
功能說明
抽任務：從任務清單隨機選出今日任務

重抽：重新隨機一次

清除：清空今日任務

完成任務：完成後獲得 1 EXP

積分系統：每 5 EXP 可兌換一次 Minecraft 30 分鐘

家長加分與清除機制：受密碼保護

歷史紀錄：保存最近 10 筆任務

已移除項目
「下一個上學日的任務」
「測試工具（強制搬移任務）」
現在抽任務直接指定為當日任務，不再保留跨日資料。

🧩 數字分解練習（Split Practice）
拖曳小圓點進入答案框進行數字分解

自動檢查正確與錯誤

完全響應式設計，適合平板與手機

🔡 注音拼讀練習（Zhuyin Practice）
聆聽發音，從注音選項中選出正確拼音

支援自由練習與挑戰模式（10 題一輪）

完整使用注音字體 BpmfIansui 顯示正確排版

⚙️ 技術重點
純 HTML / CSS / JS（無框架）

localStorage 儲存進度

支援手機與平板操作

遊戲化互動（EXP、挑戰模式）

💡 未來規劃
新增「10 以內加減法練習」頁面

© 2025 KidsLab · Created by ZTing
