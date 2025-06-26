"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventForm from "@/components/events/EventForm";
import eventService, { EventData } from "@/services/eventService";

const EditEventPage = () => {
  const params = useParams();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await eventService.getEventById(params.id as string);
        if (data) {
          setEvent(data);
        } else {
          toast.error("Event not found");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEvent();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-5 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading event details...</div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="p-5 max-w-6xl mx-auto">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-red-500">Event not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Events", href: "/events" },
          { label: "Edit Event", href: `/events/${params.id}` },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Event</h1>
        <p className="text-gray-600 mt-2">
          Update event details in English and Hindi.
        </p>
      </div>

      <EventForm initialData={event} isEditing />
    </div>
  );
};

export default EditEventPage;
