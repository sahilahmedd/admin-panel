/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ColorRing } from "react-loader-spinner";
import { Pencil, CircleX } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TableHeader from "@/components/TableHeader";
import hobbiesService, {
  HobbyData,
  HobbyTranslation,
} from "@/services/hobbiesService";

const defaultHobby = {
  HOBBY_NAME: "",
  HOBBY_IMAGE_URL: "",
  HOBBY_CREATED_BY: 1,
};

const defaultTranslation = {
  HOBBY_NAME: "",
  HOBBY_ACTIVE_YN: "Y",
  HOBBY_CREATED_BY: 1,
  lang_code: "hi",
};

const HobbiesTable = () => {
  const [data, setData] = useState<HobbyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showPanel, setShowPanel] = useState<"add" | "edit" | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<HobbyData | null>(null);
  const [hobbyForm, setHobbyForm] = useState<HobbyData>(defaultHobby);
  const [tab, setTab] = useState<"en" | "hi">("en");
  const [translation, setTranslation] = useState<{ [lang: string]: any }>({
    en: defaultTranslation,
    hi: defaultTranslation,
  });
  const [translationExists, setTranslationExists] = useState<{
    [lang: string]: boolean;
  }>({ en: false, hi: false });
  const [showHindiTab, setShowHindiTab] = useState(true);

  // Fetch hobbies data
  const getHobbies = async () => {
    setLoading(true);
    try {
      const result = await hobbiesService.getAllHobbies();
      console.log("Hobbies data received in component:", result);
      setData(result);
      console.log("Hobbies data after setState:", result);
    } catch (err) {
      console.error("Error in getHobbies:", err);
      toast.error("Failed to fetch hobbies data");
    }
    setLoading(false);
  };

  useEffect(() => {
    getHobbies();
  }, []);

  // Handle Search
  const filteredData = data.filter((item) =>
    item.HOBBY_NAME.toLowerCase().includes(searchText.toLowerCase())
  );

  console.log("Data before filtering:", data);
  console.log("Filtered data for table:", filteredData);

  // Handle file upload
  const handleFileUpload = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status) {
        const imageUrl = `https://rangrezsamaj.kunxite.com/${result.url}`;
        return imageUrl;
      } else {
        toast.error("Image upload failed");
        return null;
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Image upload error");
      return null;
    }
  };

  // Table actions
  const handleEdit = async (row: HobbyData) => {
    setSelectedHobby(row);
    setHobbyForm({
      HOBBY_NAME: row.HOBBY_NAME,
      HOBBY_IMAGE_URL: row.HOBBY_IMAGE_URL,
      HOBBY_CREATED_BY: row.HOBBY_CREATED_BY || 1,
    });
    setShowPanel("edit");
    setShowHindiTab(true);
    if (row.HOBBY_ID) {
      await fetchTranslations(row.HOBBY_ID);
    }
  };

  const handleAdd = () => {
    setSelectedHobby(null);
    setHobbyForm(defaultHobby);
    setTranslation({ en: defaultTranslation, hi: defaultTranslation });
    setTranslationExists({ en: false, hi: false });
    setShowPanel("add");
    setTab("en");
    setShowHindiTab(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this hobby?")) return;
    const success = await hobbiesService.deleteHobby(id);
    if (success) {
      toast.success("Hobby deleted");
      getHobbies();
      setShowPanel(null);
    } else {
      toast.error("Failed to delete hobby");
    }
  };

  // Translation fetch
  const fetchTranslations = async (hobbyId: number) => {
    console.log(`Fetching translations for hobby ID: ${hobbyId}`);

    // Find the hobby by ID to get its English description
    const hobby = data.find((item) => item.HOBBY_ID === hobbyId);
    console.log("Found hobby:", hobby);

    // English (default)
    setTranslation((prev) => ({
      ...prev,
      en: {
        HOBBY_NAME: hobby?.HOBBY_NAME || "",
        HOBBY_ACTIVE_YN: "Y",
        HOBBY_CREATED_BY: hobby?.HOBBY_CREATED_BY || 1,
        lang_code: "en",
      },
    }));
    setTranslationExists((prev) => ({ ...prev, en: true }));

    // Hindi
    try {
      console.log(`Requesting Hindi translation for hobby ID: ${hobbyId}`);
      const hiData = await hobbiesService.getTranslation(hobbyId, "hi");
      console.log("Hindi translation response:", hiData);

      if (hiData) {
        console.log("Setting Hindi translation data:", hiData);

        setTranslation((prev) => ({
          ...prev,
          hi: {
            HOBBY_NAME: hiData.HOBBY_NAME || "",
            HOBBY_ACTIVE_YN: hiData.HOBBY_ACTIVE_YN || "Y",
            HOBBY_CREATED_BY: hiData.HOBBY_CREATED_BY || 1,
            lang_code: hiData.lang_code || "hi",
          },
        }));
        setTranslationExists((prev) => ({ ...prev, hi: true }));
        console.log("Hindi translation exists set to true");
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
  const handleHobbyChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files?.[0]) {
      const imageUrl = await handleFileUpload(files[0]);
      if (imageUrl) {
        setHobbyForm((prev) => ({
          ...prev,
          [name]: imageUrl,
        }));
      }
    } else {
      setHobbyForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    // Validate form data
    if (!hobbyForm.HOBBY_NAME.trim()) {
      toast.error("Hobby name cannot be empty");
      return;
    }

    if (!hobbyForm.HOBBY_IMAGE_URL) {
      toast.error("Please upload an image");
      return;
    }

    // Add new hobby
    const result = await hobbiesService.createHobby(hobbyForm);
    if (result) {
      toast.success("Hobby added");
      // Set the newly created hobby as selected
      setSelectedHobby(result);
      // Show Hindi tab and switch to it
      setShowHindiTab(true);
      setTab("hi");
      // Update translations state for the new hobby
      if (result.HOBBY_ID) {
        await fetchTranslations(result.HOBBY_ID);
      }
      // Refresh hobby list
      getHobbies();
    } else {
      toast.error("Failed to add hobby");
    }
  };

  const handleUpdate = async () => {
    if (!selectedHobby?.HOBBY_ID) return;

    // Validate form data
    if (!hobbyForm.HOBBY_NAME.trim()) {
      toast.error("Hobby name cannot be empty");
      return;
    }

    if (!hobbyForm.HOBBY_IMAGE_URL) {
      toast.error("Please upload an image");
      return;
    }

    const result = await hobbiesService.updateHobby(
      selectedHobby.HOBBY_ID,
      hobbyForm
    );
    if (result) {
      toast.success("Hobby updated");
      getHobbies();
      setShowPanel(null);
    } else {
      toast.error("Failed to update hobby");
    }
  };

  // Translation submit
  const handleTranslationSave = async (lang: "hi") => {
    if (!selectedHobby?.HOBBY_ID) return;

    // Validate translation data
    if (!translation[lang].HOBBY_NAME.trim()) {
      toast.error(
        `${lang === "hi" ? "Hindi" : "English"} name cannot be empty`
      );
      return;
    }

    const exists = translationExists[lang];

    const translationData: HobbyTranslation = {
      HOBBY_NAME: translation[lang].HOBBY_NAME,
      HOBBY_ACTIVE_YN: translation[lang].HOBBY_ACTIVE_YN,
      HOBBY_CREATED_BY: translation[lang].HOBBY_CREATED_BY,
      lang_code: lang,
    };

    let result;
    if (exists) {
      result = await hobbiesService.updateTranslation(
        selectedHobby.HOBBY_ID,
        lang,
        translationData
      );
    } else {
      result = await hobbiesService.createTranslation(
        selectedHobby.HOBBY_ID,
        translationData
      );
    }

    if (result) {
      toast.success(`Translation (${lang}) saved`);

      // If this is a new Hindi translation (not an update), reset the form
      if (!exists && lang === "hi") {
        // Reset form
        setShowPanel(null);
        setSelectedHobby(null);
        setHobbyForm(defaultHobby);
        setTranslation({
          en: defaultTranslation,
          hi: defaultTranslation,
        });
        setTranslationExists({ en: false, hi: false });
        setShowHindiTab(true);

        // Refresh the hobby list
        getHobbies();
        return;
      }

      // Otherwise just update translations
      fetchTranslations(selectedHobby.HOBBY_ID);
    } else {
      toast.error(`Failed to save translation (${lang})`);
    }
  };

  const handleTranslationDelete = async (lang: "hi") => {
    if (!selectedHobby?.HOBBY_ID) return;
    const success = await hobbiesService.deleteTranslation(
      selectedHobby.HOBBY_ID,
      lang
    );
    if (success) {
      toast.success(`Translation (${lang}) deleted`);
      fetchTranslations(selectedHobby.HOBBY_ID);
    } else {
      toast.error(`Failed to delete translation (${lang})`);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row: HobbyData) => row.HOBBY_ID || 0,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row: HobbyData) => row.HOBBY_NAME,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row: HobbyData) =>
        row.HOBBY_IMAGE_URL ? (
          <img
            src={row.HOBBY_IMAGE_URL}
            alt="icon"
            width={40}
            height={40}
            className="rounded"
          />
        ) : (
          "No Image"
        ),
      width: "100px",
    },
    {
      name: "Actions",
      cell: (row: HobbyData) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
            <Pencil size={15} className="text-green-500" />
          </button>
          <button
            onClick={() => handleDelete(row.HOBBY_ID!)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-red-200"
          >
            <CircleX size={15} className="text-red-500" />
          </button>
        </div>
      ),
      width: "120px",
    },
  ];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="p-6">
        <TableHeader
          title="Hobbies"
          searchText={searchText}
          onSearchChange={setSearchText}
          addNewLink="#"
          addNewText="Add Hobby"
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
                  {showPanel === "add" ? "Add New Hobby" : "Edit Hobby"}
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
                {/* English Tab (main hobby form) */}
                {tab === "en" && (
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                      <span className="inline-block w-6 h-6 mr-2">🇬🇧</span>{" "}
                      English Content
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Name (English)
                        </label>
                        <input
                          type="text"
                          name="HOBBY_NAME"
                          value={hobbyForm.HOBBY_NAME}
                          onChange={handleHobbyChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Upload Image
                        </label>
                        <input
                          type="file"
                          name="HOBBY_IMAGE_URL"
                          onChange={handleHobbyChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                        {hobbyForm.HOBBY_IMAGE_URL && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">
                              Current image:
                            </p>
                            <img
                              src={hobbyForm.HOBBY_IMAGE_URL}
                              alt="Preview"
                              width={100}
                              height={100}
                              className="rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setShowPanel(null);
                            setSelectedHobby(null);
                            setHobbyForm(defaultHobby);
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
                          Name (Hindi)
                        </label>
                        <input
                          type="text"
                          value={translation.hi.HOBBY_NAME}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "HOBBY_NAME",
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
                          checked={translation.hi.HOBBY_ACTIVE_YN === "Y"}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "HOBBY_ACTIVE_YN",
                              e.target.checked ? "Y" : "N"
                            )
                          }
                          className="w-5 h-5"
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
                  Hobby Details
                </h2>
                <p className="text-gray-500 text-center">
                  Select a hobby to view details here.
                </p>
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full"
                >
                  Add New Hobby
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HobbiesTable;
