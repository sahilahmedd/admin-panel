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
  screen_type?: string;
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
  screen_type?: string;
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
  id_id: number | null;
  description: string;
  image_path: string | null;
  icon_path: string | null;
  active_yn: number;
  created_by: number;
  created_date: string;
  updated_by: number | null;
  updated_date: string | null;
  page_id: number;
  refrence_page_id: number | null;
  lang_code: string; // This is the lang_code of the main content (expected 'en')
  button_one: string | null;
  button_one_slug: string | null;
  button_two: string | null;
  button_two_slug: string | null;
  flex_01: string | null;
  // screen_type?: string; // REMOVE this line if present
  // Add the relation to translations
  translations?: ContentSectionLang[]; // Optional, if API hydrates it
}

// --- UPDATED ContentSectionFormData (no changes from previous for form itself) ---
export interface ContentSectionFormData {
  title: string;
  description: string;
  image_path: string;
  icon_path: string;
  active_yn: number;
  created_by: number;
  created_date: string;
  updated_by: number | null;
  page_id: number;
  refrence_page_id: number | null;
  lang_code: string; // Frontend will send this, expected 'en'
  button_one: string | null;
  button_one_slug: string | null;
  button_two: string | null;
  button_two_slug: string | null;
  flex_01: string | null;
}

// --- NEW/UPDATED Interface for a Content Section Language (Translation) record ---
// This strictly follows the new Prisma schema for `content_sections_lang`.
export interface ContentSectionLang {
  id: number; // This is the FK to content_sections.id (part of composite PK)
  lang_code: string; // Part of composite PK, e.g., 'hi', 'es', 'fr'
  title: string;
  description: string;
  image_path: string | null;
  icon_path: string | null;
  active_yn: number; // Duplicated from main content section
  created_by: number; // Duplicated from main content section
  created_date: string; // Duplicated from main content section
  updated_by: number | null; // Duplicated from main content section
  updated_date: string | null; // Duplicated from main content section
  page_id: number; // Duplicated from main content section
  refrence_page_id: number | null; // Duplicated from main content section
  id_id: number | null; // Still ambiguous - included if it's truly in your DB schema
  button_one: string | null;
  button_one_slug: string | null;
  button_two: string | null;
  button_two_slug: string | null;
  flex_01: string | null;
}

// --- NEW/UPDATED Interface for the form data when creating/editing a Content Section Language entry ---
// This will be used in ContentSectionTranslationsManager
export interface ContentSectionLangFormData {
  id: number; // This is the FK to content_sections.id (will be read-only from parentSectionId)
  lang_code: string; // Must be provided (dropdown for supported languages, not 'en')
  title: string;
  description: string;
  image_path: string | null; // Allow null
  icon_path: string | null; // Allow null
  active_yn: number;
  created_by: number;
  created_date: string; // Frontend will generate current date for new entries
  updated_by: number | null;
  page_id: number;
  refrence_page_id: number | null;
  id_id: number | null; // Included if present in DB schema
  button_one: string | null;
  button_one_slug: string | null;
  button_two: string | null;
  button_two_slug: string | null;
  flex_01: string | null;
}

// Props interface for the ContentSectionTranslationsManager component
export interface ContentSectionTranslationsManagerProps {
  parentSectionId: number; // The ID of the content_section this manager is for
}

export interface Page {
  id: number;
  page_name: string; // Or whatever field holds the display name of the page
  // Add any other relevant page fields you might use for display or logic
}
