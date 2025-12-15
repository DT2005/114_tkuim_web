// server/repositories/users.js
import { getCollection } from '../db.js';

export async function findUserByEmail(email) {
  return getCollection('users').findOne({ email });
}

export async function createUser({ email, passwordHash, role = 'user' }) {
  const doc = { 
    email, 
    passwordHash, 
    role, 
    createdAt: new Date() 
  };
  const result = await getCollection('users').insertOne(doc);
  return { ...doc, _id: result.insertedId };
}