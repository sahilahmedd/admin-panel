/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { fetchData, postData, updateData, deleteData } from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { Pencil, CircleX } from 'lucide-react';
import Image from 'next/image';

const HobbiesTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState<'add' | 'edit' | null>(null);
  const [selectedHobby, setSelectedHobby] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const defaultHobby = {
    HOBBY_NAME: '',
    HOBBY_IMAGE_URL: '',
  };

  const [newHobby, setNewHobby] = useState(defaultHobby);
  const [file, setFile] = useState<File | null>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHobby((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('https://rangrezsamaj.kunxite.com/', {
      mode: "no-cors",
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    if (data?.status === true && data.file) {
      return `https://rangrezsamaj.kunxite.com/${data.file}`;
    } else {
      throw new Error(data?.message || 'Image upload failed');
    }
  };

  const handleAdd = () => {
    setNewHobby(defaultHobby);
    setFile(null);
    setShowModal('add');
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      let imageUrl = newHobby.HOBBY_IMAGE_URL;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const res = await postData('hobbies', {
        ...newHobby,
        HOBBY_IMAGE_URL: imageUrl,
      });

      if (res) {
        loadData();
        toast.success('Hobby added successfully!');
        setShowModal(null);
      } else {
        toast.error('Failed to add hobby!');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (hobby: any) => {
    setSelectedHobby(hobby);
    setNewHobby({
      HOBBY_NAME: hobby.HOBBY_NAME,
      HOBBY_IMAGE_URL: hobby.HOBBY_IMAGE_URL,
    });
    setFile(null);
    setShowModal('edit');
  };

  const handleUpdate = async () => {
    try {
      setUploading(true);
      let imageUrl = newHobby.HOBBY_IMAGE_URL;

      if (file) {
        imageUrl = await uploadImage(file);
      }

      const res = await updateData('hobbies', selectedHobby.HOBBY_ID, {
        ...newHobby,
        HOBBY_IMAGE_URL: imageUrl,
      });

      if (res) {
        loadData();
        toast.success('Hobby updated successfully!');
        setShowModal(null);
      } else {
        toast.error('Failed to update hobby!');
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
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
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Hobbies</h1>
          <button
            onClick={handleAdd}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Hobby
          </button>
        </div>
        <DataTable columns={columns} data={data} progressPending={loading} pagination />

        {showModal && (
          <Modal
          title={showModal === "add" ? "Add New Hobby" : "Edit Hobby"}
          onClose={() => setShowModal(null)}
          onSubmit={showModal === "add" ? handleSubmit : handleUpdate}
          hobby={newHobby}
          onChange={handleChange}
          setHobby={setNewHobby}
        />        
        )}
      </div>
    </>
  );
};

// const Modal = ({ title, onClose, onSubmit, hobby, onChange, file, onFileChange, uploading }: any) => (
//   <div className="fixed inset-0 bg-gray-300/25 flex items-center justify-center">
//     <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 md:mx-auto">
//       <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>

//       <div className="grid grid-cols-1 gap-4">
//         <div>
//           <label className="block text-sm font-medium">Hobby Name</label>
//           <input
//             type="text"
//             name="HOBBY_NAME"
//             value={hobby.HOBBY_NAME}
//             onChange={onChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Icon Image</label>
//           <input type="file" accept="image/*" onChange={onFileChange} className="w-full" />
//           {file && (
//             <p className="text-sm text-gray-500 mt-1">
//               Selected: <strong>{file.name}</strong>
//             </p>
//           )}
//           {!file && hobby.HOBBY_IMAGE_URL && (
//             <img src={hobby.HOBBY_IMAGE_URL} alt="icon" width={50} className="mt-2" />
//           )}
//         </div>

//         <div className="flex w-full justify-end mt-4 gap-2">
//           <button
//             onClick={onClose}
//             className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onSubmit}
//             disabled={uploading}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             {uploading ? 'Saving...' : 'Save'}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

const Modal = ({ title, onClose, onSubmit, hobby, onChange }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);

      const res = await fetch("/api/uploadImage", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Result: ", result);
      
      if (result.status === "success") {
        const fullImageUrl = `https://rangrezsamaj.kunxite.com/${result.url}`;
        onChange({
          target: {
            name: "HOBBY_IMAGE_URL",
            value: fullImageUrl,
          },
        });
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Image upload failed.");
      }
    } catch (error) {
      toast.error("Something went wrong during upload.");
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
