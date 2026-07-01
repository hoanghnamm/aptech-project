import { useState } from "react";
import { nutritionService } from "../services/nutrition.service";

export default function useNutrition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [meta, setMeta] = useState(null);

  const reset = () => {
    setLoading(false);
    setError("");
    setResult(null);
    setMeta(null);
  };

  const submitNutrition = async (payload) => {
    setLoading(true);
    setError("");

    try {
      const response = await nutritionService.recommendNutrition(payload);
      const recommendation = response?.data?.recommendation || null;

      setResult(recommendation);
      setMeta({
        historyId: response?.data?.historyId || null,
        breed: response?.data?.breed || null,
      });

      return response;
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.[0]?.msg ||
        "Failed to generate nutrition recommendation";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    meta,
    submitNutrition,
    reset,
  };
}