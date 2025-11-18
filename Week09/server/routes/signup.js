// routes/signup.js
import { Router } from 'express';
import { nanoid } from 'nanoid';

const router = Router();
const participants = [];

// 新增 email 到必填欄位清單
const requiredFields = ['name', 'email', 'phone', 'password', 'interests', 'terms']; // terms 條款也應視為必填

function validatePayload(body) {
  for (const field of requiredFields) {
    // 檢查基本必填
    if (!body[field]) {
      // 特別處理 terms，讓錯誤訊息更明確
      if (field === 'terms') {
        return '請勾選服務條款';
      }
      return `${field} 為必填`; 
    }
  }

  // 1. 手機格式驗證
  if (!/^09\d{8}$/.test(body.phone)) {
    return '手機需為 09 開頭 10 碼';
  }

  // 2. Email 格式驗證 (新增)
  // 使用一個簡單的 regex 進行格式檢查
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return 'Email 格式不正確';
  }

  // 3. 興趣驗證
  if (!Array.isArray(body.interests) || body.interests.length === 0) {
    return '至少選擇一個興趣';
  }

  // 4. 密碼長度驗證
  if (body.password.length < 8) {
    return '密碼需至少 8 碼';
  }

  // 5. 密碼一致性驗證
  if (body.password !== body.confirmPassword) {
    return '密碼與確認密碼不一致';
  }
  
  // 6. 服務條款驗證 (確保 terms 必須為 true)
  if (body.terms !== true) {
      return '請勾選服務條款';
  }

  return null;
}

// GET /api/signup: 回傳目前報名清單與總數
router.get('/', (req, res) => {
  res.json({ total: participants.length, data: participants });
});

// POST /api/signup: 驗證所有欄位，失敗時回傳 400 與錯誤訊息。
router.post('/', (req, res) => {
  const errorMessage = validatePayload(req.body || {});
  if (errorMessage) {
    return res.status(400).json({ error: errorMessage });
  }
  
  // 避免將 confirmPassword 或原始密碼存入清單
  const newParticipant = {
    id: nanoid(8),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    interests: req.body.interests,
    createdAt: new Date().toISOString()
  };
  participants.push(newParticipant);
  res.status(201).json({ message: '報名成功', participant: newParticipant });
});

router.delete('/:id', (req, res) => {
  const index = participants.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: '找不到這位參與者' });
  }
  const [removed] = participants.splice(index, 1);
  res.json({ message: '已取消報名', participant: removed });
});

export { router };