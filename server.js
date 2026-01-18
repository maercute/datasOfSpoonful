const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router(
  process.env.NODE_ENV === 'production' ? '/data/db.json' : 'db.json',
); // [cite: 21, 27]
const middlewares = jsonServer.defaults();
const fs = require('fs');
const path = require('path');

// 1. 判斷是否為雲端環境，設定資料庫路徑 [cite: 29-34]
const isProd = process.env.NODE_ENV === 'production';
const dbDirectory = isProd ? '/data' : __dirname;
const dbPath = path.join(dbDirectory, 'db.json');

// 2. 自動初始化：如果雲端硬碟是空的，自動建立一個預設檔案 [cite: 46-56]
if (isProd && !fs.existsSync(dbPath)) {
  console.log('! 偵測到環境中無資料庫檔案，正在初始化...');
  // 這裡可以填入你想要的預設資料
  const initialData = {
    users: [],
    posts: [],
    comments: [],
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
}

// 3. 綁定路由與中間件
server.use(middlewares);
server.use(router);

// 4. 監聽 Port：這一步最重要！一定要用 0.0.0.0 [cite: 61-62]
const port = process.env.PORT || 8080;
server.listen(port, '0.0.0.0', () => {
  console.log(`JSON Server is running on port ${port}`);
});
