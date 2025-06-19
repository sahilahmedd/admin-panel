"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ApiResponse, PageFormData } from "@/utils/types";

const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

// Helper function to get current date in YYYY-MM-DD format
const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type PageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pageId: number, pageTitle: string) => void;
};

const PageModal: React.FC<PageModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PageFormData>({
    title: "",
    link_url: "",
    active_yn: 1,
    created_by: 1,
    created_date: getCurrentDateFormatted(),
    updated_by: null,
  });

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

    try {
      const payload: PageFormData = {
        title: formData.title,
        link_url: formData.link_url,
        active_yn: Number(formData.active_yn),
        created_by: Number(formData.created_by),
        created_date: formData.created_date,
        updated_by: formData.updated_by ? Number(formData.updated_by) : null,
      };

      const response = await fetch(`${API_BASE_URL}/v1/pages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Page created successfully!");
        setFormData({
          title: "",
          link_url: "",
          active_yn: 1,
          created_by: 1,
          created_date: getCurrentDateFormatted(),
          updated_by: null,
        });
        // Call the onSuccess callback with the newly created page's ID and title
        onSuccess(data.data.id, formData.title);
        onClose();
      } else {
        throw new Error(data.message || "Failed to create page.");
      }
    } catch (err: any) {
      console.error("Error creating page:", err);
      setError(`Error: ${err.message}`);
      toast.error(`Failed to create page: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create New Page
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
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

          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Page"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PageModal;
