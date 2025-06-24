/* eslint-disable @typescript-eslint/no-explicit-any */

// Base URLs for different API endpoints
const USER_API_URL = "https://node2-plum.vercel.app/api/user";

// Interfaces
export interface CityData {
  CITY_ID?: number;
  CITY_PIN_CODE: string;
  CITY_CODE: number;
  CITY_NAME: string;
  CITY_DS_CODE: string;
  CITY_DS_NAME: string;
  CITY_ST_CODE: string;
  CITY_ST_NAME: string;
  CITY_CREATED_BY?: number;
  CITY_CREATED_AT?: string;
  CITY_UPDATED_BY?: number | null;
  CITY_UPDATED_AT?: string | null;
  translations?: {
    en?: CityTranslation;
    hi?: CityTranslation;
  };
}

export interface CityTranslation {
  CITY_NAME: string;
  CITY_DS_NAME: string;
  CITY_ST_NAME: string;
  CITY_ACTIVE_YN: string;
  CITY_CREATED_BY: number;
  lang_code: string;
}

// Service functions
const cityService = {
  // Get all cities
  getAllCities: async (): Promise<CityData[]> => {
    try {
      const res = await fetch(`${USER_API_URL}/cities`);
      console.log("Cities API response status:", res.status);

      if (!res.ok) throw new Error(`Failed to fetch cities`);
      const data = await res.json();
      console.log("Cities API response data:", data);
      return data.cities || [];
    } catch (error) {
      console.error("Error fetching cities:", error);
      return [];
    }
  },

  // Get a single city by ID
  getCityById: async (id: string | number): Promise<CityData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/cities/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch city ${id}`);
      const data = await res.json();
      return data.city || null;
    } catch (error) {
      console.error(`Error fetching city ${id}:`, error);
      return null;
    }
  },

  // Create a new city
  createCity: async (city: CityData): Promise<CityData | null> => {
    try {
      console.log("Creating city with data:", city);

      const res = await fetch(`${USER_API_URL}/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });

      console.log("Create city API response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to create city:", errorText);
        throw new Error(`Failed to create city: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Create city API response data:", data);
      return data.city || null;
    } catch (error) {
      console.error("Error creating city:", error);
      return null;
    }
  },

  // Update city
  updateCity: async (
    id: string | number,
    city: CityData
  ): Promise<CityData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/cities/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(city),
      });
      if (!res.ok) throw new Error(`Failed to update city ${id}`);
      const data = await res.json();
      return data.city || null;
    } catch (error) {
      console.error(`Error updating city ${id}:`, error);
      return null;
    }
  },

  // Delete city
  deleteCity: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${USER_API_URL}/cities/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete city ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting city ${id}:`, error);
      return false;
    }
  },

  // Translation functions
  getTranslation: async (
    cityId: string | number,
    langCode: string
  ): Promise<CityTranslation | null> => {
    try {
      console.log(`Fetching translation for city ${cityId} in ${langCode}`);

      const res = await fetch(`${USER_API_URL}/cities/${cityId}/translations/`);
      console.log(`Translation API response status: ${res.status}`);

      if (!res.ok) {
        if (res.status === 404) {
          console.log(`No translation found for city ${cityId} in ${langCode}`);
          return null; // Translation doesn't exist, not an error
        }
        const errorText = await res.text();
        console.error(`Failed to fetch translation: ${errorText}`);
        throw new Error(
          `Failed to fetch translation for city ${cityId} in ${langCode}: ${res.status} ${errorText}`
        );
      }

      const responseData = await res.json();
      console.log(`Translation API response data:`, responseData);

      // Check if the response has the expected structure
      if (responseData && responseData.data) {
        // Check if translations array exists and has items
        if (
          responseData.data.translations &&
          Array.isArray(responseData.data.translations)
        ) {
          // Find the translation for the requested language
          const translation = responseData.data.translations.find(
            (item: any) => item.lang_code === langCode
          );

          if (translation) {
            console.log(`Found ${langCode} translation:`, translation);
            return {
              CITY_NAME: translation.CITY_NAME || "",
              CITY_DS_NAME: translation.CITY_DS_NAME || "",
              CITY_ST_NAME: translation.CITY_ST_NAME || "",
              CITY_ACTIVE_YN: translation.CITY_ACTIVE_YN || "Y",
              CITY_CREATED_BY: translation.CITY_CREATED_BY || 1,
              lang_code: translation.lang_code || langCode,
            };
          }
        }

        // If we didn't find a translation in the array, check if main data matches the requested language
        if (
          responseData.data.main &&
          responseData.data.main.lang_code === langCode
        ) {
          const mainData = responseData.data.main;
          return {
            CITY_NAME: mainData.CITY_NAME || "",
            CITY_DS_NAME: mainData.CITY_DS_NAME || "",
            CITY_ST_NAME: mainData.CITY_ST_NAME || "",
            CITY_ACTIVE_YN: mainData.CITY_ACTIVE_YN || "Y",
            CITY_CREATED_BY: mainData.CITY_CREATED_BY || 1,
            lang_code: mainData.lang_code || langCode,
          };
        }
      }

      console.log(`No ${langCode} translation found in response`);
      return null;
    } catch (error) {
      console.error(
        `Error fetching translation for city ${cityId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  createTranslation: async (
    cityId: string | number,
    translation: CityTranslation
  ): Promise<CityTranslation | null> => {
    try {
      console.log(
        `Creating translation for city ${cityId} with data:`,
        translation
      );

      const res = await fetch(`${USER_API_URL}/cities/${cityId}/translations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(translation),
      });

      console.log(`Create translation API response status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Failed to create translation: ${errorText}`);
        throw new Error(
          `Failed to create translation for city ${cityId}: ${res.status} ${errorText}`
        );
      }

      const data = await res.json();
      console.log(`Create translation API response data:`, data);
      return data.translation || null;
    } catch (error) {
      console.error(`Error creating translation for city ${cityId}:`, error);
      return null;
    }
  },

  updateTranslation: async (
    cityId: string | number,
    langCode: string,
    translation: CityTranslation
  ): Promise<CityTranslation | null> => {
    try {
      console.log(
        `Updating translation for city ${cityId} in ${langCode} with data:`,
        translation
      );

      const res = await fetch(
        `${USER_API_URL}/cities/${cityId}/translation/${langCode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translation),
        }
      );

      console.log(`Update translation API response status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Failed to update translation: ${errorText}`);
        throw new Error(
          `Failed to update translation for city ${cityId} in ${langCode}: ${res.status} ${errorText}`
        );
      }

      const data = await res.json();
      console.log(`Update translation API response data:`, data);
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error updating translation for city ${cityId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  deleteTranslation: async (
    cityId: string | number,
    langCode: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/cities/${cityId}/translation/${langCode}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to delete translation for city ${cityId} in ${langCode}`
        );
      return true;
    } catch (error) {
      console.error(
        `Error deleting translation for city ${cityId} in ${langCode}:`,
        error
      );
      return false;
    }
  },
};

export default cityService;
