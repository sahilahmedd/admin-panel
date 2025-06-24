/* eslint-disable @typescript-eslint/no-explicit-any */

// Base URLs for different API endpoints
const USER_API_URL = "https://node2-plum.vercel.app/api/user";

// Interfaces
export interface HobbyData {
  HOBBY_ID?: number;
  HOBBY_NAME: string;
  HOBBY_IMAGE_URL: string;
  HOBBY_CREATED_BY: number;
  HOBBY_CREATED_DT?: string;
  HOBBY_UPDATED_BY?: number | null;
  HOBBY_UPDATED_DT?: string | null;
  translations?: {
    en?: HobbyTranslation;
    hi?: HobbyTranslation;
  };
}

export interface HobbyTranslation {
  HOBBY_NAME: string;
  HOBBY_ACTIVE_YN: string;
  HOBBY_CREATED_BY: number;
  lang_code: string;
}

// Service functions
const hobbiesService = {
  // Get all hobbies
  getAllHobbies: async (): Promise<HobbyData[]> => {
    try {
      const res = await fetch(`${USER_API_URL}/hobbies`);
      console.log("Hobbies log: ", res);

      if (!res.ok) throw new Error(`Failed to fetch hobbies`);
      const data = await res.json();
      console.log("Hobbies API response data:", data);
      return data.hobbies || [];
    } catch (error) {
      console.error("Error fetching hobbies:", error);
      return [];
    }
  },

  // Get a single hobby by ID
  getHobbyById: async (id: string | number): Promise<HobbyData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/hobbies/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch hobby ${id}`);
      const data = await res.json();
      return data.hobby || null;
    } catch (error) {
      console.error(`Error fetching hobby ${id}:`, error);
      return null;
    }
  },

  // Create a new hobby
  createHobby: async (hobby: HobbyData): Promise<HobbyData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/hobbies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hobby),
      });
      if (!res.ok) throw new Error("Failed to create hobby");
      const data = await res.json();
      return data.hobby || null;
    } catch (error) {
      console.error("Error creating hobby:", error);
      return null;
    }
  },

  // Update hobby
  updateHobby: async (
    id: string | number,
    hobby: HobbyData
  ): Promise<HobbyData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/hobbies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hobby),
      });
      if (!res.ok) throw new Error(`Failed to update hobby ${id}`);
      const data = await res.json();
      return data.hobby || null;
    } catch (error) {
      console.error(`Error updating hobby ${id}:`, error);
      return null;
    }
  },

  // Delete hobby
  deleteHobby: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${USER_API_URL}/hobbies/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete hobby ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting hobby ${id}:`, error);
      return false;
    }
  },

  // Translation functions
  getTranslation: async (
    hobbyId: string | number,
    langCode: string
  ): Promise<HobbyTranslation | null> => {
    try {
      console.log(`Fetching translation for hobby ${hobbyId} in ${langCode}`);
      console.log(`API URL: ${USER_API_URL}/hobbies/${hobbyId}/translations/`);

      const res = await fetch(
        `${USER_API_URL}/hobbies/${hobbyId}/translations/`
      );

      console.log(`Translation API response status: ${res.status}`);

      if (!res.ok) {
        if (res.status === 404) {
          console.log(
            `No translation found for hobby ${hobbyId} in ${langCode}`
          );
          return null; // Translation doesn't exist, not an error
        }
        throw new Error(
          `Failed to fetch translation for hobby ${hobbyId} in ${langCode}`
        );
      }

      const data = await res.json();
      console.log(`Translation API response data:`, data);

      // The API returns an array of translations
      if (Array.isArray(data)) {
        // Find the translation for the requested language
        const translation = data.find(
          (item: any) => item.lang_code === langCode
        );
        if (translation) {
          return {
            HOBBY_NAME: translation.HOBBY_NAME || "",
            HOBBY_ACTIVE_YN: translation.HOBBY_ACTIVE_YN || "Y",
            HOBBY_CREATED_BY: translation.HOBBY_CREATED_BY || 1,
            lang_code: translation.lang_code || langCode,
          };
        }
      } else if (data && data.translations) {
        // If the data has a translations property that's an array
        if (Array.isArray(data.translations)) {
          const translation = data.translations.find(
            (item: any) => item.lang_code === langCode
          );
          if (translation) {
            return {
              HOBBY_NAME: translation.HOBBY_NAME || "",
              HOBBY_ACTIVE_YN: translation.HOBBY_ACTIVE_YN || "Y",
              HOBBY_CREATED_BY: translation.HOBBY_CREATED_BY || 1,
              lang_code: translation.lang_code || langCode,
            };
          }
        } else {
          // If translations is a single object
          return data.translations;
        }
      } else if (data) {
        // If the data itself contains the translation fields, return it
        return {
          HOBBY_NAME: data.HOBBY_NAME || "",
          HOBBY_ACTIVE_YN: data.HOBBY_ACTIVE_YN || "Y",
          HOBBY_CREATED_BY: data.HOBBY_CREATED_BY || 1,
          lang_code: data.lang_code || langCode,
        };
      }

      return null;
    } catch (error) {
      console.error(
        `Error fetching translation for hobby ${hobbyId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  createTranslation: async (
    hobbyId: string | number,
    translation: HobbyTranslation
  ): Promise<HobbyTranslation | null> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/hobbies/${hobbyId}/translations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translation),
        }
      );
      if (!res.ok)
        throw new Error(`Failed to create translation for hobby ${hobbyId}`);
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(`Error creating translation for hobby ${hobbyId}:`, error);
      return null;
    }
  },

  updateTranslation: async (
    hobbyId: string | number,
    langCode: string,
    translation: HobbyTranslation
  ): Promise<HobbyTranslation | null> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/hobbies/${hobbyId}/translations/${langCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translation),
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to update translation for hobby ${hobbyId} in ${langCode}`
        );
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error updating translation for hobby ${hobbyId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  deleteTranslation: async (
    hobbyId: string | number,
    langCode: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/hobbies/${hobbyId}/translations/${langCode}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to delete translation for hobby ${hobbyId} in ${langCode}`
        );
      return true;
    } catch (error) {
      console.error(
        `Error deleting translation for hobby ${hobbyId} in ${langCode}:`,
        error
      );
      return false;
    }
  },
};

export default hobbiesService;
