import { Router } from 'express';
import { nanoid } from 'nanoid';

export const router = Router();
const participants = [];

router.get('/', (req, res) => {
  res.json({ total: participants.length, data: participants });
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body ?? {};
  if (!name || !email || !phone) {
    return res.status(400).json({ error: 'name、email、phone 都必填' });
  }
  const participant = {
    id: nanoid(8),
    name,
    email,
    phone,
    createdAt: new Date().toISOString()
  };
  participants.push(participant);
  res.status(201).json({ message: '報名成功', participant });
});
