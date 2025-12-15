// server/routes/signup.js
import express from 'express';
import { authMiddleware } from '../middleware/auth.js'; // 引用你的 auth.js
// 請確保以下路徑指向你原本 Week11 的資料庫操作檔案
import { findAll, findByOwner, createParticipant, deleteParticipant, findParticipantById } from '../repositories/participants.js'; 

const router = express.Router();

// 1. 套用中介軟體，保護所有子路由
router.use(authMiddleware);

// GET /api/signup - 查詢
router.get('/', async (req, res) => {
  try {
    // 權限判斷：Admin 看全部，一般人只看自己的
    const data = req.user.role === 'admin'
      ? await findAll()
      : await findByOwner(req.user.id);
    
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/signup - 新增
router.post('/', async (req, res) => {
  try {
    // 強制將 ownerId 設為當前登入者
    const newParticipant = await createParticipant({ 
      ...req.body, 
      ownerId: req.user.id 
    });
    res.status(201).json(newParticipant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/signup/:id - 刪除
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const participant = await findParticipantById(id);

    if (!participant) {
      return res.status(404).json({ error: '找不到該筆資料' });
    }

    // 權限檢查：不是 Admin 且 不是資料擁有者，就拒絕
    if (req.user.role !== 'admin' && participant.ownerId !== req.user.id) {
      return res.status(403).json({ error: '權限不足' });
    }

    await deleteParticipant(id);
    res.json({ message: '刪除完成' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;