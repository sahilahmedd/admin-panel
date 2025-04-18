"use client";

import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    mobile: "",
    gender: "",
    profession: "",
    professionDetail: "",
    education: "",
    educationDesc: "",
    address: "",
    areaName: "",
    pinCode: "",
    cityCode: "",
    stateCode: "",
    districtCode: "",
    fatherName: "",
    motherName: "",
    spouseName: "",
    married: "",
    photoUrl: "",
    businessInterest: "",
    businessStream: "",
    businessType: "",
    hobby: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name" className="input" />
          <input name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="input" />
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input" />
          <select name="gender" value={formData.gender} onChange={handleChange} className="input">
            <option value="">Select Gender</option>
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
          <input name="profession" value={formData.profession} onChange={handleChange} placeholder="Profession" className="input" />
          <input name="professionDetail" value={formData.professionDetail} onChange={handleChange} placeholder="Profession Details" className="input" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="education" value={formData.education} onChange={handleChange} placeholder="Education" className="input" />
          <input name="educationDesc" value={formData.educationDesc} onChange={handleChange} placeholder="Education Description" className="input" />
          <input name="cityCode" value={formData.cityCode} onChange={handleChange} placeholder="City Code" className="input" />
          <input name="stateCode" value={formData.stateCode} onChange={handleChange} placeholder="State Code" className="input" />
          <input name="districtCode" value={formData.districtCode} onChange={handleChange} placeholder="District Code" className="input" />
          <input name="pinCode" value={formData.pinCode} onChange={handleChange} placeholder="PIN Code" className="input" />
        </div>

        <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" className="input h-20" />
        <input name="areaName" value={formData.areaName} onChange={handleChange} placeholder="Area Name" className="input" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Father's Name" className="input" />
          <input name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Mother's Name" className="input" />
          <input name="spouseName" value={formData.spouseName} onChange={handleChange} placeholder="Spouse Name" className="input" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="businessInterest" value={formData.businessInterest} onChange={handleChange} placeholder="Business Interest" className="input" />
          <input name="businessStream" value={formData.businessStream} onChange={handleChange} placeholder="Business Stream" className="input" />
          <input name="businessType" value={formData.businessType} onChange={handleChange} placeholder="Business Type" className="input" />
        </div>

        <input name="hobby" value={formData.hobby} onChange={handleChange} placeholder="Hobbies" className="input" />

        <div className="flex items-center justify-between mt-6">
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded">
            Register
          </button>
        </div>
      </form>
    </div>
  );
}
