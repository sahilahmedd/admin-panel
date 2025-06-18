import { useState, useEffect } from "react";

interface Page {
  id: number;
  title: string;
  // Add other page fields if needed
}

const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

export const usePagesFetch = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/v1/pages`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch pages");
        }

        setPages(data.data || []);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching pages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, []);

  return { pages, loading, error };
};
