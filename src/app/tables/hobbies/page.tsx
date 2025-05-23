/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData, postData, updateData, deleteData } from "@/utils/api";
import toast from "react-hot-toast";
import { Pencil, CircleX } from "lucide-react";
import Image from "next/image";
import TableHeader from "@/components/TableHeader";
import Modal from "@/components/AddEdit";
import Input from "@/components/FormInput";

const HobbiesTable = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<any>(null);
  const [searchText, setSearchText] = useState("");

  const defaultHobby = {
    HOBBY_NAME: "",
    HOBBY_IMAGE_URL: "",
    HOBBY_CREATED_BY: 1,
  };

  const [newHobby, setNewHobby] = useState(defaultHobby);

  const loadData = async () => {
    setLoading(true);
    const response = await fetchData("hobbies");
    if (response && response.hobbies) {
      setData(response.hobbies);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle search
  const filteredData = data.filter((item) =>
    item.HOBBY_NAME.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;

    if (type === "file" && files?.[0]) {
      const formData = new FormData();
      formData.append("image", files[0]);
      console.log("Uploading file to /api/uploadImage:", files[0]);
      try {
        const response = await fetch("/api/uploadImage", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (result.status) {
          const imageUrl = `https://rangrezsamaj.kunxite.com/${result.url}`;
          console.log("Image: ", imageUrl);

          setNewHobby((prev) => ({
            ...prev,
            [name]: imageUrl,
          }));
          console.log("Hobby: ", name);
        } else {
          toast.error("Image upload failed");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Image upload error");
      }
    } else {
      setNewHobby((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) || 0 : value,
      }));
    }
  };

  // const handleAdd = () => {
  //   setNewHobby(defaultHobby);
  //   setShowModal("add");
  // };

  const handleAdd = () => {
    setSelectedHobby(null); // 🛠️ Important: This resets the mode to "Add"
    setNewHobby(defaultHobby);
  };

  const handleSubmit = async () => {
    try {
      const res = await postData("hobbies", newHobby);
      if (res) {
        loadData();
        toast.success("Hobby added successfully!");
        setShowModal(null);
      } else {
        toast.error("Failed to add hobby!");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (hobby: any) => {
    setSelectedHobby(hobby);
    setNewHobby({
      HOBBY_NAME: hobby.HOBBY_NAME,
      HOBBY_IMAGE_URL: hobby.HOBBY_IMAGE_URL,
      HOBBY_CREATED_BY: hobby.HOBBY_CREATED_BY,
    });
    setShowModal("edit");
  };

  const handleUpdate = async () => {
    try {
      const res = await updateData("hobbies", selectedHobby.HOBBY_ID, newHobby);
      if (res) {
        loadData();
        toast.success("Hobby updated successfully!");
        setShowModal(null);
      } else {
        toast.error("Failed to update hobby!");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hobby?")) {
      const res = await deleteData("hobbies", id);
      if (res) {
        loadData();
        toast.success("Hobby deleted!");
      } else {
        toast.error("Failed to delete hobby!");
      }
    }
  };

  const columns = [
    {
      name: "Hobby Name",
      selector: (row) => `${row.HOBBY_ID} - ${row.HOBBY_NAME}`,
      sortable: true,
    },
    {
      name: "Image",
      cell: (row) =>
        row.HOBBY_IMAGE_URL ? (
          <Image
            src={row.HOBBY_IMAGE_URL}
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
            onClick={() => handleDelete(row.HOBBY_ID)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-red-200"
          >
            <CircleX size={15} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <TableHeader
        title="Hobbies"
        text="Hobby"
        placeholder="Search for hobbies..."
        searchText={searchText}
        setSearchText={setSearchText}
        handleAdd={handleAdd}
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-4">
        {/* Table */}
        <div className="w-full lg:w-2/3">
          <DataTable
            columns={columns}
            data={filteredData}
            progressPending={loading}
            pagination
          />
        </div>

        {/* Form Panel */}
        <div className="w-full lg:w-1/3 bg-white border border-gray-200 h-1/2 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">
            {selectedHobby ? "Edit Hobby" : "Add New Hobby"}
          </h2>

          <div className="space-y-4">
            <Input
              type="text"
              label="Hobby Name"
              name="HOBBY_NAME"
              value={newHobby.HOBBY_NAME}
              onChange={handleChange}
            />
            <Input
              type="file"
              label="Upload Icon"
              name="HOBBY_IMAGE_URL"
              value={newHobby.HOBBY_IMAGE_URL}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedHobby(null);
                  setNewHobby(defaultHobby);
                }}
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                Reset
              </button>
              <button
                onClick={selectedHobby ? handleUpdate : handleSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                {selectedHobby ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HobbiesTable;
