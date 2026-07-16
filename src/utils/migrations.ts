import { UserProfile, UserStats } from "../types";

const CURRENT_SCHEMA_VERSION = 3; // Bump this when changing schema

function backupDataBeforeMigration(key: string, data: any, fromVersion: number) {
  try {
    const backupKey = `${key}_backup_v${fromVersion}_${Date.now()}`;
    localStorage.setItem(backupKey, JSON.stringify(data));
    console.log(`[Compass Migration] Created backup at ${backupKey}`);
  } catch (err) {
    console.error("Migration backup failed:", err);
  }
}

export function runSafeMigrations() {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
    const currentVersion = parseInt(localStorage.getItem("compass_schema_version") || "1", 10);
    
    if (currentVersion >= CURRENT_SCHEMA_VERSION) {
      return; // Already up to date
    }

    console.log(`[Compass Migration] Starting safe migration from v${currentVersion} to v${CURRENT_SCHEMA_VERSION}`);

    // Read existing data
    const pStr = localStorage.getItem("compass_profile");
    const sStr = localStorage.getItem("compass_stats");

    if (!pStr && !sStr) {
      // Clean install, just set version
      localStorage.setItem("compass_schema_version", CURRENT_SCHEMA_VERSION.toString());
      return;
    }

    let pData = pStr ? JSON.parse(pStr) : null;
    let sData = sStr ? JSON.parse(sStr) : null;

    // Backup before migrating
    if (pData) backupDataBeforeMigration("compass_profile", pData, currentVersion);
    if (sData) backupDataBeforeMigration("compass_stats", sData, currentVersion);

    let v = currentVersion;

    // Migration V1 to V2
    if (v === 1) {
      console.log("[Compass Migration] Applying v1 -> v2 (Adding memory objects)");
      if (pData && !pData.memory) {
        pData.memory = { alreadySeenQuizzes: [], alreadySeenLessons: [] };
      }
      if (sData && typeof sData.streak !== 'number') {
        sData.streak = 0;
      }
      v = 2;
    }

    // Migration V2 to V3
    if (v === 2) {
      console.log("[Compass Migration] Applying v2 -> v3 (Adding personalization tracking)");
      if (pData && !pData.personalization) {
        pData.personalization = { weakSubjects: [], learningPace: "normal", lastUpdated: new Date().toISOString() };
      }
      if (pData && !pData.subjectConfidence) {
        pData.subjectConfidence = { maths: "Okay", biology: "Okay", chemistry: "Okay", physics: "Okay" };
      }
      v = 3;
    }

    // Save migrated data
    if (pData) localStorage.setItem("compass_profile", JSON.stringify(pData));
    if (sData) localStorage.setItem("compass_stats", JSON.stringify(sData));
    
    localStorage.setItem("compass_schema_version", CURRENT_SCHEMA_VERSION.toString());
    console.log("[Compass Migration] Safe migration completed successfully.");

  } catch (err) {
    console.error("[Compass Migration] CRITICAL MIGRATION ERROR:", err);
    // Could prompt rollback here, but for now we safely halt to avoid data corruption
  }
}
