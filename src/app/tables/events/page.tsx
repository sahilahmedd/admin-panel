/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { deleteData, fetchData, postData, updateData } from "@/utils/api";
import TableHeader from "@/components/TableHeader";
import toast, { Toaster } from "react-hot-toast";
// import Modal from "@/components/AddEdit";
// import Input from "@/components/FormInput";
import { CircleX, Pencil } from "lucide-react";
// import Select from "@/components/Select";
import EventModal from "@/components/events/EventModal";

type Category = {
  id: number;
  name: string;
};

type EventDataType = {
  ENVT_DESC: string;
  ENVT_EXCERPT: string;
  ENVT_DETAIL: string;
  ENVT_BANNER_IMAGE: string;
  ENVT_GALLERY_IMAGES: string;
  ENVT_CONTACT_NO: string;
  ENVT_ADDRESS: string;
  ENVT_CITY: string;
  EVNT_FROM_DT: string;
  EVNT_UPTO_DT: string;
  EVET_ACTIVE_YN: string;
  EVET_CREATED_BY: number;
  ENVT_CATE_ID: any;
  ENVT_CATE_CATE_ID: any;
};

const EventsTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const defaultEvent = {
    ENVT_DESC: "",
    ENVT_EXCERPT: "",
    ENVT_DETAIL: "",
    ENVT_BANNER_IMAGE: "",
    ENVT_GALLERY_IMAGES: "",
    ENVT_CONTACT_NO: "",
    ENVT_ADDRESS: "",
    ENVT_CITY: "",
    EVNT_FROM_DT: "",
    EVNT_UPTO_DT: "",
    EVET_ACTIVE_YN: "Y",
    EVET_CREATED_BY: 1,
    ENVT_CATE_ID: null,
    ENVT_CATE_CATE_ID: null,
  };

  const [newEvent, setNewEvent] = useState<EventDataType>(defaultEvent);

  useEffect(() => {
  console.log("newEvent changed:", newEvent);
}, [newEvent]);

  const getEvents = async () => {
    const result = await fetchData("events");
    if (result && result.events) {
      setData(result.events);
    }
    setLoading(false);
  };

  useEffect(() => {
    getEvents();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.ENVT_DESC.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ENVT_CITY.toLowerCase().includes(searchText.toLowerCase()) ||
      item.ENVT_ADDRESS.toLowerCase().includes(searchText.toLowerCase())
  );

 
  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log("Inside handleChange:", newEvent); // may show old state

    const { name, type, value } = e.target;
  
    // Safely handle file input
    if (type === "file" && e.target instanceof HTMLInputElement && e.target.files?.length) {
      const files = e.target.files;
  
      try {
        const uploadFile = async (file: File) => {
          const formData = new FormData();
          formData.append("image", file);
  
          const response = await fetch("/api/uploadImage", {
            method: "POST",
            body: formData,
          });
  
          const result = await response.json();
          if (!result.status) throw new Error("Image upload failed");
  
          return `https://rangrezsamaj.kunxite.com/${result.url}`;
        };
  
        if (name === "ENVT_BANNER_IMAGE") {
          const url = await uploadFile(files[0]);
          setNewEvent((prev) => ({ ...prev, [name]: url }));
        }
  
        if (name === "ENVT_GALLERY_IMAGES") {
          const uploadedUrls = await Promise.all(
            Array.from(files).map(uploadFile)
          );
  
          const existing = newEvent.ENVT_GALLERY_IMAGES || "";
          const newUrlsString = uploadedUrls.join(", ");
          const combined = existing
            ? `${existing}, ${newUrlsString}`
            : newUrlsString;
  
          setNewEvent((prev) => ({
            ...prev,
            [name]: combined,
          }));
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Image upload failed");
      }
    } else {
      // Handle non-file inputs
      setNewEvent((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) || null : value,
      }));
    }

    // console.log("Change: ", newEvent); 
    
  };
  
  const handleAdd = () => {
     console.log("Submitting form", newEvent);
    setNewEvent(defaultEvent);
    console.log("New Event: ", defaultEvent);
    
    setShowModal("add");
  };

  const handleSubmit = async () => {
    console.log("Submitting form", newEvent);
    if (!newEvent.ENVT_DESC || !newEvent.ENVT_CITY) {
      return toast.error("Please fill in all required fields");
    }

    try {
      const payload = {
        ...newEvent,
        ENVT_GALLERY_IMAGES: newEvent.ENVT_GALLERY_IMAGES,
      };

      // Log the payload being sent
      console.log("Submitting payload:", payload);

      // const response = await postData("events", payload);

      const res = await fetch("https://node2-plum.vercel.app/api/user/events", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      // Log the full API response
      console.log("API Response:", res);

      if (res) {
        getEvents();
        toast.success("Event Added successfully!");
        setShowModal(null);
      }
    } catch (error) {
      // Log any errors
      console.error("Submission error:", error);
      toast.error("Failed to add Event");
    }
  };

  const getCategories = async () => {
    const res = await fetch(
      "https://node2-plum.vercel.app/api/admin/categories"
    );
    const data = await res.json();

    console.log("Categories: ", data.categories);
    setCategories(data.categories);
  };

  useEffect(() => {
    getCategories();
  }, []);

  // console.log("Categories out: ", categories);
  // console.log("Event: ", defaultEvent);
  
  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setNewEvent({
      ENVT_DESC: event.ENVT_DESC,
      ENVT_EXCERPT: event.ENVT_EXCERPT,
      ENVT_DETAIL: event.ENVT_DETAIL,
      ENVT_BANNER_IMAGE: event.ENVT_BANNER_IMAGE,
      ENVT_GALLERY_IMAGES: event.ENVT_GALLERY_IMAGES.split(", "),
      ENVT_CONTACT_NO: event.ENVT_CONTACT_NO,
      ENVT_ADDRESS: event.ENVT_ADDRESS,
      ENVT_CITY: event.ENVT_CITY,
      EVNT_FROM_DT: event.EVNT_FROM_DT,
      EVNT_UPTO_DT: event.EVNT_UPTO_DT,
      EVET_ACTIVE_YN: event.EVET_ACTIVE_YN,
      EVET_CREATED_BY: 1,
      ENVT_CATE_ID: event.ENVT_CATE_ID,
      ENVT_CATE_CATE_ID: event.ENVT_CATE_CATE_ID,
    });
    setShowModal("edit");
  };


  const handleUpdate = async () => {
    try {
      const payload = {
        ...newEvent,
        ENVT_GALLERY_IMAGES: Array.isArray(newEvent.ENVT_GALLERY_IMAGES)
          ? newEvent.ENVT_GALLERY_IMAGES.join(",")
          : newEvent.ENVT_GALLERY_IMAGES,
      };

      console.log("Updating with payload:", payload);

      // const res = await updateData("events", selectedEvent.ENVT_ID, payload);
      // console.log("Update response:", res);

      const res = await fetch(
        `https://node2-plum.vercel.app/api/user/events/${selectedEvent.ENVT_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (res) {
        getEvents();
        toast.success("Event updated successfully!");
        setShowModal(null);
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update event");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Event?")) {
      try {
        const res = await deleteData("events", id);
        if (res) {
          getEvents();
          toast.success("Event deleted!");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const columns = [
    {
      name: "Event Info",
      selector: (row) => `${row.ENVT_ID} - ${row.ENVT_DESC}`,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => `${row.ENVT_CITY}`,
      sortable: true,
    },
    {
      name: "Address",
      selector: (row) => `${row.ENVT_ADDRESS}`,
      sortable: true,
    },
    {
      name: "Contact No.",
      selector: (row) => `${row.ENVT_CONTACT_NO}`,
      sortable: true,
    },
    {
      name: "Active",
      selector: (row) => `${row.EVET_ACTIVE_YN}`,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
            <Pencil size={15} className="text-green-500" />
          </button>
          <button
            onClick={() => handleDelete(row.ENVT_ID)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-red-200"
          >
            <CircleX size={15} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="p-6">
        <TableHeader
          title="Events"
          text="Event"
          placeholder="Search for events..."
          handleAdd={handleAdd}
          searchText={searchText}
          setSearchText={setSearchText}
        />
        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
        />
        {showModal && (
          <EventModal
            title={showModal === "add" ? "Add Event" : "Edit Event"}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            categories={categories}
            handleChange={handleChange}
          />
        )}
      </div>
    </>
  );
};

export default EventsTable;
