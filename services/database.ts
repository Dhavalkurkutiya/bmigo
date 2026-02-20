import * as SQLite from "expo-sqlite";

const DB_NAME = "bmigo.db";

export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DB_NAME);

    // Create history table
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        weight REAL NOT NULL,
        height REAL NOT NULL,
        bmi REAL NOT NULL,
        category TEXT NOT NULL,
        athlete_mode BOOLEAN NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `);

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};

export const getDB = async () => {
  return await SQLite.openDatabaseAsync(DB_NAME);
};

export interface HistoryRecord {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  category: string;
  athlete_mode: boolean;
  created_at: string;
}

export const addHistoryRecord = async (
  weight: number,
  height: number,
  bmi: number,
  category: string,
  athleteMode: boolean,
): Promise<number | null> => {
  try {
    const db = await getDB();
    const createdAt = new Date().toISOString();

    const result = await db.runAsync(
      "INSERT INTO history (weight, height, bmi, category, athlete_mode, created_at) VALUES (?, ?, ?, ?, ?, ?)",
      weight,
      height,
      bmi,
      category,
      athleteMode ? 1 : 0,
      createdAt,
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error adding history record:", error);
    return null;
  }
};

export const getHistoryRecords = async (): Promise<HistoryRecord[]> => {
  try {
    const db = await getDB();
    const result = await db.getAllAsync<HistoryRecord>(
      "SELECT * FROM history ORDER BY created_at DESC",
    );
    return result;
  } catch (error) {
    console.error("Error fetching history records:", error);
    return [];
  }
};

export const deleteHistoryRecord = async (id: number): Promise<boolean> => {
  try {
    const db = await getDB();
    await db.runAsync("DELETE FROM history WHERE id = ?", id);
    return true;
  } catch (error) {
    console.error("Error deleting history record:", error);
    return false;
  }
};
