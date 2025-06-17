// File: app/admin/content-sections/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast

// Import your defined types
import { ContentSection, ApiResponse } from "@/utils/types"; // Adjust path if needed

const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

function ContentSectionList() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchContentSections = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/v1/content-sections`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiResponse<ContentSection[]> = await response.json();
        if (data.success) {
          setSections(data.data);
        } else {
          setError(data.message || "Failed to fetch content sections.");
        }
      } catch (err: any) {
        console.error("Error fetching content sections:", err);
        setError(`Failed to load content sections: ${err.message}`);
        toast.error(`Failed to load sections: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContentSections();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        `Are you sure you want to delete content section with ID: ${id}?`
      )
    ) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/v1/content-sections/${id}`,
        {
          method: "DELETE",
        }
      );
      const data: ApiResponse<any> = await response.json();
      if (response.ok && data.success) {
        toast.success("Content section deleted successfully!");
        setSections(sections.filter((section) => section.id !== id));
      } else {
        throw new Error(data.message || "Failed to delete content section.");
      }
    } catch (err: any) {
      console.error("Error deleting content section:", err);
      setError(`Error deleting section: ${err.message}`);
      toast.error(`Error deleting section: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-5 max-w-6xl mx-auto text-center text-gray-700">
        <p>Loading content sections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 max-w-6xl mx-auto text-center text-red-600">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Content Section Management
      </h1>

      <div className="mb-6 flex justify-end">
        <Link
          href="/content/add-new/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Create New Section
        </Link>
      </div>

      {sections.length === 0 ? (
        <p className="text-gray-600">
          No content sections found. Start by creating a new one!
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Page ID
                </th>
                {/* <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  From Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Upto Date
                </th> */}
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Active
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Lang
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sections.map((section) => (
                <tr key={section.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.page_id}
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(section.from_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(section.upto_date).toLocaleDateString()}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.active_yn === 1 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Yes
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {section.lang_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/content/add-new/${section.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ContentSectionList;
