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

  const populateDummyData = async () => {
    try {
      const dummyData: HistoryRecord[] = [];

      for (let i = 0; i < 500; i++) {
        const bmi = 16 + Math.random() * 20; // 16 to 36
        const status =
          bmi < 18.5
            ? "Underweight"
            : bmi < 25
              ? "Normal"
              : bmi < 30
                ? "Overweight"
                : "Obese";

        dummyData.push({
          id: Date.now().toString() + i,
          date: new Date(Date.now() - i * 86400000).toISOString(), // Subtract days
          bmi: parseFloat(bmi.toFixed(1)),
          weight: Math.floor(50 + Math.random() * 50),
          height: 175,
          mode: "standard",
          status: status,
          unit: "metric", // Always stored as metric
        });
      }

      setHistory(dummyData);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dummyData));
    } catch (e) {
      console.error("Failed to populate dummy data", e);
    }
  };

  // Load history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        if (jsonValue != null) {
          const parsed = JSON.parse(jsonValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHistory(parsed);
          } else {
            await populateDummyData();
          }
        } else {
          await populateDummyData();
        }
      } catch (e) {
        console.error("Failed to load history", e);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

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
    populateDummyData,
  };
}
