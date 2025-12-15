import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

// 直接將帳號密碼寫在這裡，確保一定連得上
const uri = 'mongodb://week12-admin:week12-pass@localhost:27017/week12?authSource=week12';
let db = null;

export async function connectDB() {
  if (db) return db;
  try {
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('MongoDB 連線成功');
    return db;
  } catch (error) {
    console.error('MongoDB 連線失敗', error);
    process.exit(1);
  }
}

export function getCollection(collectionName) {
  if (!db) {
    throw new Error('資料庫尚未初始化，請先呼叫 connectDB');
  }
  return db.collection(collectionName);
}