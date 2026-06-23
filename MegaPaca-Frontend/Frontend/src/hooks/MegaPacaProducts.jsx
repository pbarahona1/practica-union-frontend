import { useCallback, useEffect, useState } from "react";

const API_URL = "http://localhost:4000/api";

export function useDataMegaPaca() {
  const [MegaPaca, setMegaPaca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMegaPaca = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "No se pudieron cargar la ropa");
      }

      const data = await response.json();
      setMegaPaca(Array.isArray(data) ? data : []);
    } catch (fetchError) {
      setError(
        fetchError instanceof Error ? fetchError.message : "Error inesperado",
      );
      setMegaPaca([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMegaPaca();
  }, [fetchMegaPaca]);

  return {
    MegaPaca,
    loading,
    error,
    refetch: fetchMegaPaca,
  };
}

export default useDataMegaPaca;
