/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { fetchData, postData, updateData, deleteData } from "@/utils/api";
// import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import {Pencil,CircleX} from 'lucide-react'

const HobbiesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<"add" | "edit" | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<any>(null);

  const defaultHobby = {
    HOBBY_NAME: "",
    HOBBY_IMAGE_URL: "",
  };

  const [newHobby, setNewHobby] = useState(defaultHobby);

  // Fetch hobbies data

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHobby((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setNewHobby(defaultHobby);
    setShowModal("add");
  };

  // Add New Hobby
  const handleSubmit = async () => {
    const res = await postData("hobbies", newHobby);
    if (res) {
      loadData();
      toast.success("Hobby Added successfully");
      setShowModal(null);
    } else {
      toast.error("Failed to add Hobby!!!");
    }
  };

  // Open Edit Modal
  const handleEdit = (hobby: any) => {
    setSelectedHobby(hobby);
    setNewHobby({
      HOBBY_NAME: hobby.HOBBY_NAME,
      HOBBY_IMAGE_URL: hobby.HOBBY_IMAGE_URL,
    });
    setShowModal("edit");
  };

  // Submit Edit hobby
  const handleUpdate = async () => {
    if (!selectedHobby) return;
    const res = await updateData("hobbies", selectedHobby.HOBBY_ID, newHobby);
    if (res) {
      loadData();
      toast.success("Successfully updated!!");
      setShowModal(null);
    } else {
      toast.error("Error updating hobby!!!");
    }
  };

  // Delete a hobby
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hobby?")) {
      const res = await deleteData("hobbies", id);
      if (res) {
        loadData();
        toast.success("Successfully deleted!!!");
      } else {
        toast.error("Error deleting hobby!!!");
      }
    }
  };

  const columns = [
    {
      name: "Hobby Name",
      selector: (row) => `${row.HOBBY_ID} - ${row.HOBBY_NAME}`,
      sortable: true,
    },
    { name: "Image", selector: (row) => row.HOBBY_IMAGE_URL },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-1">
          <button
            onClick={() => handleEdit(row)}
            className="bg-transparent text-white px-2 cursor-pointer py-1 rounded-full hover:bg-green-200"
          >
           <Pencil size={15} className="text-green-500"/>
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
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Hobbies</h1>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Hobby
          </button>
        </div>
        <DataTable
          columns={columns}
          data={data}
          progressPending={loading}
          pagination
        />

        {/* Add/Edit City Modal */}
        {showModal && (
          <Modal
            title={showModal === "add" ? "Add New Hobby" : "Edit Hobby"}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
            hobby={newHobby}
            onChange={handleChange}
          />
        )}
      </div>
    </>
  );
};

const Modal = ({ title, onClose, onSubmit, hobby, onChange }: any) => (
  <div className="fixed inset-0 bg-gray-300/25 flex items-center justify-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium">Hobby Name</label>
          <input
            type="text"
            name="HOBBY_NAME"
            value={hobby.HOBBY_NAME}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Icon URL</label>
          <input
            type="text"
            name="HOBBY_IMAGE_URL"
            value={hobby.HOBBY_IMAGE_URL}
            onChange={onChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex w-full justify-end mt-4 gap-2">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default HobbiesTable;
