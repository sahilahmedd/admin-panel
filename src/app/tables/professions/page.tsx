/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ColorRing } from "react-loader-spinner";
import { Pencil, CircleX } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TableHeader from "@/components/TableHeader";
import professionService, {
  ProfessionData,
  ProfessionTranslation,
} from "@/services/professionService";

const defaultProfession = {
  PROF_NAME: "",
  PROF_DESC: "",
  PROF_ACTIVE_YN: "Y",
  PROF_CREATED_BY: 1,
};

const defaultTranslation = {
  PROF_NAME: "",
  PROF_DESC: "",
  PROF_ACTIVE_YN: "Y",
  PROF_CREATED_BY: 1,
  lang_code: "hi",
};

const ProfessionsTable = () => {
  const [data, setData] = useState<ProfessionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showPanel, setShowPanel] = useState<"add" | "edit" | null>(null);
  const [selectedProfession, setSelectedProfession] =
    useState<ProfessionData | null>(null);
  const [professionForm, setProfessionForm] =
    useState<ProfessionData>(defaultProfession);
  const [tab, setTab] = useState<"en" | "hi">("en");
  const [translation, setTranslation] = useState<{ [lang: string]: any }>({
    en: defaultTranslation,
    hi: defaultTranslation,
  });
  const [translationExists, setTranslationExists] = useState<{
    [lang: string]: boolean;
  }>({ en: false, hi: false });
  const [showHindiTab, setShowHindiTab] = useState(true);

  // Fetch professions
  const getProfessions = async () => {
    setLoading(true);
    try {
      const result = await professionService.getAllProfessions();
      setData(result);
    } catch (err) {
      toast.error("Failed to fetch professions");
    }
    setLoading(false);
  };

  useEffect(() => {
    getProfessions();
  }, []);

  // Handle Search
  const filteredData = data.filter(
    (item) =>
      item.PROF_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
      item.PROF_DESC.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table actions
  const handleEdit = async (row: ProfessionData) => {
    setSelectedProfession(row);
    setProfessionForm({
      PROF_NAME: row.PROF_NAME,
      PROF_DESC: row.PROF_DESC,
      PROF_ACTIVE_YN: row.PROF_ACTIVE_YN || "Y",
      PROF_CREATED_BY: row.PROF_CREATED_BY || 1,
    });
    setShowPanel("edit");
    setShowHindiTab(true);
    await fetchTranslations(row.PROF_ID!);
  };

  const handleAdd = () => {
    setSelectedProfession(null);
    setProfessionForm(defaultProfession);
    setTranslation({ en: defaultTranslation, hi: defaultTranslation });
    setTranslationExists({ en: false, hi: false });
    setShowPanel("add");
    setTab("en");
    setShowHindiTab(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this profession?")) return;
    const success = await professionService.deleteProfession(id);
    if (success) {
      toast.success("Profession deleted");
      getProfessions();
      setShowPanel(null);
    } else {
      toast.error("Failed to delete profession");
    }
  };

  // Translation fetch
  const fetchTranslations = async (profId: number) => {
    console.log(`Fetching translations for profession ID: ${profId}`);

    // Find the profession by ID to get its English description
    const profession = data.find((item) => item.PROF_ID === profId);
    console.log("Found profession:", profession);

    // English (default)
    setTranslation((prev) => ({
      ...prev,
      en: {
        PROF_NAME: profession?.PROF_NAME || "",
        PROF_DESC: profession?.PROF_DESC || "",
        PROF_ACTIVE_YN: profession?.PROF_ACTIVE_YN || "Y",
        PROF_CREATED_BY: profession?.PROF_CREATED_BY || 1,
        lang_code: "en",
      },
    }));
    setTranslationExists((prev) => ({ ...prev, en: true }));

    // Hindi
    try {
      console.log(`Requesting Hindi translation for profession ID: ${profId}`);
      const hiData = await professionService.getTranslation(profId, "hi");
      console.log("Hindi translation response:", hiData);

      if (hiData) {
        console.log("Setting Hindi translation data:", hiData);

        setTranslation((prev) => ({
          ...prev,
          hi: {
            PROF_NAME: hiData.PROF_NAME || "",
            PROF_DESC: hiData.PROF_DESC || "",
            PROF_ACTIVE_YN: hiData.PROF_ACTIVE_YN || "Y",
            PROF_CREATED_BY: hiData.PROF_CREATED_BY || 1,
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
  const handleProfessionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setProfessionForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? "Y" : "N") : value,
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
    // Add new profession
    const result = await professionService.createProfession(professionForm);
    if (result) {
      toast.success("Profession added");
      // Set the newly created profession as selected
      setSelectedProfession(result);
      // Show Hindi tab and switch to it
      setShowHindiTab(true);
      setTab("hi");
      // Update translations state for the new profession
      if (result.PROF_ID) {
        await fetchTranslations(result.PROF_ID);
      }
      // Refresh professions list
      getProfessions();
    } else {
      toast.error("Failed to add profession");
    }
  };

  const handleUpdate = async () => {
    if (!selectedProfession?.PROF_ID) return;
    const result = await professionService.updateProfession(
      selectedProfession.PROF_ID,
      professionForm
    );
    if (result) {
      toast.success("Profession updated");
      getProfessions();
      setShowPanel(null);
    } else {
      toast.error("Failed to update profession");
    }
  };

  // Translation submit
  const handleTranslationSave = async (lang: "hi") => {
    if (!selectedProfession?.PROF_ID) return;
    const exists = translationExists[lang];

    const translationData: ProfessionTranslation = {
      PROF_NAME: translation[lang].PROF_NAME,
      PROF_DESC: translation[lang].PROF_DESC,
      PROF_ACTIVE_YN: translation[lang].PROF_ACTIVE_YN,
      PROF_CREATED_BY: translation[lang].PROF_CREATED_BY,
      lang_code: lang,
    };

    let result;
    if (exists) {
      result = await professionService.updateTranslation(
        selectedProfession.PROF_ID,
        lang,
        translationData
      );
    } else {
      result = await professionService.createTranslation(
        selectedProfession.PROF_ID,
        translationData
      );
    }

    if (result) {
      toast.success(`Translation (${lang}) saved`);

      // If this is a new Hindi translation (not an update), reset the form
      if (!exists && lang === "hi") {
        // Reset form
        setShowPanel(null);
        setSelectedProfession(null);
        setProfessionForm(defaultProfession);
        setTranslation({
          en: defaultTranslation,
          hi: defaultTranslation,
        });
        setTranslationExists({ en: false, hi: false });
        setShowHindiTab(true);

        // Refresh the professions list
        getProfessions();
        return;
      }

      // Otherwise just update translations
      fetchTranslations(selectedProfession.PROF_ID);
    } else {
      toast.error(`Failed to save translation (${lang})`);
    }
  };

  const handleTranslationDelete = async (lang: "hi") => {
    if (!selectedProfession?.PROF_ID) return;
    const success = await professionService.deleteTranslation(
      selectedProfession.PROF_ID,
      lang
    );
    if (success) {
      toast.success(`Translation (${lang}) deleted`);
      fetchTranslations(selectedProfession.PROF_ID);
    } else {
      toast.error(`Failed to delete translation (${lang})`);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row: ProfessionData) => row.PROF_ID || 0,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row: ProfessionData) => row.PROF_NAME,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row: ProfessionData) => row.PROF_DESC,
      sortable: true,
    },
    {
      name: "Active",
      selector: (row: ProfessionData) =>
        row.PROF_ACTIVE_YN === "Y" ? "Yes" : "No",
      sortable: true,
      width: "100px",
    },
    {
      name: "Actions",
      cell: (row: ProfessionData) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
            <Pencil size={15} className="text-green-500" />
          </button>
          <button
            onClick={() => handleDelete(row.PROF_ID!)}
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
      {/* <Toaster position="top-right" reverseOrder={false} /> */}
      <div className="p-6">
        <TableHeader
          title="Professions"
          searchText={searchText}
          onSearchChange={setSearchText}
          addNewLink="#"
          addNewText="Add Profession"
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
                  {showPanel === "add"
                    ? "Add New Profession"
                    : "Edit Profession"}
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
                {/* English Tab (main profession form) */}
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
                          name="PROF_NAME"
                          value={professionForm.PROF_NAME}
                          onChange={handleProfessionChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Description (English)
                        </label>
                        <input
                          type="text"
                          name="PROF_DESC"
                          value={professionForm.PROF_DESC}
                          onChange={handleProfessionChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Active
                        </label>
                        <input
                          type="checkbox"
                          name="PROF_ACTIVE_YN"
                          checked={professionForm.PROF_ACTIVE_YN === "Y"}
                          onChange={(e) => {
                            handleProfessionChange({
                              target: {
                                name: "PROF_ACTIVE_YN",
                                value: e.target.checked ? "Y" : "N",
                                type: "checkbox",
                                checked: e.target.checked,
                              },
                            } as React.ChangeEvent<HTMLInputElement>);
                          }}
                          className="w-5 h-5"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Created By
                        </label>
                        <input
                          type="number"
                          name="PROF_CREATED_BY"
                          value={professionForm.PROF_CREATED_BY}
                          onChange={handleProfessionChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setShowPanel(null);
                            setSelectedProfession(null);
                            setProfessionForm(defaultProfession);
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
                          value={translation.hi.PROF_NAME}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "PROF_NAME",
                              e.target.value
                            )
                          }
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Description (Hindi)
                        </label>
                        <input
                          type="text"
                          value={translation.hi.PROF_DESC}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "PROF_DESC",
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
                          checked={translation.hi.PROF_ACTIVE_YN === "Y"}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "PROF_ACTIVE_YN",
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
                          value={translation.hi.PROF_CREATED_BY}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "PROF_CREATED_BY",
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
                  Profession Details
                </h2>
                <p className="text-gray-500 text-center">
                  Select a profession to view details here.
                </p>
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full"
                >
                  Add New Profession
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfessionsTable;
