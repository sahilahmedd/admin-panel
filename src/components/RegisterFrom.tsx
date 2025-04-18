"use client";

import React, { useState } from "react";

const RegisterForm = () => {
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
    state: "",
    district: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    photo: null,
    business1: "",
    business2: "",
    hobby: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white border border-dashed p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Register</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        {/* Left Column */}
        <div>
          <label className="block text-sm font-medium">Unique ID</label>
          <input
            name="uniqueId"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">Date of Birth</label>
          <input name="dob" type="date" onChange={handleChange} className="input" />

          <label className="block text-sm font-medium mt-4">
            Mobile Number
          </label>
          <input
            name="mobile"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">
            Profession Details
          </label>
          <input
            name="professionDetails"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">Address</label>
          <input
            name="address"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">State</label>
          <select name="state" onChange={handleChange} className="input">
            <option>Select state</option>
            <option>State 1</option>
            <option>State 2</option>
          </select>

          <label className="block text-sm font-medium mt-4">
            Father’s Name
          </label>
          <input
            name="fatherName"
            type="text"
            onChange={handleChange}
            className="input"
          />

          {/* <label className="block text-sm font-medium mt-4">Photo</label>
          <input name="photo" type="file" onChange={handleChange} className="input" /> */}
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Photo</label>
            <div className="flex items-center">
              <label
                htmlFor="photo"
                className="cursor-pointer bg-gray-100 border border-gray-300 rounded-lg px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Choose File
              </label>
              <span className="ml-3 text-gray-500 text-sm">
                {formData.photo ? formData.photo.name : "No file chosen"}
              </span>
              <input
                id="photo"
                name="photo"
                type="file"
                onChange={handleChange}
                className="hidden"
              />
            </div>
          </div>

          <label className="block text-sm font-medium mt-4">Business</label>
          <input
            name="business1"
            type="text"
            onChange={handleChange}
            className="input"
          />
        </div>

        {/* Right Column */}
        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            name="fullName"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">Gender</label>
          <select name="gender" onChange={handleChange} className="input">
            <option>Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label className="block text-sm font-medium mt-4">Profession</label>
          <input
            name="profession"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">Education</label>
          <input
            name="education"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">Pincode</label>
          <input
            name="pincode"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">District</label>
          <select name="district" onChange={handleChange} className="input">
            <option>Select district</option>
            <option>District 1</option>
            <option>District 2</option>
          </select>

          <label className="block text-sm font-medium mt-4">
            Mother’s Name
          </label>
          <input
            name="motherName"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">Business</label>
          <input
            name="business2"
            type="text"
            onChange={handleChange}
            className="input"
          />

          <label className="block text-sm font-medium mt-4">Hobby</label>
          <input
            name="hobby"
            type="text"
            onChange={handleChange}
            className="input"
          />
        </div>

        <div className="col-span-1 md:col-span-2 mt-4">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
