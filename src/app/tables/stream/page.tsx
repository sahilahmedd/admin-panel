/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetchData, postData, updateData, deleteData } from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { Pencil, CircleX } from 'lucide-react';
import Image from 'next/image';

const StreamTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'add' | 'edit' | null>(null);
  const [selectedStream, setSelectedStream] = useState<any>(null);

  const defaultStream = {
    STREAM_ID: 1,
    STREAM_NAME: "",
    STREAM_CREATED_BY: 0,
    STREAM_CREATED_DT: "",
    STREAM_UPDATED_BY: null,
    STREAM_UPDATED_DT: null
  };

  const [newStream, setNewStream] = useState(defaultStream);

  const loadData = async () => {
    setLoading(true);
    const response = await fetchData('streams');
    console.log("Education: ", response);
    
    if (response && response.streams) {
      setData(response.streams);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStream((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = () => {
    setNewStream(defaultStream);
    setShowModal('add');
  };

  const handleSubmit = async () => {
    try {
      const res = await postData('streams', newStream);
      console.log("Send: ", res);
      
      if (res) {
        loadData();
        toast.success('Stream added successfully!');
        setShowModal(null);
      } else {
        toast.error('Failed to add Stream!');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEdit = (streams: any) => {
    setSelectedStream(streams);
    setNewStream({
        STREAM_ID: 1,
        STREAM_NAME: streams.STREAM_NAME,
        STREAM_CREATED_BY: 0,
        STREAM_CREATED_DT: streams.STREAM_CREATED_DT,
        STREAM_UPDATED_BY: null,
        STREAM_UPDATED_DT: null
    });
    setShowModal('edit');
  };

  const handleUpdate = async () => {
    try {
      const res = await updateData('streams', selectedStream.STREAM_ID, newStream);
      if (res) {
        loadData();
        toast.success('Stream updated successfully!');
        setShowModal(null);
      } else {
        toast.error('Failed to update Stream!');
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this Stream?')) {
      const res = await deleteData('streams', id);
      if (res) {
        loadData();
        toast.success('Stream deleted!');
      } else {
        toast.error('Failed to delete stream!');
      }
    }
  };

  const columns = [
    {
      name: 'Stream name',
      selector: (row) => `${row.STREAM_ID} - ${row.STREAM_NAME}`,
      sortable: true,
    },
    // {
    //   name: 'Image',
    //   cell: (row) =>
    //     row.STREAM_IMAGE_URL ? (
    //       <Image
    //         src={row.STREAM_IMAGE_URL}
    //         alt="icon"
    //         width={40}
    //         height={40}
    //         className="rounded"
    //       />
    //     ) : (
    //       'No Image'
    //     ),
    // },
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
            onClick={() => handleDelete(row.STREAM_ID)}
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
          <h1 className="text-2xl font-bold">Stream</h1>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Stream
          </button>
        </div>
        <DataTable columns={columns} data={data} progressPending={loading} pagination />

        {showModal && (
          <Modal
            title={showModal === 'add' ? 'Add New Stream' : 'Edit Stream'}
            onClose={() => setShowModal(null)}
            onSubmit={showModal === 'add' ? handleSubmit : handleUpdate}
            streams={newStream}
            onChange={handleChange}
            setStream={setNewStream}
          />
        )}
      </div>
    </>
  );
};

const Modal = ({ title, onClose, onSubmit, streams, onChange, setStream }: any) => {
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
            name: 'STREAM_IMAGE_URL',
            value: fullImageUrl,
          },
        });
        setStream((prev: any) => ({
          ...prev,
          STREAM_IMAGE_URL: fullImageUrl,
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
            <label className="block text-sm font-medium">Stream Name</label>
            <input
              type="text"
              name="STREAM_NAME"
              value={streams.STREAM_NAME}
              onChange={onChange}
              className="w-full p-2 border rounded"
            />
          </div>
{/* 
          <div>
            <label className="block text-sm font-medium">Stream Icon</label>
            {streams.STREAM_IMAGE_URL && (
              <Image
                width={40}
                height={40}
                src={streams.STREAM_IMAGE_URL}
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
          </div> */}

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

export default StreamTable;
