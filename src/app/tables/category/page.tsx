/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import TableHeader from "@/components/TableHeader";
import { ColorRing } from "react-loader-spinner";
import { Pencil, CircleX } from "lucide-react";
import toast from "react-hot-toast";

const defaultCategory = {
  CATE_DESC: "",
  CATE_CATE_ID: null,
  CATE_CREATED_BY: 1,
};
const defaultTranslation = {
  CATE_DESC: "",
  CATE_ACTIVE_YN: "Y",
  CATE_CREATED_BY: 1,
  lang_code: "hi",
};

const CategoryTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showPanel, setShowPanel] = useState<"add" | "edit" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [categoryForm, setCategoryForm] = useState(defaultCategory);
  const [tab, setTab] = useState<"en" | "hi">("en");
  const [translation, setTranslation] = useState<{ [lang: string]: any }>({
    en: defaultTranslation,
    hi: defaultTranslation,
  });
  const [translationExists, setTranslationExists] = useState<{
    [lang: string]: boolean;
  }>({ en: false, hi: false });
  const [showHindiTab, setShowHindiTab] = useState(true);

  // Fetch categories
  const getCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://node2-plum.vercel.app/api/admin/categories"
      );
      const result = await res.json();
      if (result && result.categories) {
        setData(result.categories);
      }
    } catch (err) {
      // handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Handle Search
  const filteredData = data.filter((item) =>
    item.CATE_DESC.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table actions
  const handleEdit = async (row: any) => {
    setSelectedCategory(row);
    setCategoryForm({
      CATE_DESC: row.CATE_DESC,
      CATE_CATE_ID: row.CATE_CATE_ID || null,
      CATE_CREATED_BY: row.CATE_CREATED_BY || 1,
    });
    setShowPanel("edit");
    setShowHindiTab(true);
    await fetchTranslations(row.CATE_ID);
  };

  const handleAdd = () => {
    console.log("handleAdd called");
    setSelectedCategory(null);
    setCategoryForm(defaultCategory);
    setTranslation({ en: defaultTranslation, hi: defaultTranslation });
    setTranslationExists({ en: false, hi: false });
    setShowPanel("add");
    setTab("en");
    setShowHindiTab(false);
    console.log("handleAdd completed", {
      showPanel: "add",
      tab: "en",
      categoryForm: defaultCategory,
      showHindiTab: false,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const res = await fetch(
      `https://node2-plum.vercel.app/api/admin/categories/${id}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      toast.success("Category deleted");
      getCategories();
      setShowPanel(null);
    } else {
      toast.error("Failed to delete category");
    }
  };

  // Translation fetch
  const fetchTranslations = async (cateId: number) => {
    // Find the category by ID to get its English description
    const category = data.find((item) => item.CATE_ID === cateId);

    // English (default)
    setTranslation((prev) => ({
      ...prev,
      en: { CATE_DESC: category?.CATE_DESC || "" },
    }));
    setTranslationExists((prev) => ({ ...prev, en: true }));

    // Hindi
    try {
      const res = await fetch(
        `https://node2-plum.vercel.app/api/admin/categories/${cateId}/translation/hi`
      );
      console.log("Hindi translation API response status:", res.status);

      if (res.ok) {
        const result = await res.json();
        console.log("Full Hindi translation response:", result);

        // The translation data is inside the "translation" property
        const translationData = result.translation;

        if (translationData) {
          console.log("Processing Hindi translation data:", translationData);
          setTranslation((prev) => ({
            ...prev,
            hi: {
              CATE_DESC: translationData.CATE_DESC || "",
              CATE_ACTIVE_YN: translationData.CATE_ACTIVE_YN || "Y",
              CATE_CREATED_BY: translationData.CATE_CREATED_BY || 1,
              lang_code: translationData.lang_code || "hi",
            },
          }));
          setTranslationExists((prev) => ({ ...prev, hi: true }));
        } else {
          console.log("No valid Hindi translation data in response");
          setTranslation((prev) => ({ ...prev, hi: defaultTranslation }));
          setTranslationExists((prev) => ({ ...prev, hi: false }));
        }
      } else {
        console.log("No Hindi translation found, using default");
        setTranslation((prev) => ({ ...prev, hi: defaultTranslation }));
        setTranslationExists((prev) => ({ ...prev, hi: false }));
      }
    } catch (error) {
      console.error("Error fetching Hindi translation:", error);
      setTranslation((prev) => ({ ...prev, hi: defaultTranslation }));
      setTranslationExists((prev) => ({ ...prev, hi: false }));
    }
  };

  // Form handlers
  const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]:
        name === "CATE_CATE_ID"
          ? value === ""
            ? null
            : parseInt(value, 10)
          : name === "CATE_CREATED_BY"
          ? Number(value)
          : value,
    }));
  };
  const handleTranslationChange = (
    lang: "en" | "hi",
    field: string,
    value: any
  ) => {
    setTranslation((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));
  };

  // Submit handlers
  const handleSubmit = async () => {
    // Add new category
    const payload = {
      ...categoryForm,
      CATE_CATE_ID:
        categoryForm.CATE_CATE_ID === "" ? null : categoryForm.CATE_CATE_ID,
      CATE_CREATED_BY: categoryForm.CATE_CREATED_BY,
    };
    const res = await fetch(
      "https://node2-plum.vercel.app/api/admin/categories",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      toast.success("Category added");
      const result = await res.json();
      if (result && result.category && result.category.CATE_ID) {
        // Set the newly created category as selected
        setSelectedCategory(result.category);
        // Show Hindi tab and switch to it
        setShowHindiTab(true);
        setTab("hi");
        // Update translations state for the new category
        await fetchTranslations(result.category.CATE_ID);
      } else {
        // If we couldn't get the new category ID, just reset the form
        setShowPanel(null);
      }
      // Refresh categories list
      getCategories();
    } else {
      toast.error("Failed to add category");
    }
  };
  const handleUpdate = async () => {
    if (!selectedCategory) return;
    const payload = {
      ...categoryForm,
      CATE_CATE_ID:
        categoryForm.CATE_CATE_ID === "" ? null : categoryForm.CATE_CATE_ID,
    };
    const res = await fetch(
      `https://node2-plum.vercel.app/api/admin/categories/${selectedCategory.CATE_ID}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    if (res.ok) {
      toast.success("Category updated");
      getCategories();
      setShowPanel(null);
    } else {
      toast.error("Failed to update category");
    }
  };

  // Translation submit
  const handleTranslationSave = async (lang: "hi") => {
    if (!selectedCategory) return;
    const exists = translationExists[lang];
    const url = exists
      ? `https://node2-plum.vercel.app/api/admin/categories/${selectedCategory.CATE_ID}/translation/${lang}`
      : `https://node2-plum.vercel.app/api/admin/categories/${selectedCategory.CATE_ID}/translation`;
    const method = exists ? "PUT" : "POST";
    const body = JSON.stringify({
      lang_code: lang,
      CATE_DESC: translation[lang].CATE_DESC,
      CATE_ACTIVE_YN: translation[lang].CATE_ACTIVE_YN,
      CATE_CREATED_BY: translation[lang].CATE_CREATED_BY,
    });
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.ok) {
      toast.success(`Translation (${lang}) saved`);

      // If this is a new Hindi translation (not an update), reset the form
      if (!exists && lang === "hi") {
        // Reset form
        setShowPanel(null);
        setSelectedCategory(null);
        setCategoryForm(defaultCategory);
        setTranslation({
          en: defaultTranslation,
          hi: defaultTranslation,
        });
        setTranslationExists({ en: false, hi: false });
        setShowHindiTab(true);

        // Refresh the categories list
        getCategories();
        return;
      }

      // Otherwise just update translations
      fetchTranslations(selectedCategory.CATE_ID);
    } else {
      toast.error(`Failed to save translation (${lang})`);
    }
  };
  const handleTranslationDelete = async (lang: "hi") => {
    if (!selectedCategory) return;
    const url = `https://node2-plum.vercel.app/api/admin/categories/${selectedCategory.CATE_ID}/translation/${lang}`;
    const res = await fetch(url, { method: "DELETE" });
    if (res.ok) {
      toast.success(`Translation (${lang}) deleted`);
      fetchTranslations(selectedCategory.CATE_ID);
    } else {
      toast.error(`Failed to delete translation (${lang})`);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row: any) => row.CATE_ID,
      sortable: true,
    },
    {
      name: "Parent Category ID",
      selector: (row: any) => row.CATE_CATE_ID ?? "-",
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: any) => row.CATE_DESC,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: any) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
            <Pencil size={15} className="text-green-500" />
          </button>
          <button
            onClick={() => handleDelete(row.CATE_ID)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-red-200"
          >
            <CircleX size={15} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="p-6">
        <TableHeader
          title="Categories"
          searchText={searchText}
          onSearchChange={setSearchText}
          addNewLink="#"
          addNewText="Add Category"
          onAddClick={handleAdd}
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          {/* Left - Table */}
          <div className="w-full lg:w-2/3">
            <DataTable
              columns={columns}
              data={filteredData}
              progressPending={loading}
              progressComponent={
                <div className="flex justify-center items-center h-32">
                  <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    colors={[
                      "#e15b64",
                      "#f47e60",
                      "#f8b26a",
                      "#abbd81",
                      "#849b87",
                    ]}
                  />
                </div>
              }
              pagination
            />
          </div>

          {/* Right - Add/Edit panel with translation tabs */}
          <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-lg shadow p-6">
            {showPanel ? (
              <>
                <h2 className="text-xl font-semibold mb-4 text-center">
                  {showPanel === "add" ? "Add New Category" : "Edit Category"}
                </h2>
                <div className="mb-4 border-b border-gray-200">
                  <nav
                    className="-mb-px flex space-x-8 justify-center"
                    aria-label="Tabs"
                  >
                    <button
                      type="button"
                      onClick={() => setTab("en")}
                      className={`${
                        tab === "en"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                    >
                      <span className="inline-block w-5 h-5 mr-2">🇬🇧</span>{" "}
                      English
                    </button>
                    {showHindiTab && (
                      <button
                        type="button"
                        onClick={() => setTab("hi")}
                        className={`${
                          tab === "hi"
                            ? "border-green-500 text-green-600"
                            : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                      >
                        <span className="inline-block w-5 h-5 mr-2">🇮🇳</span>{" "}
                        Hindi
                      </button>
                    )}
                  </nav>
                </div>
                {/* English Tab (main category form) */}
                {tab === "en" && (
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                      <span className="inline-block w-6 h-6 mr-2">🇬🇧</span>{" "}
                      English Content
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Description (English)
                        </label>
                        <input
                          type="text"
                          name="CATE_DESC"
                          value={categoryForm.CATE_DESC}
                          onChange={handleCategoryChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Parent Category ID
                        </label>
                        <input
                          type="number"
                          name="CATE_CATE_ID"
                          value={
                            categoryForm.CATE_CATE_ID === null
                              ? ""
                              : categoryForm.CATE_CATE_ID
                          }
                          onChange={handleCategoryChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Created By
                        </label>
                        <input
                          type="number"
                          name="CATE_CREATED_BY"
                          value={categoryForm.CATE_CREATED_BY}
                          onChange={handleCategoryChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setShowPanel(null);
                            setSelectedCategory(null);
                            setCategoryForm(defaultCategory);
                            setTranslation({
                              en: defaultTranslation,
                              hi: defaultTranslation,
                            });
                            setTranslationExists({ en: false, hi: false });
                          }}
                          className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={
                            showPanel === "add" ? handleSubmit : handleUpdate
                          }
                          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {showPanel === "add" ? "Add" : "Update"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {/* Hindi Tab */}
                {tab === "hi" && showHindiTab && (
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
                      <span className="inline-block w-6 h-6 mr-2">🇮🇳</span>{" "}
                      Hindi Translation
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Description (Hindi)
                        </label>
                        <input
                          type="text"
                          value={translation.hi.CATE_DESC}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "CATE_DESC",
                              e.target.value
                            )
                          }
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Active
                        </label>
                        <input
                          type="checkbox"
                          checked={translation.hi.CATE_ACTIVE_YN === "Y"}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "CATE_ACTIVE_YN",
                              e.target.checked ? "Y" : "N"
                            )
                          }
                          className="w-5 h-5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Created By
                        </label>
                        <input
                          type="number"
                          value={translation.hi.CATE_CREATED_BY}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "CATE_CREATED_BY",
                              Number(e.target.value)
                            )
                          }
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Language Code
                        </label>
                        <input
                          type="text"
                          value={translation.hi.lang_code}
                          readOnly
                          className="w-full border px-3 py-2 rounded bg-gray-100"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => handleTranslationSave("hi")}
                          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          {translationExists.hi ? "Update" : "Add"} Hindi
                        </button>
                        {translationExists.hi && (
                          <button
                            onClick={() => handleTranslationDelete("hi")}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete Hindi
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Category Details
                </h2>
                <p className="text-gray-500 text-center">
                  Select a category to view details here.
                </p>
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full"
                >
                  Add New Category
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryTable;
