"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import eventService, { EventData } from "@/services/eventService";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Toaster } from "react-hot-toast";

const EventsTable = () => {
  const [data, setData] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const getEvents = async () => {
    const events = await eventService.getAllEvents();
    setData(events);
    setLoading(false);
  };

  console.log("Data: ", data);

  useEffect(() => {
    getEvents();
  }, []);

  const filteredData = data.filter(
    (item) =>
      (item.ENVT_DESC || "").toLowerCase().includes(searchText.toLowerCase()) ||
      (item.ENVT_CITY || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      await eventService.deleteEvent(id.toString());
      toast.success("Event deleted successfully!");
      getEvents();
    }
  };

  return (
    <div className="p-5 max-w-6xl mx-auto">
      <Toaster position="top-right" reverseOrder={false} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Event Management
      </h1>

      <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-medium">Quick Guide:</span>
          <br />• <span className="font-medium text-blue-600">Add Event</span> -
          Add a new event to the system.
          <br />• <span className="font-medium text-green-600">
            Edit
          </span> or <span className="font-medium text-red-600">Delete</span>{" "}
          events using the action buttons.
        </p>
      </div>

      <div className="mb-6 flex justify-end">
        <Link
          href="/events/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
        >
          Add Event
        </Link>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                City
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                From Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Upto Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  Loading events...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No events found.
                </td>
              </tr>
            ) : (
              filteredData.map((event) => (
                <tr key={event.ENVT_ID} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.ENVT_ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.ENVT_DESC || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.ENVT_CITY || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.EVNT_FROM_DT || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.EVNT_UPTO_DT || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {event.Category?.CATE_DESC || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/events/${event.ENVT_ID}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <span className="inline-flex items-center">
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </span>
                    </Link>
                    <button
                      onClick={() => handleDelete(event.ENVT_ID!)}
                      className="text-red-600 hover:text-red-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    >
                      <span className="inline-flex items-center">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;
