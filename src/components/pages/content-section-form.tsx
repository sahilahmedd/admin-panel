// // File: app/content/add-new/new/page.tsx
// // File: app/content/add-new/edit/[id]/page.tsx

// "use client"; // This directive is necessary for Client Components

// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-hot-toast"; // Assuming react-hot-toast is installed

// // Import your defined types
// import {
//   ContentSection,
//   ApiResponse,
//   ContentSectionFormData,
// } from "@/utils/types"; // Adjust path if needed

// const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

// // Helper function to get current date in YYYY-MM-DD format for date inputs
// const getCurrentDateFormatted = (): string => {
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
//   const day = today.getDate().toString().padStart(2, "0");
//   return `${year}-${month}-${day}`;
// };

// function ContentSectionForm() {
//   const router = useRouter();
//   const params = useParams();
//   const id = params.id as string | undefined; // 'id' can be a string or undefined for new pages

//   // Initialize state with ContentSectionFormData interface
//   const [formData, setFormData] = useState<ContentSectionFormData>({
//     title: "",
//     description: "",
//     image_path: "",
//     icon_path: "",
//     // from_date: getCurrentDateFormatted(), // Default to current date
//     // upto_date: getCurrentDateFormatted(), // Default to current date
//     active_yn: 1, // Default to active (1 for Yes)
//     created_by: 1, // Example default creator ID
//     created_date: getCurrentDateFormatted(), // Will be sent to API
//     updated_by: null,
//     page_id: 1, // Default page_id, assuming you have one or will select from a list
//     refrence_page_id: null,
//     lang_code: "en", // Default language code
//   });
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isEditing, setIsEditing] = useState<boolean>(false);

//   useEffect(() => {
//     if (id) {
//       setIsEditing(true);
//       const fetchSectionData = async () => {
//         try {
//           setLoading(true);
//           setError(null);
//           const response = await fetch(
//             `${API_BASE_URL}/v1/content-sections/${id}`
//           );
//           if (!response.ok) {
//             throw new Error(
//               `Failed to fetch content section data: ${response.statusText}`
//             );
//           }
//           const data: ApiResponse<ContentSection> = await response.json(); // Type the response data
//           if (data.success) {
//             const section = data.data;
//             setFormData({
//               title: section.title || "",
//               description: section.description || "",
//               image_path: section.image_path || "",
//               icon_path: section.icon_path || "",
//               // Format dates from ISO string to YYYY-MM-DD for date input values
//               //   from_date: section.from_date ? new Date(section.from_date).toISOString().split('T')[0] : getCurrentDateFormatted(),
//               //   upto_date: section.upto_date ? new Date(section.upto_date).toISOString().split('T')[0] : getCurrentDateFormatted(),
//               active_yn: section.active_yn === 1 ? 1 : 0,
//               created_by: section.created_by,
//               created_date: section.created_date
//                 ? new Date(section.created_date).toISOString().split("T")[0]
//                 : getCurrentDateFormatted(),
//               updated_by: section.updated_by || null,
//               page_id: section.page_id,
//               refrence_page_id: section.refrence_page_id || null,
//               lang_code: section.lang_code || "en",
//             });
//           } else {
//             setError(
//               data.message || "Failed to fetch content section for editing."
//             );
//             toast.error(data.message || "Failed to fetch section for editing.");
//           }
//         } catch (err: any) {
//           console.error("Error fetching content section for edit:", err);
//           setError(`Error loading content section: ${err.message}`);
//           toast.error(`Error loading section: ${err.message}`);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchSectionData();
//     } else {
//       setIsEditing(false);
//       // Reset form for new page creation if no ID is present
//       setFormData({
//         title: "",
//         description: "",
//         image_path: "",
//         icon_path: "",
//         // from_date: getCurrentDateFormatted(),
//         // upto_date: getCurrentDateFormatted(),
//         active_yn: 1,
//         created_by: 1,
//         created_date: getCurrentDateFormatted(),
//         updated_by: null,
//         page_id: 1, // Reset to default
//         refrence_page_id: null,
//         lang_code: "en", // Reset to default
//       });
//     }
//   }, [id]);

//   // Type the event for input/textarea changes
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const target = e.target as HTMLInputElement;
//     const { name, value, type } = target;
//     const checked = type === "checkbox" ? target.checked : undefined;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
//     }));
//   };

