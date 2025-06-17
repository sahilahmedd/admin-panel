// File: app/admin/content-sections/components/ContentSectionTranslationsManager.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Import your defined types
import { ContentSectionLang, ApiResponse, ContentSectionLangFormData, ContentSectionTranslationsManagerProps } from '@/utils/types'; // Adjust path if needed

const API_BASE_URL = 'https://node2-plum.vercel.app/api/admin';

// Helper function to get current date in YYYY-MM-DD format (still needed for created_date)
const getCurrentDateFormatted = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ContentSectionTranslationsManager: React.FC<ContentSectionTranslationsManagerProps> = ({ parentSectionId }) => {
  const [translations, setTranslations] = useState<ContentSectionLang[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingTranslation, setEditingTranslation] = useState<ContentSectionLangFormData | null>(null);

  // Form state for new/editing translation
  const [formData, setFormData] = useState<ContentSectionLangFormData>({
    id: 0, // This will need to be provided manually for new translations
    title: '',
    id_id: parentSectionId, // This links to the parent content section
    description: '',
    image_path: '',
    icon_path: '',
    active_yn: 1,
    created_by: 1, // Example default creator ID
    created_date: getCurrentDateFormatted(),
    updated_by: null,
    page_id: 0, // Will need to be fetched from parent section or input
    refrence_page_id: null,
    lang_code: '', // Must be provided
  });

  // Fetch translations when parentSectionId changes or form is closed/updated
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        // Note: Filtering by 'id_id' if that's the FK in content_sections_lang,
        // or just 'id' if 'id' itself in content_sections_lang IS the content_section.id (your schema is ambiguous here)
        // Assuming your backend GET /v1/content-sections-lang?id={parentId} endpoint works by matching the 'id' field in the translations table.
        const response = await fetch(`${API_BASE_URL}/v1/content-sections-lang?id=${parentSectionId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: ApiResponse<ContentSectionLang[]> = await response.json();
        if (data.success) {
          setTranslations(data.data);
        } else {
          setError(data.message || 'Failed to fetch translations.');
        }
      } catch (err: any) {
        console.error("Error fetching translations:", err);
        setError(`Failed to load translations: ${err.message}`);
        toast.error(`Failed to load translations: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (parentSectionId) {
      fetchTranslations();
    }
  }, [parentSectionId, isFormOpen]); // Re-fetch when form state changes (added/edited translation)

  const handleOpenForm = (translation?: ContentSectionLang) => {
    if (translation) {
      setEditingTranslation(translation);
      // Map existing translation data to form data for editing
      setFormData({
        id: translation.id,
        title: translation.title,
        id_id: translation.id_id,
        description: translation.description,
        image_path: translation.image_path || '',
        icon_path: translation.icon_path || '',
        active_yn: translation.active_yn,
        created_by: translation.created_by,
        created_date: translation.created_date ? new Date(translation.created_date).toISOString().split('T')[0] : getCurrentDateFormatted(),
        updated_by: translation.updated_by,
        page_id: translation.page_id,
        refrence_page_id: translation.refrence_page_id || null,
        lang_code: translation.lang_code,
      });
    } else {
      setEditingTranslation(null);
      // Reset form for new translation, set parent ID and current date
      setFormData({
        id: 0, // IMPORTANT: User must manually set this for new translations as per your schema!
        title: '',
        id_id: parentSectionId, // Link to the current parent section
        description: '',
        image_path: '',
        icon_path: '',
        active_yn: 1,
        created_by: 1,
        created_date: getCurrentDateFormatted(),
        updated_by: null,
        page_id: 0, // This will need to be fetched/derived from parent, or user input
        refrence_page_id: null,
        lang_code: '',
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTranslation(null); // Clear editing state
    setError(null); // Clear any form-specific errors
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === "checkbox" ? target.checked : undefined;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : name === 'id' || name === 'page_id' || name === 'created_by' || name === 'updated_by' || name === 'refrence_page_id' || name === 'id_id' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const method = editingTranslation ? 'PUT' : 'POST';
    // If editing, use the translation's 'id' and 'lang_code' for the URL as per your API definition
    // Note: Your backend APIs defined like GET/PUT/DELETE /v1/content-sections-lang/:id/:lang_code
    // will need to be adjusted to just /:id since 'id' is @id in your schema.
    // Assuming backend API for update/delete just uses `id` as param.
    // If you intend for `id` and `lang_code` to be used in the URL for PUT/DELETE, your backend routes
    // and Prisma query `findUnique` in contentSectionLangController.js might need review to match.
    // For now, based on your schema where 'id' is `@id`, we'll use just `id` for PUT/DELETE.
    const url = editingTranslation
      ? `${API_BASE_URL}/v1/content-sections-lang/${editingTranslation.id}`
      : `${API_BASE_URL}/v1/content-sections-lang`;

    try {
      const payload: ContentSectionLangFormData = {
        ...formData,
        id: Number(formData.id), // Ensure ID is a number
        id_id: formData.id_id ? Number(formData.id_id) : null, // Ensure it's a number or null
        active_yn: Number(formData.active_yn),
        created_by: Number(formData.created_by),
        page_id: Number(formData.page_id),
        refrence_page_id: formData.refrence_page_id ? Number(formData.refrence_page_id) : null,
        updated_by: formData.updated_by ? Number(formData.updated_by) : null,
      };

      // Critical validation for new translations
      if (!editingTranslation && (!payload.id || !payload.lang_code)) {
        throw new Error("For new translations, 'ID' and 'Language Code' are required fields.");
      }

      // Check if ID is 0 or needs to be set manually for new records
      if (!editingTranslation && payload.id === 0) {
          // This case happens if user doesn't input an ID for new translation
          throw new Error("For new translations, you must manually provide a unique 'ID' field.");
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: ApiResponse<ContentSectionLang> = await response.json();

      if (response.ok && data.success) {
        toast.success(`Translation ${editingTranslation ? 'updated' : 'created'} successfully!`);
        handleCloseForm(); // Close form and trigger re-fetch of list
      } else {
        throw new Error(data.message || `Failed to ${editingTranslation ? 'update' : 'create'} translation.`);
      }
    } catch (err: any) {
      console.error(`Error ${editingTranslation ? 'updating' : 'creating'} translation:`, err);
      setError(`Error: ${err.message}`);
      toast.error(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTranslation = async (idToDelete: number) => {
    if (!window.confirm(`Are you sure you want to delete translation with ID: ${idToDelete}?`)) {
      return;
    }
    try {
      // Assuming your backend API for delete just uses 'id' as the param, as per @id definition
      const response = await fetch(`${API_BASE_URL}/v1/content-sections-lang/${idToDelete}`, {
        method: 'DELETE',
      });
      const data: ApiResponse<any> = await response.json();
      if (response.ok && data.success) {
        toast.success('Translation deleted successfully!');
        setTranslations(translations.filter(t => t.id !== idToDelete));
      } else {
        throw new Error(data.message || 'Failed to delete translation.');
      }
    } catch (err: any) {
      console.error("Error deleting translation:", err);
      setError(`Error deleting translation: ${err.message}`);
      toast.error(`Error deleting translation: ${err.message}`);
    }
  };


  return (
    <div className="border border-gray-200 rounded-lg p-4 mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Translations</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {!isFormOpen && (
        <div className="mb-4">
          <button
            onClick={() => handleOpenForm()}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Add New Translation
          </button>
        </div>
      )}

      {loading && !isFormOpen && (
        <p className="text-center text-gray-600">Loading translations...</p>
      )}

      {!isFormOpen && !loading && translations.length === 0 && (
        <p className="text-gray-600">No translations found for this section. Add one!</p>
      )}

      {!isFormOpen && !loading && translations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lang Code</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {translations.map((translation) => (
                <tr key={`${translation.id}-${translation.lang_code}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{translation.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 uppercase">{translation.lang_code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{translation.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {translation.active_yn === 1 ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOpenForm(translation)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4 focus:outline-none"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTranslation(translation.id)}
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

      {isFormOpen && (
        <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h3 className="text-xl font-semibold mb-4 text-blue-800">{editingTranslation ? 'Edit Translation' : 'Add New Translation'}</h3>

          <p className="text-sm text-red-700 mb-4 font-semibold">
            WARNING: As per your schema, the 'ID' field below is the PRIMARY KEY for this translation entry and is NOT auto-incrementing. You MUST provide a unique ID for each new translation. If this ID is intended to be the ID of the parent Content Section, your schema for `content_sections_lang` is currently incorrect and will lead to issues (it should be part of a composite primary key like `@@id([content_section_id, lang_code])`). For now, we proceed as `id` being an independent unique ID you provide.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ID Field (CRITICAL: User must provide for new) */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-700">Translation ID (Unique, Manually Provided)</label>
              <input
                type="number"
                id="id"
                name="id"
                value={formData.id === 0 && !editingTranslation ? '' : formData.id} // Show empty for new if 0
                onChange={handleChange}
                required
                readOnly={!!editingTranslation} // ID cannot be changed when editing
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${editingTranslation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
              {!editingTranslation && formData.id === 0 && (
                <p className="mt-1 text-xs text-red-500">Provide a unique integer ID (e.g., from your main content section, or another unique identifier).</p>
              )}
            </div>

            {/* Language Code */}
            <div>
              <label htmlFor="lang_code" className="block text-sm font-medium text-gray-700">Language Code (e.g., es, fr, de)</label>
              <input
                type="text"
                id="lang_code"
                name="lang_code"
                value={formData.lang_code}
                onChange={handleChange}
                required
                maxLength={5} // Max 5 as per @db.VarChar(5) for lang_code
                readOnly={!!editingTranslation} // Lang code typically not changeable after creation
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${editingTranslation ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
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
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
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
              <label htmlFor="image_path" className="block text-sm font-medium text-gray-700">Image Path (URL)</label>
              <input
                type="text"
                id="image_path"
                name="image_path"
                value={formData.image_path || ''}
                onChange={handleChange}
                maxLength={250}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Icon Path (Optional) */}
            <div>
              <label htmlFor="icon_path" className="block text-sm font-medium text-gray-700">Icon Path (URL)</label>
              <input
                type="text"
                id="icon_path"
                name="icon_path"
                value={formData.icon_path || ''}
                onChange={handleChange}
                maxLength={250}
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
              <label htmlFor="active_yn" className="ml-2 block text-sm text-gray-900">Active</label>
            </div>

            {/* Page ID (Required) - Duplicated, but in schema */}
            <div>
              <label htmlFor="page_id" className="block text-sm font-medium text-gray-700">Page ID (from main content section)</label>
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

            {/* Reference Page ID (Optional) - Duplicated, but in schema */}
            <div>
              <label htmlFor="refrence_page_id" className="block text-sm font-medium text-gray-700">Reference Page ID (Optional)</label>
              <input
                type="number"
                id="refrence_page_id"
                name="refrence_page_id"
                value={formData.refrence_page_id || ''}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            {/* Created By */}
            <div>
              <label htmlFor="created_by" className="block text-sm font-medium text-gray-700">Created By (User ID)</label>
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

            {/* Hidden fields */}
            <input type="hidden" name="created_date" value={formData.created_date} />
            <input type="hidden" name="id_id" value={formData.id_id || ''} /> {/* Pass id_id from parent */}


            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? (editingTranslation ? 'Updating...' : 'Adding...') : (editingTranslation ? 'Update Translation' : 'Add Translation')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ContentSectionTranslationsManager;
