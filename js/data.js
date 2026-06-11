// js/data.js

const mockItems = [
  {
    "id": "item_001",
    "type": "遺失",
    "status": "尋找中",
    "name": "紅色結繩髮圈",
    "category": "飾品",
    "district": "桃園區",
    "location": "桃園火車站前站大廳",
    "date": "2026-06-10",
    "description": "手工編織的紅色結繩，對失主來說是非常重要的物品，希望能盡快找回。",
    "imageUrl": "images/items/musubi.avif",
    // 📍 綁定給一般用戶 (測試帳號)
    "publisherEmail": "user@kimi.com",
    "publisherName": "一般探索者"
  },
  {
    "id": "item_002",
    "type": "拾獲",
    "status": "已結案",
    "name": "高中國文課本",
    "category": "書籍",
    "district": "中壢區",
    "location": "元智大學圖書館前廣場",
    "date": "2026-06-08",
    "description": "課本內頁有許多手寫筆記與插畫，封面寫著三年二班。",
    "imageUrl": "images/items/book.jpg",
    // 📍 綁定給一般用戶 (測試帳號)
    "publisherEmail": "user@kimi.com",
    "publisherName": "一般探索者"
  },
  {
    "id": "item_003",
    "type": "遺失",
    "status": "尋找中",
    "name": "風景素描本",
    "category": "文具",
    "district": "八德區",
    "location": "廣豐新天地附近公園",
    "date": "2026-06-05",
    "description": "黑色硬殼素描本，裡面畫滿了各種天空與彗星的草圖。",
    "imageUrl": "images/items/sketch.avif",
    // 📍 綁定給管理員
    "publisherEmail": "admin@kimi.com",
    "publisherName": "超級管理員"
  },
  {
    "id": "item_004",
    "type": "拾獲",
    "status": "已結案",
    "name": "碎屏的智慧型手機",
    "category": "電子產品",
    "district": "龜山區",
    "location": "虎頭山環保公園觀景台",
    "date": "2026-06-01",
    "description": "螢幕有大面積碎裂，手機殼是深藍色的星空圖案，已沒電關機。",
    "imageUrl": "images/items/phone.avif",
    "publisherEmail": "stranger@kimi.com",
    "publisherName": "路人甲"
  },
  {
    "id": "item_005",
    "type": "拾獲",
    "status": "尋找中",
    "name": "流星觀測圖鑑",
    "category": "書籍",
    "district": "蘆竹區",
    "location": "台茂購物中心一樓座椅區",
    "date": "2026-05-28",
    "description": "精裝版的天文觀測圖鑑，內附多張高解析度星空照片。",
    "imageUrl": "images/items/guide.avif",
    "publisherEmail": "stranger@kimi.com",
    "publisherName": "路人乙"
  }
];