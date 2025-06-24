/* eslint-disable @typescript-eslint/no-explicit-any */

// Base URLs for different API endpoints
const USER_API_URL = "https://node2-plum.vercel.app/api/user";

// Interfaces
export interface EducationData {
  EDUCATION_ID?: number;
  EDUCATION_NAME: string;
  EDUCATION_IMAGE_URL: string;
  EDUCATION_CREATED_BY: number;
  EDUCATION_CREATED_DT?: string;
  EDUCATION_UPDATED_BY?: number | null;
  EDUCATION_UPDATED_DT?: string | null;
  translations?: {
    en?: EducationTranslation;
    hi?: EducationTranslation;
  };
}

export interface EducationTranslation {
  EDUCATION_NAME: string;
  EDUCATION_ACTIVE_YN: string;
  EDUCATION_CREATED_BY: number;
  lang_code: string;
}

// Service functions
const educationService = {
  // Get all education
  getAllEducation: async (): Promise<EducationData[]> => {
    try {
      const res = await fetch(`${USER_API_URL}/education`);
      console.log("Education log: ", res);

      if (!res.ok) throw new Error(`Failed to fetch education`);
      const data = await res.json();
      console.log("Education API response data:", data);
      return data.educations || [];
    } catch (error) {
      console.error("Error fetching education:", error);
      return [];
    }
  },

  // Get a single education by ID
  getEducationById: async (
    id: string | number
  ): Promise<EducationData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/education/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch education ${id}`);
      const data = await res.json();
      return data.education || null;
    } catch (error) {
      console.error(`Error fetching education ${id}:`, error);
      return null;
    }
  },

  // Create a new education
  createEducation: async (
    education: EducationData
  ): Promise<EducationData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/education`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(education),
      });
      if (!res.ok) throw new Error("Failed to create education");
      const data = await res.json();
      return data.education || null;
    } catch (error) {
      console.error("Error creating education:", error);
      return null;
    }
  },

  // Update education
  updateEducation: async (
    id: string | number,
    education: EducationData
  ): Promise<EducationData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/education/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(education),
      });
      if (!res.ok) throw new Error(`Failed to update education ${id}`);
      const data = await res.json();
      return data.education || null;
    } catch (error) {
      console.error(`Error updating education ${id}:`, error);
      return null;
    }
  },

  // Delete education
  deleteEducation: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${USER_API_URL}/education/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete education ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting education ${id}:`, error);
      return false;
    }
  },

  // Translation functions
  getTranslation: async (
    educationId: string | number,
    langCode: string
  ): Promise<EducationTranslation | null> => {
    try {
      console.log(
        `Fetching translation for education ${educationId} in ${langCode}`
      );
      console.log(
        `API URL: ${USER_API_URL}/education/${educationId}/translations/`
      );

      const res = await fetch(
        `${USER_API_URL}/education/${educationId}/translations/`
      );

      console.log(`Translation API response status: ${res.status}`);

      if (!res.ok) {
        if (res.status === 404) {
          console.log(
            `No translation found for education ${educationId} in ${langCode}`
          );
          return null; // Translation doesn't exist, not an error
        }
        throw new Error(
          `Failed to fetch translation for education ${educationId} in ${langCode}`
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
            EDUCATION_NAME: translation.EDUCATION_NAME || "",
            EDUCATION_ACTIVE_YN: translation.EDUCATION_ACTIVE_YN || "Y",
            EDUCATION_CREATED_BY: translation.EDUCATION_CREATED_BY || 1,
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
              EDUCATION_NAME: translation.EDUCATION_NAME || "",
              EDUCATION_ACTIVE_YN: translation.EDUCATION_ACTIVE_YN || "Y",
              EDUCATION_CREATED_BY: translation.EDUCATION_CREATED_BY || 1,
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
          EDUCATION_NAME: data.EDUCATION_NAME || "",
          EDUCATION_ACTIVE_YN: data.EDUCATION_ACTIVE_YN || "Y",
          EDUCATION_CREATED_BY: data.EDUCATION_CREATED_BY || 1,
          lang_code: data.lang_code || langCode,
        };
      }

      return null;
    } catch (error) {
      console.error(
        `Error fetching translation for education ${educationId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  createTranslation: async (
    educationId: string | number,
    translation: EducationTranslation
  ): Promise<EducationTranslation | null> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/education/${educationId}/translations`,
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
          `Failed to create translation for education ${educationId}`
        );
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error creating translation for education ${educationId}:`,
        error
      );
      return null;
    }
  },

  updateTranslation: async (
    educationId: string | number,
    langCode: string,
    translation: EducationTranslation
  ): Promise<EducationTranslation | null> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/education/${educationId}/translations/${langCode}`,
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
          `Failed to update translation for education ${educationId} in ${langCode}`
        );
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error updating translation for education ${educationId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  deleteTranslation: async (
    educationId: string | number,
    langCode: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/education/${educationId}/translations/${langCode}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to delete translation for education ${educationId} in ${langCode}`
        );
      return true;
    } catch (error) {
      console.error(
        `Error deleting translation for education ${educationId} in ${langCode}:`,
        error
      );
      return false;
    }
  },
};

export default educationService;
