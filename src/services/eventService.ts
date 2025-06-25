import { toast } from "react-hot-toast";

const ADMIN_API_URL = "https://node2-plum.vercel.app/api/admin";

export interface EventData {
  ENVT_ID?: number;
  ENVT_CATE_ID?: number;
  ENVT_CATE_CATE_ID?: number;
  lang_code?: string;
  ENVT_DESC: string;
  ENVT_EXCERPT?: string;
  ENVT_DETAIL?: string;
  ENVT_BANNER_IMAGE?: string;
  ENVT_GALLERY_IMAGES?: string;
  ENVT_CONTACT_NO?: string;
  ENVT_ADDRESS?: string;
  ENVT_CITY?: string;
  EVNT_FROM_DT?: string;
  EVNT_UPTO_DT?: string;
  EVET_ACTIVE_YN?: string;
  EVET_CREATED_BY?: number;
  EVET_CREATED_DT?: string;
  EVET_UPDATED_BY?: number | null;
  EVET_UPDATED_DT?: string | null;
  Category?: {
    CATE_ID: number;
    CATE_DESC: string;
  };
  SubCategory?: {
    CATE_ID: number;
    CATE_DESC: string;
  };
}

export interface EventTranslation {
  ENVT_TITLE?: string;
  ENVT_DESC: string;
  ENVT_LOCATION?: string;
  ENVT_ACTIVE_YN?: string;
  ENVT_CREATED_BY?: number;
  lang_code: string;
}

const eventService = {
  getAllEvents: async (): Promise<EventData[]> => {
    try {
      const res = await fetch(`${ADMIN_API_URL}/events`);
      if (!res.ok) throw new Error(`Failed to fetch events`);
      const data = await res.json();
      return data.events || [];
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },

  getEventById: async (id: string | number): Promise<EventData | null> => {
    try {
      const res = await fetch(`${ADMIN_API_URL}/events/${id}`);
      if (!res.ok) throw new Error(`Failed to fetch event ${id}`);
      const data = await res.json();
      return data.event || null;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      return null;
    }
  },

  createEvent: async (event: EventData): Promise<EventData | null> => {
    try {
      const res = await fetch(`${ADMIN_API_URL}/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error(`Failed to create event`);
      const data = await res.json();
      return data.event || null;
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  },

  updateEvent: async (
    id: string | number,
    event: EventData
  ): Promise<EventData | null> => {
    try {
      const res = await fetch(`${ADMIN_API_URL}/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });
      if (!res.ok) throw new Error(`Failed to update event ${id}`);
      const data = await res.json();
      return data.event || null;
    } catch (error) {
      console.error(`Error updating event ${id}:`, error);
      return null;
    }
  },

  deleteEvent: async (id: string | number): Promise<boolean> => {
    try {
      const res = await fetch(`${ADMIN_API_URL}/events/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete event ${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting event ${id}:`, error);
      return false;
    }
  },

  // Translation functions
  getTranslation: async (
    eventId: string | number,
    langCode: string
  ): Promise<EventTranslation | null> => {
    try {
      const res = await fetch(
        `${ADMIN_API_URL}/events/${eventId}/translations/`
      );
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error(
          `Failed to fetch translation for event ${eventId} in ${langCode}`
        );
      }
      const responseData = await res.json();
      if (responseData && responseData.data) {
        if (
          responseData.data.translations &&
          Array.isArray(responseData.data.translations)
        ) {
          const translation = responseData.data.translations.find(
            (item: any) => item.lang_code === langCode
          );
          if (translation) {
            return translation;
          }
        }
        if (
          responseData.data.main &&
          responseData.data.main.lang_code === langCode
        ) {
          return responseData.data.main;
        }
      }
      return null;
    } catch (error) {
      console.error(
        `Error fetching translation for event ${eventId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  createTranslation: async (
    eventId: string | number,
    translation: EventTranslation
  ): Promise<EventTranslation | null> => {
    try {
      const res = await fetch(
        `${ADMIN_API_URL}/events/${eventId}/translations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(translation),
        }
      );
      if (!res.ok)
        throw new Error(`Failed to create translation for event ${eventId}`);
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(`Error creating translation for event ${eventId}:`, error);
      return null;
    }
  },

  updateTranslation: async (
    eventId: string | number,
    langCode: string,
    translation: EventTranslation
  ): Promise<EventTranslation | null> => {
    try {
      const res = await fetch(
        `${ADMIN_API_URL}/events/${eventId}/translations/${langCode}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(translation),
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to update translation for event ${eventId} in ${langCode}`
        );
      const data = await res.json();
      return data.translation || null;
    } catch (error) {
      console.error(
        `Error updating translation for event ${eventId} in ${langCode}:`,
        error
      );
      return null;
    }
  },

  deleteTranslation: async (
    eventId: string | number,
    langCode: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(
        `${ADMIN_API_URL}/events/${eventId}/translations/${langCode}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok)
        throw new Error(
          `Failed to delete translation for event ${eventId} in ${langCode}`
        );
      return true;
    } catch (error) {
      console.error(
        `Error deleting translation for event ${eventId} in ${langCode}:`,
        error
      );
      return false;
    }
  },
};

export default eventService;