//   // Type the event for form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     const method = isEditing ? "PUT" : "POST";
//     const url = isEditing
//       ? `${API_BASE_URL}/v1/content-sections/${id}`
//       : `${API_BASE_URL}/v1/content-sections`;

//     try {
//       const payload: ContentSectionFormData = {
//         ...formData,
//         active_yn: Number(formData.active_yn),
//         created_by: Number(formData.created_by),
//         page_id: Number(formData.page_id), // Ensure page_id is a number
//         refrence_page_id: formData.refrence_page_id
//           ? Number(formData.refrence_page_id)
//           : null,
//         updated_by: formData.updated_by ? Number(formData.updated_by) : null,
//         // Dates are already strings from form inputs, should be 'YYYY-MM-DD'
//       };

//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const data: ApiResponse<ContentSection> = await response.json();

//       if (response.ok && data.success) {
//         toast.success(
//           `Content section ${isEditing ? "updated" : "created"} successfully!`
//         );
//         setTimeout(() => {
//           router.push("/content/add-new"); // Redirect to the list
//         }, 2000); // 2-second delay
//       } else {
//         throw new Error(
//           data.message ||
//             `Failed to ${isEditing ? "update" : "create"} content section.`
//         );
//       }
//     } catch (err: any) {
//       console.error(
//         `Error ${isEditing ? "updating" : "creating"} content section:`,
//         err
//       );
//       setError(`Error: ${err.message}`);
//       toast.error(`Error: ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && isEditing && !formData.title) {
//     return (
//       <div className="p-5 max-w-4xl mx-auto text-center text-gray-700">
//         Loading content section data...
//       </div>
//     );
//   }

//   return (
//     <div className="p-5 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-10">
//       <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
//         {isEditing ? "Edit Content Section" : "Create New Content Section"}
//       </h1>

//       {error && (
//         <div
//           className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
//           role="alert"
//         >
//           <strong className="font-bold">Error!</strong>
//           <span className="block sm:inline"> {error}</span>
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Title */}
//         <div>
//           <label
//             htmlFor="title"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Title
//           </label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             required
//             maxLength={50}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>

//         {/* Description */}
//         <div>
//           <label
//             htmlFor="description"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             required
//             rows={4}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           ></textarea>
//         </div>

//         {/* Image Path (Optional) */}
//         <div>
//           <label
//             htmlFor="image_path"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Image Path (URL)
//           </label>
//           <input
//             type="text"
//             id="image_path"
//             name="image_path"
//             value={formData.image_path || ""} // Handle null for initial render
//             onChange={handleChange}
//             maxLength={250}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>

//         {/* Icon Path (Optional) */}
//         <div>
//           <label
//             htmlFor="icon_path"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Icon Path (URL)
//           </label>
//           <input
//             type="text"
//             id="icon_path"
//             name="icon_path"
//             value={formData.icon_path || ""} // Handle null for initial render
//             onChange={handleChange}
//             maxLength={250}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>

//         {/* From Date */}
//         {/* <div>
//           <label htmlFor="from_date" className="block text-sm font-medium text-gray-700">From Date</label>
//           <input
//             type="date"
//             id="from_date"
//             name="from_date"
//             value={formData.from_date}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div> */}

//         {/* Upto Date */}
//         {/* <div>
//           <label htmlFor="upto_date" className="block text-sm font-medium text-gray-700">Upto Date</label>
//           <input
//             type="date"
//             id="upto_date"
//             name="upto_date"
//             value={formData.upto_date}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div> */}

//         {/* Page ID (Required) */}
//         <div>
//           <label
//             htmlFor="page_id"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Page ID
//           </label>
//           <input
//             type="number"
//             id="page_id"
//             name="page_id"
//             value={formData.page_id}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>

//         {/* Reference Page ID (Optional) */}
//         <div>
//           <label
//             htmlFor="refrence_page_id"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Reference Page ID (Optional)
//           </label>
//           <input
//             type="number"
//             id="refrence_page_id"
//             name="refrence_page_id"
//             value={formData.refrence_page_id || ""} // Handle null for initial render
//             onChange={handleChange}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>

