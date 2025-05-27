/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import ClientSideCustomEditor from "../clientside-editor";

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
  const [eventID, setEventID] = useState();

  useEffect(() => {
    setEditorLoaded(true);
    setEditorData(newEvent.ENVT_DETAIL || "");
    // console.log("Change: ", setNewEvent);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>

        {/* Description */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Event Name</label>
          <input
            type="text"
            name="ENVT_DESC"
            value={newEvent.ENVT_DESC}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Excerpt */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Short Description</label>
          <textarea
            name="ENVT_EXCERPT"
            value={newEvent.ENVT_EXCERPT}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Details */}
        {/* <div className="mb-3">
          <label className="block font-medium mb-1">Details</label>
          <textarea
            name="ENVT_DETAIL"
            value={newEvent.ENVT_DETAIL}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div> */}
        <div className="mb-3">
          <label className="block font-medium mb-2">Details</label>
          {editorLoaded && (
            <ClientSideCustomEditor
              data={editorData}
              onChange={(html: string) =>
                setNewEvent((prev) => ({ ...prev, ENVT_DETAIL: html }))
              }
            />
          )}
        </div>

        {/* Banner Image Upload */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Banner Image</label>
          <input
            type="file"
            name="ENVT_BANNER_IMAGE"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
          {newEvent.ENVT_BANNER_IMAGE && (
            <div className="mt-2">
              <Image
                src={newEvent.ENVT_BANNER_IMAGE}
                alt="Banner Preview"
                width={200}
                height={100}
                className="rounded"
              />
            </div>
          )}
        </div>

        {/* Gallery Image Upload */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Gallery Images</label>
          <input
            type="file"
            name="ENVT_GALLERY_IMAGES"
            accept="image/*"
            multiple
            onChange={handleChange}
            className="w-full"
          />
          {newEvent.ENVT_GALLERY_IMAGES &&
            (Array.isArray(newEvent.ENVT_GALLERY_IMAGES)
              ? newEvent.ENVT_GALLERY_IMAGES.length > 0
              : newEvent.ENVT_GALLERY_IMAGES.trim() !== "") && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {(Array.isArray(newEvent.ENVT_GALLERY_IMAGES)
                  ? newEvent.ENVT_GALLERY_IMAGES
                  : newEvent.ENVT_GALLERY_IMAGES.split(",")
                ).map((url: string, index: number) => (
                  <div
                    key={index}
                    className="relative w-full aspect-video border rounded overflow-hidden"
                  >
                    <Image
                      src={url.trim()}
                      alt={`Gallery Image ${index + 1}`}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* City */}
        <div className="mb-3">
          <label className="block font-medium mb-1">City</label>
          <input
            type="text"
            name="ENVT_CITY"
            value={newEvent.ENVT_CITY}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Address</label>
          <input
            type="text"
            name="ENVT_ADDRESS"
            value={newEvent.ENVT_ADDRESS}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Contact No */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Contact No</label>
          <input
            type="text"
            name="ENVT_CONTACT_NO"
            value={newEvent.ENVT_CONTACT_NO}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Event Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">From Date</label>
            <input
              type="date"
              name="EVNT_FROM_DT"
              value={newEvent.EVNT_FROM_DT}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Upto Date</label>
            <input
              type="date"
              name="EVNT_UPTO_DT"
              value={newEvent.EVNT_UPTO_DT}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* EVET_ACTIVE_YN */}
        <div className="mb-3">
          <label className="block font-medium mb-1">Active? (Y/N)</label>
          <input
            type="text"
            name="EVET_ACTIVE_YN"
            value={newEvent.EVET_ACTIVE_YN}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded uppercase"
            maxLength={1}
          />
        </div>

        {/* EVET_CREATED_BY */}
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

        {/* ENVT_CATE_ID */}
        {/* <div className="mb-3">
          <label className="block font-medium mb-1">Category ID</label>
          <input
            type="number"
            name="ENVT_CATE_ID"
            value={newEvent.ENVT_CATE_ID}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div> */}

        <div className="flex gap-10">
          <div className="mb-3">
            <label htmlFor="ENVT_CATE_ID" className="block font-medium mb-1">
              Category
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
              className="py-2 px-4 border border-black shadow-sm rounded"
              title="Category"
            >
              <option value="#" disabled selected>
                Select a category
              </option>
              {categories?.map((cat) => (
                <option key={cat.CATE_ID} value={cat.CATE_ID}>
                  {cat.CATE_DESC}
                </option>
              ))}
            </select>
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
                <option value="#" disabled selected>
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

        {/* ENVT_CATE_CATE_ID */}
        {/* <div className="mb-6">
          <label className="block font-medium mb-1">Sub Category ID</label>
          <input
            type="number"
            name="ENVT_CATE_CATE_ID"
            value={newEvent.ENVT_CATE_CATE_ID}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div> */}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
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
