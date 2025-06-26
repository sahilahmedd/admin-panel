"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ClientSideCustomEditor from "../clientside-editor";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CustomEditor from "@/components/custom-editor";

export interface EventTranslation {
  description: string;
  excerpt: string;
  detail: string;
  address: string;
  city: string;
}

interface EventTranslationsManagerProps {
  eventId: number;
  onClose?: () => void;
  onSave?: () => void;
  translations: {
    en: EventTranslation;
    hi?: EventTranslation;
  };
  onChange: (translations: {
    en: EventTranslation;
    hi?: EventTranslation;
  }) => void;
  errors?: {
    translations?: {
      en?: Partial<EventTranslation>;
      hi?: Partial<EventTranslation>;
    };
  };
  showEnglishTab?: boolean;
}

const API_BASE_URL = "https://node2-plum.vercel.app/api/admin";

const EventTranslationsManager: React.FC<EventTranslationsManagerProps> = ({
  eventId,
  onClose,
  onSave,
  translations,
  onChange,
  errors = {},
  showEnglishTab = true,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editorLoaded, setEditorLoaded] = useState<boolean>(false);
  const [hiTranslationExists, setHiTranslationExists] =
    useState<boolean>(false);

  useEffect(() => {
    setEditorLoaded(true);
    if (eventId !== 0) {
      checkHindiTranslation();
    }
  }, [eventId]);

  const checkHindiTranslation = async () => {
    if (eventId === 0) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${eventId}/translations/hi`
      );
      if (response.ok) {
        setHiTranslationExists(true);
      } else if (response.status === 404) {
        setHiTranslationExists(false);
      }
    } catch (err) {
      console.error("Error checking Hindi translation:", err);
    }
  };

  const handleTranslationChange = (
    lang: "en" | "hi",
    field: keyof EventTranslation,
    value: string
  ) => {
    const updatedTranslations = {
      ...translations,
      [lang]: {
        ...(translations[lang] || {}),
        [field]: value,
      },
    };
    onChange(updatedTranslations);
  };

  const handleSaveTranslation = async () => {
    if (eventId === 0) {
      toast.error(
        "Cannot save translation for a new event. Save the event first."
      );
      return;
    }

    setLoading(true);
    try {
      const translationData = {
        ENVT_DESC: translations.hi?.description || "",
        ENVT_EXCERPT: translations.hi?.excerpt || "",
        ENVT_DETAIL: translations.hi?.detail || "",
        ENVT_ADDRESS: translations.hi?.address || "",
        ENVT_CITY: translations.hi?.city || "",
        lang_code: "hi",
        ENVT_ACTIVE_YN: "Y",
        ENVT_CREATED_BY: 1,
      };

      const method = hiTranslationExists ? "PUT" : "POST";
      const endpoint = hiTranslationExists
        ? `${API_BASE_URL}/events/${eventId}/translations/hi`
        : `${API_BASE_URL}/events/${eventId}/translations`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(translationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to ${hiTranslationExists ? "update" : "create"} translation`
        );
      }

      const result = await response.json();
      toast.success(
        `Hindi translation ${
          hiTranslationExists ? "updated" : "created"
        } successfully!`
      );

      if (!hiTranslationExists) {
        setHiTranslationExists(true);
      }

      if (onSave) {
        onSave();
      }
    } catch (err: any) {
      console.error("Error saving translation:", err);
      toast.error(`Failed to save translation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTranslation = async () => {
    if (eventId === 0) {
      toast.error("Cannot delete translation for a new event.");
      return;
    }

    if (!hiTranslationExists) {
      toast.error("No Hindi translation to delete.");
      return;
    }

    if (
      !window.confirm("Are you sure you want to delete the Hindi translation?")
    ) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/events/${eventId}/translations/hi`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete translation");
      }

      toast.success("Hindi translation deleted successfully!");
      setHiTranslationExists(false);
      onChange({
        ...translations,
        hi: undefined,
      });
    } catch (err: any) {
      console.error("Error deleting translation:", err);
      toast.error(`Failed to delete translation: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading event data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="space-y-6">
      {showEnglishTab ? (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">English Translation</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="en-description">Description *</Label>
              <Input
                id="en-description"
                value={translations.en.description}
                onChange={(e) =>
                  handleTranslationChange("en", "description", e.target.value)
                }
                className={
                  errors?.translations?.en?.description ? "border-red-500" : ""
                }
              />
              {errors?.translations?.en?.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.en.description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="en-excerpt">Excerpt *</Label>
              <Input
                id="en-excerpt"
                value={translations.en.excerpt}
                onChange={(e) =>
                  handleTranslationChange("en", "excerpt", e.target.value)
                }
                className={
                  errors?.translations?.en?.excerpt ? "border-red-500" : ""
                }
              />
              {errors?.translations?.en?.excerpt && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.en.excerpt}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="en-detail">Detail *</Label>
              <div
                className={
                  errors?.translations?.en?.detail ? "border-red-500" : ""
                }
              >
                <CustomEditor
                  data={translations.en.detail}
                  onChange={(value) =>
                    handleTranslationChange("en", "detail", value)
                  }
                />
              </div>
              {errors?.translations?.en?.detail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.en.detail}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="en-address">Address *</Label>
              <Textarea
                id="en-address"
                value={translations.en.address}
                onChange={(e) =>
                  handleTranslationChange("en", "address", e.target.value)
                }
                className={
                  errors?.translations?.en?.address ? "border-red-500" : ""
                }
              />
              {errors?.translations?.en?.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.en.address}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="en-city">City *</Label>
              <Input
                id="en-city"
                value={translations.en.city}
                onChange={(e) =>
                  handleTranslationChange("en", "city", e.target.value)
                }
                className={
                  errors?.translations?.en?.city ? "border-red-500" : ""
                }
              />
              {errors?.translations?.en?.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.en.city}
                </p>
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Hindi Translation (Optional)
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="hi-description">Description</Label>
              <Input
                id="hi-description"
                value={translations.hi?.description || ""}
                onChange={(e) =>
                  handleTranslationChange("hi", "description", e.target.value)
                }
                className={
                  errors?.translations?.hi?.description ? "border-red-500" : ""
                }
              />
              {errors?.translations?.hi?.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.hi.description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="hi-excerpt">Excerpt</Label>
              <Input
                id="hi-excerpt"
                value={translations.hi?.excerpt || ""}
                onChange={(e) =>
                  handleTranslationChange("hi", "excerpt", e.target.value)
                }
                className={
                  errors?.translations?.hi?.excerpt ? "border-red-500" : ""
                }
              />
              {errors?.translations?.hi?.excerpt && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.hi.excerpt}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="hi-detail">Detail</Label>
              <div
                className={
                  errors?.translations?.hi?.detail ? "border-red-500" : ""
                }
              >
                <CustomEditor
                  data={translations.hi?.detail || ""}
                  onChange={(value) =>
                    handleTranslationChange("hi", "detail", value)
                  }
                />
              </div>
              {errors?.translations?.hi?.detail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.hi.detail}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="hi-address">Address</Label>
              <Textarea
                id="hi-address"
                value={translations.hi?.address || ""}
                onChange={(e) =>
                  handleTranslationChange("hi", "address", e.target.value)
                }
                className={
                  errors?.translations?.hi?.address ? "border-red-500" : ""
                }
              />
              {errors?.translations?.hi?.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.hi.address}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="hi-city">City</Label>
              <Input
                id="hi-city"
                value={translations.hi?.city || ""}
                onChange={(e) =>
                  handleTranslationChange("hi", "city", e.target.value)
                }
                className={
                  errors?.translations?.hi?.city ? "border-red-500" : ""
                }
              />
              {errors?.translations?.hi?.city && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.translations.hi.city}
                </p>
              )}
            </div>
          </div>
        </Card>
      )}

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={handleSaveTranslation}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          {loading
            ? "Saving..."
            : hiTranslationExists
            ? "Update Hindi Translation"
            : "Create Hindi Translation"}
        </button>

        {hiTranslationExists && (
          <button
            type="button"
            onClick={handleDeleteTranslation}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Hindi Translation
          </button>
        )}
      </div>

      {onClose && (
        <div className="mt-6 text-center border-t pt-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Back to Event Details
          </button>
        </div>
      )}
    </div>
  );
};

export default EventTranslationsManager;
