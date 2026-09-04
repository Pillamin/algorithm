// src/config/firebase.js
// Firebase 초기화 및 Firestore 연동
// 실제 배포 시 아래 firebaseConfig 값을 Firebase Console에서 발급받은 값으로 교체하세요.

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// --- Firestore CRUD helpers ---

export async function fetchProblems() {
  try {
    const snapshot = await getDocs(collection(db, 'flowchart_problems'));
    if (snapshot.empty) return null;
    return snapshot.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((item) => !item.deleted);
  } catch (e) {
    console.warn('Firebase fetch failed, falling back to local data.', e);
    return null;
  }
}

export async function saveProblem(problem) {
  const ref = doc(db, 'flowchart_problems', problem.id);
  await setDoc(ref, { ...problem, adminKey: 'comedu2026' }, { merge: true });
}

export async function deleteProblemFromDB(problemId) {
  await deleteDoc(doc(db, 'flowchart_problems', problemId));
}

export async function fetchQuizQuestions() {
  try {
    const snapshot = await getDocs(collection(db, 'algorithm_quiz_questions'));
    if (snapshot.empty) return null;
    return snapshot.docs
      .map((d) => ({ id: Number(d.id) || d.id, ...d.data() }))
      .filter((item) => !item.deleted);
  } catch (e) {
    console.warn('Firebase fetch quiz failed, falling back to local data.', e);
    return null;
  }
}

export async function saveQuizQuestion(question) {
  const ref = doc(db, 'algorithm_quiz_questions', String(question.id));
  await setDoc(ref, { ...question, adminKey: 'comedu2026' }, { merge: true });
}

export async function deleteQuizQuestionFromDB(questionId) {
  await deleteDoc(doc(db, 'algorithm_quiz_questions', String(questionId)));
}

// --- Batch Sync Helpers ---

export async function saveProblemsBatch(problems) {
  const batch = writeBatch(db);
  const collRef = collection(db, 'flowchart_problems');
  
  // 1. Get existing docs and extract IDs (ensuring string)
  const snapshot = await getDocs(collRef);
  const existingIds = snapshot.docs.filter(d => !d.data().deleted).map(d => d.id);
  
  // 2. Identify new IDs and IDs to soft delete
  const newIds = problems.map(p => String(p.id));
  const idsToDelete = existingIds.filter(id => !newIds.includes(id));
  
  // 3. Soft delete items no longer present
  for (const id of idsToDelete) {
    const ref = doc(db, 'flowchart_problems', id);
    batch.set(ref, { adminKey: 'comedu2026', deleted: true }, { merge: true });
  }
  
  // 4. Save/update new and existing items
  for (const p of problems) {
    const ref = doc(db, 'flowchart_problems', String(p.id));
    batch.set(ref, { ...p, adminKey: 'comedu2026', deleted: false }, { merge: true });
  }
  
  await batch.commit();
}

export async function saveQuizQuestionsBatch(questions) {
  const batch = writeBatch(db);
  const collRef = collection(db, 'algorithm_quiz_questions');
  
  // 1. Get existing docs and extract IDs (ensuring string)
  const snapshot = await getDocs(collRef);
  const existingIds = snapshot.docs.filter(d => !d.data().deleted).map(d => d.id);
  
  // 2. Identify new IDs and IDs to soft delete
  const newIds = questions.map(q => String(q.id));
  const idsToDelete = existingIds.filter(id => !newIds.includes(id));
  
  // 3. Soft delete items no longer present
  for (const id of idsToDelete) {
    const ref = doc(db, 'algorithm_quiz_questions', id);
    batch.set(ref, { adminKey: 'comedu2026', deleted: true }, { merge: true });
  }
  
  // 4. Save/update new and existing items
  for (const q of questions) {
    const ref = doc(db, 'algorithm_quiz_questions', String(q.id));
    batch.set(ref, { ...q, adminKey: 'comedu2026', deleted: false }, { merge: true });
  }
  
  await batch.commit();
}

// --- Version Snapshot Helpers ---
export async function saveVersionSnapshot(type, data, note = '') {
  const versionId = `v_${Date.now()}`;
  const timestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleString('ko-KR');
  const collectionName = type === 'quiz' ? 'algorithm_quiz_versions' : 'algorithm_problem_versions';
  
  const payload = {
    id: versionId,
    type,
    timestamp,
    dateStr,
    count: data.length,
    data,
    note,
    adminKey: 'comedu2026',
  };

  try {
    const ref = doc(db, collectionName, versionId);
    await setDoc(ref, payload);
  } catch (e) {
    console.warn('Firebase version save failed:', e);
  }

  // Also maintain in localStorage as immediate fallback
  try {
    const localKey = type === 'quiz' ? 'algo_quiz_version_history' : 'algo_problem_version_history';
    const localList = JSON.parse(localStorage.getItem(localKey) || '[]');
    localList.unshift(payload);
    // Keep last 30 versions in localStorage
    localStorage.setItem(localKey, JSON.stringify(localList.slice(0, 30)));
  } catch (e) {
    console.warn('Local version history write failed:', e);
  }

  return payload;
}

export async function fetchVersionSnapshots(type) {
  const collectionName = type === 'quiz' ? 'algorithm_quiz_versions' : 'algorithm_problem_versions';
  const localKey = type === 'quiz' ? 'algo_quiz_version_history' : 'algo_problem_version_history';
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    if (!snapshot.empty) {
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      return list;
    }
  } catch (e) {
    console.warn('Firebase fetch versions failed, using local history.', e);
  }
  try {
    return JSON.parse(localStorage.getItem(localKey) || '[]');
  } catch {
    return [];
  }
}

export async function deleteVersionSnapshot(type, versionId) {
  const collectionName = type === 'quiz' ? 'algorithm_quiz_versions' : 'algorithm_problem_versions';
  const localKey = type === 'quiz' ? 'algo_quiz_version_history' : 'algo_problem_version_history';
  try {
    await deleteDoc(doc(db, collectionName, versionId));
  } catch (e) {
    console.warn('Firebase delete version failed:', e);
  }
  try {
    const localList = JSON.parse(localStorage.getItem(localKey) || '[]');
    const filtered = localList.filter((v) => v.id !== versionId);
    localStorage.setItem(localKey, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Local version delete failed:', e);
  }
}
