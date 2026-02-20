import { initDatabase } from "@/services/database";
import { useEffect, useState } from "react";

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
        setIsInitialized(true);
      } catch (err) {
        console.error("Database initialization failed:", err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    init();
  }, []);

  return { isInitialized, error };
}
