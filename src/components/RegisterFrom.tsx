"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    uniqueId: "",
    fullName: "",
    dob: "",
    gender: "",
    mobile: "",
    profession: "",
    professionDetails: "",
    education: "",
    address: "",
    pincode: "",
    areaName: "",
    state: "",
    district: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    photo: null,
    business: "",
    hobby: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement & HTMLSelectElement;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border-2 border-gray-300 border-dashed rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add User</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="uniqueId" placeholder="Unique ID" className="input" onChange={handleChange} />
        <input type="text" name="fullName" placeholder="Full Name" className="input" onChange={handleChange} />

        <input type="date" name="dob" className="input" onChange={handleChange} />
        <select name="gender" className="input" onChange={handleChange}>
          <option value="">Select gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>

        <input type="text" name="mobile" placeholder="Mobile number" className="input" onChange={handleChange} />
        <input type="text" name="profession" placeholder="Elect profession" className="input" onChange={handleChange} />

        <input type="text" name="professionDetails" placeholder="Profession Details" className="input" onChange={handleChange} />
        <input type="text" name="education" placeholder="Education" className="input" onChange={handleChange} />

        <input type="text" name="address" placeholder="Address" className="input" onChange={handleChange} />
        <input type="text" name="pincode" placeholder="Pincode" className="input" onChange={handleChange} />

        <select name="state" className="input" onChange={handleChange}>
          <option value="">Select state</option>
          <option value="GJ">Gujarat</option>
          <option value="MH">Maharashtra</option>
        </select>
        <select name="district" className="input" onChange={handleChange}>
          <option value="">Select district</option>
          <option value="01">Ahmedabad</option>
          <option value="02">Surat</option>
        </select>

        <input type="text" name="fatherName" placeholder="Father’s Name" className="input" onChange={handleChange} />
        <input type="text" name="motherName" placeholder="Mother’s Name" className="input" onChange={handleChange} />

        <input type="file" name="photo" className="input" onChange={handleChange} />
        <input type="text" name="spouseName" placeholder="Spouse Name" className="input" onChange={handleChange} />

        <input type="text" name="business" placeholder="Business" className="input" onChange={handleChange} />
        <input type="text" name="hobby" placeholder="Hobby" className="input" onChange={handleChange} />

        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 cursor-pointer">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
