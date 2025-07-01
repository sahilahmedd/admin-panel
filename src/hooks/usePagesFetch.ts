import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";

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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        // Get auth session for token
        const session = await getSession();
        const token = session?.user?.token;

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Add auth token if available
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/v1/pages`, {
          headers,
          // Add cache control to prevent stale data
          cache: "no-store",
        });

        if (!response.ok) {
          // Handle specific error codes
          if (response.status === 500) {
            throw new Error("Server error. Please try again later.");
          } else if (response.status === 401) {
            throw new Error("Authentication required. Please log in again.");
          } else {
            const errorData = await response.json().catch(() => null);
            throw new Error(
              errorData?.message ||
                `Error ${response.status}: Failed to fetch pages`
            );
          }
        }

        const data = await response.json();
        setPages(data.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred");
        console.error("Error fetching pages:", err);

        // Implement retry logic (max 3 retries)
        if (retryCount < 3) {
          console.log(`Retrying fetch (${retryCount + 1}/3)...`);
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000); // Retry after 2 seconds
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPages();
  }, [retryCount]);

  return { pages, loading, error };
};
