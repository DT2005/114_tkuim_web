// server/index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import authRouter from './routes/auth.js'; 
import signupRouter from './routes/signup.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('../client'));

console.log('⏳ 正在連線資料庫...');

// ★ 嚴格順序：先連線 DB -> 再掛載路由 -> 最後啟動 Server
connectDB().then(() => {
  
  // 只有連線成功後，路由才會被掛載
  app.use('/auth', authRouter);
  app.use('/api/signup', signupRouter);

  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ MongoDB 連線成功 (Ready to handle requests)`);
  });

}).catch(err => {
  console.error('❌ 資料庫連線失敗，伺服器無法啟動:', err);
  process.exit(1);
});
export default app;