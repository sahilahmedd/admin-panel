/* eslint-disable @typescript-eslint/no-explicit-any */

// Base URLs for different API endpoints
const USER_API_URL = "https://node2-plum.vercel.app/api/user";

// Interfaces
export interface StreamData {
  STREAM_ID?: number;
  STREAM_NAME: string;
  STREAM_CREATED_BY: number;
  STREAM_CREATED_DT?: string;
  STREAM_UPDATED_BY?: number | null;
  STREAM_UPDATED_DT?: string | null;
  translations?: {
    en?: StreamTranslation;
    hi?: StreamTranslation;
  };
}

export interface StreamTranslation {
  STREAM_NAME: string;
  STREAM_ACTIVE_YN: string;
  STREAM_CREATED_BY: number;
  lang_code: string;
}

// Service functions
const streamsService = {
  // Get all streams
  getAllStreams: async (): Promise<StreamData[]> => {
    try {
      const res = await fetch(`${USER_API_URL}/streams`);
      console.log("Streams log: ", res);

      if (!res.ok) throw new Error(`Failed to fetch streams`);
      const data = await res.json();
      console.log("Streams API response data:", data);
      return data.streams || [];
    } catch (error) {
      console.error("Error fetching streams:", error);
      return [];
    }
  },

  // Get a single stream by ID
  getStreamById: async (id: string | number): Promise<StreamData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/streams/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch stream ${id}`);
      const data = await res.json();
      return data.stream || null;
    } catch (error) {
      console.error(`Error fetching stream ${id}:`, error);
      return null;
    }
  },

  // Create a new stream
  createStream: async (stream: StreamData): Promise<StreamData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/streams`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stream),
      });
      if (!res.ok) throw new Error("Failed to create stream");
      const data = await res.json();
      return data.stream || null;
    } catch (error) {
      console.error("Error creating stream:", error);
      return null;
    }
  },

  // Update stream
  updateStream: async (
    id: string | number,
    stream: StreamData
  ): Promise<StreamData | null> => {
    try {
      const res = await fetch(`${USER_API_URL}/streams/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stream),
      });
      if (!res.ok) throw new Error(`Failed to update stream ${id}`);
      const data = await res.json();
      return data.stream || null;
    } catch (error) {
      console.error(`Error updating stream ${id}:`, error);
      return null;
    }
  },

  // Delete stream
  deleteStream: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${USER_API_URL}/streams/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete stream ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting stream ${id}:`, error);
      return false;
    }
  },

  // Translation functions
  getTranslation: async (
    streamId: string | number,
    langCode: string
  ): Promise<StreamTranslation | null> => {
    try {
      console.log(`Fetching translation for stream ${streamId} in ${langCode}`);
      console.log(`API URL: ${USER_API_URL}/streams/${streamId}/translations/`);

      const res = await fetch(
        `${USER_API_URL}/streams/${streamId}/translations/`
      );

      console.log(`Translation API response status: ${res.status}`);

      if (!res.ok) {
        if (res.status === 404) {
          console.log(
            `No translation found for stream ${streamId} in ${langCode}`
          );
          return null; // Translation doesn't exist, not an error
        }
        throw new Error(
          `Failed to fetch translation for stream ${streamId} in ${langCode}`
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
            STREAM_NAME: translation.STREAM_NAME || "",
            STREAM_ACTIVE_YN: translation.STREAM_ACTIVE_YN || "Y",
            STREAM_CREATED_BY: translation.STREAM_CREATED_BY || 1,
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
              STREAM_NAME: translation.STREAM_NAME || "",
              STREAM_ACTIVE_YN: translation.STREAM_ACTIVE_YN || "Y",
              STREAM_CREATED_BY: translation.STREAM_CREATED_BY || 1,
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
          STREAM_NAME: data.STREAM_NAME || "",
          STREAM_ACTIVE_YN: data.STREAM_ACTIVE_YN || "Y",
          STREAM_CREATED_BY: data.STREAM_CREATED_BY || 1,
          lang_code: data.lang_code || langCode,
        };
      }

      return null;
    } catch (error) {
      console.error(
        `Error fetching translation for stream ${streamId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  createTranslation: async (
    streamId: string | number,
    translation: StreamTranslation
  ): Promise<StreamTranslation | null> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/streams/${streamId}/translations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(translation),
        }
      );
      if (!res.ok)
        throw new Error(`Failed to create translation for stream ${streamId}`);
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error creating translation for stream ${streamId}:`,
        error
      );
      return null;
    }
  },

  updateTranslation: async (
    streamId: string | number,
    langCode: string,
    translation: StreamTranslation
  ): Promise<StreamTranslation | null> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/streams/${streamId}/translations/${langCode}`,
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
          `Failed to update translation for stream ${streamId} in ${langCode}`
        );
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error updating translation for stream ${streamId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  deleteTranslation: async (
    streamId: string | number,
    langCode: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${USER_API_URL}/streams/${streamId}/translations/${langCode}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to delete translation for stream ${streamId} in ${langCode}`
        );
      return true;
    } catch (error) {
      console.error(
        `Error deleting translation for stream ${streamId} in ${langCode}:`,
        error
      );
      return false;
    }
  },
};

export default streamsService;
