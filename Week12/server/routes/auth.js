// server/routes/auth.js

import express from 'express';
import bcrypt from 'bcryptjs';
import { findUserByEmail, createUser } from '../repositories/users.js';
import { generateToken } from '../generateToken.js'; // 確保路徑正確

const router = express.Router();
const SALT_ROUNDS = 10; // bcrypt 加密強度

// 1. POST /auth/signup - 註冊 (含密碼加密)
router.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: '請提供 Email 和密碼' });
  }

  try {
    // 檢查 Email 是否已存在
    if (await findUserByEmail(email)) {
      return res.status(409).json({ error: '此 Email 已被註冊' });
    }

    // 🎯 密碼 Hashing (達成無明碼密碼要求)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 建立使用者
    const newUser = await createUser({ 
      email, 
      passwordHash, 
      // 確保 role 只允許 'admin' 或 'student' (或 'user')
      role: role === 'admin' ? 'admin' : 'student' // 假設非 admin 都是 student/user
    });

    // 移除 hash 值後回傳
    const { passwordHash: _, ...userWithoutHash } = newUser; 
    res.status(201).json(userWithoutHash);
  } catch (error) {
    res.status(500).json({ error: '註冊失敗: ' + error.message });
  }
});

// 2. POST /auth/login - 登入 (回傳 Token)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: '請提供 Email 和密碼' });
  }

  try {
    const user = await findUserByEmail(email);

    // 檢查使用者是否存在
    if (!user) {
      return res.status(401).json({ error: '使用者不存在或密碼錯誤' });
    }

    // 🎯 密碼驗證 (與資料庫的 Hash 值比對)
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: '使用者不存在或密碼錯誤' });
    }

    // 🎯 產生 JWT Token (包含 role)
    const token = generateToken(user);

    // 移除 hash 值後回傳
    const { passwordHash: _, ...userWithoutHash } = user;

    res.json({ 
      token, 
      user: userWithoutHash 
    });
  } catch (error) {
    res.status(500).json({ error: '登入失敗: ' + error.message });
  }
});

export default router;

// 記得在 index.js 引用這個路由: app.use('/auth', authRouter);