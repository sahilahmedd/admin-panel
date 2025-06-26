"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUpload from "@/components/ImageUpload";
import ClientSideCustomEditor from "@/components/clientside-editor";
import eventService, { EventData } from "@/services/eventService";

// Form validation schema
const eventFormSchema = z.object({
  ENVT_DESC: z.string().min(1, "Description is required"),
  ENVT_EXCERPT: z.string().min(1, "Excerpt is required"),
  ENVT_DETAIL: z.string().min(1, "Detail is required"),
  ENVT_CITY: z.string().min(1, "City is required"),
  ENVT_ADDRESS: z.string().min(1, "Address is required"),
  ENVT_CONTACT_NO: z.string().min(1, "Contact number is required"),
  EVNT_FROM_DT: z.string().min(1, "Start date is required"),
  EVNT_UPTO_DT: z.string().min(1, "End date is required"),
  ENVT_CATE_ID: z.string().min(1, "Category is required"),
  ENVT_BANNER_IMAGE: z.string().optional(),
  ENVT_GALLERY_IMAGES: z.array(z.string()),
  EVET_ACTIVE_YN: z.string(),
  ENVT_CATE_CATE_ID: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

interface Category {
  CATE_ID: number;
  CATE_DESC: string;
  CATE_CATE_ID?: number;
}

interface EventFormProps {
  initialData?: EventData;
  isEditing?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [tab, setTab] = useState<"en" | "hi">("en");
  const [showHindiTab, setShowHindiTab] = useState(false);
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [translation, setTranslation] = useState<{
    en: {
      ENVT_DESC: string;
      ENVT_EXCERPT: string;
      ENVT_DETAIL: string;
      ENVT_ADDRESS: string;
      ENVT_CITY: string;
    };
    hi?: {
      ENVT_DESC: string;
      ENVT_EXCERPT: string;
      ENVT_DETAIL: string;
      ENVT_ADDRESS: string;
      ENVT_CITY: string;
    };
  }>({
    en: {
      ENVT_DESC: initialData?.ENVT_DESC || "",
      ENVT_EXCERPT: initialData?.ENVT_EXCERPT || "",
      ENVT_DETAIL: initialData?.ENVT_DETAIL || "",
      ENVT_ADDRESS: initialData?.ENVT_ADDRESS || "",
      ENVT_CITY: initialData?.ENVT_CITY || "",
    },
  });

  // Initialize form with react-hook-form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ENVT_DESC: initialData?.ENVT_DESC || "",
      ENVT_EXCERPT: initialData?.ENVT_EXCERPT || "",
      ENVT_DETAIL: initialData?.ENVT_DETAIL || "",
      ENVT_CITY: initialData?.ENVT_CITY || "",
      ENVT_ADDRESS: initialData?.ENVT_ADDRESS || "",
      ENVT_CONTACT_NO: initialData?.ENVT_CONTACT_NO || "",
      EVNT_FROM_DT: initialData?.EVNT_FROM_DT?.split("T")[0] || "",
      EVNT_UPTO_DT: initialData?.EVNT_UPTO_DT?.split("T")[0] || "",
      ENVT_CATE_ID: initialData?.ENVT_CATE_ID?.toString() || "",
      ENVT_BANNER_IMAGE: initialData?.ENVT_BANNER_IMAGE || "",
      ENVT_GALLERY_IMAGES: initialData?.ENVT_GALLERY_IMAGES
        ? typeof initialData.ENVT_GALLERY_IMAGES === "string" &&
          initialData.ENVT_GALLERY_IMAGES.startsWith("[")
          ? JSON.parse(initialData.ENVT_GALLERY_IMAGES)
          : [initialData.ENVT_GALLERY_IMAGES]
        : [],
      EVET_ACTIVE_YN: initialData?.EVET_ACTIVE_YN || "Y",
      ENVT_CATE_CATE_ID: initialData?.ENVT_CATE_CATE_ID?.toString() || "",
    },
  });

  // Watch for category changes
  const selectedCategoryId = form.watch("ENVT_CATE_ID");

  useEffect(() => {
    setEditorLoaded(true);
    fetchCategories();
    if (isEditing && initialData?.ENVT_ID) {
      fetchTranslations();
      setShowHindiTab(true);
    } else {
      setShowHindiTab(false); // Don't show Hindi tab for new events
    }
  }, [isEditing, initialData]);

  useEffect(() => {
    const updateSubCategories = () => {
      const selectedCategory = categories.find(
        (cat) => cat.CATE_ID.toString() === selectedCategoryId
      );
      if (selectedCategory?.CATE_DESC.toLowerCase() === "donation") {
        const subs = categories.filter(
          (cat) => cat.CATE_CATE_ID === selectedCategory.CATE_ID
        );
        setSubCategories(subs);
      } else {
        setSubCategories([]);
        form.setValue("ENVT_CATE_CATE_ID", "");
      }
    };

    updateSubCategories();
  }, [selectedCategoryId, categories, form]);

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

  const fetchTranslations = async () => {
    try {
      const hiTranslation = await eventService.getTranslation(
        initialData!.ENVT_ID!,
        "hi"
      );
      if (hiTranslation) {
        setTranslation((prev) => ({
          ...prev,
          hi: {
            ENVT_DESC: hiTranslation.ENVT_DESC || "",
            ENVT_EXCERPT: hiTranslation.ENVT_EXCERPT || "",
            ENVT_DETAIL: hiTranslation.ENVT_DETAIL || "",
            ENVT_ADDRESS: hiTranslation.ENVT_ADDRESS || "",
            ENVT_CITY: hiTranslation.ENVT_CITY || "",
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
      toast.error("Failed to fetch Hindi translation");
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

  const handleTranslationChange = (
    lang: "en" | "hi",
    field: string,
    value: string
  ) => {
    setTranslation((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [field]: value },
    }));

    // Update main form if it's English
    if (lang === "en") {
      form.setValue(field as any, value);
    }
  };

  const onSubmit = async (values: EventFormValues) => {
    try {
      setLoading(true);

      const eventPayload = {
        ...values,
        ENVT_GALLERY_IMAGES: JSON.stringify(values.ENVT_GALLERY_IMAGES),
        ENVT_CATE_ID: Number(values.ENVT_CATE_ID),
        ENVT_CATE_CATE_ID: values.ENVT_CATE_CATE_ID
          ? Number(values.ENVT_CATE_CATE_ID)
          : null,
        EVET_CREATED_BY: 1,
      };

      let result;
      if (isEditing && initialData?.ENVT_ID) {
        result = await eventService.updateEvent(
          initialData.ENVT_ID.toString(),
          eventPayload
        );
      } else {
        result = await eventService.createEvent(eventPayload);
        // After successful creation, show the Hindi tab
        if (result) {
          setShowHindiTab(true);
          setTab("hi"); // Switch to Hindi tab automatically
        }
      }

      if (result) {
        // Handle Hindi translation
        const translationPayload = {
          ENVT_DESC: translation.hi?.ENVT_DESC || "",
          ENVT_EXCERPT: translation.hi?.ENVT_EXCERPT || "",
          ENVT_DETAIL: translation.hi?.ENVT_DETAIL || "",
          ENVT_CITY: translation.hi?.ENVT_CITY || "",
          ENVT_ADDRESS: translation.hi?.ENVT_ADDRESS || "",
          lang_code: "hi",
          ENVT_ACTIVE_YN: "Y",
          ENVT_CREATED_BY: 1,
        };

        const eventId = isEditing ? initialData!.ENVT_ID! : result.ENVT_ID!;

        try {
          // Try to get existing Hindi translation
          const existingTranslation = await eventService.getTranslation(
            eventId,
            "hi"
          );

          if (existingTranslation) {
            // Update existing translation
            await eventService.updateTranslation(
              eventId,
              "hi",
              translationPayload
            );
          } else {
            // Create new translation
            await eventService.createTranslation(eventId, translationPayload);
          }
        } catch (error) {
          console.error("Error handling Hindi translation:", error);
          toast.error("Failed to save Hindi translation");
        }

        toast.success(
          isEditing
            ? "Event updated successfully!"
            : "Event created successfully! You can now add Hindi translations."
        );

        if (!isEditing) {
          // For new events, stay on the page and show Hindi tab
          router.push(`/events/${result.ENVT_ID}`);
        } else {
          router.push("/events");
        }
      }
    } catch (error) {
      console.error("Error submitting event:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Language Tabs */}
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
                Hindi
              </button>
            )}
          </nav>
        </div>

        {/* Language-specific Fields */}
        {tab === "en" ? (
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <h3 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
              English Content
            </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="ENVT_DESC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTranslationChange(
                            "en",
                            "ENVT_DESC",
                            e.target.value
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ENVT_EXCERPT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTranslationChange(
                            "en",
                            "ENVT_EXCERPT",
                            e.target.value
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ENVT_DETAIL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detail</FormLabel>
                    <FormControl>
                      {editorLoaded && (
                        <ClientSideCustomEditor
                          data={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                            handleTranslationChange("en", "ENVT_DETAIL", value);
                          }}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ENVT_ADDRESS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTranslationChange(
                            "en",
                            "ENVT_ADDRESS",
                            e.target.value
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ENVT_CITY"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleTranslationChange(
                            "en",
                            "ENVT_CITY",
                            e.target.value
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        ) : (
          <div className="border border-green-200 rounded-lg p-4 bg-green-50">
            <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center">
              Hindi Translation
            </h3>
            <div className="space-y-4">
              <div>
                <Label>Event Name (Hindi)</Label>
                <Input
                  value={translation.hi?.ENVT_DESC || ""}
                  onChange={(e) =>
                    handleTranslationChange("hi", "ENVT_DESC", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Short Description (Hindi)</Label>
                <Textarea
                  value={translation.hi?.ENVT_EXCERPT || ""}
                  onChange={(e) =>
                    handleTranslationChange(
                      "hi",
                      "ENVT_EXCERPT",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <Label>Detail (Hindi)</Label>
                {editorLoaded && (
                  <ClientSideCustomEditor
                    data={translation.hi?.ENVT_DETAIL || ""}
                    onChange={(value) =>
                      handleTranslationChange("hi", "ENVT_DETAIL", value)
                    }
                  />
                )}
              </div>

              <div>
                <Label>Address (Hindi)</Label>
                <Textarea
                  value={translation.hi?.ENVT_ADDRESS || ""}
                  onChange={(e) =>
                    handleTranslationChange(
                      "hi",
                      "ENVT_ADDRESS",
                      e.target.value
                    )
                  }
                />
              </div>

              <div>
                <Label>City (Hindi)</Label>
                <Input
                  value={translation.hi?.ENVT_CITY || ""}
                  onChange={(e) =>
                    handleTranslationChange("hi", "ENVT_CITY", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* Common Fields - Always Visible */}
        <Card className="p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-4">Common Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="EVNT_FROM_DT"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="EVNT_UPTO_DT"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ENVT_CATE_ID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded-md"
                    onChange={(e) => {
                      field.onChange(e);
                      form.setValue("ENVT_CATE_CATE_ID", "");
                    }}
                  >
                    <option value="">Select a category</option>
                    {categories
                      .filter((cat) => !cat.CATE_CATE_ID)
                      .map((category) => (
                        <option key={category.CATE_ID} value={category.CATE_ID}>
                          {category.CATE_DESC}
                        </option>
                      ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {subCategories.length > 0 && (
            <FormField
              control={form.control}
              name="ENVT_CATE_CATE_ID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub Category</FormLabel>
                  <FormControl>
                    <select {...field} className="w-full p-2 border rounded-md">
                      <option value="">Select a sub category</option>
                      {subCategories.map((category) => (
                        <option key={category.CATE_ID} value={category.CATE_ID}>
                          {category.CATE_DESC}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="ENVT_CONTACT_NO"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Number</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ENVT_BANNER_IMAGE"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Banner Image (Optional)</FormLabel>
                <FormControl>
                  <ImageUpload
                    name="banner"
                    imageUrl={field.value}
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        try {
                          const url = await uploadFile(e.target.files[0]);
                          field.onChange(url);
                        } catch (error) {
                          toast.error("Failed to upload banner image");
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ENVT_GALLERY_IMAGES"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gallery Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    name="gallery"
                    imageUrls={field.value}
                    onChange={async (e) => {
                      if (e.target.files?.[0]) {
                        try {
                          const url = await uploadFile(e.target.files[0]);
                          field.onChange([...field.value, url]);
                        } catch (error) {
                          toast.error("Failed to upload gallery image");
                        }
                      }
                    }}
                    multiple
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/events")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Event"
              : "Create Event"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EventForm;
