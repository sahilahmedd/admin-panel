/* eslint-disable @typescript-eslint/no-explicit-any */

// Base URLs for different API endpoints
const USER_API_URL = "https://node2-plum.vercel.app/api/user";
const ADMIN_API_URL = "https://node2-plum.vercel.app/api/admin";

// Interfaces
export interface BusinessData {
  BUSS_ID?: number;
  BUSS_STREM: string;
  BUSS_TYPE: string;
  BUSS_CREATED_BY: number;
  BUSS_CREATED_AT?: string;
  BUSS_UPDATED_BY?: number | null;
  BUSS_UPDATED_AT?: string | null;
  translations?: {
    en?: BusinessTranslation;
    hi?: BusinessTranslation;
  };
}

export interface BusinessTranslation {
  BUSS_STREM: string;
  BUSS_TYPE: string;
  BUSS_ACTIVE_YN: string;
  BUSS_CREATED_BY: number;
  lang_code: string;
}

// Service functions
const businessService = {
  // Get all business
  getAllBusiness: async (): Promise<BusinessData[]> => {
    try {
      const res = await fetch(`${USER_API_URL}/business`);
      console.log("Business log: ", res);

      if (!res.ok) throw new Error(`Failed to fetch business`);
      const data = await res.json();
      console.log("Business API response data:", data);
      return data.businesses || [];
    } catch (error) {
      console.error("Error fetching business:", error);
      return [];
    }
  },

  // Get a single business by ID
  getBusinessById: async (
    id: string | number
  ): Promise<BusinessData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/business/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch business ${id}`);
      const data = await res.json();
      return data.business || null;
    } catch (error) {
      console.error(`Error fetching business ${id}:`, error);
      return null;
    }
  },

  // Create a new business
  createBusiness: async (
    business: BusinessData
  ): Promise<BusinessData | null> => {
    try {
      console.log("Creating business with data:", business);
      console.log(`API URL: ${USER_API_URL}/business`);

      const res = await fetch(`${USER_API_URL}/business`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(business),
      });

      console.log("Create business API response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Failed to create business:", errorText);
        throw new Error(
          `Failed to create business: ${res.status} ${errorText}`
        );
      }

      const data = await res.json();
      console.log("Create business API response data:", data);
      return data.business || null;
    } catch (error) {
      console.error("Error creating business:", error);
      return null;
    }
  },

  // Update business
  updateBusiness: async (
    id: string | number,
    business: BusinessData
  ): Promise<BusinessData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/business/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(business),
      });
      if (!res.ok) throw new Error(`Failed to update business ${id}`);
      const data = await res.json();
      return data.business || null;
    } catch (error) {
      console.error(`Error updating business ${id}:`, error);
      return null;
    }
  },

  // Delete business
  deleteBusiness: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${USER_API_URL}/business/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete business ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting business ${id}:`, error);
      return false;
    }
  },

  // Translation functions
  getTranslation: async (
    businessId: string | number,
    langCode: string
  ): Promise<BusinessTranslation | null> => {
    try {
      console.log(
        `Fetching translation for business ${businessId} in ${langCode}`
      );
      console.log(
        `API URL: ${USER_API_URL}/business/${businessId}/translations/`
      );

      const res = await fetch(
        `${USER_API_URL}/business/${businessId}/translations/`
      );

      console.log(`Translation API response status: ${res.status}`);

      if (!res.ok) {
        if (res.status === 404) {
          console.log(
            `No translation found for business ${businessId} in ${langCode}`
          );
          return null; // Translation doesn't exist, not an error
        }
        const errorText = await res.text();
        console.error(`Failed to fetch translation: ${errorText}`);
        throw new Error(
          `Failed to fetch translation for business ${businessId} in ${langCode}: ${res.status} ${errorText}`
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
              BUSS_STREM: translation.BUSS_STREM || "",
              BUSS_TYPE: translation.BUSS_TYPE || "",
              BUSS_ACTIVE_YN: translation.BUSS_ACTIVE_YN || "Y",
              BUSS_CREATED_BY: translation.BUSS_CREATED_BY || 1,
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
            BUSS_STREM: mainData.BUSS_STREM || "",
            BUSS_TYPE: mainData.BUSS_TYPE || "",
            BUSS_ACTIVE_YN: mainData.BUSS_ACTIVE_YN || "Y",
            BUSS_CREATED_BY: mainData.BUSS_CREATED_BY || 1,
            lang_code: mainData.lang_code || langCode,
          };
        }
      }

      console.log(`No ${langCode} translation found in response`);
      return null;
    } catch (error) {
      console.error(
        `Error fetching translation for business ${businessId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  createTranslation: async (
    businessId: string | number,
    translation: BusinessTranslation
  ): Promise<BusinessTranslation | null> => {
    try {
      console.log(
        `Creating translation for business ${businessId} with data:`,
        translation
      );
      console.log(
        `API URL: ${USER_API_URL}/business/${businessId}/translations`
      );

      const res = await fetch(
        `${USER_API_URL}/business/${businessId}/translations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translation),
        }
      );

      console.log(`Create translation API response status: ${res.status}`);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Failed to create translation: ${errorText}`);
        throw new Error(
          `Failed to create translation for business ${businessId}: ${res.status} ${errorText}`
        );
      }

      const data = await res.json();
      console.log(`Create translation API response data:`, data);
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error creating translation for business ${businessId}:`,
        error
      );
      return null;
    }
  },

  updateTranslation: async (
    businessId: string | number,
    langCode: string,
    translation: BusinessTranslation
  ): Promise<BusinessTranslation | null> => {
    try {
      console.log(
        `Updating translation for business ${businessId} in ${langCode} with data:`,
        translation
      );
      console.log(
        `API URL: ${USER_API_URL}/business/${businessId}/translations/${langCode}`
      );

      const res = await fetch(
        `${USER_API_URL}/business/${businessId}/translations/${langCode}`,
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
          `Failed to update translation for business ${businessId} in ${langCode}: ${res.status} ${errorText}`
        );
      }

      const data = await res.json();
      console.log(`Update translation API response data:`, data);
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error updating translation for business ${businessId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  deleteTranslation: async (
    businessId: string | number,
    langCode: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/business/${businessId}/translations/${langCode}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to delete translation for business ${businessId} in ${langCode}`
        );
      return true;
    } catch (error) {
      console.error(
        `Error deleting translation for business ${businessId} in ${langCode}:`,
        error
      );
      return false;
    }
  },
};

export default businessService;
