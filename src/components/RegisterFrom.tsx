/* eslint-disable @typescript-eslint/no-explicit-any */
// export default RegisterForm;
"use client";
import React, { useEffect, useState } from "react";
import { fetchData } from "@/utils/api";
import Select from "./Select";
import Input from "./Input";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    PR_FULL_NAME: "",
    PR_FATHER_NAME: "",
    PR_MOTHER_NAME: "",
    PR_FATHER_ID: "",
    PR_MOTHER_ID: "",
    PR_DOB: "",
    PR_GENDER: "",
    PR_MOBILE_NO: "",
    PR_HOBBY: "",
    PR_MARRIED_YN: "",
    PR_SPOUSE_NAME: "",
    PR_SPOUSE_ID: "",
    PR_ADDRESS: "",
    PR_AREA_NAME: "",
    PR_PIN_CODE: "",
    PR_CITY_CODE: "",
    PR_DISTRICT_CODE: "",
    PR_STATE_CODE: "",
    PR_EDUCATION: "",
    PR_EDUCATION_DESC: "",
    PR_PROFESSION_ID: "",
    PR_PROFESSION: "",
    PR_PROFESSION_DETA: "",
    PR_BUSS_CODE: "",
    PR_BUSS_STREAM: "",
    PR_BUSS_TYPE: "",
  });
  const [hobby, setHobby] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [edu, setEdu] = useState<any[]>([])
  const [professions, setProfessions] = useState<any[]>([])

  // FETCHING DATA FROM APIs
  // Get hobbies
  useEffect(() => {
    const getHobby = async () => {
      const res = await fetchData("hobbies");
      setHobby(res.hobbies);
    };

    getHobby();
  }, []);

  // console.log("Hobby: ", hobby);

  // Get Pincode, city, state list
  useEffect(() => {
    const getCiy = async () => {
      const res = await fetchData("cities");
      setCity(res.cities);
    };

    getCiy();
  }, []);
  
  // console.log("Cities: ", city);



  // Get Education
  useEffect(()=>{
    const getEdu = async ()=>{
      const res = await fetchData("education")
      setEdu(res.education)
    }
    getEdu();
  },[])

  // console.log("Edu: ", edu);

  useEffect(()=>{
    const getProfessions = async()=>{
      const res = await fetchData("professions")
      setProfessions(res.professions)
    }
    getProfessions();
  },[])
  
  console.log("Professions: ", professions);
  


  // Getting Pincodes
  const uniquePincodes = Array.from(
    new Map(
      city.map((item)=> [
        item.CITY_PIN_CODE, { label: item.CITY_PIN_CODE, value: item.CITY_PIN_CODE },
      ])
    ).values()
  )
  // console.log("Pincodes: ", uniquePincodes);
  
  // Getting districts Array
  const uniqueDistricts = Array.from(
    new Map(
      city.map((item) => [
        item.CITY_DS_CODE,
        { label: item.CITY_DS_NAME, value: item.CITY_DS_CODE },
      ])
    ).values()
  );

  // Getting states Array
  const uniqueStates = Array.from(
    new Map(
      city.map((item) => [
        item.CITY_ST_CODE,
        { label: item.CITY_ST_NAME, value: item.CITY_ST_CODE },
      ])
    ).values()
  );

  // Handle change
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  
  //   // If PINCODE is selected, auto-fill city, district, and state
  //   if (name === "PR_PIN_CODE") {
  //     const selectedCity = city.find((c) => c.CITY_PIN_CODE === value);
  
  //     if (selectedCity) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         [name]: value,
  //         PR_CITY_CODE: selectedCity.CITY_ID,
  //         PR_DISTRICT_CODE: selectedCity.CITY_DS_CODE,
  //         PR_STATE_CODE: selectedCity.CITY_ST_CODE,
  //       }));
  //     } else {
  //       // fallback if not found
  //       setFormData((prev) => ({
  //         ...prev,
  //         [name]: value,
  //       }));
  //     }
  //   } 

  //   else if (name === "PR_PROFESSION"){
  //     const selectedProfessions = professions.find((p)=>p.PROF_NAME === value);
  //     console.log("Selected PROF: ", selectedProfessions);
      
  //     if(selectedProfessions){
  //       setFormData((prev)=>({
  //         ...prev,
  //         [name]: value,
  //         PR_PROFESSION_ID: selectedProfessions?.PROF_ID || "",
  //         PR_PROFESSION_DETA: selectedProfessions?.PROF_DESC
  //       }))
  //     }    
  //     // Default case
  //     else {
  //       setFormData((prev) => ({
  //         ...prev,
  //         [name]: value,
  //       }));
  //     }
  //   }
  // };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    // Autofill city, district, state from PIN
    if (name === "PR_PIN_CODE") {
      const selectedCity = city.find((c) => c.CITY_PIN_CODE === value);
      if (selectedCity) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          PR_CITY_CODE: selectedCity.CITY_ID,
          PR_DISTRICT_CODE: selectedCity.CITY_DS_CODE,
          PR_STATE_CODE: selectedCity.CITY_ST_CODE,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  
    // Autofill profession ID from name
    else if (name === "PR_PROFESSION") {
      const selectedProfession = professions.find((p) => p.PROF_NAME === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        PR_PROFESSION_ID: selectedProfession?.PROF_ID || "",
        PR_PROFESSION_DETA: selectedProfession?.PROF_DESC
      }));
    }
  
    // Default case
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form", formData);
    // integrate API call here
  };

  console.log("Form data: ", formData);
  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-6xl mx-auto p-6 border-1 border-gray-300 bg-white shadow-md rounded-md space-y-8"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
        Add User
      </h2>

      {/* Personal Details */}
      <div>
        <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
          Personal Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            name="PR_FULL_NAME"
            value={formData.PR_FULL_NAME}
            onChange={handleChange}
          />
          <Input
            label="Father's Name"
            name="PR_FATHER_NAME"
            value={formData.PR_FATHER_NAME}
            onChange={handleChange}
          />
          <Input
            label="Mother's Name"
            name="PR_MOTHER_NAME"
            value={formData.PR_MOTHER_NAME}
            onChange={handleChange}
          />
          <Input
            label="Father ID"
            name="PR_FATHER_ID"
            value={formData.PR_FATHER_ID}
            onChange={handleChange}
          />
          <Input
            label="Mother ID"
            name="PR_MOTHER_ID"
            value={formData.PR_MOTHER_ID}
            onChange={handleChange}
          />
          <Input
            label="Date of Birth"
            name="PR_DOB"
            type="date"
            value={formData.PR_DOB}
            onChange={handleChange}
          />
          <Select
            label="Gender"
            name="PR_GENDER"
            value={formData.PR_GENDER}
            onChange={handleChange}
            options={["Male", "Female", "Other"]}
          />
          <Input
            label="Mobile Number"
            name="PR_MOBILE_NO"
            type="tel"
            value={formData.PR_MOBILE_NO}
            onChange={handleChange}
          />
          {/* <Input label="Hobby" name="PR_HOBBY" value={formData.PR_HOBBY} onChange={handleChange} /> */}
          <Select
            label="Hobby"
            name="PR_HOBBY"
            value={formData.PR_HOBBY}
            onChange={handleChange}
            options={hobby.map((item) => ({
              label: item.HOBBY_NAME,
              value: item.HOBBY_NAME,
            }))}
          />
        </div>
      </div>

      {/* Married Status */}
      <div>
        <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
          Married Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Married?"
            name="PR_MARRIED_YN"
            value={formData.PR_MARRIED_YN}
            onChange={handleChange}
            options={["Yes", "No"]}
          />
          <Input
            label="Spouse Name"
            name="PR_SPOUSE_NAME"
            value={formData.PR_SPOUSE_NAME}
            onChange={handleChange}
          />
          <Input
            label="Spouse ID"
            name="PR_SPOUSE_ID"
            value={formData.PR_SPOUSE_ID}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Address Details */}
      <div>
        <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
          Address Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Address"
            name="PR_ADDRESS"
            value={formData.PR_ADDRESS}
            onChange={handleChange}
          />
          <Input
            label="Area"
            name="PR_AREA_NAME"
            value={formData.PR_AREA_NAME}
            onChange={handleChange}
          />
          {/* <Input
            label="Pincode"
            name="PR_PIN_CODE"
            value={formData.PR_PIN_CODE}
            onChange={handleChange}
          /> */}
          <Select
            label="Pincode"
            name="PR_PIN_CODE"
            value={formData.PR_PIN_CODE}
            onChange={handleChange}
            options={uniquePincodes}
          />
          {/* <Input label="City" name="PR_CITY_CODE" value={formData.PR_CITY_CODE} onChange={handleChange} /> */}
          <Select
            label="City"
            name="PR_CITY_CODE"
            value={formData.PR_CITY_CODE}
            onChange={handleChange}
            options={city.map((item) => ({
              label: item.CITY_NAME,
              value: item.CITY_ID,
            }))}
          />
          {/* <Input label="District" name="PR_DISTRICT_CODE" value={formData.PR_DISTRICT_CODE} onChange={handleChange} /> */}
          <Select
            label="District"
            name="PR_DISTRICT_CODE"
            value={formData.PR_DISTRICT_CODE}
            onChange={handleChange}
            options={uniqueDistricts}
          />
          {/* <Input label="State" name="PR_STATE_CODE" value={formData.PR_STATE_CODE} onChange={handleChange} /> */}
          <Select
            label="State"
            name="PR_STATE_CODE"
            value={formData.PR_STATE_CODE}
            onChange={handleChange}
            options={uniqueStates}
          />
        </div>
      </div>

      {/* Education Details */}
      <div>
        <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
          Education Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <Input
            label="Education"
            name="PR_EDUCATION"
            value={formData.PR_EDUCATION}
            onChange={handleChange}
          /> */}
          <Select
            label="Education"
            name="PR_EDUCATION"
            value={formData.PR_EDUCATION}
            onChange={handleChange}
            options={edu.map((item)=>(
              {
                label: item.EDUCATION_NAME,
                value: item.EDUCATION_NAME,
              }
            ))}
          />
          <Input
            label="Education Description"
            name="PR_EDUCATION_DESC"
            value={formData.PR_EDUCATION_DESC}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Professional Details */}
      <div>
        <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
          Professional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* <Input
            label="Profession"
            name="PR_PROFESSION"
            value={formData.PR_PROFESSION}
            onChange={handleChange}
          /> */}
          <Select
            label="Profession"
            name="PR_PROFESSION"
            value={formData.PR_PROFESSION}
            onChange={handleChange}
            options={professions.map((item)=>(
              {
                label: item.PROF_NAME,
                value: item.PROF_NAME,
              }
            ))}
          />
          <Input
            label="Profession ID"
            name="PR_PROFESSION_ID"
            value={formData.PR_PROFESSION_ID}
            onChange={handleChange}
            disabled={true}
          />
          <Input
            type="text  "
            label="Profession Description"
            name="PR_PROFESSION_DETA"
            value={formData.PR_PROFESSION_DETA}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Business Details */}
      <div>
        <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
          Business Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Business Code"
            name="PR_BUSS_CODE"
            value={formData.PR_BUSS_CODE}
            onChange={handleChange}
          />
          <Input
            label="Business Stream"
            name="PR_BUSS_STREAM"
            value={formData.PR_BUSS_STREAM}
            onChange={handleChange}
          />
          <Input
            label="Business Type"
            name="PR_BUSS_TYPE"
            value={formData.PR_BUSS_TYPE}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="text-center mt-8">
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          ADD
        </button>
      </div>
    </form>
  );
};

export default AddUserForm;
