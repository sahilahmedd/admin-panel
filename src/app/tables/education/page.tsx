/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData, postData, updateData, deleteData } from "@/utils/api";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, CircleX } from "lucide-react";
import Image from "next/image";
import Modal from "@/components/AddEdit";
import Input from "@/components/FormInput";
import TableHeader from "@/components/TableHeader";
import Breadcrumbs from "@/components/Breadcrumbs";

const EducationTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [selectedEdu, setSelectedEdu] = useState<any>(null);
  const [searchText, setSearchText] = useState("");

  const defaultEdu = {
    EDUCATION_ID: 1,
    EDUCATION_NAME: "",
    EDUCATION_IMAGE_URL: "",
    EDUCATION_CREATED_BY: 1,
    EDUCATION_CREATED_DT: "",
    EDUCATION_UPDATED_BY: null,
    EDUCATION_UPDATED_DT: null,
  };

  const [newEdu, setNewEdu] = useState(defaultEdu);

  const loadData = async () => {
    setLoading(true);
    const response = await fetchData("education");
    console.log("Education: ", response);

    if (response && response.education) {
      setData(response.education);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle search
  const filteredData = data.filter((item) =>
    item.EDUCATION_NAME.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files?.[0]) {
      const formData = new FormData();
      formData.append("image", files[0]); // 👈 key must match what your API expects

      try {
        const response = await fetch("/api/uploadImage", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        console.log("Response: ", result);

        if (result.status) {
          const imageUrl = `https://rangrezsamaj.kunxite.com/${result.url}`; // This is likely a relative path
          console.log("URL: ", imageUrl);

          // ✅ Store the uploaded image URL in your form data
          setNewEdu((prev) => ({
            ...prev,
            [name]: imageUrl,
          }));
        } else {
          toast.error("Image upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Image upload error");
      }
    } else {
      setNewEdu((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) || 0 : value,
      }));
    }
  };

  const handleAdd = () => {
    setNewEdu(defaultEdu);
    setSelectedEdu(null);
  };

  const handleSubmit = async () => {
    try {
      const res = await postData("education", newEdu);
      console.log("Send: ", res);

      if (res) {
        loadData();
        toast.success("Edcuation added successfully!");
        setShowModal(null);
      } else {
        toast.error("Failed to add Education!");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (edu: any) => {
    setSelectedEdu(edu);
    setNewEdu({
      EDUCATION_ID: edu.EDUCATION_ID,
      EDUCATION_NAME: edu.EDUCATION_NAME,
      EDUCATION_IMAGE_URL: edu.EDUCATION_IMAGE_URL,
      EDUCATION_CREATED_BY: 1,
      EDUCATION_CREATED_DT: edu.EDUCATION_CREATED_DT,
      EDUCATION_UPDATED_BY: null,
      EDUCATION_UPDATED_DT: null,
    });
    setShowModal("edit");
  };

  const handleUpdate = async () => {
    try {
      const res = await updateData(
        "education",
        selectedEdu.EDUCATION_ID,
        newEdu
      );
      if (res) {
        loadData();
        toast.success("Education updated successfully!");
        setShowModal(null);
      } else {
        toast.error("Failed to update Education!");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Education?")) {
      const res = await deleteData("education", id);
      if (res) {
        loadData();
        toast.success("Education deleted!");
      } else {
        toast.error("Failed to delete Education!");
      }
    }
  };

  const columns = [
    {
      name: "Education",
      selector: (row) => `${row.EDUCATION_ID} - ${row.EDUCATION_NAME}`,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) =>
        row.EDUCATION_IMAGE_URL ? (
          <Image
            src={row.EDUCATION_IMAGE_URL}
            alt="icon"
            width={40}
            height={40}
            className="rounded"
          />
        ) : (
          "No Image"
        ),
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
            onClick={() => handleDelete(row.EDUCATION_ID)}
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
      <Breadcrumbs />
      <div className="p-6">
        <TableHeader
          title="Educations"
          text="Education"
          placeholder="Search for education..."
          handleAdd={handleAdd}
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <div className="flex flex-col lg:flex-row gap-6 mt-4">
          {/* Left - Table */}
          <div className="w-full lg:w-2/3">
            <DataTable
              columns={columns}
              data={filteredData}
              progressPending={loading}
              pagination
            />
          </div>

          {/* Right - Always visible form */}
          <div className="w-full lg:w-1/3 bg-white border border-gray-200 rounded-lg shadow p-6 h-1/2 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {selectedEdu ? "Edit Education" : "Add New Education"}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              <Input
                type="text"
                label="Education Name"
                name="EDUCATION_NAME"
                value={newEdu.EDUCATION_NAME}
                onChange={handleChange}
              />
              <Input
                type="file"
                label="Upload Icon"
                name="EDUCATION_IMAGE_URL"
                value={newEdu.EDUCATION_IMAGE_URL}
                onChange={handleChange}
              />
            </div>

            <div className="flex justify-end gap-2 pt-6">
              <button
                onClick={() => {
                  setSelectedEdu(null);
                  setNewEdu(defaultEdu);
                }}
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                Reset
              </button>
              <button
                onClick={selectedEdu ? handleUpdate : handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {selectedEdu ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EducationTable;
