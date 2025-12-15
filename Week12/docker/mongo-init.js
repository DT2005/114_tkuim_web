// Week12/docker/mongo-init.js

db = db.getSiblingDB('week12'); // 確保操作在 week12 資料庫

db.createUser({
  user: 'week12-admin', // 講義指定帳號
  pwd: 'week12-pass',  // 講義指定密碼
  roles: [{ role: 'readWrite', db: 'week12' }]
});

// 1. participants 集合加入索引
db.createCollection('participants');
db.participants.createIndex({ ownerId: 1 });

// 2. users 集合 + email 唯一索引
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });

// 預先建立管理員帳號
db.users.insertOne({
  email: 'admin@example.com',
  passwordHash: '$2b$10$4P6uyrAvH/e0K9..exampleHash12345', // 這裡的 hash 值是用 bcrypt 生成的範例
  role: 'admin',
  createdAt: new Date()
});