import { ObjectId } from 'mongodb';
import { getCollection } from '../db.js';

export async function findAll() {
  return getCollection('participants').find().toArray();
}

export async function findByOwner(ownerId) {
  return getCollection('participants').find({ ownerId }).toArray();
}

export async function createParticipant(data) {
  const result = await getCollection('participants').insertOne({
    ...data,
    createdAt: new Date()
  });
  return { ...data, _id: result.insertedId };
}

export async function findParticipantById(id) {
  if (!ObjectId.isValid(id)) return null;
  return getCollection('participants').findOne({ _id: new ObjectId(id) });
}

export async function deleteParticipant(id) {
  if (!ObjectId.isValid(id)) return;
  return getCollection('participants').deleteOne({ _id: new ObjectId(id) });
}