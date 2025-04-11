/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetchData, postData, updateData, deleteData } from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { Pencil, CircleX } from 'lucide-react';
import Image from 'next/image';

const EducationTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'add' | 'edit' | null>(null);
  const [selectedEdu, setSelectedEdu] = useState<any>(null);

  const defaultEdu = {
    EDUCATION_ID: 1,
    EDUCATION_NAME: "",
    EDUCATION_IMAGE_URL: "",
    EDUCATION_CREATED_BY: 1,
    EDUCATION_CREATED_DT: "",
    EDUCATION_UPDATED_BY: null,
    EDUCATION_UPDATED_DT: null
  };

  const [newEdu, setNewEdu] = useState(defaultEdu);

  const loadData = async () => {
    setLoading(true);
    const response = await fetchData('education');
    console.log("Education: ", response);
    
    if (response && response.education) {
      setData(response.education);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewEdu((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setNewEdu(defaultEdu);
    setShowModal('add');
  };

  const handleSubmit = async () => {
    try {
      const res = await postData('education', newEdu);
      console.log("Send: ", res);
      
      if (res) {
        loadData();
        toast.success('Edcuation added successfully!');
        setShowModal(null);
      } else {
        toast.error('Failed to add Education!');
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
        EDUCATION_UPDATED_DT: null
    });
    setShowModal('edit');
  };

  const handleUpdate = async () => {
    try {
      const res = await updateData('education', selectedEdu.EDUCATION_ID, newEdu);
      if (res) {
        loadData();
        toast.success('Education updated successfully!');
        setShowModal(null);
      } else {
        toast.error('Failed to update Education!');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this Education?')) {
      const res = await deleteData('education', id);
      if (res) {
        loadData();
        toast.success('Education deleted!');
      } else {
        toast.error('Failed to delete Education!');
      }
    }
  };

  const columns = [
    {
      name: 'Education',
      selector: (row) => `${row.EDUCATION_ID} - ${row.EDUCATION_NAME}`,
      sortable: true,
    },
    {
      name: 'Image',
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
          'No Image'
        ),
    },
    {
      name: 'Actions',
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
      <div className="p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Hobbies</h1>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Education
          </button>
        </div>
        <DataTable columns={columns} data={data} progressPending={loading} pagination />

        {showModal && (
          <Modal
            title={showModal === 'add' ? 'Add New Education' : 'Edit Education'}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === 'add' ? handleSubmit : handleUpdate}
            edu={newEdu}
            onChange={handleChange}
            setEdu={setNewEdu}
          />
        )}
      </div>
    </>
  );
};

const Modal = ({ title, onClose, onSubmit, edu, onChange, setEdu }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);

      const res = await fetch('/api/uploadImage', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.status === 'success') {
        const fullImageUrl = `https://rangrezsamaj.kunxite.com/${result.url}`;
        onChange({
          target: {
            name: 'EDUCATION_IMAGE_URL',
            value: fullImageUrl,
          },
        });
        setEdu((prev: any) => ({
          ...prev,
          EDUCATION_IMAGE_URL: fullImageUrl,
        }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Image upload failed.');
      }
    } catch (error) {
      toast.error('Something went wrong during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-300/25 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium">Education Name</label>
            <input
              type="text"
              name="EDUCATION_NAME"
              value={edu.EDUCATION_NAME}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Education Icon</label>
            {edu.EDUCATION_IMAGE_URL && (
              <Image
                width={40}
                height={40}
                src={edu.EDUCATION_IMAGE_URL}
                alt="Uploaded icon"
                className="h-12 w-12 mb-2 object-contain rounded-full border"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full"
            />
            {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
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
              disabled={uploading}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationTable;
