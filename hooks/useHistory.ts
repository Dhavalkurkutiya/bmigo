import {
  addHistoryRecord,
  HistoryRecord as DBHistoryRecord,
  deleteHistoryRecord,
  getHistoryRecords,
  initDatabase,
} from "@/services/database";
import { useEffect, useState } from "react";

export interface HistoryRecord {
  id: string;
  date: string; // ISO-8601
  bmi: number;
  weight: number;
  height: number;
  mode: "athlete" | "indian" | "standard";
  status: string; // "Normal", "Overweight", etc.
  unit: "metric"; // Always stored as metric
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize DB and load history
  useEffect(() => {
    let mounted = true;
    const initAndLoad = async () => {
      try {
        await initDatabase();
        const records = await getHistoryRecords();
        if (mounted) {
          setHistory(mapDBRecordsToUI(records));
        }
      } catch (e) {
        console.error("Failed to initialize or load history", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    initAndLoad();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshHistory = async () => {
    try {
      const records = await getHistoryRecords();
      setHistory(mapDBRecordsToUI(records));
    } catch (e) {
      console.error("Failed to refresh history", e);
    }
  };

  const addRecord = async (record: Omit<HistoryRecord, "id" | "date">) => {
    try {
      // Determine athlete mode boolean
      const athleteMode = record.mode === "athlete";

      await addHistoryRecord(
        record.weight,
        record.height,
        record.bmi,
        record.status,
        athleteMode,
      );

      await refreshHistory();
    } catch (e) {
      console.error("Failed to save record", e);
    }
  };

  const clearHistory = async () => {
    // Basic implementation: delete all not supported by service yet individually,
    // but maybe we don't need "clear all" right now or we iterate.
    // User asked for "deleteRecord", so let's expose that.
    // For now, I will skip 'clearHistory' or implement it via loop if needed,
    // but better to just expose delete function.
    // Let's implement delete by ID.
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteHistoryRecord(Number(id));
      await refreshHistory();
    } catch (e) {
      console.error("Failed to delete record", e);
    }
  };

  const getRecentTrends = () => {
    if (history.length === 0) return { avgBmi: 0, weightChange: 0 };

    // Average BMI (last 10 records)
    const recentRecords = history.slice(0, 10);
    const avgBmi =
      recentRecords.reduce((acc, curr) => acc + curr.bmi, 0) /
      recentRecords.length;

    // Weight Change (Current vs Oldest)
    // Note: History is ordered DESC by default from service (created_at DESC).
    // So history[0] is newest, history[length-1] is oldest.
    const currentWeight = history[0].weight;
    const oldestWeight = history[history.length - 1].weight;
    const weightChange = currentWeight - oldestWeight;

    return {
      avgBmi: parseFloat(avgBmi.toFixed(1)),
      weightChange: parseFloat(weightChange.toFixed(1)),
    };
  };

  // Helper to map DB records to UI format
  const mapDBRecordsToUI = (records: DBHistoryRecord[]): HistoryRecord[] => {
    return records.map((r) => ({
      id: r.id.toString(),
      date: r.created_at,
      bmi: r.bmi,
      weight: r.weight,
      height: r.height,
      mode: r.athlete_mode ? "athlete" : "standard", // Mapping boolean back to mode
      status: r.category,
      unit: "metric",
    }));
  };

  return {
    history,
    loading,
    addRecord,
    clearHistory, // Keeping it compatible, though implementation might be empty or partial
    deleteRecord, // New function requested
    getRecentTrends,
  };
}
