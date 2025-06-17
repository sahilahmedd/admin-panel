// File: types/index.d.ts or types.ts (e.g., in a 'src/types' folder)

// Define the structure of a Page object coming from your API
export interface Page {
  id: number;
  title: string;
  link_url: string;
  meta_title: string | null;
  meta_description: string | null;
  active_yn: number; // Use 1 for active, 0 for inactive
  created_by: number;
  created_date: string; // Assuming ISO string format from database
  updated_by: number | null;
  updated_date: string | null; // Assuming ISO string format
}

// Define the structure of your API response (common for success/error)
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T; // T will be Page[] or Page depending on the endpoint
}

// Define the shape of the form data for Page creation/editing
export interface PageFormData {
  title: string;
  link_url: string;
  active_yn: number;
  created_by: number;
  created_date: string; // <-- ADD THIS FIELD (as a string for date 'YYYY-MM-DD')
  updated_by: number | null;
}

export interface ContentSectionType {
  id: number;
  type_name: string;
  description: string;
  active_yn: number;
  created_by: number;
  created_date: string;
  updated_by: number | null;
  updated_date: string | null;
}

// --- UPDATED Interface for a Content Section ---
export interface ContentSection {
  id: number;
  title: string;
  id_id: number | null; // Ambiguous, but included as per schema, nullable
  description: string;
  image_path: string | null;
  icon_path: string | null;
//   from_date: string; // Will handle as 'YYYY-MM-DD' string
//   upto_date: string; // Will handle as 'YYYY-MM-DD' string
  active_yn: number;
  created_by: number;
  created_date: string;
  updated_by: number | null;
  updated_date: string | null;
  page_id: number; // Required foreign key to pages
  refrence_page_id: number | null;
  lang_code: string;
}

// --- UPDATED Interface for the form data when creating/editing a Content Section ---
export interface ContentSectionFormData {
  title: string;
  // id_id is not included in form data as its purpose is unclear and it's nullable
  description: string;
  image_path: string; // Frontend will treat as string, can be empty
  icon_path: string; // Frontend will treat as string, can be empty
//   from_date: string; // 'YYYY-MM-DD'
//   upto_date: string; // 'YYYY-MM-DD'
  active_yn: number;
  created_by: number;
  created_date: string; // As per API pattern, frontend will generate
  updated_by: number | null;
  page_id: number;
  refrence_page_id: number | null;
  lang_code: string;
}

// --- Content Section Item Types (if needed later) ---
export interface ContentSectionItemType {
  id: number;
  type_name: string;
  description: string;
  active_yn: number;
  created_by: number;
  created_date: string;
  updated_by: number | null;
  updated_date: string | null;
}

export interface ContentSectionLang {
  id: number; // Primary key for the translation, manually provided/unique from frontend
  title: string;
  id_id: number | null; // Ambiguous: FK to content_sections.id?
  description: string;
  image_path: string | null;
  icon_path: string | null;
  active_yn: number;
  created_by: number;
  created_date: string; // ISO string format
  updated_by: number | null;
  updated_date: string | null; // ISO string format
  page_id: number;
  refrence_page_id: number | null;
  lang_code: string;
}

// Interface for the form data when creating/editing a Content Section Language entry
// This will be used in ContentSectionTranslationsManager
export interface ContentSectionLangFormData {
  id: number; // Must be provided for new entries (manual ID assignment)
  title: string;
  id_id: number | null;
  description: string;
  image_path: string | null; // Changed to allow null
  icon_path: string | null; // Changed to allow null
  active_yn: number;
  created_by: number;
  created_date: string; // Frontend will generate current date for new entries
  updated_by: number | null;
  page_id: number;
  refrence_page_id: number | null;
  lang_code: string;
}

// Props interface for the ContentSectionTranslationsManager component
export interface ContentSectionTranslationsManagerProps {
  parentSectionId: number; // The ID of the content_section this manager is for
}
