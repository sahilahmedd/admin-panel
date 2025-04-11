/* eslint-disable @typescript-eslint/no-explicit-any */
const API_BASE_URL = "https://node2-plum.vercel.app/api/user";

// Generic GET request function
export async function fetchData(endpoint: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`);
    if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
    return await res.json();
  } catch (error) {
    console.error("API GET Error:", error);
    return null;
  }
}

// Generic POST request function
export async function postData(endpoint: string, payload: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Failed to POST to ${endpoint}`);
    return await res.json();
  } catch (error) {
    console.error("API POST Error:", error);
    return null;
  }
}

// Generic PUT request function (for updating records)
export async function updateData(endpoint: string, id: string, payload: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error(`Failed to update ${endpoint}/${id}`);
    return await res.json();
  } catch (error) {
    console.error("API PUT Error:", error);
    return null;
  }
}

// Generic DELETE request function
export async function deleteData(endpoint: string, id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error(`Failed to delete ${endpoint}/${id}`);
    return await res.json();
  } catch (error) {
    console.error("API DELETE Error:", error);
    return null;
  }
}

// Image upload API

// export const uploadImageToHostinger = async (file: File): Promise<string> => {
//   const formData = new FormData();
//   formData.append("image", file);

//   const response = await fetch("/api/uploadImage/", {
//     method: "POST",
//     body: formData,
//   });

//   // Check response status code
//   if (!response.ok) {
//     throw new Error(`Image upload failed with status ${response.status}`);
//   }

//   let result: any;

//   try {
//     result = await response.json();
//   } catch (err) {
//     throw new Error("Failed to parse response from image server. Not valid JSON.");
//   }

//   // Validate response format
//   if (result?.status === true && result?.file) {
//     return `https://rangrezsamaj.kunxite.com/${result.url}`;
//   } else {
//     throw new Error(result?.message || "Unknown error occurred during image upload.");
//   }
// };
