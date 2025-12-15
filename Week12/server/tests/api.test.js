import request from 'supertest';
import { describe, test, expect, beforeAll } from 'vitest';
import app from '../index.js';
import { connectDB, getCollection } from '../db.js';

// 測試變數
let adminToken = '';
let studentToken = '';
let studentParticipantId = '';
let anotherParticipantId = ''; 

beforeAll(async () => {
  await connectDB();
  // 🧹 關鍵修正：測試開始前，清空資料庫，避免舊帳號密碼不符的問題
  try {
    await getCollection('users').deleteMany({});
    await getCollection('participants').deleteMany({});
    console.log('🧹 資料庫已清空，準備測試');
  } catch (e) {
    console.log('⚠️ 清空資料庫失敗 (可能是第一次執行):', e.message);
  }
});

describe('Week 12 API 權限與身份驗證測試', () => {

  // --- 1. 註冊與登入 ---
  test('1. 註冊 Admin 帳號', async () => {
    // 因為清空了資料庫，這裡一定會是 201 Created
    await request(app).post('/auth/signup')
      .send({ email: 'admin@test.com', password: 'password123', role: 'admin' })
      .expect(201);
  });
  
  test('2. 註冊 Student 帳號', async () => {
    await request(app).post('/auth/signup')
      .send({ email: 'student@test.com', password: 'password123', role: 'student' })
      .expect(201);
  });

  test('3. 登入 Admin 取得 Token', async () => {
    const res = await request(app).post('/auth/login')
      .send({ email: 'admin@test.com', password: 'password123' })
      .expect(200);
    adminToken = res.body.token;
    expect(adminToken).toBeDefined();
  });

  test('4. 登入 Student 取得 Token', async () => {
    const res = await request(app).post('/auth/login')
      .send({ email: 'student@test.com', password: 'password123' })
      .expect(200);
    studentToken = res.body.token;
    expect(studentToken).toBeDefined();
  });

  // --- 5. [POST] 學生新增報名資料 ---
  test('5. Student 新增報名資料並驗證 ownerId', async () => {
    const res = await request(app).post('/api/signup')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ name: '王小明', email: 'student_ming@test.com', phone: '0912345678' })
      .expect(201); // 如果這裡 403，代表 authMiddleware 沒設好
    
    expect(res.body.ownerId).toBeDefined(); 
    studentParticipantId = res.body._id;
  });
  
  // --- 6. [GET] 查詢權限測試 ---
  test('6. Student 查詢資料 (應只看到自己的 1 筆)', async () => {
    const res = await request(app).get('/api/signup')
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);
    expect(res.body.data).toHaveLength(1);
  });

  test('7. Admin 查詢資料 (應看到所有人的 >= 1 筆)', async () => {
    const res = await request(app).get('/api/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1); 
  });

  // --- 8. [DELETE] 權限測試 ---
  test('8. Student 嘗試刪除不存在的 ID (應回傳 404)', async () => {
    await request(app).delete('/api/signup/6571b0000000000000000000') 
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(404); // 如果這裡 403，代表還沒進到 Controller 就被擋了
  });
  
  test('9. Admin 建立一筆資料 (供 Student 嘗試刪除)', async () => {
    const res = await request(app).post('/api/signup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Admin_Post', email: 'admin@post.com', phone: '0900000000' })
      .expect(201);
    anotherParticipantId = res.body._id;
  });
  
  test('10. Student 嘗試刪除別人的資料 (應回傳 403)', async () => {
    await request(app).delete(`/api/signup/${anotherParticipantId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(403);
  });

  test('11. Student 刪除自己的資料 (應成功 200)', async () => {
    await request(app).delete(`/api/signup/${studentParticipantId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .expect(200);
  });
  
  test('12. Admin 刪除別人的資料 (應成功 200)', async () => {
    await request(app).delete(`/api/signup/${anotherParticipantId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });

  // --- 13. 未登入測試 ---
  test('13. 未提供 Token 訪問 GET (應回傳 401)', async () => {
    await request(app).get('/api/signup')
      .expect(401); 
  });
});