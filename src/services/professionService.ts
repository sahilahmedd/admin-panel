/* eslint-disable @typescript-eslint/no-explicit-any */

// Base URLs for different API endpoints
const USER_API_URL = "https://node2-plum.vercel.app/api/user";
const ADMIN_API_URL = "https://node2-plum.vercel.app/api/admin";

// Interfaces
export interface ProfessionData {
  PROF_ID?: number;
  PROF_NAME: string;
  PROF_DESC: string;
  PROF_ACTIVE_YN: string;
  PROF_CREATED_BY: number;
  translations?: {
    en?: ProfessionTranslation;
    hi?: ProfessionTranslation;
  };
}

export interface ProfessionTranslation {
  PROF_NAME: string;
  PROF_DESC: string;
  PROF_ACTIVE_YN: string;
  PROF_CREATED_BY: number;
  lang_code: string;
}

// Service functions
const professionService = {
  // Get all professions
  getAllProfessions: async (): Promise<ProfessionData[]> => {
    try {
      const res = await fetch(`${USER_API_URL}/professions`);
      if (!res.ok) throw new Error(`Failed to fetch professions`);
      const data = await res.json();
      return data.professions || [];
    } catch (error) {
      console.error("Error fetching professions:", error);
      return [];
    }
  },

  // Get a single profession by ID
  getProfessionById: async (
    id: string | number
  ): Promise<ProfessionData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/professions/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch profession ${id}`);
      const data = await res.json();
      return data.profession || null;
    } catch (error) {
      console.error(`Error fetching profession ${id}:`, error);
      return null;
    }
  },

  // Create a new profession
  createProfession: async (
    profession: ProfessionData
  ): Promise<ProfessionData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/professions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profession),
      });
      if (!res.ok) throw new Error("Failed to create profession");
      const data = await res.json();
      return data.profession || null;
    } catch (error) {
      console.error("Error creating profession:", error);
      return null;
    }
  },

  // Update a profession
  updateProfession: async (
    id: string | number,
    profession: ProfessionData
  ): Promise<ProfessionData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/professions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profession),
      });
      if (!res.ok) throw new Error(`Failed to update profession ${id}`);
      const data = await res.json();
      return data.profession || null;
    } catch (error) {
      console.error(`Error updating profession ${id}:`, error);
      return null;
    }
  },

  // Delete a profession
  deleteProfession: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${USER_API_URL}/professions/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete profession ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting profession ${id}:`, error);
      return false;
    }
  },

  // Translation functions
  getTranslation: async (
    profId: string | number,
    langCode: string
  ): Promise<ProfessionTranslation | null> => {
    try {
      console.log(
        `Fetching translation for profession ${profId} in ${langCode}`
      );
      console.log(
        `API URL: ${USER_API_URL}/professions/${profId}/translations/`
      );

      const res = await fetch(
        `${USER_API_URL}/professions/${profId}/translations/`
      );

      console.log(`Translation API response status: ${res.status}`);

      if (!res.ok) {
        if (res.status === 404) {
          console.log(
            `No translation found for profession ${profId} in ${langCode}`
          );
          return null; // Translation doesn't exist, not an error
        }
        throw new Error(
          `Failed to fetch translation for profession ${profId} in ${langCode}`
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
            PROF_NAME: translation.PROF_NAME || "",
            PROF_DESC: translation.PROF_DESC || "",
            PROF_ACTIVE_YN: translation.PROF_ACTIVE_YN || "Y",
            PROF_CREATED_BY: translation.PROF_CREATED_BY || 1,
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
              PROF_NAME: translation.PROF_NAME || "",
              PROF_DESC: translation.PROF_DESC || "",
              PROF_ACTIVE_YN: translation.PROF_ACTIVE_YN || "Y",
              PROF_CREATED_BY: translation.PROF_CREATED_BY || 1,
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
          PROF_NAME: data.PROF_NAME || "",
          PROF_DESC: data.PROF_DESC || "",
          PROF_ACTIVE_YN: data.PROF_ACTIVE_YN || "Y",
          PROF_CREATED_BY: data.PROF_CREATED_BY || 1,
          lang_code: data.lang_code || langCode,
        };
      }

      return null;
    } catch (error) {
      console.error(
        `Error fetching translation for profession ${profId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  createTranslation: async (
    profId: string | number,
    translation: ProfessionTranslation
  ): Promise<ProfessionTranslation | null> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/professions/${profId}/translations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translation),
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to create translation for profession ${profId}`
        );
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error creating translation for profession ${profId}:`,
        error
      );
      return null;
    }
  },

  updateTranslation: async (
    profId: string | number,
    langCode: string,
    translation: ProfessionTranslation
  ): Promise<ProfessionTranslation | null> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/professions/${profId}/translations/${langCode}`,
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
          `Failed to update translation for profession ${profId} in ${langCode}`
        );
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error updating translation for profession ${profId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  deleteTranslation: async (
    profId: string | number,
    langCode: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/professions/${profId}/translations/${langCode}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to delete translation for profession ${profId} in ${langCode}`
        );
      return true;
    } catch (error) {
      console.error(
        `Error deleting translation for profession ${profId} in ${langCode}:`,
        error
      );
      return false;
    }
  },
};

export default professionService;
