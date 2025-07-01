"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { usePagesFetch } from "@/hooks/usePagesFetch";
import ImageUpload from "@/components/ImageUpload";
import ClientSideCustomEditor from "@/components/clientside-editor";

// Import your defined types
import { ContentSection, ContentSectionLang, ApiResponse } from "@/utils/types"; // Adjust path as needed

const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

// Helper function to get current date in ISO string (YYYY-MM-DD) format
const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to safely parse values to number or null
const safeParseNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const num = Number(value);
  return isNaN(num) ? null : num;
};

function ContentSectionForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined; // The ID of the content_section being edited
  const { pages, loading: pagesLoading, error: pagesError } = usePagesFetch();

  const [loading, setLoading] = useState<boolean>(true); // Overall loading for form data
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"en" | "hi">("en"); // Start with English tab
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);

  // --- Form Data States ---
  // State for English content (from content_sections table)
  const [enFormData, setEnFormData] = useState<Partial<ContentSection>>({
    title: "",
    description: "",
    image_path: null,
    icon_path: null,
    active_yn: 1,
    created_by: 1,
    updated_by: 1,
    page_id: 1,
    refrence_page_id: null,
    lang_code: "en",
    id_id: null,
    button_one: "",
    button_one_slug: "",
    button_two: "",
    button_two_slug: "",
    flex_01: "",
  });

  // State for Hindi translation (from content_sections_lang table)
  const [hiFormData, setHiFormData] = useState<Partial<ContentSectionLang>>({
    id: 0,
    lang_code: "hi",
    title: "",
    description: "",
    image_path: null,
    icon_path: null,
    active_yn: 1,
    created_by: 1,
    updated_by: 1,
    created_date: getCurrentDateFormatted(),
    page_id: 1,
    refrence_page_id: null,
    button_one: "",
    button_one_slug: "",
    button_two: "",
    button_two_slug: "",
    flex_01: "",
  });
  // --- End Form Data States ---

  // Track if Hindi content actually exists in DB to determine POST vs PUT
  const [hiContentExists, setHiContentExists] = useState<boolean>(false);

  // Fetch initial data for both English and Hindi when editing
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
          // 1. Fetch English (main) content
          const enResponse = await fetch(
            `${API_BASE_URL}/v1/content-sections/${id}`
          );
          const enData: ApiResponse<ContentSection> = await enResponse.json();

          if (!enResponse.ok || !enData.success) {
            throw new Error(
              enData.message || "Failed to fetch English content."
            );
          }
          // Set English form data based on fetched content
          setEnFormData({
            title: enData.data.title,
            description: enData.data.description,
            image_path: enData.data.image_path,
            icon_path: enData.data.icon_path,
            active_yn: enData.data.active_yn,
            created_by: enData.data.created_by,
            updated_by: enData.data.updated_by,
            page_id: enData.data.page_id,
            refrence_page_id: enData.data.refrence_page_id,
            lang_code: enData.data.lang_code,
            id_id: enData.data.id_id,
            button_one: enData.data.button_one || "",
            button_one_slug: enData.data.button_one_slug || "",
            button_two: enData.data.button_two || "",
            button_two_slug: enData.data.button_two_slug || "",
            flex_01: enData.data.flex_01 || "",
          });

          // 2. Fetch Hindi translation
          const hiResponse = await fetch(
            `${API_BASE_URL}/v1/content-sections-lang/${id}/hi`
          );
          const hiData: ApiResponse<ContentSectionLang> =
            await hiResponse.json();

          console.log("Hindi translation fetch response:", {
            status: hiResponse.status,
            ok: hiResponse.ok,
            success: hiData.success,
            hasData: !!hiData.data,
          });

          if (hiResponse.ok && hiData.success && hiData.data) {
            console.log("Setting hiContentExists to true");
            setHiContentExists(true); // Hindi translation found
            // Set Hindi form data based on fetched translation
            setHiFormData({
              id: hiData.data.id,
              lang_code: hiData.data.lang_code,
              title: hiData.data.title,
              description: hiData.data.description,
              image_path: hiData.data.image_path,
              icon_path: hiData.data.icon_path,
              active_yn: hiData.data.active_yn,
              created_by: hiData.data.created_by,
              updated_by: hiData.data.updated_by,
              created_date: hiData.data.created_date
                ? new Date(hiData.data.created_date).toISOString().split("T")[0]
                : getCurrentDateFormatted(),
              page_id: hiData.data.page_id,
              refrence_page_id: hiData.data.refrence_page_id,
              button_one: hiData.data.button_one || "",
              button_one_slug: hiData.data.button_one_slug || "",
              button_two: hiData.data.button_two || "",
              button_two_slug: hiData.data.button_two_slug || "",
              flex_01: hiData.data.flex_01 || "",
            });
          } else if (hiResponse.status === 404) {
            setHiContentExists(false); // Hindi translation doesn't exist, prepare for creation
            setHiFormData((prev) => ({
              ...prev,
              id: parseInt(id), // Set parent ID for new creation
              lang_code: "hi",
              title: "", // Empty title for new Hindi translation
              description: "", // Empty description for new Hindi translation
              image_path: enData.data.image_path,
              icon_path: enData.data.icon_path,
              active_yn: enData.data.active_yn,
              created_by: enData.data.created_by,
              updated_by: enData.data.updated_by,
              created_date: getCurrentDateFormatted(),
              page_id: enData.data.page_id,
              refrence_page_id: enData.data.refrence_page_id,
              button_one: enData.data.button_one || "",
              button_one_slug: enData.data.button_one_slug || "",
              button_two: enData.data.button_two || "",
              button_two_slug: enData.data.button_two_slug || "",
              flex_01: enData.data.flex_01 || "",
            }));
            toast("Hindi translation not found, preparing form to create it.", {
              icon: "ℹ️",
            });
          }
        } catch (err: any) {
          console.error("Error fetching multi-language content:", err);
          setError(`Failed to load content: ${err.message}`);
          toast.error(`Failed to load content: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      // This is a NEW content section creation
      setIsEditing(false);
      setLoading(false); // No data to fetch initially
      setEnFormData((prev) => ({
        ...prev,
        created_by: 1,
        updated_by: 1,
        page_id: 1,
        lang_code: "en",
      }));
      // Reset Hindi form data to empty state for new content
      setHiFormData((prev) => ({
        ...prev,
        title: "",
        description: "",
        image_path: null,
        icon_path: null,
        active_yn: 1,
        created_by: 1,
        updated_by: 1,
        page_id: 1,
        created_date: getCurrentDateFormatted(),
        refrence_page_id: null,
      }));
    }
  }, [id]);

  useEffect(() => {
    setEditorLoaded(true);
  }, []);

  // Handle changes for English content form
  const handleEnChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;
    let parsedValue: string | number | null = value;

    if (type === "file" && target.files && target.files[0]) {
      const file = target.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const res = await fetch("/api/uploadImage", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.status === "success") {
          const imageUrl = `https://rangrezsamaj.kunxite.com/${data.url}`;
          setEnFormData((prev) => ({
            ...prev,
            [name === "image_upload" ? "image_path" : "icon_path"]: imageUrl,
          }));
          toast.success("Image uploaded successfully!");
        } else {
          console.error("Image upload failed: ", data.message);
          toast.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
        toast.error("Error uploading image");
      }
      return;
    }

    if (type === "number") {
      parsedValue = safeParseNumber(value);
    } else if (type === "checkbox") {
      parsedValue = checked ? 1 : 0;
    }

    setEnFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    // Synchronize button slugs between English and Hindi
    if (name === "button_one_slug" || name === "button_two_slug") {
      setHiFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
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
      parsedValue = safeParseNumber(value); // Use safeParseNumber
    } else if (type === "checkbox") {
      parsedValue = checked ? 1 : 0;
    }

    setHiFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // Handles saving both English and Hindi content
  const handleSaveAll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let mainSectionId = isEditing ? parseInt(id as string) : 0; // Will get ID after POST for new

      // --- 1. Create/Update English Content (content_sections table) ---
      const enPayload = {
        title: enFormData.title,
        description: enFormData.description,
        image_path: enFormData.image_path === "" ? null : enFormData.image_path,
        icon_path: enFormData.icon_path === "" ? null : enFormData.icon_path,
        active_yn: Number(enFormData.active_yn),
        created_by: isEditing
          ? undefined
          : safeParseNumber(enFormData.created_by),
        updated_by: isEditing ? 1 : undefined,
        page_id: safeParseNumber(enFormData.page_id),
        refrence_page_id: safeParseNumber(enFormData.refrence_page_id),
        lang_code: "en",
        id_id: safeParseNumber(enFormData.id_id),
        button_one: enFormData.button_one || null,
        button_one_slug: enFormData.button_one_slug || null,
        button_two: enFormData.button_two || null,
        button_two_slug: enFormData.button_two_slug || null,
        flex_01: enFormData.flex_01 || null,
      };

      if (!isEditing) {
        // --- CREATE New Main Section ---
        const createEnResponse = await fetch(
          `${API_BASE_URL}/v1/content-sections`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enPayload),
          }
        );
        const createEnData: ApiResponse<ContentSection> =
          await createEnResponse.json();

        if (!createEnResponse.ok || !createEnData.success) {
          throw new Error(
            createEnData.message || "Failed to create English content."
          );
        }
        mainSectionId = createEnData.data.id; // Get the ID of the newly created section
        toast.success("English content created successfully!");
        // After creation, we MUST redirect to the edit page to manage translations
        router.push(`/content/add-new/${mainSectionId}`);
        return; // Exit as redirect will happen
      } else {
        // --- UPDATE Existing Main Section ---
        const updateEnResponse = await fetch(
          `${API_BASE_URL}/v1/content-sections/${mainSectionId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enPayload),
          }
        );
        const updateEnData: ApiResponse<ContentSection> =
          await updateEnResponse.json();

        if (!updateEnResponse.ok || !updateEnData.success) {
          throw new Error(
            updateEnData.message || "Failed to update English content."
          );
        }
        toast.success("English content updated successfully!");
      }

      // --- 2. Update/Create Hindi Content (content_sections_lang table) ---
      // This part only executes if we are editing
      const hiPayload = {
        id: mainSectionId,
        lang_code: "hi",
        title: hiFormData.title,
        description: hiFormData.description,
        image_path: enFormData.image_path === "" ? null : enFormData.image_path,
        icon_path: enFormData.icon_path === "" ? null : enFormData.icon_path,
        active_yn: Number(enFormData.active_yn),
        created_by: hiContentExists
          ? undefined
          : safeParseNumber(enFormData.created_by),
        updated_by: hiContentExists ? 1 : undefined,
        created_date: hiContentExists ? undefined : getCurrentDateFormatted(),
        page_id: safeParseNumber(enFormData.page_id),
        refrence_page_id: safeParseNumber(enFormData.refrence_page_id),
        button_one: hiFormData.button_one || null,
        button_one_slug: enFormData.button_one_slug || null,
        button_two: hiFormData.button_two || null,
        button_two_slug: enFormData.button_two_slug || null,
        flex_01: hiFormData.flex_01 || null,
      };

      const hiMethod = hiContentExists ? "PUT" : "POST";
      const hiUrl = hiContentExists
        ? `${API_BASE_URL}/v1/content-sections-lang/${mainSectionId}/hi`
        : `${API_BASE_URL}/v1/content-sections-lang`;

      const hiResponse = await fetch(hiUrl, {
        method: hiMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(hiPayload),
      });
      const hiData: ApiResponse<ContentSectionLang> = await hiResponse.json();

      if (!hiResponse.ok || !hiData.success) {
        throw new Error(
          hiData.message ||
            `Failed to ${
              hiMethod === "PUT" ? "update" : "create"
            } Hindi translation.`
        );
      }
      toast.success(
        `Hindi translation ${
          hiMethod === "PUT" ? "updated" : "created"
        } successfully!`
      );
      if (hiMethod === "POST") setHiContentExists(true);

      // --- Final Redirect After ALL Saves (only if editing an existing section) ---
      if (isEditing) {
        setTimeout(() => {
          router.push("/content/add-new/"); // Redirect to the list after all saves
        }, 2000); // 2-second delay
      }
    } catch (err: any) {
      console.error("Error saving multi-language content:", err);
      setError(`Error: ${err.message}`);
      toast.error(`Error saving content: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHindi = async () => {
    console.log("Delete Hindi triggered, hiContentExists:", hiContentExists);
    if (!hiContentExists) {
      toast.error("No Hindi translation to delete.");
      return;
    }
    if (
      !window.confirm(
        `Are you sure you want to delete the Hindi translation for section ID: ${id}?`
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const deleteUrl = `${API_BASE_URL}/v1/content-sections-lang/${id}/hi`;
      console.log("Attempting to delete Hindi translation at URL:", deleteUrl);
      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });
      const data: ApiResponse<any> = await response.json();
      console.log("Delete response:", { status: response.status, data });
      if (response.ok && data.success) {
        toast.success("Hindi translation deleted successfully!");
        setHiContentExists(false); // Mark Hindi as not existing
        // Reset hiFormData to prepare for potential re-creation
        setHiFormData((prev) => ({
          ...prev,
          id: parseInt(id as string), // Ensure parent ID is set for new creation
          lang_code: "hi",
          title: "", // Removed (hi) prefix
          description: "", // Removed (hi) prefix
          image_path: enFormData.image_path,
          icon_path: enFormData.icon_path,
          active_yn: enFormData.active_yn,
          created_by: enFormData.created_by,
          updated_by: enFormData.updated_by,
          created_date: getCurrentDateFormatted(),
          page_id: enFormData.page_id,
          refrence_page_id: enFormData.refrence_page_id,
          id_id: enFormData.id_id,
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

  if (loading && isEditing) {
    // Only show loading when editing and initial fetch is underway
    return (
      <p className="p-5 max-w-4xl mx-auto text-center text-gray-700">
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

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {isEditing
          ? `Edit Content Section: ID ${id}`
          : "Create New Content Section"}
      </h1>

      <p className="text-sm text-gray-600 mb-6">
        {isEditing
          ? 'Edit content in different languages. Click "Save All Changes" to update all changes.'
          : "Create the main English content section. A default Hindi translation will be auto-generated by the backend. You can then edit translations after creation."}
      </p>

      {isEditing && ( // Only show tabs when editing an existing section
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setCurrentTab("en")}
              className={`${
                currentTab === "en"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <span className="inline-block w-5 h-5 mr-2">🇬🇧</span> English
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab("hi")}
              className={`${
                currentTab === "hi"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <span className="inline-block w-5 h-5 mr-2">🇮🇳</span> Hindi
            </button>
          </nav>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* English Content Section - Always visible, or under 'en' tab */}
        {(currentTab === "en" || !isEditing) && ( // Show EN if 'en' tab active OR if creating new
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
              <span className="inline-block w-6 h-6 mr-2">🇬🇧</span> English
              Content
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              This data is stored in the `content_sections` table.
            </p>

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
                {editorLoaded && (
                  <div className="mt-1">
                    <ClientSideCustomEditor
                      data={enFormData.description || ""}
                      onChange={(html: string) =>
                        setEnFormData((prev) => ({
                          ...prev,
                          description: html,
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="en_image_path"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Image Upload (English, Optional)
                </label>
                <div className="space-y-2">
                  <ImageUpload
                    name="image_upload"
                    imageUrl={enFormData.image_path || ""}
                    onChange={handleEnChange}
                  />
                  {enFormData.image_path && (
                    <p className="text-sm text-gray-500">
                      Current image: {enFormData.image_path}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="en_icon_path"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Icon Upload (English, Optional)
                </label>
                <div className="space-y-2">
                  <ImageUpload
                    name="icon_upload"
                    imageUrl={enFormData.icon_path || ""}
                    onChange={handleEnChange}
                  />
                  {enFormData.icon_path && (
                    <p className="text-sm text-gray-500">
                      Current icon: {enFormData.icon_path}
                    </p>
                  )}
                </div>
              </div>

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
                  Page
                </label>
                <select
                  id="en_page_id"
                  name="page_id"
                  value={enFormData.page_id || ""}
                  onChange={handleEnChange}
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Select a page</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.title}
                    </option>
                  ))}
                </select>
                {pagesLoading && (
                  <p className="text-sm text-gray-500 mt-1">Loading pages...</p>
                )}
                {pagesError && (
                  <p className="text-sm text-red-500 mt-1">
                    Error loading pages: {pagesError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="en_refrence_page_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  Reference Page (Optional)
                </label>
                <select
                  id="en_refrence_page_id"
                  name="refrence_page_id"
                  value={enFormData.refrence_page_id || ""}
                  onChange={handleEnChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">None</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.title}
                    </option>
                  ))}
                </select>
                {pagesLoading && (
                  <p className="text-sm text-gray-500 mt-1">Loading pages...</p>
                )}
                {pagesError && (
                  <p className="text-sm text-red-500 mt-1">
                    Error loading pages: {pagesError}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="en_user_id"
                  className="block text-sm font-medium text-gray-700"
                >
                  {isEditing ? "Updated By" : "Created By"}
                </label>
                <input
                  type="number"
                  id="en_user_id"
                  name={isEditing ? "updated_by" : "created_by"}
                  value={isEditing ? "1" : enFormData.created_by || ""}
                  onChange={handleEnChange}
                  required
                  readOnly={isEditing}
                  className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
                    isEditing
                      ? "bg-gray-100 cursor-not-allowed"
                      : "focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  } sm:text-sm`}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="en_button_one"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Button One Text
                  </label>
                  <input
                    type="text"
                    id="en_button_one"
                    name="button_one"
                    value={enFormData.button_one || ""}
                    onChange={handleEnChange}
                    maxLength={50}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="en_button_one_slug"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Button One Link
                  </label>
                  <input
                    type="text"
                    id="en_button_one_slug"
                    name="button_one_slug"
                    value={enFormData.button_one_slug || ""}
                    onChange={handleEnChange}
                    maxLength={100}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="en_button_two"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Button Two Text
                  </label>
                  <input
                    type="text"
                    id="en_button_two"
                    name="button_two"
                    value={enFormData.button_two || ""}
                    onChange={handleEnChange}
                    maxLength={50}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label
                    htmlFor="en_button_two_slug"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Button Two Link
                  </label>
                  <input
                    type="text"
                    id="en_button_two_slug"
                    name="button_two_slug"
                    value={enFormData.button_two_slug || ""}
                    onChange={handleEnChange}
                    maxLength={100}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="en_flex_01"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Field (Flex 01)
                </label>
                <input
                  type="text"
                  id="en_flex_01"
                  name="flex_01"
                  value={enFormData.flex_01 || ""}
                  onChange={handleEnChange}
                  maxLength={250}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This is a flexible field that can be used for additional data
                  (max 250 characters).
                </p>
              </div>

              <input
                type="hidden"
                name="lang_code"
                value={enFormData.lang_code || ""}
              />
              <input
                type="hidden"
                name="id_id"
                value={enFormData.id_id || ""}
              />
            </div>
          </div>
        )}
        {/* Hindi Content Section - Only shown when editing and 'hi' tab active */}
        {isEditing && currentTab === "hi" && (
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
              <span className="inline-block w-6 h-6 mr-2">🇮🇳</span> Hindi
              Translation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide Hindi translations for the content. Button links are
              automatically synced with English version.
            </p>

            <div className="space-y-4">
              {/* Parent ID (Hidden) */}
              <input
                type="hidden"
                name="id"
                value={hiFormData.id || (id ? parseInt(id) : "")}
              />

              {/* Language Code (Hidden) */}
              <input
                type="hidden"
                name="lang_code"
                value={hiFormData.lang_code || "hi"}
              />

              {/* Title and description fields - normal */}
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
                {editorLoaded && (
                  <div className="mt-1">
                    <ClientSideCustomEditor
                      data={hiFormData.description || ""}
                      onChange={(html: string) =>
                        setHiFormData((prev) => ({
                          ...prev,
                          description: html,
                        }))
                      }
                    />
                  </div>
                )}
              </div>

              {/* Hindi Button Fields - Only button text fields */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-800 mb-3">
                  Button Translations
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="hi_button_one"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Button One Text (Hindi)
                    </label>
                    <input
                      type="text"
                      id="hi_button_one"
                      name="button_one"
                      value={hiFormData.button_one || ""}
                      onChange={handleHiChange}
                      maxLength={50}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="hi_button_two"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Button Two Text (Hindi)
                    </label>
                    <input
                      type="text"
                      id="hi_button_two"
                      name="button_two"
                      value={hiFormData.button_two || ""}
                      onChange={handleHiChange}
                      maxLength={50}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Hidden fields for button slugs - synced with English */}
                <input
                  type="hidden"
                  name="button_one_slug"
                  value={hiFormData.button_one_slug || ""}
                />
                <input
                  type="hidden"
                  name="button_two_slug"
                  value={hiFormData.button_two_slug || ""}
                />
              </div>

              <div>
                <label
                  htmlFor="hi_flex_01"
                  className="block text-sm font-medium text-gray-700"
                >
                  Additional Field (Flex 01) (Hindi)
                </label>
                <input
                  type="text"
                  id="hi_flex_01"
                  name="flex_01"
                  value={hiFormData.flex_01 || ""}
                  onChange={handleHiChange}
                  maxLength={250}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This is a flexible field that can be used for additional data
                  (max 250 characters).
                </p>
              </div>

              {/* Information about synced fields */}
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Automatically Synced Fields
                </h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Image Path: {enFormData.image_path || "None"}</li>
                  <li>• Icon Path: {enFormData.icon_path || "None"}</li>
                  <li>
                    • Button Links: {enFormData.button_one_slug || "None"} /{" "}
                    {enFormData.button_two_slug || "None"}
                  </li>
                  <li>
                    • Active Status: {enFormData.active_yn === 1 ? "Yes" : "No"}
                  </li>
                  <li>
                    • Page:{" "}
                    {pages.find((p) => p.id === enFormData.page_id)?.title ||
                      "Loading..."}
                  </li>
                  <li>
                    • Reference Page:{" "}
                    {pages.find((p) => p.id === enFormData.refrence_page_id)
                      ?.title || "None"}
                  </li>
                </ul>
              </div>

              {/* Delete Hindi Translation Button */}
              {hiContentExists && (
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
        )}
        {/* End Hindi Content Section conditional rendering */}
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

      {/* Back to List */}
      <div className="text-center mt-4">
        <Link
          href="/content/add-new/"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Back to Content Section List
        </Link>
      </div>
    </div>
  );
}

export default ContentSectionForm;
