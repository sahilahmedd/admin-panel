/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ColorRing } from "react-loader-spinner";
import { Pencil, CircleX } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TableHeader from "@/components/TableHeader";
import cityService, { CityData, CityTranslation } from "@/services/cityService";

const defaultCity = {
  CITY_PIN_CODE: "",
  CITY_CODE: 0,
  CITY_NAME: "",
  CITY_DS_CODE: "",
  CITY_DS_NAME: "",
  CITY_ST_CODE: "",
  CITY_ST_NAME: "",
  CITY_CREATED_BY: 1,
};

const defaultTranslation = {
  CITY_NAME: "",
  CITY_DS_NAME: "",
  CITY_ST_NAME: "",
  CITY_ACTIVE_YN: "Y",
  CITY_CREATED_BY: 1,
  lang_code: "hi",
};

const CitiesTable = () => {
  const [data, setData] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showPanel, setShowPanel] = useState<"add" | "edit" | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [cityForm, setCityForm] = useState<CityData>(defaultCity);
  const [tab, setTab] = useState<"en" | "hi">("en");
  const [translation, setTranslation] = useState<{ [lang: string]: any }>({
    en: defaultTranslation,
    hi: defaultTranslation,
  });
  const [translationExists, setTranslationExists] = useState<{
    [lang: string]: boolean;
  }>({ en: false, hi: false });
  const [showHindiTab, setShowHindiTab] = useState(true);

  // Fetch cities data
  const getCities = async () => {
    setLoading(true);
    try {
      const result = await cityService.getAllCities();
      console.log("Cities data received in component:", result);
      setData(result);
      console.log("Cities data after setState:", result);
    } catch (err) {
      console.error("Error in getCities:", err);
      toast.error("Failed to fetch cities data");
    }
    setLoading(false);
  };

  useEffect(() => {
    getCities();
  }, []);

  // Handle Search
  const filteredData = data.filter(
    (item) =>
      item.CITY_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
      item.CITY_DS_NAME.toLowerCase().includes(searchText.toLowerCase()) ||
      item.CITY_ST_NAME.toLowerCase().includes(searchText.toLowerCase())
  );

  console.log("Data before filtering:", data);
  console.log("Filtered data for table:", filteredData);

  // Table actions
  const handleEdit = async (row: CityData) => {
    console.log("Editing city:", row);
    setSelectedCity(row);
    setCityForm({
      CITY_PIN_CODE: row.CITY_PIN_CODE,
      CITY_CODE: row.CITY_CODE,
      CITY_NAME: row.CITY_NAME,
      CITY_DS_CODE: row.CITY_DS_CODE,
      CITY_DS_NAME: row.CITY_DS_NAME,
      CITY_ST_CODE: row.CITY_ST_CODE,
      CITY_ST_NAME: row.CITY_ST_NAME,
      CITY_CREATED_BY: row.CITY_CREATED_BY || 1,
    });
    setShowPanel("edit");

    // Always show Hindi tab when editing
    setShowHindiTab(true);

    if (row.CITY_ID) {
      // Fetch translations and check if Hindi translation exists
      const hindiExists = await fetchTranslations(row.CITY_ID);

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
    console.log("handleAdd called - opening add city panel");
    setSelectedCity(null);
    setCityForm(defaultCity);
    setTranslation({ en: defaultTranslation, hi: defaultTranslation });
    setTranslationExists({ en: false, hi: false });
    setShowPanel("add");
    setTab("en");
    setShowHindiTab(false);
    console.log("Add city panel state updated:", {
      showPanel: "add",
      tab: "en",
      showHindiTab: false,
      cityForm: defaultCity,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this city?")) return;
    const success = await cityService.deleteCity(id);
    if (success) {
      toast.success("City deleted");
      getCities();
      setShowPanel(null);
    } else {
      toast.error("Failed to delete city");
    }
  };

  // Translation fetch
  const fetchTranslations = async (cityId: number) => {
    console.log(`Fetching translations for city ID: ${cityId}`);

    // Find the city by ID to get its English description
    const city = data.find((item) => item.CITY_ID === cityId);
    console.log("Found city:", city);

    // English (default)
    setTranslation((prev) => ({
      ...prev,
      en: {
        CITY_NAME: city?.CITY_NAME || "",
        CITY_DS_NAME: city?.CITY_DS_NAME || "",
        CITY_ST_NAME: city?.CITY_ST_NAME || "",
        CITY_ACTIVE_YN: "Y",
        CITY_CREATED_BY: city?.CITY_CREATED_BY || 1,
        lang_code: "en",
      },
    }));
    setTranslationExists((prev) => ({ ...prev, en: true }));

    // Hindi
    try {
      console.log(`Requesting Hindi translation for city ID: ${cityId}`);
      const hiData = await cityService.getTranslation(cityId, "hi");
      console.log("Hindi translation response:", hiData);

      if (hiData && hiData.CITY_NAME) {
        console.log("Setting Hindi translation data:", hiData);

        setTranslation((prev) => ({
          ...prev,
          hi: {
            CITY_NAME: hiData.CITY_NAME || "",
            CITY_DS_NAME: hiData.CITY_DS_NAME || "",
            CITY_ST_NAME: hiData.CITY_ST_NAME || "",
            CITY_ACTIVE_YN: hiData.CITY_ACTIVE_YN || "Y",
            CITY_CREATED_BY: hiData.CITY_CREATED_BY || 1,
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
            CITY_NAME: "",
            CITY_DS_NAME: "",
            CITY_ST_NAME: "",
            CITY_ACTIVE_YN: "Y",
            CITY_CREATED_BY: city?.CITY_CREATED_BY || 1,
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
          CITY_NAME: "",
          CITY_DS_NAME: "",
          CITY_ST_NAME: "",
          CITY_ACTIVE_YN: "Y",
          CITY_CREATED_BY: city?.CITY_CREATED_BY || 1,
          lang_code: "hi",
        },
      }));
      setTranslationExists((prev) => ({ ...prev, hi: false }));

      // Return false to indicate error fetching Hindi translation
      return false;
    }
  };

  // Form handlers
  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCityForm((prev) => ({
      ...prev,
      [name]: name === "CITY_CODE" ? Number(value) || 0 : value,
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
    if (!cityForm.CITY_NAME.trim()) {
      toast.error("City name cannot be empty");
      return;
    }

    console.log("Submitting city form:", cityForm);

    try {
      // Add new city
      const result = await cityService.createCity(cityForm);
      console.log("Create city result:", result);

      if (result && result.CITY_ID) {
        toast.success("City added");

        // Set the newly created city as selected
        setSelectedCity(result);

        // Show Hindi tab and switch to it
        setShowHindiTab(true);
        setTab("hi");

        // Update translations state for the new city
        await fetchTranslations(result.CITY_ID);

        // Refresh city list
        getCities();
      } else {
        toast.error("Failed to add city: No valid response from server");
        console.error("Invalid response from createCity:", result);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(
        `Failed to add city: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  const handleUpdate = async () => {
    if (!selectedCity?.CITY_ID) return;

    // Validate form data
    if (!cityForm.CITY_NAME.trim()) {
      toast.error("City name cannot be empty");
      return;
    }

    const result = await cityService.updateCity(selectedCity.CITY_ID, cityForm);
    if (result) {
      toast.success("City updated");
      getCities();
      setShowPanel(null);
    } else {
      toast.error("Failed to update city");
    }
  };

  // Translation submit
  const handleTranslationSave = async (lang: "hi") => {
    if (!selectedCity?.CITY_ID) return;

    // Validate translation data
    if (!translation[lang].CITY_NAME.trim()) {
      toast.error(
        `${lang === "hi" ? "Hindi" : "English"} city name cannot be empty`
      );
      return;
    }

    const exists = translationExists[lang];

    const translationData: CityTranslation = {
      CITY_NAME: translation[lang].CITY_NAME,
      CITY_DS_NAME: translation[lang].CITY_DS_NAME,
      CITY_ST_NAME: translation[lang].CITY_ST_NAME,
      CITY_ACTIVE_YN: translation[lang].CITY_ACTIVE_YN || "Y",
      CITY_CREATED_BY: translation[lang].CITY_CREATED_BY || 1,
      lang_code: lang,
    };

    console.log(
      `Saving ${lang} translation for city ID ${selectedCity.CITY_ID}:`,
      translationData
    );
    console.log(`Translation exists: ${exists}`);

    try {
      let result;

      // Always create a new translation first if it doesn't exist
      if (!exists) {
        console.log("Creating new translation since it doesn't exist");
        result = await cityService.createTranslation(
          selectedCity.CITY_ID,
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
        await fetchTranslations(selectedCity.CITY_ID);
      } else {
        // Update existing translation
        console.log("Updating existing translation");
        result = await cityService.updateTranslation(
          selectedCity.CITY_ID,
          lang,
          translationData
        );

        if (result) {
          toast.success(`Translation (${lang}) updated`);
          // Refresh translations
          await fetchTranslations(selectedCity.CITY_ID);
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
    if (!selectedCity?.CITY_ID) return;
    const success = await cityService.deleteTranslation(
      selectedCity.CITY_ID,
      lang
    );
    if (success) {
      toast.success(`Translation (${lang}) deleted`);
      fetchTranslations(selectedCity.CITY_ID);
    } else {
      toast.error(`Failed to delete translation (${lang})`);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row: CityData) => row.CITY_ID || 0,
      sortable: true,
      width: "80px",
    },
    {
      name: "City",
      selector: (row: CityData) => row.CITY_NAME,
      sortable: true,
    },
    {
      name: "District",
      selector: (row: CityData) => row.CITY_DS_NAME,
      sortable: true,
    },
    {
      name: "State",
      selector: (row: CityData) => row.CITY_ST_NAME,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: CityData) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
            <Pencil size={15} className="text-green-500" />
          </button>
          <button
            onClick={() => handleDelete(row.CITY_ID!)}
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
          title="Cities"
          searchText={searchText}
          onSearchChange={setSearchText}
          addNewText="Add City"
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
                  {showPanel === "add" ? "Add New City" : "Edit City"}
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
                {/* English Tab (main city form) */}
                {tab === "en" && (
                  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                    <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
                      <span className="inline-block w-6 h-6 mr-2">🇬🇧</span>{" "}
                      English Content
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium">
                          City Name (English)
                        </label>
                        <input
                          type="text"
                          name="CITY_NAME"
                          value={cityForm.CITY_NAME}
                          onChange={handleCityChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          City Code
                        </label>
                        <input
                          type="number"
                          name="CITY_CODE"
                          value={cityForm.CITY_CODE}
                          onChange={handleCityChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="CITY_PIN_CODE"
                          value={cityForm.CITY_PIN_CODE}
                          onChange={handleCityChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          District Name (English)
                        </label>
                        <input
                          type="text"
                          name="CITY_DS_NAME"
                          value={cityForm.CITY_DS_NAME}
                          onChange={handleCityChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          District Code
                        </label>
                        <input
                          type="text"
                          name="CITY_DS_CODE"
                          value={cityForm.CITY_DS_CODE}
                          onChange={handleCityChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          State Name (English)
                        </label>
                        <input
                          type="text"
                          name="CITY_ST_NAME"
                          value={cityForm.CITY_ST_NAME}
                          onChange={handleCityChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          State Code
                        </label>
                        <input
                          type="text"
                          name="CITY_ST_CODE"
                          value={cityForm.CITY_ST_CODE}
                          onChange={handleCityChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setShowPanel(null);
                            setSelectedCity(null);
                            setCityForm(defaultCity);
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
                          City Name (Hindi)
                        </label>
                        <input
                          type="text"
                          value={translation.hi?.CITY_NAME || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "CITY_NAME",
                              e.target.value
                            )
                          }
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          District Name (Hindi)
                        </label>
                        <input
                          type="text"
                          value={translation.hi?.CITY_DS_NAME || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "CITY_DS_NAME",
                              e.target.value
                            )
                          }
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">
                          State Name (Hindi)
                        </label>
                        <input
                          type="text"
                          value={translation.hi?.CITY_ST_NAME || ""}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "CITY_ST_NAME",
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
                          checked={translation.hi?.CITY_ACTIVE_YN === "Y"}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "CITY_ACTIVE_YN",
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
                  City Details
                </h2>
                <p className="text-gray-500 text-center">
                  Select a city to view details here.
                </p>
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full"
                >
                  Add New City
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CitiesTable;