//         {/* Language Code */}
//         <div>
//           <label
//             htmlFor="lang_code"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Language Code
//           </label>
//           <input
//             type="text"
//             id="lang_code"
//             name="lang_code"
//             value={formData.lang_code}
//             onChange={handleChange}
//             required
//             maxLength={2}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>

//         {/* Active Y/N */}
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             id="active_yn"
//             name="active_yn"
//             checked={formData.active_yn === 1}
//             onChange={handleChange}
//             className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//           />
//           <label
//             htmlFor="active_yn"
//             className="ml-2 block text-sm text-gray-900"
//           >
//             Active
//           </label>
//         </div>

//         {/* Created By */}
//         <div>
//           <label
//             htmlFor="created_by"
//             className="block text-sm font-medium text-gray-700"
//           >
//             Created By (User ID)
//           </label>
//           <input
//             type="number"
//             id="created_by"
//             name="created_by"
//             value={formData.created_by}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
//           />
//         </div>

//         {/* Hidden field for created_date */}
//         <input
//           type="hidden"
//           name="created_date"
//           value={formData.created_date}
//         />

//         {/* Submit Button */}
//         <div>
//           <button
//             type="submit"
//             className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             disabled={loading}
//           >
//             {loading
//               ? isEditing
//                 ? "Updating..."
//                 : "Creating..."
//               : isEditing
//               ? "Update Section"
//               : "Create Section"}
//           </button>
//         </div>

//         {/* Back to List */}
//         <div className="text-center mt-4">
//           <Link
//             href="/content/add-new"
//             className="text-blue-600 hover:text-blue-800 text-sm"
//           >
//             Back to Content Section List
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// }

// export default ContentSectionForm;

// File: app/admin/content-sections/new/page.tsx
// File: app/admin/content-sections/edit/[id]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Import your defined types
import {
  ContentSection,
  ApiResponse,
  ContentSectionFormData,
} from "@/utils/types"; // Adjust path if needed

// Import the new Translation Manager Component
import ContentSectionTranslationsManager from "@/components/pages/ContentSectionTranslationsManager"; // Adjust path as needed

const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

