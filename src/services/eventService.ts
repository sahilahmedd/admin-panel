import { toast } from "react-hot-toast";

const BASE_URL = "https://node2-plum.vercel.app/api/admin";

export interface EventTranslation {
  description: string;
  excerpt: string;
  detail: string;
  address: string;
  city: string;
}

export interface EventData {
  id: number;
  categoryId: number;
  subCategoryId?: number | null;
  translations: {
    en: EventTranslation;
    hi?: EventTranslation;
  };
  bannerImage: string;
  galleryImages: string;
  contactNo: string;
  fromDate: string;
  uptoDate: string;
  isActive: boolean;
  createdBy: number;
}

// Response type from the API
export interface EventResponse {
  success: boolean;
  message: string;
  events?: EventData[];
  event?: EventData;
}

// Type for creating a new event
export type CreateEventData = Omit<EventData, "id">;

// Type for updating an event
export type UpdateEventData = Partial<Omit<EventData, "id">>;

class EventService {
  // Get all events
  async getAllEvents(): Promise<EventData[]> {
    try {
      const response = await fetch(`${BASE_URL}/events`);
      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      // Group events by ENVT_ID and build translations
      const grouped: Record<string, any> = {};
      for (const item of data.events || []) {
        const id = item.ENVT_ID;
        if (!grouped[id]) {
          grouped[id] = {
            id,
            categoryId: item.ENVT_CATE_ID,
            subCategoryId: item.ENVT_CATE_CATE_ID,
            translations: {},
            bannerImage: item.ENVT_BANNER_IMAGE,
            galleryImages: item.ENVT_GALLERY_IMAGES,
            contactNo: item.ENVT_CONTACT_NO,
            fromDate: item.EVNT_FROM_DT,
            uptoDate: item.EVNT_UPTO_DT,
            isActive: item.EVET_ACTIVE_YN === "Y",
            createdBy: item.EVET_CREATED_BY,
          };
        }
        grouped[id].translations[item.lang_code] = {
          description: item.ENVT_DESC,
          excerpt: item.ENVT_EXCERPT,
          detail: item.ENVT_DETAIL,
          address: item.ENVT_ADDRESS,
          city: item.ENVT_CITY,
        };
        // Prefer English for top-level fields if available
        if (item.lang_code === "en") {
          grouped[id].bannerImage = item.ENVT_BANNER_IMAGE;
          grouped[id].galleryImages = item.ENVT_GALLERY_IMAGES;
          grouped[id].contactNo = item.ENVT_CONTACT_NO;
          grouped[id].fromDate = item.EVNT_FROM_DT;
          grouped[id].uptoDate = item.EVNT_UPTO_DT;
          grouped[id].isActive = item.EVET_ACTIVE_YN === "Y";
          grouped[id].createdBy = item.EVET_CREATED_BY;
        }
      }
      return Object.values(grouped);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
      return [];
    }
  }

  // Get single event by ID
  async getEventById(id: string): Promise<EventData | null> {
    try {
      const response = await fetch(`${BASE_URL}/events/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch event");
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      // If the backend returns an array of language versions for the event
      const items = Array.isArray(data.event) ? data.event : [data.event];
      if (!items[0]) return null;
      // Group by ENVT_ID and build translations (should be only one group)
      const grouped: Record<string, any> = {};
      for (const item of items) {
        const eid = item.ENVT_ID;
        if (!grouped[eid]) {
          grouped[eid] = {
            id: eid,
            categoryId: item.ENVT_CATE_ID,
            subCategoryId: item.ENVT_CATE_CATE_ID,
            translations: {},
            bannerImage: item.ENVT_BANNER_IMAGE,
            galleryImages: item.ENVT_GALLERY_IMAGES,
            contactNo: item.ENVT_CONTACT_NO,
            fromDate: item.EVNT_FROM_DT,
            uptoDate: item.EVNT_UPTO_DT,
            isActive: item.EVET_ACTIVE_YN === "Y",
            createdBy: item.EVET_CREATED_BY,
          };
        }
        grouped[eid].translations[item.lang_code] = {
          description: item.ENVT_DESC,
          excerpt: item.ENVT_EXCERPT,
          detail: item.ENVT_DETAIL,
          address: item.ENVT_ADDRESS,
          city: item.ENVT_CITY,
        };
        if (item.lang_code === "en") {
          grouped[eid].bannerImage = item.ENVT_BANNER_IMAGE;
          grouped[eid].galleryImages = item.ENVT_GALLERY_IMAGES;
          grouped[eid].contactNo = item.ENVT_CONTACT_NO;
          grouped[eid].fromDate = item.EVNT_FROM_DT;
          grouped[eid].uptoDate = item.EVNT_UPTO_DT;
          grouped[eid].isActive = item.EVET_ACTIVE_YN === "Y";
          grouped[eid].createdBy = item.EVET_CREATED_BY;
        }
      }
      return Object.values(grouped)[0];
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to fetch event");
      return null;
    }
  }

  // Utility to map frontend EventData to backend API payload
  mapEventDataToApiPayload(
    event: Partial<EventData>,
    lang: "en" | "hi" = "en"
  ) {
    return {
      ENVT_CATE_ID: event.categoryId,
      ENVT_CATE_CATE_ID: event.subCategoryId ?? null,
      ENVT_DESC: event.translations?.[lang]?.description ?? "",
      ENVT_EXCERPT: event.translations?.[lang]?.excerpt ?? "",
      ENVT_DETAIL: event.translations?.[lang]?.detail ?? "",
      ENVT_BANNER_IMAGE: event.bannerImage,
      ENVT_GALLERY_IMAGES: event.galleryImages,
      ENVT_CONTACT_NO: event.contactNo,
      ENVT_ADDRESS: event.translations?.[lang]?.address ?? "",
      ENVT_CITY: event.translations?.[lang]?.city ?? "",
      EVNT_FROM_DT: event.fromDate,
      EVNT_UPTO_DT: event.uptoDate,
      EVET_ACTIVE_YN: event.isActive ? "Y" : "N",
      EVET_CREATED_BY: event.createdBy,
      lang_code: lang,
    };
  }

  // Create new event
  async createEvent(
    eventData: Partial<EventData>,
    lang: "en" | "hi" = "en"
  ): Promise<any> {
    try {
      const payload = this.mapEventDataToApiPayload(eventData, lang);
      const response = await fetch(`${BASE_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to create event");
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success("Event created successfully");
      return data.event || null;
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
      return null;
    }
  }

  // Update event
  async updateEvent(
    id: string,
    eventData: Partial<EventData>,
    lang: "en" | "hi" = "en"
  ): Promise<EventData | null> {
    try {
      const payload = this.mapEventDataToApiPayload(eventData, lang);
      const response = await fetch(`${BASE_URL}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success("Event updated successfully");
      return data.event || null;
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
      return null;
    }
  }

  // Delete event
  async deleteEvent(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/events/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete event");
      }

      const data: EventResponse = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      toast.success("Event deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event");
      return false;
    }
  }
}

// Create a singleton instance
const eventService = new EventService();
export default eventService;
