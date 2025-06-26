"use client";

import React from "react";
import Breadcrumbs from "@/components/Breadcrumbs";
import EventForm from "@/components/events/EventForm";

const AddEventPage = () => {
  return (
    <div className="p-5 max-w-6xl mx-auto">
      <Breadcrumbs
        items={[
          { label: "Events", href: "/events" },
          { label: "Add New Event", href: "/events/new" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add New Event</h1>
        <p className="text-gray-600 mt-2">
          Create a new event with details in English and Hindi.
        </p>
      </div>

      <EventForm />
    </div>
  );
};

export default AddEventPage;
