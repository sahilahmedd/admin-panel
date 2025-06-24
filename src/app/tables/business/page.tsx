/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ColorRing } from "react-loader-spinner";
import { Pencil, CircleX } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TableHeader from "@/components/TableHeader";
import businessService, {
  BusinessData,
  BusinessTranslation,
} from "@/services/businessService";

const defaultBusiness = {
  BUSS_STREM: "",
  BUSS_TYPE: "",
  BUSS_CREATED_BY: 1,
};

const defaultTranslation = {
  BUSS_STREM: "",
  BUSS_TYPE: "",
  BUSS_ACTIVE_YN: "Y",
  BUSS_CREATED_BY: 1,
  lang_code: "hi",
};

const BusinessTable = () => {
  const [data, setData] = useState<BusinessData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showPanel, setShowPanel] = useState<"add" | "edit" | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessData | null>(
    null
  );
  const [businessForm, setBusinessForm] =
    useState<BusinessData>(defaultBusiness);
  const [tab, setTab] = useState<"en" | "hi">("en");
  const [translation, setTranslation] = useState<{ [lang: string]: any }>({
    en: defaultTranslation,
    hi: defaultTranslation,
  });
  const [translationExists, setTranslationExists] = useState<{
    [lang: string]: boolean;
  }>({ en: false, hi: false });
  const [showHindiTab, setShowHindiTab] = useState(true);

  // Fetch business data
  const getBusiness = async () => {
    setLoading(true);
    try {
      const result = await businessService.getAllBusiness();
      console.log("Business data received in component:", result);
      setData(result);
      console.log("Business data after setState:", result);
    } catch (err) {
      console.error("Error in getBusiness:", err);
      toast.error("Failed to fetch business data");
    }
    setLoading(false);
  };

  useEffect(() => {
    getBusiness();
  }, []);

  // Handle Search
  const filteredData = data.filter(
    (item) =>
      item.BUSS_STREM.toLowerCase().includes(searchText.toLowerCase()) ||
      item.BUSS_TYPE.toLowerCase().includes(searchText.toLowerCase())
  );

  console.log("Data before filtering:", data);
  console.log("Filtered data for table:", filteredData);

  // Table actions
  const handleEdit = async (row: BusinessData) => {
    console.log("Editing business:", row);
    setSelectedBusiness(row);
    setBusinessForm({
      BUSS_STREM: row.BUSS_STREM,
      BUSS_TYPE: row.BUSS_TYPE,
      BUSS_CREATED_BY: row.BUSS_CREATED_BY || 1,
    });
    setShowPanel("edit");

    // Always show Hindi tab when editing
    setShowHindiTab(true);

    if (row.BUSS_ID) {
      // Fetch translations and check if Hindi translation exists
      const hindiExists = await fetchTranslations(row.BUSS_ID);

      // Switch to Hindi tab if translation exists
      if (hindiExists) {
        console.log("Hindi translation found, switching to Hindi tab");
        setTab("hi");
      } else {
        console.log("No Hindi translation found, staying on English tab");
        setTab("en");
      }
    }
  };

  const handleAdd = () => {
    console.log("handleAdd called - opening add business panel");
    setSelectedBusiness(null);
    setBusinessForm(defaultBusiness);
    setTranslation({ en: defaultTranslation, hi: defaultTranslation });
    setTranslationExists({ en: false, hi: false });
    setShowPanel("add");
    setTab("en");
    setShowHindiTab(false);
    console.log("Add business panel state updated:", {
      showPanel: "add",
      tab: "en",
      showHindiTab: false,
      businessForm: defaultBusiness,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this business?")) return;
    const success = await businessService.deleteBusiness(id);
    if (success) {
      toast.success("Business deleted");
      getBusiness();
      setShowPanel(null);
    } else {
      toast.error("Failed to delete business");
    }
  };

  // Translation fetch
  const fetchTranslations = async (businessId: number) => {
    console.log(`Fetching translations for business ID: ${businessId}`);

    // Find the business by ID to get its English description
    const business = data.find((item) => item.BUSS_ID === businessId);
    console.log("Found business:", business);

    // English (default)
    setTranslation((prev) => ({
      ...prev,
      en: {
        BUSS_STREM: business?.BUSS_STREM || "",
        BUSS_TYPE: business?.BUSS_TYPE || "",
        BUSS_ACTIVE_YN: "Y",
        BUSS_CREATED_BY: business?.BUSS_CREATED_BY || 1,
        lang_code: "en",
      },
    }));
    setTranslationExists((prev) => ({ ...prev, en: true }));

    // Hindi
    try {
      console.log(
        `Requesting Hindi translation for business ID: ${businessId}`
      );
      const hiData = await businessService.getTranslation(businessId, "hi");
      console.log("Hindi translation response:", hiData);

      if (hiData && hiData.BUSS_STREM) {
        console.log("Setting Hindi translation data:", hiData);

        setTranslation((prev) => ({
          ...prev,
          hi: {
            BUSS_STREM: hiData.BUSS_STREM || "",
            BUSS_TYPE: hiData.BUSS_TYPE || "",
            BUSS_ACTIVE_YN: hiData.BUSS_ACTIVE_YN || "Y",
            BUSS_CREATED_BY: hiData.BUSS_CREATED_BY || 1,
            lang_code: hiData.lang_code || "hi",
          },
        }));
        setTranslationExists((prev) => ({ ...prev, hi: true }));
        console.log("Hindi translation exists set to true");

        // Return true to indicate Hindi translation exists
        return true;
      } else {
        console.log("No Hindi translation found, using default");
        setTranslation((prev) => ({
          ...prev,
          hi: {
            BUSS_STREM: "",
            BUSS_TYPE: "",
            BUSS_ACTIVE_YN: "Y",
            BUSS_CREATED_BY: business?.BUSS_CREATED_BY || 1,
            lang_code: "hi",
          },
        }));
        setTranslationExists((prev) => ({ ...prev, hi: false }));

        // Return false to indicate no Hindi translation
        return false;
      }
    } catch (error) {
      console.error("Error fetching Hindi translation:", error);
      setTranslation((prev) => ({
        ...prev,
        hi: {
          BUSS_STREM: "",
          BUSS_TYPE: "",
          BUSS_ACTIVE_YN: "Y",
          BUSS_CREATED_BY: business?.BUSS_CREATED_BY || 1,
          lang_code: "hi",
        },
      }));
      setTranslationExists((prev) => ({ ...prev, hi: false }));

      // Return false to indicate error fetching Hindi translation
      return false;
    }
  };

  // Form handlers
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessForm((prev) => ({
      ...prev,
      [name]: value,
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
    // Validate form data
    if (!businessForm.BUSS_STREM.trim()) {
      toast.error("Business name cannot be empty");
      return;
    }

    if (!businessForm.BUSS_TYPE.trim()) {
      toast.error("Business type cannot be empty");
      return;
    }

    console.log("Submitting business form:", businessForm);

    try {
      // Add new business
      const result = await businessService.createBusiness(businessForm);
      console.log("Create business result:", result);

      if (result && result.BUSS_ID) {
        toast.success("Business added");

        // Set the newly created business as selected
        setSelectedBusiness(result);

        // Show Hindi tab and switch to it
        setShowHindiTab(true);
        setTab("hi");

        // Update translations state for the new business
        await fetchTranslations(result.BUSS_ID);

        // Refresh business list
        getBusiness();
      } else {
        toast.error("Failed to add business: No valid response from server");
        console.error("Invalid response from createBusiness:", result);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(
        `Failed to add business: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleUpdate = async () => {
    if (!selectedBusiness?.BUSS_ID) return;

    // Validate form data
    if (!businessForm.BUSS_STREM.trim()) {
      toast.error("Business name cannot be empty");
      return;
    }

    if (!businessForm.BUSS_TYPE.trim()) {
      toast.error("Business type cannot be empty");
      return;
    }

    const result = await businessService.updateBusiness(
      selectedBusiness.BUSS_ID,
      businessForm
    );
    if (result) {
      toast.success("Business updated");
      getBusiness();
      setShowPanel(null);
    } else {
      toast.error("Failed to update business");
    }
  };

  // Translation submit
  const handleTranslationSave = async (lang: "hi") => {
    if (!selectedBusiness?.BUSS_ID) return;

    // Validate translation data
    if (!translation[lang].BUSS_STREM.trim()) {
      toast.error(
        `${lang === "hi" ? "Hindi" : "English"} business name cannot be empty`
      );
      return;
    }

    if (!translation[lang].BUSS_TYPE.trim()) {
      toast.error(
        `${lang === "hi" ? "Hindi" : "English"} business type cannot be empty`
      );
      return;
    }

    const exists = translationExists[lang];

    const translationData: BusinessTranslation = {
      BUSS_STREM: translation[lang].BUSS_STREM,
      BUSS_TYPE: translation[lang].BUSS_TYPE,
      BUSS_ACTIVE_YN: translation[lang].BUSS_ACTIVE_YN || "Y",
      BUSS_CREATED_BY: translation[lang].BUSS_CREATED_BY || 1,
      lang_code: lang,
    };

    console.log(
      `Saving ${lang} translation for business ID ${selectedBusiness.BUSS_ID}:`,
      translationData
    );
    console.log(`Translation exists: ${exists}`);

    try {
      let result;

      // Always create a new translation first if it doesn't exist
      if (!exists) {
        console.log("Creating new translation since it doesn't exist");
        result = await businessService.createTranslation(
          selectedBusiness.BUSS_ID,
          translationData
        );

        if (!result) {
          toast.error(`Failed to create translation (${lang})`);
          return;
        }

        // Mark translation as existing now
        setTranslationExists((prev) => ({ ...prev, [lang]: true }));
        toast.success(`Translation (${lang}) created`);

        // Refresh translations
        await fetchTranslations(selectedBusiness.BUSS_ID);
      } else {
        // Update existing translation
        console.log("Updating existing translation");
        result = await businessService.updateTranslation(
          selectedBusiness.BUSS_ID,
          lang,
          translationData
        );

        if (result) {
          toast.success(`Translation (${lang}) updated`);
          // Refresh translations
          await fetchTranslations(selectedBusiness.BUSS_ID);
        } else {
          toast.error(`Failed to update translation (${lang})`);
        }
      }
    } catch (error) {
      console.error(`Error saving ${lang} translation:`, error);
      toast.error(
        `Failed to save translation (${lang}): ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleTranslationDelete = async (lang: "hi") => {
    if (!selectedBusiness?.BUSS_ID) return;
    const success = await businessService.deleteTranslation(
      selectedBusiness.BUSS_ID,
      lang
    );
    if (success) {
      toast.success(`Translation (${lang}) deleted`);
      fetchTranslations(selectedBusiness.BUSS_ID);
    } else {
      toast.error(`Failed to delete translation (${lang})`);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row: BusinessData) => row.BUSS_ID || 0,
      sortable: true,
      width: "80px",
    },
    {
      name: "Business",
      selector: (row: BusinessData) => row.BUSS_STREM,
      sortable: true,
    },
    {
      name: "Type",
      selector: (row: BusinessData) => row.BUSS_TYPE,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: BusinessData) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
            <Pencil size={15} className="text-green-500" />
          </button>
          <button
            onClick={() => handleDelete(row.BUSS_ID!)}
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
          title="Business"
          searchText={searchText}
          onSearchChange={setSearchText}
          addNewText="Add Business"
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
                  {showPanel === "add" ? "Add New Business" : "Edit Business"}
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
                {/* English Tab (main business form) */}
                {tab === "en" && (
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                      <span className="inline-block w-6 h-6 mr-2">🇬🇧</span>{" "}
                      English Content
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">
                          Business Name (English)
                        </label>
                        <input
                          type="text"
                          name="BUSS_STREM"
                          value={businessForm.BUSS_STREM}
                          onChange={handleBusinessChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Business Type (English)
                        </label>
                        <input
                          type="text"
                          name="BUSS_TYPE"
                          value={businessForm.BUSS_TYPE}
                          onChange={handleBusinessChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setShowPanel(null);
                            setSelectedBusiness(null);
                            setBusinessForm(defaultBusiness);
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
                          Business Name (Hindi)
                        </label>
                        <input
                          type="text"
                          value={translation.hi?.BUSS_STREM || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "BUSS_STREM",
                              e.target.value
                            )
                          }
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Business Type (Hindi)
                        </label>
                        <input
                          type="text"
                          value={translation.hi?.BUSS_TYPE || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "BUSS_TYPE",
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
                          checked={translation.hi?.BUSS_ACTIVE_YN === "Y"}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "BUSS_ACTIVE_YN",
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
                  Business Details
                </h2>
                <p className="text-gray-500 text-center">
                  Select a business to view details here.
                </p>
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full"
                >
                  Add New Business
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BusinessTable;
