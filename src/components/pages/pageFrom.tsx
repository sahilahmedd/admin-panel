"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast"

import { Page, ApiResponse, PageFormData } from "@/utils/types"; // Adjust path if needed

const API_BASE_URL =
  "https://node2-plum.vercel.app/api/admin";

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

function PageForm() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string | undefined;

  const [formData, setFormData] = useState<PageFormData>({
    title: "",
    link_url: "",
    active_yn: 1,
    created_by: 10,
    created_date: getCurrentDateFormatted(), // <-- Initialize with current date
    updated_by: null,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      const fetchPageData = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await fetch(`${API_BASE_URL}/v1/pages/${id}`);
          if (!response.ok) {
            throw new Error(
              `Failed to fetch page data: ${response.statusText}`
            );
          }
          const data: ApiResponse<Page> = await response.json();
          if (data.success) {
            // Format created_date from ISO string to YYYY-MM-DD for consistency
            const fetchedCreatedDate = data.data.created_date
              ? new Date(data.data.created_date).toISOString().split("T")[0]
              : getCurrentDateFormatted();

            setFormData({
              title: data.data.title || "",
              link_url: data.data.link_url || "",
              active_yn: data.data.active_yn === 1 ? 1 : 0,
              created_by: data.data.created_by,
              created_date: fetchedCreatedDate, // <-- Use fetched date
              updated_by: data.data.updated_by || null,
            });
          } else {
            setError(data.message || "Failed to fetch page for editing.");
          }
        } catch (err: any) {
          console.error("Error fetching page for edit:", err);
          setError(`Error loading page: ${err.message}`);
        } finally {
          setLoading(false);
        }
      };
      fetchPageData();
    } else {
      setIsEditing(false);
      // Reset form for new page creation, ensuring created_date is current
      setFormData({
        title: "",
        link_url: "",
        active_yn: 1,
        created_by: 1,
        created_date: getCurrentDateFormatted(), // <-- Reset to current date
        updated_by: null,
      });
    }
  }, [id]);

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
  //   }));
  // };

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      ? `${API_BASE_URL}/v1/pages/${id}`
      : `${API_BASE_URL}/v1/pages`;

    try {
      const payload: PageFormData = {
        title: formData.title,
        link_url: formData.link_url,
        active_yn: Number(formData.active_yn),
        created_by: Number(formData.created_by),
        created_date: formData.created_date, // <-- INCLUDE created_date in payload
        updated_by: formData.updated_by ? Number(formData.updated_by) : null,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse<Page> = await response.json();

      if (response.ok && data.success) {
        alert(`Page ${isEditing ? "updated" : "created"} successfully!`);
        // toast.success(`Page ${isEditing ? "updated" : "created"} successfully!`)
        router.push('/content/view-content');
      } else {
        throw new Error(
          data.message || `Failed to ${isEditing ? "update" : "create"} page.`
        );
      }
    } catch (err: any) {
      console.error(`Error ${isEditing ? "updating" : "creating"} page:`, err);
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing && !formData.title) {
    return (
      <div className="p-5 max-w-4xl mx-auto text-center text-gray-700">
        Loading page data...
      </div>
    );
  }

  return (
    <div className="p-5 max-w-2xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <Toaster position="top-center" />
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {isEditing ? "Edit Page" : "Create New Page"}
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
            maxLength={20}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>

        {/* Link URL */}
        <div>
          <label
            htmlFor="link_url"
            className="block text-sm font-medium text-gray-700"
          >
            Link URL
          </label>
          <input
            type="text"
            id="link_url"
            name="link_url"
            value={formData.link_url}
            onChange={handleChange}
            required
            maxLength={50}
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

        {/* Hidden field for created_date - not strictly necessary if logic above handles it,
            but can be useful for debugging or if you want to visually show it.
            Alternatively, if your API supports it, you could just let backend generate it.
            Since your Postman example *sends* it, we're sending it from here.
            The type 'date' makes it a date picker in the browser if you make it visible.
        */}
        {/*
        <div>
          <label htmlFor="created_date" className="block text-sm font-medium text-gray-700">Created Date</label>
          <input
            type="date"
            id="created_date"
            name="created_date"
            value={formData.created_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        */}

        {/* Submit Button */}
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
              ? "Update Page"
              : "Create Page"}
          </button>
        </div>

        {/* Back to List */}
        <div className="text-center mt-4">
          <Link
            href="/content/view-content"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Back to Page List
          </Link>
        </div>
      </form>
    </div>
  );
}

export default PageForm;
