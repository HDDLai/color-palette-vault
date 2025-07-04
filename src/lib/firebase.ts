import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

const serviceKeyPath = process.env.FIREBASE_ADMIN_PRIVATE_KEY_PATH;

if (!serviceKeyPath) {
  throw new Error('FIREBASE_ADMIN_PRIVATE_KEY_PATH is not set in the environment variables.');
}

const absolutePath = path.resolve(serviceKeyPath);
const serviceAccount = JSON.parse(fs.readFileSync(absolutePath, "utf8"));


if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

const db = getFirestore();

export { db };
