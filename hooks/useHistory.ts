import AsyncStorage from "@react-native-async-storage/async-storage";
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

const STORAGE_KEY = "@bmi_history_v1";

export function useHistory() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Load history on mount
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        setHistory(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setLoading(false);
    }
  };

  const addRecord = async (record: Omit<HistoryRecord, "id" | "date">) => {
    try {
      const newRecord: HistoryRecord = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        ...record,
      };

      const updatedHistory = [newRecord, ...history];
      setHistory(updatedHistory);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    } catch (e) {
      console.error("Failed to save record", e);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (e) {
      console.error("Failed to clear history", e);
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
    const currentWeight = history[0].weight;
    const oldestWeight = history[history.length - 1].weight;
    const weightChange = currentWeight - oldestWeight;

    return {
      avgBmi: parseFloat(avgBmi.toFixed(1)),
      weightChange: parseFloat(weightChange.toFixed(1)),
    };
  };

  return {
    history,
    loading,
    addRecord,
    clearHistory,
    getRecentTrends,
  };
}
