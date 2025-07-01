// File: app/admin/content-sections/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // Assuming you're using react-hot-toast

// Import your defined types
import { ContentSection, ContentSectionLang, ApiResponse } from "@/utils/types"; // Adjust path if needed
import PageModal from "./PageModal"; // Import the PageModal component
import { usePagesFetch } from "@/hooks/usePagesFetch"; // Import the pages fetch hook

const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

// Language display helpers
const languageFlags: Record<string, string> = {
  en: "🇬🇧",
  hi: "🇮🇳",
};

const languageNames: Record<string, string> = {
  en: "English",
  hi: "Hindi",
};

type SectionWithTranslations = ContentSection & {
  availableLanguages?: { code: string; active: boolean }[];
};

function ContentSectionList() {
  const [sections, setSections] = useState<SectionWithTranslations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState<boolean>(false);
  const { pages, loading: pagesLoading, error: pagesError } = usePagesFetch(); // Use the hook to fetch pages
  const router = useRouter();

  // Create a mapping of page IDs to page titles
  const pageMap = new Map();
  pages.forEach((page) => {
    pageMap.set(page.id, page.title);
  });

  useEffect(() => {
    fetchContentSections();
  }, []);

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
        // Fetch translations for each section
        const sectionsWithTranslations = await Promise.all(
          data.data.map(async (section) => {
            try {
              // Main language is always English
              const availableLanguages = [
                { code: "en", active: section.active_yn === 1 },
              ];

              // Try to fetch Hindi translation
              const hiResponse = await fetch(
                `${API_BASE_URL}/v1/content-sections-lang/${section.id}/hi`
              );

              if (hiResponse.ok) {
                const hiData = await hiResponse.json();
                if (hiData.success && hiData.data) {
                  availableLanguages.push({
                    code: "hi",
                    active: hiData.data.active_yn === 1,
                  });
                }
              }

              return {
                ...section,
                availableLanguages,
              };
            } catch (err) {
              console.error(
                `Error fetching translations for section ${section.id}:`,
                err
              );
              // Return section with just the English language if there's an error
              return {
                ...section,
                availableLanguages: [
                  { code: "en", active: section.active_yn === 1 },
                ],
              };
            }
          })
        );

        setSections(sectionsWithTranslations);
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

  const handlePageCreationSuccess = (pageId: number, pageTitle: string) => {
    toast.success(`Page "${pageTitle}" created successfully!`);
    // Update the pageMap with the new page
    pageMap.set(pageId, pageTitle);
    // Refresh the sections list
    fetchContentSections();
  };

  if (loading || pagesLoading) {
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

  if (pagesError) {
    toast.error(`Error loading pages: ${pagesError}`);
  }

  // Function to render language flags with status
  const renderLanguages = (section: SectionWithTranslations) => {
    if (
      !section.availableLanguages ||
      section.availableLanguages.length === 0
    ) {
      return <span className="text-gray-400">No languages</span>;
    }

    return (
      <div className="flex flex-col space-y-1">
        {section.availableLanguages.map((lang) => (
          <div key={lang.code} className="flex items-center">
            <span className="mr-1">
              {languageFlags[lang.code] || lang.code}
            </span>
            <span className={lang.active ? "font-medium" : "text-gray-400"}>
              {languageNames[lang.code] || lang.code}
              {!lang.active && " (inactive)"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Function to render buttons if they exist
  const renderButtons = (section: ContentSection) => {
    if (!section.button_one && !section.button_two) {
      return <span className="text-gray-400">No buttons</span>;
    }

    return (
      <div className="flex flex-col space-y-1">
        {section.button_one && (
          <div className="flex items-center">
            <span className="font-medium text-blue-600">
              {section.button_one}
            </span>
            {section.button_one_slug && (
              <span className="ml-2 text-xs text-gray-500">
                → {section.button_one_slug}
              </span>
            )}
          </div>
        )}
        {section.button_two && (
          <div className="flex items-center">
            <span className="font-medium text-green-600">
              {section.button_two}
            </span>
            {section.button_two_slug && (
              <span className="ml-2 text-xs text-gray-500">
                → {section.button_two_slug}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Content Section Management
      </h1>

      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Quick Guide:</span>
          <br />•{" "}
          <span className="font-medium text-green-600">Create New Page</span> -
          Add a completely new page to the website.
          <br />•{" "}
          <span className="font-medium text-blue-600">
            Create New Section
          </span>{" "}
          - Add content sections to existing pages.
        </p>
      </div>

      <div className="mb-6 flex justify-end space-x-4">
        <button
          onClick={() => setIsPageModalOpen(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Create New Page
        </button>
        <Link
          href="/content/add-new/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Create New Section
        </Link>
      </div>

      {/* Page Modal */}
      <PageModal
        isOpen={isPageModalOpen}
        onClose={() => setIsPageModalOpen(false)}
        onSuccess={handlePageCreationSuccess}
      />

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
                  Page
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Buttons
                </th>
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
                  Languages
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
                    {section.page_id ? (
                      <div>
                        <span className="font-medium">
                          {pageMap.get(section.page_id) || "Unknown Page"}
                        </span>
                        <div className="text-xs text-gray-500">
                          ID: {section.page_id}
                        </div>
                        <Link
                          href={`/content/view-content/${section.page_id}`}
                          className="text-xs text-blue-500 hover:text-blue-700"
                        >
                          (View Page)
                        </Link>
                      </div>
                    ) : (
                      <span className="text-gray-400">No Page Assigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {renderButtons(section)}
                  </td>
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
                    {renderLanguages(section)}
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
