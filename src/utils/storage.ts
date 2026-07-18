import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface CompassDB extends DBSchema {
  ai_cache: {
    key: string;
    value: {
      key: string;
      response: any;
      timestamp: number;
    };
  };
  chat_history: {
    key: string;
    value: {
      sessionId: string;
      messages: any[];
      updatedAt: number;
    };
  };
  generated_books: {
    key: string;
    value: {
      bookId: string;
      content: any;
      createdAt: number;
    };
  };
  offline_queue: {
    key: string;
    value: {
      id: string;
      action: string;
      payload: any;
      timestamp: number;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<CompassDB>> | null = null;

export async function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<CompassDB>('compass-study-db', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('ai_cache')) {
          db.createObjectStore('ai_cache', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('chat_history')) {
          db.createObjectStore('chat_history', { keyPath: 'sessionId' });
        }
        if (!db.objectStoreNames.contains('generated_books')) {
          db.createObjectStore('generated_books', { keyPath: 'bookId' });
        }
        if (!db.objectStoreNames.contains('offline_queue')) {
          db.createObjectStore('offline_queue', { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

// 1. AI Cache (Gemini Cost Optimization)
export async function getCachedAIResponse(promptKey: string) {
  const db = await getDB();
  const cached = await db.get('ai_cache', promptKey);
  if (cached) {
    // Optional: add expiry check here, e.g., 7 days
    return cached.response;
  }
  return null;
}

export async function setCachedAIResponse(promptKey: string, response: any) {
  const db = await getDB();
  await db.put('ai_cache', {
    key: promptKey,
    response,
    timestamp: Date.now(),
  });
}

// 2. Chat History (IndexedDB instead of Firebase)
export async function saveChatSession(sessionId: string, messages: any[]) {
  const db = await getDB();
  await db.put('chat_history', {
    sessionId,
    messages,
    updatedAt: Date.now(),
  });
}

export async function getChatSession(sessionId: string) {
  const db = await getDB();
  const session = await db.get('chat_history', sessionId);
  return session ? session.messages : [];
}

// 3. Export Backup Data
export async function exportAllLocalData(): Promise<string> {
  const db = await getDB();
  const ai_cache = await db.getAll('ai_cache');
  const chat_history = await db.getAll('chat_history');
  
  // also grab localStorage data (compass_* keys)
  const localSettings: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('compass_')) {
      localSettings[key] = localStorage.getItem(key) || '';
    }
  }

  const exportData = {
    version: 'schema_v1',
    timestamp: Date.now(),
    indexedDB: {
      ai_cache,
      chat_history,
    },
    localStorage: localSettings,
  };

  return JSON.stringify(exportData);
}

// 4. Safe Migration & Restore
export async function restoreFromBackup(backupJson: string): Promise<boolean> {
  try {
    const data = JSON.parse(backupJson);
    if (!data.version || !data.localStorage) return false;

    // Restore localStorage
    for (const [key, value] of Object.entries(data.localStorage)) {
      if (typeof value === 'string') {
        localStorage.setItem(key, value);
      }
    }

    // Restore IndexedDB
    const db = await getDB();
    if (data.indexedDB?.chat_history) {
      const tx = db.transaction('chat_history', 'readwrite');
      for (const item of data.indexedDB.chat_history) {
        await tx.store.put(item);
      }
      await tx.done;
    }
    
    if (data.indexedDB?.ai_cache) {
      const tx = db.transaction('ai_cache', 'readwrite');
      for (const item of data.indexedDB.ai_cache) {
        await tx.store.put(item);
      }
      await tx.done;
    }

    return true;
  } catch (err) {
    console.error("Failed to restore backup", err);
    return false;
  }
}

// 5. Personalization Engine (Weakness tracking)
export async function updateStudentPersonalization(profile: any, scorePercent: number, subjectName: string) {
  if (!profile) return;
  
  const updatedProfile = { ...profile };
  
  if (!updatedProfile.personalization) {
    updatedProfile.personalization = { weakSubjects: [], learningPace: "normal", lastUpdated: new Date().toISOString() };
  }
  
  if (!updatedProfile.subjectConfidence) {
    updatedProfile.subjectConfidence = { maths: "Okay", biology: "Okay", chemistry: "Okay", physics: "Okay" };
  }

  const subKey = subjectName.toLowerCase() as "maths" | "biology" | "chemistry" | "physics";
  
  if (scorePercent < 60) {
    updatedProfile.subjectConfidence[subKey] = "Weak";
    if (!updatedProfile.personalization.weakSubjects.includes(subjectName)) {
      updatedProfile.personalization.weakSubjects.push(subjectName);
    }
  } else if (scorePercent >= 85) {
    updatedProfile.subjectConfidence[subKey] = "Confident";
    updatedProfile.personalization.weakSubjects = updatedProfile.personalization.weakSubjects.filter((s: string) => s !== subjectName);
  } else {
    updatedProfile.subjectConfidence[subKey] = "Okay";
  }

  updatedProfile.personalization.lastUpdated = new Date().toISOString();
  localStorage.setItem("compass_profile", JSON.stringify(updatedProfile));
}

// Memory System for AI invisible personalization
export function _deprecated_updateStudentPersonalization(updates: any) {
  const current = JSON.parse(localStorage.getItem('compass_student_persona') || '{}');
  const merged = { ...current, ...updates, lastUpdated: Date.now() };
  localStorage.setItem('compass_student_persona', JSON.stringify(merged));
}

export function getStudentPersonalization() {
  return JSON.parse(localStorage.getItem('compass_student_persona') || '{}');
}

// Debounce Firebase sync (limit to max 1 write per X seconds)
let syncTimeout: any = null;
export function debouncedFirebaseSync(syncFn: () => void, delayMs = 15000) {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(() => {
    syncFn();
    syncTimeout = null;
  }, delayMs);
}
