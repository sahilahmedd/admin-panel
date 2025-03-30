const API_BASE_URL = "https://node2-plum.vercel.app/api/user";

// Generic GET request function
export async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}