// Helper function to get current date in YYYY-MM-DD format (still needed for created_date)
const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function ContentSectionForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;

  const [formData, setFormData] = useState<ContentSectionFormData>({
    title: "",
    description: "",
    image_path: "",
    icon_path: "",
    active_yn: 1,
    created_by: 1,
    created_date: getCurrentDateFormatted(),
    updated_by: null,
    page_id: 1,
    refrence_page_id: null,
    lang_code: "en",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<"main" | "translations">("main"); // New state for tabs

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchSectionData = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch(
            `${API_BASE_URL}/v1/content-sections/${id}`
          );
          if (!response.ok) {
            throw new Error(
              `Failed to fetch content section data: ${response.statusText}`
            );
          }
          const data: ApiResponse<ContentSection> = await response.json();
          if (data.success) {
            const section = data.data;
            setFormData({
              title: section.title || "",
              description: section.description || "",
              image_path: section.image_path || "",
              icon_path: section.icon_path || "",
              active_yn: section.active_yn === 1 ? 1 : 0,
              created_by: section.created_by,
              created_date: section.created_date
                ? new Date(section.created_date).toISOString().split("T")[0]
                : getCurrentDateFormatted(),
              updated_by: section.updated_by || null,
              page_id: section.page_id,
              refrence_page_id: section.refrence_page_id || null,
              lang_code: section.lang_code || "en",
            });
          } else {
            setError(
              data.message || "Failed to fetch content section for editing."
            );
            toast.error(data.message || "Failed to fetch section for editing.");
          }
        } catch (err: any) {
          console.error("Error fetching content section for edit:", err);
          setError(`Error loading content section: ${err.message}`);
          toast.error(`Error loading section: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchSectionData();
    } else {
      setIsEditing(false);
      setFormData({
        title: "",
        description: "",
        image_path: "",
        icon_path: "",
        active_yn: 1,
        created_by: 1,
        created_date: getCurrentDateFormatted(),
        updated_by: null,
        page_id: 1,
        refrence_page_id: null,
        lang_code: "en",
      });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `${API_BASE_URL}/v1/content-sections/${id}`
      : `${API_BASE_URL}/v1/content-sections`;

    try {
      const payload: ContentSectionFormData = {
        ...formData,
        active_yn: Number(formData.active_yn),
        created_by: Number(formData.created_by),
        page_id: Number(formData.page_id),
        refrence_page_id: formData.refrence_page_id
          ? Number(formData.refrence_page_id)
          : null,
        updated_by: formData.updated_by ? Number(formData.updated_by) : null,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse<ContentSection> = await response.json();

      if (response.ok && data.success) {
        toast.success(
          `Content section ${isEditing ? "updated" : "created"} successfully!`
        );
        setTimeout(() => {
          router.push("/content/add-new");
        }, 2000);
      } else {
        throw new Error(
          data.message ||
            `Failed to ${isEditing ? "update" : "create"} content section.`
        );
      }
    } catch (err: any) {
      console.error(
        `Error ${isEditing ? "updating" : "creating"} content section:`,
        err
      );
      setError(`Error: ${err.message}`);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !formData.title) {
    return (
      <div className="p-5 max-w-4xl mx-auto text-center text-gray-700">
        Loading content section data...
      </div>
    );
  }

  return (
    <div className="p-5 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {isEditing ? "Edit Content Section" : "Create New Content Section"}
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {isEditing && ( // Only show tabs when editing an existing section
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setCurrentTab("main")}
              className={`${
                currentTab === "main"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Main Content
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab("translations")}
              className={`${
                currentTab === "translations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Translations
            </button>
          </nav>
        </div>
      )}

      {currentTab === "main" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              maxLength={50}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Image Path (Optional) */}
          <div>
            <label
              htmlFor="image_path"
              className="block text-sm font-medium text-gray-700"
            >
              Image Path (URL)
            </label>
            <input
              type="text"
              id="image_path"
              name="image_path"
              value={formData.image_path || ""}
              onChange={handleChange}
              maxLength={250}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Icon Path (Optional) */}
          <div>
            <label
              htmlFor="icon_path"
              className="block text-sm font-medium text-gray-700"
            >
              Icon Path (URL)
            </label>
            <input
              type="text"
              id="icon_path"
              name="icon_path"
              value={formData.icon_path || ""}
              onChange={handleChange}
              maxLength={250}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Page ID (Required) */}
          <div>
            <label
              htmlFor="page_id"
              className="block text-sm font-medium text-gray-700"
            >
              Page ID
            </label>
            <input
              type="number"
              id="page_id"
              name="page_id"
              value={formData.page_id}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Reference Page ID (Optional) */}
          <div>
            <label
              htmlFor="refrence_page_id"
              className="block text-sm font-medium text-gray-700"
            >
              Reference Page ID (Optional)
            </label>
            <input
              type="number"
              id="refrence_page_id"
              name="refrence_page_id"
              value={formData.refrence_page_id || ""}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Language Code */}
          <div>
            <label
              htmlFor="lang_code"
              className="block text-sm font-medium text-gray-700"
            >
              Language Code
            </label>
            <input
              type="text"
              id="lang_code"
              name="lang_code"
              value={formData.lang_code}
              onChange={handleChange}
              required
              maxLength={2}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Active Y/N */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="active_yn"
              name="active_yn"
              checked={formData.active_yn === 1}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="active_yn"
              className="ml-2 block text-sm text-gray-900"
            >
              Active
            </label>
          </div>

          {/* Created By */}
          <div>
            <label
              htmlFor="created_by"
              className="block text-sm font-medium text-gray-700"
            >
              Created By (User ID)
            </label>
            <input
              type="number"
              id="created_by"
              name="created_by"
              value={formData.created_by}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Hidden field for created_date */}
          <input
            type="hidden"
            name="created_date"
            value={formData.created_date}
          />

          {/* Submit Button for Main Content */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Section"
                : "Create Section"}
            </button>
          </div>
        </form>
      )}

      {currentTab === "translations" && isEditing && id && (
        // Render Translation Manager only if editing and a section ID is available
        <ContentSectionTranslationsManager parentSectionId={parseInt(id)} />
      )}

      {/* Back to List (always visible) */}
      <div className="text-center mt-4">
        <Link
          href="/content/add-new"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Back to Content Section List
        </Link>
      </div>
    </div>
  );
}

export default ContentSectionForm;
