const jsonServer = require("json-server");
const auth = require("json-server-auth"); // [新增] 引入認證模組
const server = jsonServer.create();
const path = require("path");
const fs = require("fs");

// 1. 設定資料庫路徑
const isProd = process.env.NODE_ENV === "production";
const dbDirectory = isProd ? "/data" : __dirname;
const dbPath = path.join(dbDirectory, "db.json");

// 2. 初始化路由
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// [關鍵步驟] 必須將資料庫實體綁定到 server 上，Auth 才能運作
server.db = router.db;

// 3. 自動初始化：如果是空的，建立預設檔案
if (isProd && !fs.existsSync(dbPath)) {
  console.log("! 偵測到環境中無資料庫檔案，正在初始化...");
  const initialData = {
    users: [],
    restaurants: [],
    dishes: [],
    reviews: [],
    collections: [],
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

// 4. 使用中間件 (注意順序！)
server.use(middlewares);
server.use(auth); // [新增] Auth 必須在 router 之前
server.use(router);

// 5. 監聽 Port
const port = process.env.PORT || 8080;
server.listen(port, "0.0.0.0", () => {
  console.log(`JSON Server with Auth is running on port ${port}`);
});
