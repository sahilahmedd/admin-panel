/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";
import ClientSideCustomEditor from "../clientside-editor";

interface ValidationErrors {
  ENVT_DESC?: string;
  ENVT_EXCERPT?: string;
  ENVT_DETAIL?: string;
  ENVT_CITY?: string;
  ENVT_ADDRESS?: string;
  ENVT_CONTACT_NO?: string;
  EVNT_FROM_DT?: string;
  EVNT_UPTO_DT?: string;
  EVET_ACTIVE_YN?: string;
  ENVT_CATE_ID?: string;
}

type Props = {
  title: string;
  onClose: () => void;
  onSubmit: () => void;
  newEvent: any;
  categories?: any[];
  setNewEvent: React.Dispatch<React.SetStateAction<any>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const EventModal = ({
  title,
  onClose,
  onSubmit,
  newEvent,
  setNewEvent,
  categories,
  handleChange,
}: Props) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    setEditorLoaded(true);
    setEditorData(newEvent.ENVT_DETAIL || "");
  }, []);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Event Name validation
    if (!newEvent.ENVT_DESC?.trim()) {
      newErrors.ENVT_DESC = "Event name is required";
      isValid = false;
    } else if (newEvent.ENVT_DESC.length > 100) {
      newErrors.ENVT_DESC = "Event name must be less than 100 characters";
      isValid = false;
    }

    // Short Description validation
    if (!newEvent.ENVT_EXCERPT?.trim()) {
      newErrors.ENVT_EXCERPT = "Short description is required";
      isValid = false;
    }

    // Details validation
    if (!newEvent.ENVT_DETAIL?.trim()) {
      newErrors.ENVT_DETAIL = "Details are required";
      isValid = false;
    }

    // City validation
    if (!newEvent.ENVT_CITY?.trim()) {
      newErrors.ENVT_CITY = "City is required";
      isValid = false;
    }

    // Address validation
    if (!newEvent.ENVT_ADDRESS?.trim()) {
      newErrors.ENVT_ADDRESS = "Address is required";
      isValid = false;
    }

    // Contact validation
    if (!newEvent.ENVT_CONTACT_NO?.trim()) {
      newErrors.ENVT_CONTACT_NO = "Contact number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(newEvent.ENVT_CONTACT_NO.trim())) {
      newErrors.ENVT_CONTACT_NO = "Contact number must be 10 digits";
      isValid = false;
    }

    // Date validations
    const fromDate = new Date(newEvent.EVNT_FROM_DT);
    const uptoDate = new Date(newEvent.EVNT_UPTO_DT);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!newEvent.EVNT_FROM_DT) {
      newErrors.EVNT_FROM_DT = "From date is required";
      isValid = false;
    } else if (fromDate < today) {
      newErrors.EVNT_FROM_DT = "From date cannot be in the past";
      isValid = false;
    }

    if (!newEvent.EVNT_UPTO_DT) {
      newErrors.EVNT_UPTO_DT = "Upto date is required";
      isValid = false;
    } else if (uptoDate < fromDate) {
      newErrors.EVNT_UPTO_DT = "Upto date must be after from date";
      isValid = false;
    }

    // Active status validation
    if (!newEvent.EVET_ACTIVE_YN?.trim()) {
      newErrors.EVET_ACTIVE_YN = "Active status is required";
      isValid = false;
    } else if (!/^[YN]$/i.test(newEvent.EVET_ACTIVE_YN)) {
      newErrors.EVET_ACTIVE_YN = "Must be Y or N";
      isValid = false;
    }

    // Category validation
    if (!newEvent.ENVT_CATE_ID || newEvent.ENVT_CATE_ID === "#") {
      newErrors.ENVT_CATE_ID = "Category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit();
    } else {
      toast.error("Please fix the errors before submitting");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>

        {/* Event Name */}
        <div className="mb-3">
          <label className="block font-medium mb-1">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="ENVT_DESC"
            value={newEvent.ENVT_DESC}
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
            value={newEvent.ENVT_EXCERPT}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.ENVT_EXCERPT ? "border-red-500" : ""
            }`}
          />
          {errors.ENVT_EXCERPT && (
            <p className="text-red-500 text-sm mt-1">{errors.ENVT_EXCERPT}</p>
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
                data={editorData}
                onChange={(html: string) =>
                  setNewEvent((prev) => ({ ...prev, ENVT_DETAIL: html }))
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
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
              {newEvent.ENVT_BANNER_IMAGE && (
                <button
                  type="button"
                  onClick={() =>
                    setNewEvent((prev) => ({ ...prev, ENVT_BANNER_IMAGE: "" }))
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

            {newEvent.ENVT_BANNER_IMAGE && (
              <div className="relative w-full border rounded-lg overflow-hidden bg-gray-50">
                <div className="aspect-[16/9] relative">
                  <Image
                    src={newEvent.ENVT_BANNER_IMAGE}
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

            {!newEvent.ENVT_BANNER_IMAGE && (
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
                  onChange={handleChange}
                  className="hidden"
                />
              </label>
            </div>

            {newEvent.ENVT_GALLERY_IMAGES &&
            (Array.isArray(newEvent.ENVT_GALLERY_IMAGES)
              ? newEvent.ENVT_GALLERY_IMAGES.length > 0
              : newEvent.ENVT_GALLERY_IMAGES.trim() !== "") ? (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {(Array.isArray(newEvent.ENVT_GALLERY_IMAGES)
                    ? newEvent.ENVT_GALLERY_IMAGES
                    : newEvent.ENVT_GALLERY_IMAGES.split(",")
                  ).map((url: string, index: number) => (
                    <div
                      key={index}
                      className="group relative aspect-square border rounded-lg overflow-hidden bg-white"
                    >
                      <Image
                        src={url.trim()}
                        alt={`Gallery Image ${index + 1}`}
                        fill
                        className="object-cover transition-opacity group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => {
                            const updatedImages = Array.isArray(
                              newEvent.ENVT_GALLERY_IMAGES
                            )
                              ? newEvent.ENVT_GALLERY_IMAGES.filter(
                                  (_, i) => i !== index
                                )
                              : newEvent.ENVT_GALLERY_IMAGES.split(",")
                                  .filter((_, i) => i !== index)
                                  .join(",");
                            setNewEvent((prev) => ({
                              ...prev,
                              ENVT_GALLERY_IMAGES: updatedImages,
                            }));
                          }}
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
                  {Array.isArray(newEvent.ENVT_GALLERY_IMAGES)
                    ? newEvent.ENVT_GALLERY_IMAGES.length
                    : newEvent.ENVT_GALLERY_IMAGES.split(",").length}{" "}
                  images selected. Hover and click the trash icon to remove an
                  image.
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
            value={newEvent.ENVT_CITY}
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
            value={newEvent.ENVT_ADDRESS}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded ${
              errors.ENVT_ADDRESS ? "border-red-500" : ""
            }`}
          />
          {errors.ENVT_ADDRESS && (
            <p className="text-red-500 text-sm mt-1">{errors.ENVT_ADDRESS}</p>
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
            value={newEvent.ENVT_CONTACT_NO}
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
              value={newEvent.EVNT_FROM_DT}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${
                errors.EVNT_FROM_DT ? "border-red-500" : ""
              }`}
            />
            {errors.EVNT_FROM_DT && (
              <p className="text-red-500 text-sm mt-1">{errors.EVNT_FROM_DT}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">
              Upto Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="EVNT_UPTO_DT"
              value={newEvent.EVNT_UPTO_DT}
              onChange={handleChange}
              className={`w-full border px-3 py-2 rounded ${
                errors.EVNT_UPTO_DT ? "border-red-500" : ""
              }`}
            />
            {errors.EVNT_UPTO_DT && (
              <p className="text-red-500 text-sm mt-1">{errors.EVNT_UPTO_DT}</p>
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
            value={newEvent.EVET_ACTIVE_YN}
            onChange={handleChange}
            className={`w-full border px-3 py-2 rounded uppercase ${
              errors.EVET_ACTIVE_YN ? "border-red-500" : ""
            }`}
            maxLength={1}
          />
          {errors.EVET_ACTIVE_YN && (
            <p className="text-red-500 text-sm mt-1">{errors.EVET_ACTIVE_YN}</p>
          )}
        </div>

        {/* Created By */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Created By (User ID)</label>
          <input
            type="number"
            name="EVET_CREATED_BY"
            value={newEvent.EVET_CREATED_BY}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Category Selection */}
        <div className="flex gap-10">
          <div className="mb-3">
            <label htmlFor="ENVT_CATE_ID" className="block font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="ENVT_CATE_ID"
              value={newEvent.ENVT_CATE_ID}
              onChange={(e) =>
                setNewEvent((prev) => ({
                  ...prev,
                  ENVT_CATE_ID: parseInt(e.target.value, 10),
                }))
              }
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
              <p className="text-red-500 text-sm mt-1">{errors.ENVT_CATE_ID}</p>
            )}
          </div>

          {newEvent.ENVT_CATE_ID == 1 && (
            <div className="mb-3">
              <label
                htmlFor="ENVT_CATE_CATE_ID"
                className="block font-medium mb-1"
              >
                Sub Category
              </label>
              <select
                name="ENVT_CATE_CATE_ID"
                value={newEvent.ENVT_CATE_CATE_ID}
                onChange={(e) =>
                  setNewEvent((prev) => ({
                    ...prev,
                    ENVT_CATE_CATE_ID: parseInt(e.target.value, 10),
                  }))
                }
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

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
