import jwt from 'jsonwebtoken';

// 🔑 關鍵：這裡的密鑰必須跟 generateToken.js 一模一樣
const JWT_SECRET = 'MySuperSecretKeyForWeek12'; 

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    
    // 1. 檢查是否有帶 Token
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: '未提供 Token' });
    }

    // 2. 取出 Token 字串
    const token = authHeader.split(' ')[1];

    // 3. 驗證 Token (如果密鑰不對，這裡會報錯)
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. 放行，並把資料掛在 req 上
    req.user = { 
      id: decoded.sub || decoded.id, // 相容 sub 或 id
      email: decoded.email, 
      role: decoded.role 
    };

    next();

  } catch (error) {
    console.error('驗證失敗:', error.message);
    // Token 無效或過期回傳 403
    res.status(403).json({ error: 'Token 無效' });
  }
}