"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ClientSideCustomEditor from "@/components/clientside-editor";
import Breadcrumbs from "@/components/Breadcrumbs";
import eventService, {
  EventData,
  UpdateEventData,
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

const EditEventPage = () => {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  const [categories, setCategories] = useState<Category[]>([]);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState<"en" | "hi">("en");
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);

  const [eventData, setEventData] = useState<any>({});
  const [eventDataHi, setEventDataHi] = useState<any>({});

  useEffect(() => {
    setEditorLoaded(true);
    fetchCategories();
    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    if (
      eventData.ENVT_GALLERY_IMAGES &&
      Array.isArray(eventData.ENVT_GALLERY_IMAGES)
    ) {
      setGalleryImageUrls(eventData.ENVT_GALLERY_IMAGES);
    }
  }, [eventData.ENVT_GALLERY_IMAGES]);

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

  const fetchEventData = async () => {
    try {
      const data = await eventService.getEventById(eventId);
      if (data) {
        setEventData({
          ENVT_DESC: data.translations.en?.description || "",
          ENVT_EXCERPT: data.translations.en?.excerpt || "",
          ENVT_DETAIL: data.translations.en?.detail || "",
          ENVT_BANNER_IMAGE: data.bannerImage || "",
          ENVT_GALLERY_IMAGES: data.galleryImages
            ? data.galleryImages
                .split(",")
                .map((s: string) => s.trim())
                .filter(Boolean)
            : [],
          ENVT_CITY: data.translations.en?.city || "",
          ENVT_ADDRESS: data.translations.en?.address || "",
          ENVT_CONTACT_NO: data.contactNo || "",
          EVNT_FROM_DT: data.fromDate || "",
          EVNT_UPTO_DT: data.uptoDate || "",
          EVET_ACTIVE_YN: data.isActive ? "Y" : "N",
          ENVT_CATE_ID: data.categoryId,
          ENVT_CATE_CATE_ID: data.subCategoryId,
          EVET_CREATED_BY: data.createdBy,
        });
        setEventDataHi({
          ENVT_DESC: data.translations.hi?.description || "",
          ENVT_EXCERPT: data.translations.hi?.excerpt || "",
          ENVT_DETAIL: data.translations.hi?.detail || "",
          ENVT_CITY: data.translations.hi?.city || "",
          ENVT_ADDRESS: data.translations.hi?.address || "",
        });
      }
    } catch (error) {
      toast.error("Failed to fetch event data");
      router.push("/events");
    } finally {
      setInitialLoading(false);
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

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files) {
      try {
        if (name === "ENVT_GALLERY_IMAGES") {
          const uploadedUrls = await Promise.all(
            Array.from(files).map(uploadFile)
          );
          const combined = [...eventData.ENVT_GALLERY_IMAGES, ...uploadedUrls];
          setEventData({ ...eventData, ENVT_GALLERY_IMAGES: combined });
          setGalleryImageUrls(combined);
        } else if (name === "ENVT_BANNER_IMAGE" && files[0]) {
          const url = await uploadFile(files[0]);
          setEventData({ ...eventData, ENVT_BANNER_IMAGE: url });
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Image upload failed");
      }
    } else {
      if (currentTab === "hi") {
        setEventDataHi({
          ...eventDataHi,
          [name]: value,
        });
      } else {
        setEventData({
          ...eventData,
          [name]: type === "number" ? Number(value) || null : value,
        });
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;
    if (name === "ENVT_GALLERY_IMAGES") {
      try {
        const uploadedUrls = await Promise.all(
          Array.from(files).map(uploadFile)
        );
        const combined = [...eventData.ENVT_GALLERY_IMAGES, ...uploadedUrls];
        setEventData({ ...eventData, ENVT_GALLERY_IMAGES: combined });
        setGalleryImageUrls(combined);
      } catch (error) {
        toast.error("Gallery image upload failed");
      }
    } else if (name === "ENVT_BANNER_IMAGE" && files[0]) {
      try {
        const url = await uploadFile(files[0]);
        setEventData({ ...eventData, ENVT_BANNER_IMAGE: url });
      } catch (error) {
        toast.error("Banner image upload failed");
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;
    if (!eventData.ENVT_CATE_ID) {
      newErrors.ENVT_CATE_ID = "Category is required";
      isValid = false;
    }
    if (!eventData.ENVT_EXCERPT) {
      newErrors.ENVT_EXCERPT = "Excerpt is required";
      isValid = false;
    }
    if (!eventData.ENVT_DETAIL) {
      newErrors.ENVT_DETAIL = "Detail is required";
      isValid = false;
    }
    if (!eventData.ENVT_ADDRESS) {
      newErrors.ENVT_ADDRESS = "Address is required";
      isValid = false;
    }
    if (!eventData.ENVT_CITY) {
      newErrors.ENVT_CITY = "City is required";
      isValid = false;
    }
    if (!eventData.ENVT_BANNER_IMAGE) {
      newErrors.ENVT_BANNER_IMAGE = "Banner image is required";
      isValid = false;
    }
    if (!eventData.ENVT_CONTACT_NO) {
      newErrors.ENVT_CONTACT_NO = "Contact number is required";
      isValid = false;
    }
    if (!eventData.EVNT_FROM_DT) {
      newErrors.EVNT_FROM_DT = "From date is required";
      isValid = false;
    }
    if (!eventData.EVNT_UPTO_DT) {
      newErrors.EVNT_UPTO_DT = "Upto date is required";
      isValid = false;
    } else if (
      new Date(eventData.EVNT_UPTO_DT) < new Date(eventData.EVNT_FROM_DT)
    ) {
      newErrors.EVNT_UPTO_DT = "Upto date must be after from date";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }
    setLoading(true);
    try {
      // Prepare English payload
      const payloadEn: any = {
        ENVT_DESC: eventData.ENVT_DESC,
        ENVT_EXCERPT: eventData.ENVT_EXCERPT,
        ENVT_DETAIL: eventData.ENVT_DETAIL,
        ENVT_BANNER_IMAGE: eventData.ENVT_BANNER_IMAGE,
        ENVT_GALLERY_IMAGES: eventData.ENVT_GALLERY_IMAGES.join(","),
        ENVT_CONTACT_NO: eventData.ENVT_CONTACT_NO,
        ENVT_ADDRESS: eventData.ENVT_ADDRESS,
        ENVT_CITY: eventData.ENVT_CITY,
        EVNT_FROM_DT: eventData.EVNT_FROM_DT,
        EVNT_UPTO_DT: eventData.EVNT_UPTO_DT,
        ENVT_CATE_ID: Number(eventData.ENVT_CATE_ID),
        ENVT_CATE_CATE_ID:
          eventData.ENVT_CATE_CATE_ID && eventData.ENVT_CATE_CATE_ID !== "#"
            ? Number(eventData.ENVT_CATE_CATE_ID)
            : undefined,
        EVET_ACTIVE_YN: eventData.EVET_ACTIVE_YN,
        EVET_CREATED_BY: eventData.EVET_CREATED_BY,
        lang_code: "en",
      };
      Object.keys(payloadEn).forEach(
        (key) => payloadEn[key] === undefined && delete payloadEn[key]
      );
      const resultEn = await eventService.updateEvent(eventId, payloadEn);
      if (!resultEn) throw new Error("English event update failed");
      // Prepare Hindi payload
      const payloadHi: any = {
        ...payloadEn,
        ENVT_DESC: eventDataHi.ENVT_DESC,
        ENVT_EXCERPT: eventDataHi.ENVT_EXCERPT,
        ENVT_DETAIL: eventDataHi.ENVT_DETAIL,
        ENVT_CITY: eventDataHi.ENVT_CITY,
        ENVT_ADDRESS: eventDataHi.ENVT_ADDRESS,
        lang_code: "hi",
      };
      Object.keys(payloadHi).forEach(
        (key) => payloadHi[key] === undefined && delete payloadHi[key]
      );
      const resultHi = await eventService.updateEvent(eventId, payloadHi);
      if (!resultHi) throw new Error("Hindi event update failed");
      toast.success("Event updated successfully in both languages!");
      router.push("/events");
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    const updated = [...eventData.ENVT_GALLERY_IMAGES];
    updated.splice(index, 1);
    setEventData({ ...eventData, ENVT_GALLERY_IMAGES: updated });
    setGalleryImageUrls(updated);
  };

  if (initialLoading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="p-5 max-w-6xl mx-auto bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Edit Event
      </h1>
      <p className="text-sm text-gray-600 mb-6 text-center">
        Edit the event details and translations. Use the tabs to switch between
        languages. All fields marked with * are required.
      </p>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 justify-center" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setCurrentTab("en")}
            className={`$${
              currentTab === "en"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <span className="inline-block w-5 h-5 mr-2">🇬🇧</span> English
          </button>
          <button
            type="button"
            onClick={() => setCurrentTab("hi")}
            className={`$${
              currentTab === "hi"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <span className="inline-block w-5 h-5 mr-2">🇮🇳</span> Hindi
          </button>
        </nav>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentTab === "en" && (
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="text-2xl font-semibold mb-4 text-blue-800 flex items-center">
              <span className="inline-block w-6 h-6 mr-2">🇬🇧</span> English
              Content
            </h3>
            {/* Event Name */}
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Event Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ENVT_DESC"
                value={eventData.ENVT_DESC}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${
                  errors.ENVT_DESC ? "border-red-500" : ""
                }`}
              />
              {errors.ENVT_DESC && (
                <p className="text-red-500 text-sm mt-1">{errors.ENVT_DESC}</p>
              )}
            </div>
            {/* Short Description */}
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="ENVT_EXCERPT"
                value={eventData.ENVT_EXCERPT}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${
                  errors.ENVT_EXCERPT ? "border-red-500" : ""
                }`}
              />
              {errors.ENVT_EXCERPT && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ENVT_EXCERPT}
                </p>
              )}
            </div>
            {/* Details */}
            <div className="mb-3">
              <label className="block font-medium mb-2">
                Details <span className="text-red-500">*</span>
              </label>
              {editorLoaded && (
                <>
                  <ClientSideCustomEditor
                    data={eventData.ENVT_DETAIL || ""}
                    onChange={(html) =>
                      setEventData((prev: any) => ({
                        ...prev,
                        ENVT_DETAIL: html,
                      }))
                    }
                  />
                  {errors.ENVT_DETAIL && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.ENVT_DETAIL}
                    </p>
                  )}
                </>
              )}
            </div>
            {/* Banner Image Upload */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Banner Image</label>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Choose Banner Image
                    <input
                      type="file"
                      name="ENVT_BANNER_IMAGE"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  {eventData.ENVT_BANNER_IMAGE && (
                    <button
                      type="button"
                      onClick={() =>
                        setEventData((prev: any) => ({
                          ...prev,
                          ENVT_BANNER_IMAGE: "",
                        }))
                      }
                      className="ml-3 text-red-500 hover:text-red-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {eventData.ENVT_BANNER_IMAGE && (
                  <div className="relative w-full border rounded-lg overflow-hidden bg-gray-50">
                    <div className="aspect-[16/9] relative">
                      <Image
                        src={eventData.ENVT_BANNER_IMAGE}
                        alt="Banner Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-2 text-xs text-gray-500">
                      Banner image preview
                    </div>
                  </div>
                )}
                {!eventData.ENVT_BANNER_IMAGE && (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      No banner image selected
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* Gallery Image Upload */}
            <div className="mb-6">
              <label className="block font-medium mb-2">Gallery Images</label>
              <div className="flex flex-col space-y-3">
                <div className="flex items-center">
                  <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg border border-gray-300 flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10zM4 2a3 3 0 00-3 3v10a3 3 0 003 3h12a3 3 0 003-3V5a3 3 0 00-3-3H4z"
                        clipRule="evenodd"
                      />
                      <path d="M2 7h16M7 2v16" />
                    </svg>
                    Choose Gallery Images
                    <input
                      type="file"
                      name="ENVT_GALLERY_IMAGES"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
                {galleryImageUrls.length > 0 ? (
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {galleryImageUrls.map((url, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square border rounded-lg overflow-hidden bg-white"
                        >
                          <Image
                            src={url}
                            alt={`Gallery Image ${index + 1}`}
                            fill
                            className="object-cover transition-opacity group-hover:opacity-80"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(index)}
                              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                            Image {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      {galleryImageUrls.length} images selected. Hover and click
                      the trash icon to remove an image.
                    </p>
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      No gallery images selected
                    </p>
                    <p className="text-xs text-gray-400">
                      You can select multiple images
                    </p>
                  </div>
                )}
              </div>
            </div>
            {/* City */}
            <div className="mb-3">
              <label className="block font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ENVT_CITY"
                value={eventData.ENVT_CITY}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${
                  errors.ENVT_CITY ? "border-red-500" : ""
                }`}
              />
              {errors.ENVT_CITY && (
                <p className="text-red-500 text-sm mt-1">{errors.ENVT_CITY}</p>
              )}
            </div>
            {/* Address */}
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ENVT_ADDRESS"
                value={eventData.ENVT_ADDRESS}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${
                  errors.ENVT_ADDRESS ? "border-red-500" : ""
                }`}
              />
              {errors.ENVT_ADDRESS && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ENVT_ADDRESS}
                </p>
              )}
            </div>
            {/* Contact No */}
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Contact No <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ENVT_CONTACT_NO"
                value={eventData.ENVT_CONTACT_NO}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded ${
                  errors.ENVT_CONTACT_NO ? "border-red-500" : ""
                }`}
              />
              {errors.ENVT_CONTACT_NO && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ENVT_CONTACT_NO}
                </p>
              )}
            </div>
            {/* Event Dates */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block font-medium mb-1">
                  From Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="EVNT_FROM_DT"
                  value={eventData.EVNT_FROM_DT}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.EVNT_FROM_DT ? "border-red-500" : ""
                  }`}
                />
                {errors.EVNT_FROM_DT && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.EVNT_FROM_DT}
                  </p>
                )}
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Upto Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="EVNT_UPTO_DT"
                  value={eventData.EVNT_UPTO_DT}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 rounded ${
                    errors.EVNT_UPTO_DT ? "border-red-500" : ""
                  }`}
                />
                {errors.EVNT_UPTO_DT && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.EVNT_UPTO_DT}
                  </p>
                )}
              </div>
            </div>
            {/* Active Status */}
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Active? (Y/N) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="EVET_ACTIVE_YN"
                value={eventData.EVET_ACTIVE_YN}
                onChange={handleChange}
                className={`w-full border px-3 py-2 rounded uppercase ${
                  errors.EVET_ACTIVE_YN ? "border-red-500" : ""
                }`}
                maxLength={1}
              />
              {errors.EVET_ACTIVE_YN && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.EVET_ACTIVE_YN}
                </p>
              )}
            </div>
            {/* Created By */}
            <div className="mb-3">
              <label className="block font-medium mb-1">
                Created By (User ID)
              </label>
              <input
                type="number"
                name="EVET_CREATED_BY"
                value={eventData.EVET_CREATED_BY}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            {/* Category Selection */}
            <div className="flex gap-10">
              <div className="mb-3">
                <label
                  htmlFor="ENVT_CATE_ID"
                  className="block font-medium mb-1"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="ENVT_CATE_ID"
                  value={eventData.ENVT_CATE_ID}
                  onChange={handleChange}
                  className={`py-2 px-4 border shadow-sm rounded ${
                    errors.ENVT_CATE_ID ? "border-red-500" : "border-black"
                  }`}
                  title="Category"
                >
                  <option value="#" disabled>
                    Select a category
                  </option>
                  {categories?.map((cat) => (
                    <option key={cat.CATE_ID} value={cat.CATE_ID}>
                      {cat.CATE_DESC}
                    </option>
                  ))}
                </select>
                {errors.ENVT_CATE_ID && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.ENVT_CATE_ID}
                  </p>
                )}
              </div>
              {eventData.ENVT_CATE_ID == 1 && (
                <div className="mb-3">
                  <label
                    htmlFor="ENVT_CATE_CATE_ID"
                    className="block font-medium mb-1"
                  >
                    Sub Category
                  </label>
                  <select
                    name="ENVT_CATE_CATE_ID"
                    value={eventData.ENVT_CATE_CATE_ID}
                    onChange={handleChange}
                    className="py-2 px-4 border border-black shadow-sm rounded"
                    title="Category"
                  >
                    <option value="#" disabled>
                      Select a category
                    </option>
                    {categories?.map((cat) => (
                      <option key={cat.CATE_ID} value={cat.CATE_ID}>
                        {cat.CATE_DESC}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Hindi Tab */}
        {currentTab === "hi" && (
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
              <span className="inline-block w-6 h-6 mr-2">🇮🇳</span> Hindi
              Translation
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide Hindi translations for the event. Other settings will be
              automatically synced with the English version.
            </p>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="hi_description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description (Hindi)
                </label>
                {editorLoaded && (
                  <div className="mt-1">
                    <ClientSideCustomEditor
                      data={eventDataHi.ENVT_DETAIL || ""}
                      onChange={(html) =>
                        setEventDataHi((prev) => ({
                          ...prev,
                          ENVT_DETAIL: html,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="hi_excerpt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Excerpt (Hindi)
                </label>
                <input
                  type="text"
                  id="hi_excerpt"
                  name="ENVT_EXCERPT"
                  value={eventDataHi.ENVT_EXCERPT || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="hi_detail"
                  className="block text-sm font-medium text-gray-700"
                >
                  Detail (Hindi)
                </label>
                {editorLoaded && (
                  <div className="mt-1">
                    <ClientSideCustomEditor
                      data={eventDataHi.ENVT_DETAIL || ""}
                      onChange={(html) =>
                        setEventDataHi((prev) => ({
                          ...prev,
                          ENVT_DETAIL: html,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
              <div>
                <label
                  htmlFor="hi_address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address (Hindi)
                </label>
                <input
                  type="text"
                  id="hi_address"
                  name="ENVT_ADDRESS"
                  value={eventDataHi.ENVT_ADDRESS || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label
                  htmlFor="hi_city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City (Hindi)
                </label>
                <input
                  type="text"
                  id="hi_city"
                  name="ENVT_CITY"
                  value={eventDataHi.ENVT_CITY || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                />
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-800 mb-2">
                  Automatically Synced Fields
                </h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>
                    • Banner Image: {eventData.ENVT_BANNER_IMAGE || "None"}
                  </li>
                  <li>
                    • Gallery Images:{" "}
                    {eventData.ENVT_GALLERY_IMAGES.join(", ") || "None"}
                  </li>
                  <li>• City: {eventData.ENVT_CITY || "None"}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={loading}
          >
            {loading ? "Saving Changes..." : "Save All Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditEventPage;
