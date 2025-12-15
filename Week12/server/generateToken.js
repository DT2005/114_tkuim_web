// server/generateToken.js
import jwt from 'jsonwebtoken';

const EXPIRES_IN = '2h';
// 🔑 修正點：將密鑰直接寫死
const JWT_SECRET = 'MySuperSecretKeyForWeek12'; 

export function generateToken(user) {
  return jwt.sign(
    {
      sub: user._id?.toString?.() ?? user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET, // <--- 改用寫死的變數
    { expiresIn: EXPIRES_IN }
  );
}