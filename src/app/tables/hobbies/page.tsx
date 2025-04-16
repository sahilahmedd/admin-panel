/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetchData, postData, updateData, deleteData } from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { Pencil, CircleX } from 'lucide-react';
import Image from 'next/image';
import TableHeader from '@/components/TableHeader';

const HobbiesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'add' | 'edit' | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<any>(null);
  const [searchText, setSearchText] = useState("");

  const defaultHobby = {
    HOBBY_NAME: '',
    HOBBY_IMAGE_URL: '',
  };

  const [newHobby, setNewHobby] = useState(defaultHobby);

  const loadData = async () => {
    setLoading(true);
    const response = await fetchData('hobbies');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHobby((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setNewHobby(defaultHobby);
    setShowModal('add');
  };

  const handleSubmit = async () => {
    try {
      const res = await postData('hobbies', newHobby);
      if (res) {
        loadData();
        toast.success('Hobby added successfully!');
        setShowModal(null);
      } else {
        toast.error('Failed to add hobby!');
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
    });
    setShowModal('edit');
  };

  const handleUpdate = async () => {
    try {
      const res = await updateData('hobbies', selectedHobby.HOBBY_ID, newHobby);
      if (res) {
        loadData();
        toast.success('Hobby updated successfully!');
        setShowModal(null);
      } else {
        toast.error('Failed to update hobby!');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hobby?')) {
      const res = await deleteData('hobbies', id);
      if (res) {
        loadData();
        toast.success('Hobby deleted!');
      } else {
        toast.error('Failed to delete hobby!');
      }
    }
  };

  const columns = [
    {
      name: 'Hobby Name',
      selector: (row) => `${row.HOBBY_ID} - ${row.HOBBY_NAME}`,
      sortable: true,
    },
    {
      name: 'Image',
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
        {/* <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Hobbies</h1>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Hobby
          </button>
        </div> */}
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Cities</h1>
          <div className="w-full sm:w-64">
            <TableSearch
              searchText={searchText}
              setSearchText={setSearchText}
              placeholder="Search by city, district, or state..."
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-2 rounded-full shadow-sm transition"
          >
            + Add New Hobby
            <PlusIcon strokeWidth={3} />
          </button>
        </div> */}

        <TableHeader
          title="Hobbies"
          text="Hobby"
          placeholder="Search for hobbies..."
          searchText={searchText}
          setSearchText={setSearchText}
          handleAdd={handleAdd}
        />

        <DataTable columns={columns} data={filteredData} progressPending={loading} pagination />

        {showModal && (
          <Modal
            title={showModal === 'add' ? 'Add New Hobby' : 'Edit Hobby'}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === 'add' ? handleSubmit : handleUpdate}
            hobby={newHobby}
            onChange={handleChange}
            setHobby={setNewHobby}
          />
        )}
      </div>
    </>
  );
};

const Modal = ({ title, onClose, onSubmit, hobby, onChange, setHobby }: any) => {
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
            name: 'HOBBY_IMAGE_URL',
            value: fullImageUrl,
          },
        });
        setHobby((prev: any) => ({
          ...prev,
          HOBBY_IMAGE_URL: fullImageUrl,
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
            <label className="block text-sm font-medium">Hobby Icon</label>
            {hobby.HOBBY_IMAGE_URL && (
              <Image
                width={40}
                height={40}
                src={hobby.HOBBY_IMAGE_URL}
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

export default HobbiesTable;
