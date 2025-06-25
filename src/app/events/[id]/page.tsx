"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ClientSideCustomEditor from "@/components/clientside-editor";
import Breadcrumbs from "@/components/Breadcrumbs";
import eventService, {
  EventData,
  EventTranslation,
} from "@/services/eventService";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import EventTranslationsManager from "@/components/events/EventTranslationsManager";
import CustomEditor from "@/components/custom-editor";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";
import { ColorRing } from "react-loader-spinner";

interface ValidationErrors {
  ENVT_DESC?: string;
  ENVT_CATE_ID?: string;
  ENVT_EXCERPT?: string;
  ENVT_DETAIL?: string;
  ENVT_ADDRESS?: string;
  ENVT_CITY?: string;
  ENVT_BANNER_IMAGE?: string;
  ENVT_GALLERY_IMAGES?: string;
  ENVT_CONTACT_NO?: string;
  EVNT_FROM_DT?: string;
  EVNT_UPTO_DT?: string;
  EVET_ACTIVE_YN?: string;
  categoryId?: string;
  translations?: {
    en?: {
      description?: string;
      excerpt?: string;
      detail?: string;
      address?: string;
      city?: string;
    };
    hi?: {
      description?: string;
      excerpt?: string;
      detail?: string;
      address?: string;
      city?: string;
    };
  };
  bannerImage?: string;
  galleryImages?: string;
  contactNo?: string;
  fromDate?: string;
  uptoDate?: string;
}

interface Category {
  CATE_ID: number;
  CATE_DESC: string;
}

const defaultEvent = {
  ENVT_DESC: "",
  ENVT_CITY: "",
  EVNT_FROM_DT: "",
  EVNT_UPTO_DT: "",
  EVET_CREATED_BY: 1,
};

const defaultTranslation = {
  ENVT_DESC: "",
  ENVT_ACTIVE_YN: "Y",
  ENVT_CREATED_BY: 1,
  lang_code: "hi",
};

const EditEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [tab, setTab] = useState<"en" | "hi">("en");
  const [showHindiTab, setShowHindiTab] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [eventForm, setEventForm] = useState<EventData>(defaultEvent);
  const [translation, setTranslation] = useState<{ [lang: string]: any }>({
    en: defaultTranslation,
    hi: defaultTranslation,
  });
  const [translationExists, setTranslationExists] = useState<{
    [lang: string]: boolean;
  }>({ en: false, hi: false });

  useEffect(() => {
    setEditorLoaded(true);
    fetchCategories();
    if (eventId && eventId !== "new") {
      fetchEvent();
    } else {
      setInitialLoading(false);
      setShowHindiTab(false);
    }
  }, [eventId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://node2-plum.vercel.app/api/admin/categories"
      );
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchEvent = async () => {
    setInitialLoading(true);
    try {
      const data = await eventService.getEventById(eventId);
      if (data) {
        setEventForm({
          ENVT_DESC: data.ENVT_DESC || "",
          ENVT_CITY: data.ENVT_CITY || "",
          EVNT_FROM_DT: data.EVNT_FROM_DT || "",
          EVNT_UPTO_DT: data.EVNT_UPTO_DT || "",
          EVET_CREATED_BY: data.EVET_CREATED_BY || 1,
        });
        await fetchTranslations(data.ENVT_ID!);
        setShowHindiTab(true);
      }
    } catch (error) {
      toast.error("Failed to fetch event data");
      router.push("/events");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchTranslations = async (eventId: number) => {
    // English (default)
    setTranslation((prev) => ({
      ...prev,
      en: {
        ENVT_DESC: eventForm.ENVT_DESC,
        ENVT_ACTIVE_YN: "Y",
        ENVT_CREATED_BY: eventForm.EVET_CREATED_BY || 1,
        lang_code: "en",
      },
    }));
    setTranslationExists((prev) => ({ ...prev, en: true }));

    // Hindi
    try {
      const hiData = await eventService.getTranslation(eventId, "hi");
      if (hiData && hiData.ENVT_DESC) {
        setTranslation((prev) => ({
          ...prev,
          hi: {
            ENVT_DESC: hiData.ENVT_DESC || "",
            ENVT_ACTIVE_YN: hiData.ENVT_ACTIVE_YN || "Y",
            ENVT_CREATED_BY: hiData.ENVT_CREATED_BY || 1,
            lang_code: hiData.lang_code || "hi",
          },
        }));
        setTranslationExists((prev) => ({ ...prev, hi: true }));
        setTab("hi");
        return true;
      } else {
        setTranslation((prev) => ({
          ...prev,
          hi: defaultTranslation,
        }));
        setTranslationExists((prev) => ({ ...prev, hi: false }));
        setTab("en");
        return false;
      }
    } catch (error) {
      setTranslation((prev) => ({ ...prev, hi: defaultTranslation }));
      setTranslationExists((prev) => ({ ...prev, hi: false }));
      setTab("en");
      return false;
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const response = await fetch("/api/uploadImage", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.status === "success" && data.url) {
      return `https://rangrezsamaj.kunxite.com/${data.url}`;
    } else {
      throw new Error("Upload failed");
    }
  };

  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventForm((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!(eventForm.ENVT_DESC || "").trim()) {
        toast.error("Event description cannot be empty");
        setLoading(false);
        return;
      }
      if (!(eventForm.ENVT_CITY || "").trim()) {
        toast.error("Event city cannot be empty");
        setLoading(false);
        return;
      }
      if (!(eventForm.EVNT_FROM_DT || "").trim()) {
        toast.error("Event from date cannot be empty");
        setLoading(false);
        return;
      }
      let result;
      if (eventId && eventId !== "new") {
        result = await eventService.updateEvent(eventId, eventForm);
      } else {
        result = await eventService.createEvent(eventForm);
      }
      if (result && result.ENVT_ID) {
        toast.success(`Event ${eventId !== "new" ? "updated" : "added"}`);
        setShowHindiTab(true);
        setTab("hi");
        if (!eventId || eventId === "new") {
          router.replace(`/events/${result.ENVT_ID}`);
        } else {
          await fetchTranslations(result.ENVT_ID);
        }
      } else {
        toast.error("Failed to save event");
      }
    } catch (error) {
      toast.error("Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationSave = async (lang: "hi") => {
    if (!eventId || eventId === "new") return;
    if (!translation[lang].ENVT_DESC.trim()) {
      toast.error("Hindi event description cannot be empty");
      return;
    }
    const exists = translationExists[lang];
    const translationData: EventTranslation = {
      ENVT_DESC: translation[lang].ENVT_DESC,
      ENVT_ACTIVE_YN: translation[lang].ENVT_ACTIVE_YN || "Y",
      ENVT_CREATED_BY: translation[lang].ENVT_CREATED_BY || 1,
      lang_code: lang,
    };
    try {
      let result;
      if (!exists) {
        result = await eventService.createTranslation(eventId, translationData);
        if (!result) {
          toast.error(`Failed to create translation (${lang})`);
          return;
        }
        setTranslationExists((prev) => ({ ...prev, [lang]: true }));
        toast.success(`Translation (${lang}) created`);
        await fetchTranslations(Number(eventId));
      } else {
        result = await eventService.updateTranslation(
          eventId,
          lang,
          translationData
        );
        if (result) {
          toast.success(`Translation (${lang}) updated`);
          await fetchTranslations(Number(eventId));
        } else {
          toast.error(`Failed to update translation (${lang})`);
        }
      }
    } catch (error) {
      toast.error(`Failed to save translation (${lang})`);
    }
  };

  const handleTranslationDelete = async (lang: "hi") => {
    if (!eventId || eventId === "new") return;
    const success = await eventService.deleteTranslation(eventId, lang);
    if (success) {
      toast.success(`Translation (${lang}) deleted`);
      fetchTranslations(Number(eventId));
    } else {
      toast.error(`Failed to delete translation (${lang})`);
    }
  };

  if (initialLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {eventId && eventId !== "new" ? "Edit Event" : "Add New Event"}
      </h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Edit the event details and translations. Use the tabs to switch between
        languages. All fields marked with * are required.
      </p>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setTab("en")}
            className={`$${
              tab === "en"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <span className="inline-block w-5 h-5 mr-2">🇬🇧</span> English
          </button>
          {showHindiTab && (
            <button
              type="button"
              onClick={() => setTab("hi")}
              className={`$${
                tab === "hi"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <span className="inline-block w-5 h-5 mr-2">🇮🇳</span> Hindi
            </button>
          )}
        </nav>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {tab === "en" && (
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="text-2xl font-semibold mb-4 text-blue-800 flex items-center">
              <span className="inline-block w-6 h-6 mr-2">🇬🇧</span> English
              Content
            </h3>
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Event Description *
              </label>
              <textarea
                name="ENVT_DESC"
                value={eventForm.ENVT_DESC}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Event City *</label>
              <input
                type="text"
                name="ENVT_CITY"
                value={eventForm.ENVT_CITY}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Event From Date *
              </label>
              <input
                type="date"
                name="EVNT_FROM_DT"
                value={eventForm.EVNT_FROM_DT}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="mb-3">
              <label className="block font-medium mb-1">Event Upto Date</label>
              <input
                type="date"
                name="EVNT_UPTO_DT"
                value={eventForm.EVNT_UPTO_DT}
                onChange={handleEventChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setEventForm(defaultEvent);
                  setTranslation({
                    en: defaultTranslation,
                    hi: defaultTranslation,
                  });
                  setTranslationExists({ en: false, hi: false });
                  setTab("en");
                  setShowHindiTab(false);
                  if (eventId && eventId !== "new") router.push("/events");
                }}
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                disabled={loading}
              >
                {eventId && eventId !== "new" ? "Update" : "Add"}
              </button>
            </div>
          </div>
        )}
        {tab === "hi" && showHindiTab && (
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="text-2xl font-semibold mb-4 text-green-800 flex items-center">
              <span className="inline-block w-6 h-6 mr-2">🇮🇳</span> Hindi
              Translation
            </h3>
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Event Description (Hindi) *
              </label>
              <textarea
                value={translation.hi?.ENVT_DESC || ""}
                onChange={(e) =>
                  handleTranslationChange("hi", "ENVT_DESC", e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleTranslationSave("hi")}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {translationExists.hi ? "Update" : "Add"} Hindi
              </button>
              {translationExists.hi && (
                <button
                  type="button"
                  onClick={() => handleTranslationDelete("hi")}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Delete Hindi
                </button>
              )}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditEventPage;
