/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ColorRing } from "react-loader-spinner";
import { Pencil, CircleX } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import TableHeader from "@/components/TableHeader";
import streamsService, {
  StreamData,
  StreamTranslation,
} from "@/services/streamsService";

const defaultStream = {
  STREAM_NAME: "",
  STREAM_CREATED_BY: 1,
};

const defaultTranslation = {
  STREAM_NAME: "",
  STREAM_ACTIVE_YN: "Y",
  STREAM_CREATED_BY: 1,
  lang_code: "hi",
};

const StreamTable = () => {
  const [data, setData] = useState<StreamData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showPanel, setShowPanel] = useState<"add" | "edit" | null>(null);
  const [selectedStream, setSelectedStream] = useState<StreamData | null>(null);
  const [streamForm, setStreamForm] = useState<StreamData>(defaultStream);
  const [tab, setTab] = useState<"en" | "hi">("en");
  const [translation, setTranslation] = useState<{ [lang: string]: any }>({
    en: defaultTranslation,
    hi: defaultTranslation,
  });
  const [translationExists, setTranslationExists] = useState<{
    [lang: string]: boolean;
  }>({ en: false, hi: false });
  const [showHindiTab, setShowHindiTab] = useState(true);

  // Fetch streams data
  const getStreams = async () => {
    setLoading(true);
    try {
      const result = await streamsService.getAllStreams();
      console.log("Streams data received in component:", result);
      setData(result);
      console.log("Streams data after setState:", result);
    } catch (err) {
      console.error("Error in getStreams:", err);
      toast.error("Failed to fetch streams data");
    }
    setLoading(false);
  };

  useEffect(() => {
    getStreams();
  }, []);

  // Handle Search
  const filteredData = data.filter((item) =>
    item.STREAM_NAME.toLowerCase().includes(searchText.toLowerCase())
  );

  console.log("Data before filtering:", data);
  console.log("Filtered data for table:", filteredData);

  // Table actions
  const handleEdit = async (row: StreamData) => {
    setSelectedStream(row);
    setStreamForm({
      STREAM_NAME: row.STREAM_NAME,
      STREAM_CREATED_BY: row.STREAM_CREATED_BY || 1,
    });
    setShowPanel("edit");
    setShowHindiTab(true);
    if (row.STREAM_ID) {
      await fetchTranslations(row.STREAM_ID);
    }
  };

  const handleAdd = () => {
    setSelectedStream(null);
    setStreamForm(defaultStream);
    setTranslation({ en: defaultTranslation, hi: defaultTranslation });
    setTranslationExists({ en: false, hi: false });
    setShowPanel("add");
    setTab("en");
    setShowHindiTab(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this stream?")) return;
    const success = await streamsService.deleteStream(id);
    if (success) {
      toast.success("Stream deleted");
      getStreams();
      setShowPanel(null);
    } else {
      toast.error("Failed to delete stream");
    }
  };

  // Translation fetch
  const fetchTranslations = async (streamId: number) => {
    console.log(`Fetching translations for stream ID: ${streamId}`);

    // Find the stream by ID to get its English description
    const stream = data.find((item) => item.STREAM_ID === streamId);
    console.log("Found stream:", stream);

    // English (default)
    setTranslation((prev) => ({
      ...prev,
      en: {
        STREAM_NAME: stream?.STREAM_NAME || "",
        STREAM_ACTIVE_YN: "Y",
        STREAM_CREATED_BY: stream?.STREAM_CREATED_BY || 1,
        lang_code: "en",
      },
    }));
    setTranslationExists((prev) => ({ ...prev, en: true }));

    // Hindi
    try {
      console.log(`Requesting Hindi translation for stream ID: ${streamId}`);
      const hiData = await streamsService.getTranslation(streamId, "hi");
      console.log("Hindi translation response:", hiData);

      if (hiData) {
        console.log("Setting Hindi translation data:", hiData);

        setTranslation((prev) => ({
          ...prev,
          hi: {
            STREAM_NAME: hiData.STREAM_NAME || "",
            STREAM_ACTIVE_YN: hiData.STREAM_ACTIVE_YN || "Y",
            STREAM_CREATED_BY: hiData.STREAM_CREATED_BY || 1,
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
  const handleStreamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStreamForm((prev) => ({
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
    if (!streamForm.STREAM_NAME.trim()) {
      toast.error("Stream name cannot be empty");
      return;
    }

    // Add new stream
    const result = await streamsService.createStream(streamForm);
    if (result) {
      toast.success("Stream added");
      // Set the newly created stream as selected
      setSelectedStream(result);
      // Show Hindi tab and switch to it
      setShowHindiTab(true);
      setTab("hi");
      // Update translations state for the new stream
      if (result.STREAM_ID) {
        await fetchTranslations(result.STREAM_ID);
      }
      // Refresh stream list
      getStreams();
    } else {
      toast.error("Failed to add stream");
    }
  };

  const handleUpdate = async () => {
    if (!selectedStream?.STREAM_ID) return;

    // Validate form data
    if (!streamForm.STREAM_NAME.trim()) {
      toast.error("Stream name cannot be empty");
      return;
    }

    const result = await streamsService.updateStream(
      selectedStream.STREAM_ID,
      streamForm
    );
    if (result) {
      toast.success("Stream updated");
      getStreams();
      setShowPanel(null);
    } else {
      toast.error("Failed to update stream");
    }
  };

  // Translation submit
  const handleTranslationSave = async (lang: "hi") => {
    if (!selectedStream?.STREAM_ID) return;

    // Validate translation data
    if (!translation[lang].STREAM_NAME.trim()) {
      toast.error(
        `${lang === "hi" ? "Hindi" : "English"} name cannot be empty`
      );
      return;
    }

    const exists = translationExists[lang];

    const translationData: StreamTranslation = {
      STREAM_NAME: translation[lang].STREAM_NAME,
      STREAM_ACTIVE_YN: translation[lang].STREAM_ACTIVE_YN,
      STREAM_CREATED_BY: translation[lang].STREAM_CREATED_BY,
      lang_code: lang,
    };

    let result;
    if (exists) {
      result = await streamsService.updateTranslation(
        selectedStream.STREAM_ID,
        lang,
        translationData
      );
    } else {
      result = await streamsService.createTranslation(
        selectedStream.STREAM_ID,
        translationData
      );
    }

    if (result) {
      toast.success(`Translation (${lang}) saved`);

      // If this is a new Hindi translation (not an update), reset the form
      if (!exists && lang === "hi") {
        // Reset form
        setShowPanel(null);
        setSelectedStream(null);
        setStreamForm(defaultStream);
        setTranslation({
          en: defaultTranslation,
          hi: defaultTranslation,
        });
        setTranslationExists({ en: false, hi: false });
        setShowHindiTab(true);

        // Refresh the stream list
        getStreams();
        return;
      }

      // Otherwise just update translations
      fetchTranslations(selectedStream.STREAM_ID);
    } else {
      toast.error(`Failed to save translation (${lang})`);
    }
  };

  const handleTranslationDelete = async (lang: "hi") => {
    if (!selectedStream?.STREAM_ID) return;
    const success = await streamsService.deleteTranslation(
      selectedStream.STREAM_ID,
      lang
    );
    if (success) {
      toast.success(`Translation (${lang}) deleted`);
      fetchTranslations(selectedStream.STREAM_ID);
    } else {
      toast.error(`Failed to delete translation (${lang})`);
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row: StreamData) => row.STREAM_ID || 0,
      sortable: true,
      width: "80px",
    },
    {
      name: "Name",
      selector: (row: StreamData) => row.STREAM_NAME,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row: StreamData) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
            <Pencil size={15} className="text-green-500" />
          </button>
          <button
            onClick={() => handleDelete(row.STREAM_ID!)}
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
          title="Streams"
          searchText={searchText}
          onSearchChange={setSearchText}
          addNewLink="#"
          addNewText="Add Stream"
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
                  {showPanel === "add" ? "Add New Stream" : "Edit Stream"}
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
                {/* English Tab (main stream form) */}
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
                          name="STREAM_NAME"
                          value={streamForm.STREAM_NAME}
                          onChange={handleStreamChange}
                          className="w-full border px-3 py-2 rounded"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => {
                            setShowPanel(null);
                            setSelectedStream(null);
                            setStreamForm(defaultStream);
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
                          value={translation.hi.STREAM_NAME}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "STREAM_NAME",
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
                          checked={translation.hi.STREAM_ACTIVE_YN === "Y"}
                          onChange={(e) =>
                            handleTranslationChange(
                              "hi",
                              "STREAM_ACTIVE_YN",
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
                  Stream Details
                </h2>
                <p className="text-gray-500 text-center">
                  Select a stream to view details here.
                </p>
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 w-full"
                >
                  Add New Stream
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StreamTable;
