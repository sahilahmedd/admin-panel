"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

// Import your defined types
import {
  ContentSection, // For the main 'en' content
  ContentSectionLang, // For 'hi' and other translations
  ApiResponse,
  ContentSectionTranslationsManagerProps,
} from "@/utils/types"; // Adjust path if needed

const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

// Helper function to get current date in ISO string (YYYY-MM-DD) format
const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ContentSectionTranslationsManager: React.FC<
  ContentSectionTranslationsManagerProps
> = ({ parentSectionId }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for English content (from content_sections table)
  const [enContent, setEnContent] = useState<ContentSection | null>(null);
  // State for Hindi translation (from content_sections_lang table)
  const [hiContent, setHiContent] = useState<ContentSectionLang | null>(null);

  // --- Form Data States ---
  // Store form data for English
  const [enFormData, setEnFormData] = useState<Partial<ContentSection>>({
    title: "",
    description: "",
    image_path: null,
    icon_path: null,
    active_yn: 1,
    created_by: 1, // Assuming a default user
    page_id: 0, // Needs to be pulled from parent section
    refrence_page_id: null,
    lang_code: "en", // Explicitly 'en' for this form section
  });

  // Store form data for Hindi
  const [hiFormData, setHiFormData] = useState<Partial<ContentSectionLang>>({
    id: parentSectionId, // Foreign key to parent
    lang_code: "hi", // Explicitly 'hi' for this form section
    title: "",
    description: "",
    image_path: null,
    icon_path: null,
    active_yn: 1,
    created_by: 1, // Assuming a default user
    created_date: getCurrentDateFormatted(),
    page_id: 0, // Needs to be pulled from parent section
    refrence_page_id: null,
    id_id: null, // Keep if in schema, but consider its purpose
  });
  // --- End Form Data States ---

  // Fetch initial data for both English and Hindi
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Fetch English (main) content
        const enResponse = await fetch(
          `${API_BASE_URL}/v1/content-sections/${parentSectionId}`
        );
        const enData: ApiResponse<ContentSection> = await enResponse.json();

        if (!enResponse.ok || !enData.success) {
          throw new Error(enData.message || "Failed to fetch English content.");
        }
        setEnContent(enData.data);
        setEnFormData({
          title: enData.data.title,
          description: enData.data.description,
          image_path: enData.data.image_path,
          icon_path: enData.data.icon_path,
          active_yn: enData.data.active_yn,
          created_by: enData.data.created_by,
          created_date: enData.data.created_date,
          page_id: enData.data.page_id,
          refrence_page_id: enData.data.refrence_page_id,
          lang_code: enData.data.lang_code,
          id_id: enData.data.id_id, // If id_id is part of content_sections
        });

        // 2. Fetch Hindi translation
        // Use the specific GET endpoint for a single translation by composite key
        const hiResponse = await fetch(
          `${API_BASE_URL}/v1/content-sections-lang/${parentSectionId}/hi`
        );
        const hiData: ApiResponse<ContentSectionLang> = await hiResponse.json();

        if (hiResponse.ok && hiData.success && hiData.data) {
          setHiContent(hiData.data);
          setHiFormData({
            id: hiData.data.id,
            lang_code: hiData.data.lang_code,
            title: hiData.data.title,
            description: hiData.data.description,
            image_path: hiData.data.image_path,
            icon_path: hiData.data.icon_path,
            active_yn: hiData.data.active_yn,
            created_by: hiData.data.created_by,
            created_date: hiData.data.created_date
              ? new Date(hiData.data.created_date).toISOString().split("T")[0]
              : getCurrentDateFormatted(),
            updated_by: hiData.data.updated_by,
            updated_date: hiData.data.updated_date,
            page_id: hiData.data.page_id,
            refrence_page_id: hiData.data.refrence_page_id,
            id_id: hiData.data.id_id, // If id_id is part of content_sections_lang
          });
        } else if (hiResponse.status === 404) {
          // Hindi translation doesn't exist, prepare for creation
          setHiContent(null);
          setHiFormData((prev) => ({
            ...prev,
            id: parentSectionId, // Ensure parent ID is set for new creation
            lang_code: "hi",
            created_date: getCurrentDateFormatted(),
            title: `(hi) ${enData.data.title || ""}`, // Pre-fill with placeholder
            description: `(hi) ${enData.data.description || ""}`,
            active_yn: enData.data.active_yn, // Copy active status from main
            created_by: enData.data.created_by, // Copy created_by from main
            page_id: enData.data.page_id, // Copy page_id from main
            refrence_page_id: enData.data.refrence_page_id, // Copy refrence_page_id from main
            image_path: enData.data.image_path, // Copy image path from main
            icon_path: enData.data.icon_path, // Copy icon path from main
            id_id: enData.data.id_id, // Copy id_id from main
          }));
          toast("Hindi translation not found, preparing form to create it.", {
            icon: "ℹ️",
          });
        } else {
          throw new Error(
            hiData.message || "Failed to fetch Hindi translation."
          );
        }
      } catch (err: any) {
        console.error("Error fetching multi-language content:", err);
        setError(`Failed to load content: ${err.message}`);
        toast.error(`Failed to load content: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (parentSectionId) {
      fetchData();
    }
  }, [parentSectionId]);

  // Handle changes for English content form
  const handleEnChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;
    let parsedValue: string | number | null = value;

    if (type === "number") {
      parsedValue = value === "" ? null : Number(value);
    } else if (type === "checkbox") {
      parsedValue = checked ? 1 : 0;
    }

    setEnFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // Handle changes for Hindi content form
  const handleHiChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;
    let parsedValue: string | number | null = value;

    if (type === "number") {
      parsedValue = value === "" ? null : Number(value);
    } else if (type === "checkbox") {
      parsedValue = checked ? 1 : 0;
    }

    setHiFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSaveAll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const toasts: Promise<any>[] = [];

    try {
      // --- 1. Update English Content (content_sections table) ---
      const enPayload = {
        title: enFormData.title,
        description: enFormData.description,
        image_path: enFormData.image_path === "" ? null : enFormData.image_path,
        icon_path: enFormData.icon_path === "" ? null : enFormData.icon_path,
        active_yn: Number(enFormData.active_yn),
        created_by: Number(enFormData.created_by),
        page_id: Number(enFormData.page_id),
        refrence_page_id: enFormData.refrence_page_id
          ? Number(enFormData.refrence_page_id)
          : null,
        // No need to send id_id or lang_code for update, as they are fixed on main content
      };

      const enUpdatePromise = fetch(
        `${API_BASE_URL}/v1/content-sections/${parentSectionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(enPayload),
        }
      ).then((res) =>
        res.json().then((data) => {
          if (!res.ok || !data.success)
            throw new Error(
              data.message || "Failed to update English content."
            );
          toast.success("English content updated successfully!");
          return data.data;
        })
      );
      toasts.push(enUpdatePromise);

      // --- 2. Update/Create Hindi Content (content_sections_lang table) ---
      const hiMethod = hiContent ? "PUT" : "POST"; // If hiContent exists, it's an update; otherwise, create
      const hiUrl = hiContent
        ? `${API_BASE_URL}/v1/content-sections-lang/${parentSectionId}/hi`
        : `${API_BASE_URL}/v1/content-sections-lang`;

      const hiPayload = {
        id: parentSectionId, // Crucial for content_sections_lang table
        lang_code: "hi",
        title: hiFormData.title,
        description: hiFormData.description,
        image_path: hiFormData.image_path === "" ? null : hiFormData.image_path,
        icon_path: hiFormData.icon_path === "" ? null : hiFormData.icon_path,
        active_yn: Number(hiFormData.active_yn),
        created_by: Number(hiFormData.created_by),
        created_date: hiFormData.created_date || getCurrentDateFormatted(), // Ensure created_date for new entry
        updated_by: hiFormData.updated_by
          ? Number(hiFormData.updated_by)
          : null,
        page_id: Number(hiFormData.page_id),
        refrence_page_id: hiFormData.refrence_page_id
          ? Number(hiFormData.refrence_page_id)
          : null,
        id_id: hiFormData.id_id ? Number(hiFormData.id_id) : null, // If id_id is relevant here
      };

      const hiUpdatePromise = fetch(hiUrl, {
        method: hiMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hiPayload),
      }).then((res) =>
        res.json().then((data) => {
          if (!res.ok || !data.success)
            throw new Error(
              data.message ||
                `Failed to ${
                  hiMethod === "PUT" ? "update" : "create"
                } Hindi translation.`
            );
          toast.success(
            `Hindi translation ${
              hiMethod === "PUT" ? "updated" : "created"
            } successfully!`
          );
          // If a new Hindi translation was created, update the hiContent state for subsequent updates
          if (hiMethod === "POST") setHiContent(data.data);
          return data.data;
        })
      );
      toasts.push(hiUpdatePromise);

      // Wait for all promises to settle
      await Promise.all(toasts);
    } catch (err: any) {
      console.error("Error saving multi-language content:", err);
      setError(`Error: ${err.message}`);
      toast.error(`Error saving content: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHindi = async () => {
    if (!hiContent) {
      toast.success("No Hindi translation to delete.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete the Hindi translation for section ID: ${parentSectionId}?`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/content-sections-lang/${parentSectionId}/hi`,
        {
          method: "DELETE",
        }
      );
      const data: ApiResponse<any> = await response.json();
      if (response.ok && data.success) {
        toast.success("Hindi translation deleted successfully!");
        setHiContent(null); // Clear Hindi content state
        // Reset hiFormData to prepare for potential re-creation
        setHiFormData((prev) => ({
          ...prev,
          lang_code: "hi",
          title: `(hi) ${enContent?.title || ""}`, // Pre-fill with placeholder
          description: `(hi) ${enContent?.description || ""}`,
          image_path: enContent?.image_path,
          icon_path: enContent?.icon_path,
          active_yn: enContent?.active_yn || 1,
          created_by: enContent?.created_by || 1,
          created_date: getCurrentDateFormatted(),
          page_id: enContent?.page_id || 0,
          refrence_page_id: enContent?.refrence_page_id,
          id_id: enContent?.id_id,
        }));
      } else {
        throw new Error(data.message || "Failed to delete Hindi translation.");
      }
    } catch (err: any) {
      console.error("Error deleting Hindi translation:", err);
      setError(`Error deleting Hindi translation: ${err.message}`);
      toast.error(`Error deleting Hindi translation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center text-gray-600">
        Loading content and translations...
      </p>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  // Render the combined form once data is loaded
  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-8 bg-white shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-gray-700">
        Manage Content: Section ID {parentSectionId}
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Edit English (main) content and its Hindi translation on this screen.
        Use the 'Save All Changes' button to update both.
      </p>

      <form onSubmit={handleSaveAll} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* English Content Section */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
              <span className="inline-block w-6 h-6 mr-2">🇬🇧</span> English
              Content (Main)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This data is stored in the `content_sections` table.
            </p>

            {/* Common Fields for English */}
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="en_title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title (English)
                </label>
                <input
                  type="text"
                  id="en_title"
                  name="title"
                  value={enFormData.title || ""}
                  onChange={handleEnChange}
                  required
                  maxLength={50}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="en_description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description (English)
                </label>
                <textarea
                  id="en_description"
                  name="description"
                  value={enFormData.description || ""}
                  onChange={handleEnChange}
                  required
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="en_image_path"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image Path (English, Optional)
                </label>
                <input
                  type="text"
                  id="en_image_path"
                  name="image_path"
                  value={enFormData.image_path || ""}
                  onChange={handleEnChange}
                  maxLength={250}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="en_icon_path"
                  className="block text-sm font-medium text-gray-700"
                >
                  Icon Path (English, Optional)
                </label>
                <input
                  type="text"
                  id="en_icon_path"
                  name="icon_path"
                  value={enFormData.icon_path || ""}
                  onChange={handleEnChange}
                  maxLength={250}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {/* Shared fields from content_sections */}
              <div>
                <label
                  htmlFor="en_active_yn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Active (English)
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="en_active_yn"
                    name="active_yn"
                    checked={enFormData.active_yn === 1}
                    onChange={handleEnChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="en_active_yn"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Is Active
                  </label>
                </div>
              </div>
              <div>
                <label
                  htmlFor="en_page_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Page ID (English)
                </label>
                <input
                  type="number"
                  id="en_page_id"
                  name="page_id"
                  value={enFormData.page_id || 0}
                  onChange={handleEnChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="en_refrence_page_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reference Page ID (English, Optional)
                </label>
                <input
                  type="number"
                  id="en_refrence_page_id"
                  name="refrence_page_id"
                  value={enFormData.refrence_page_id || ""}
                  onChange={handleEnChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="en_created_by"
                  className="block text-sm font-medium text-gray-700"
                >
                  Created By (English)
                </label>
                <input
                  type="number"
                  id="en_created_by"
                  name="created_by"
                  value={enFormData.created_by || 0}
                  onChange={handleEnChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {/* Hidden fields for fixed values or values from parent section that aren't user-editable here */}
              <input
                type="hidden"
                name="lang_code"
                value={enFormData.lang_code || ""}
              />
              <input
                type="hidden"
                name="id_id"
                value={enFormData.id_id || ""}
              />{" "}
              {/* Keep if relevant */}
            </div>
          </div>

          {/* Hindi Content Section */}
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
              <span className="inline-block w-6 h-6 mr-2">🇮🇳</span> Hindi
              Content
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This data is stored in the `content_sections_lang` table.
            </p>

            <div className="space-y-4">
              {/* Parent ID (Read-only for translations) */}
              <div>
                <label
                  htmlFor="hi_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Parent Section ID
                </label>
                <input
                  type="number"
                  id="hi_id"
                  name="id"
                  value={hiFormData.id || parentSectionId}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                />
              </div>
              {/* Language Code (Read-only) */}
              <div>
                <label
                  htmlFor="hi_lang_code"
                  className="block text-sm font-medium text-gray-700"
                >
                  Language Code
                </label>
                <input
                  type="text"
                  id="hi_lang_code"
                  name="lang_code"
                  value={hiFormData.lang_code?.toUpperCase() || "HI"}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
                />
              </div>
              {/* Translatable Fields for Hindi */}
              <div>
                <label
                  htmlFor="hi_title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title (Hindi)
                </label>
                <input
                  type="text"
                  id="hi_title"
                  name="title"
                  value={hiFormData.title || ""}
                  onChange={handleHiChange}
                  required
                  maxLength={50}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="hi_description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description (Hindi)
                </label>
                <textarea
                  id="hi_description"
                  name="description"
                  value={hiFormData.description || ""}
                  onChange={handleHiChange}
                  required
                  rows={4}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="hi_image_path"
                  className="block text-sm font-medium text-gray-700"
                >
                  Image Path (Hindi, Optional)
                </label>
                <input
                  type="text"
                  id="hi_image_path"
                  name="image_path"
                  value={hiFormData.image_path || ""}
                  onChange={handleHiChange}
                  maxLength={250}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="hi_icon_path"
                  className="block text-sm font-medium text-gray-700"
                >
                  Icon Path (Hindi, Optional)
                </label>
                <input
                  type="text"
                  id="hi_icon_path"
                  name="icon_path"
                  value={hiFormData.icon_path || ""}
                  onChange={handleHiChange}
                  maxLength={250}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              {/* Shared fields from content_sections_lang (duplicated from main) */}
              <div>
                <label
                  htmlFor="hi_active_yn"
                  className="block text-sm font-medium text-gray-700"
                >
                  Active (Hindi)
                </label>
                <div className="flex items-center mt-1">
                  <input
                    type="checkbox"
                    id="hi_active_yn"
                    name="active_yn"
                    checked={hiFormData.active_yn === 1}
                    onChange={handleHiChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="hi_active_yn"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Is Active
                  </label>
                </div>
              </div>
              <div>
                <label
                  htmlFor="hi_page_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Page ID (Hindi)
                </label>
                <input
                  type="number"
                  id="hi_page_id"
                  name="page_id"
                  value={hiFormData.page_id || 0}
                  onChange={handleHiChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="hi_refrence_page_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reference Page ID (Hindi, Optional)
                </label>
                <input
                  type="number"
                  id="hi_refrence_page_id"
                  name="refrence_page_id"
                  value={hiFormData.refrence_page_id || ""}
                  onChange={handleHiChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="hi_created_by"
                  className="block text-sm font-medium text-gray-700"
                >
                  Created By (Hindi)
                </label>
                <input
                  type="number"
                  id="hi_created_by"
                  name="created_by"
                  value={hiFormData.created_by || 0}
                  onChange={handleHiChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <input
                type="hidden"
                name="created_date"
                value={hiFormData.created_date || ""}
              />
              <input
                type="hidden"
                name="id_id"
                value={hiFormData.id_id || ""}
              />{" "}
              {/* If id_id is relevant */}
            </div>

            {/* Delete Hindi Translation Button */}
            {hiContent && ( // Only show delete button if Hindi content actually exists
              <div className="mt-6 border-t pt-4 border-gray-200">
                <button
                  type="button"
                  onClick={handleDeleteHindi}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  Delete Hindi Translation
                </button>
                <p className="text-xs text-gray-500 mt-1">
                  Note: This only deletes the Hindi translation, not the main
                  English content.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Save All Changes Button */}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentSectionTranslationsManager;
