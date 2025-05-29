/* eslint-disable @typescript-eslint/no-explicit-any */
// export default RegisterForm;
"use client";
import React, { useEffect, useState } from "react";
import { fetchData } from "@/utils/api";
import Select from "../Select";
import Input from "../Input";
import ImageUpload from "../ImageUpload";
import toast, { Toaster } from "react-hot-toast";
// import { X } from 'lucide-react'

type UserFormData = {
  PR_ROLE: string;
  PR_FULL_NAME: string;
  PR_PHOTO_URL: string;
  PR_FATHER_NAME: string;
  PR_MOTHER_NAME: string;
  PR_DOB: string;
  PR_GENDER: string;
  PR_MOBILE_NO: string;
  PR_HOBBY: string;
  PR_MARRIED_YN: string;
  PR_SPOUSE_NAME: string;
  PR_ADDRESS: string;
  PR_AREA_NAME: string;
  PR_PIN_CODE: string;
  PR_CITY_CODE: string;
  PR_DISTRICT_CODE: string;
  PR_STATE_CODE: string;
  PR_EDUCATION: string;
  PR_EDUCATION_DESC: string;
  PR_PROFESSION: string;
  PR_PROFESSION_DETA: string;
  PR_BUSS_STREAM: string;
  PR_BUSS_TYPE: string;
  PR_BUSS_INTER: string;
};

type FormErrors = Partial<Record<keyof UserFormData | "otp", string>>;

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    PR_ROLE: "",
    PR_FULL_NAME: "",
    PR_PHOTO_URL: "",
    PR_FATHER_NAME: "",
    PR_MOTHER_NAME: "",
    // PR_FATHER_ID: null,
    // PR_MOTHER_ID: null,
    PR_DOB: "",
    PR_GENDER: "",
    PR_MOBILE_NO: "",
    PR_HOBBY: "",
    PR_MARRIED_YN: "",
    PR_SPOUSE_NAME: "",
    // PR_SPOUSE_ID: null,
    PR_ADDRESS: "",
    PR_AREA_NAME: "",
    PR_PIN_CODE: "",
    PR_CITY_CODE: "",
    PR_DISTRICT_CODE: "",
    PR_STATE_CODE: "",
    PR_EDUCATION: "",
    PR_EDUCATION_DESC: "",
    PR_PROFESSION_ID: null,
    PR_PROFESSION: "",
    PR_PROFESSION_DETA: "",
    PR_BUSS_CODE: "",
    PR_BUSS_STREAM: "",
    PR_BUSS_TYPE: "",
    PR_BUSS_INTER: "",
  });
  const [hobby, setHobby] = useState<any[]>([]);
  const [city, setCity] = useState<any[]>([]);
  const [edu, setEdu] = useState<any[]>([]);
  const [professions, setProfessions] = useState<any[]>([]);
  const [business, setBusiness] = useState<any[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string>("");
  const [mobileNo, setMobileNo] = useState({
    PR_MOBILE_NO: "",
  });
  const [otp, setOtp] = useState("");
  // const [isCorrect, setIsCorrect] = useState("");
  const [verify, setVerify] = useState({
    PR_MOBILE_NO: "",
    PR_FULL_NAME: "",
    PR_DOB: "",
    PR_ROLE: "",
  });
  const [prId, setPrId] = useState();
  const [children, setChildren] = useState([{ name: "", dob: "" }]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // FETCHING DATA FROM APIs
  // Get hobbies
  const getHobby = async () => {
    const res = await fetchData("hobbies");
    setHobby(res.hobbies);
  };

  useEffect(() => {
    getHobby();
  }, []);

  // console.log("Hobby: ", hobby);

  // Get Pincode, city, state list
  const getCity = async () => {
    const res = await fetchData("cities");
    setCity(res.cities);
  };

  useEffect(() => {
    getCity();
  }, []);

  // console.log("Cities: ", city);

  // Get Education
  const getEdu = async () => {
    const res = await fetchData("education");
    setEdu(res.education);
  };

  useEffect(() => {
    getEdu();
  }, []);

  // console.log("Edu: ", edu);

  const getProfessions = async () => {
    const res = await fetchData("professions");
    setProfessions(res.professions);
  };

  useEffect(() => {
    getProfessions();
  }, []);

  // console.log("Professions: ", professions);

  // Getting Pincodes
  const uniquePincodes = Array.from(
    new Map(
      city.map((item) => [
        item.CITY_PIN_CODE,
        { label: item.CITY_PIN_CODE, value: item.CITY_PIN_CODE },
      ])
    ).values()
  );
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

  const getBusiness = async () => {
    const res = await fetchData("business");
    setBusiness(res.Business);
  };

  useEffect(() => {
    getBusiness();
  }, []);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.PR_ROLE) errors.PR_ROLE = "Role is required";
    if (!formData.PR_FULL_NAME.trim())
      errors.PR_FULL_NAME = "Full name is required";
    if (!formData.PR_PHOTO_URL) errors.PR_PHOTO_URL = "Photo is required";
    if (!formData.PR_FATHER_NAME.trim())
      errors.PR_FATHER_NAME = "Father's name is required";
    if (!formData.PR_MOTHER_NAME.trim())
      errors.PR_MOTHER_NAME = "Mother's name is required";
    if (!formData.PR_DOB) errors.PR_DOB = "Date of Birth is required";
    if (!formData.PR_GENDER) errors.PR_GENDER = "Gender is required";
    if (!formData.PR_MOBILE_NO || !/^\d{10}$/.test(formData.PR_MOBILE_NO)) {
      errors.PR_MOBILE_NO = "Valid 10-digit Mobile number is required";
    }
    if (!otpVerified) errors.otp = "OTP verification is required";
    if (!formData.PR_HOBBY) errors.PR_HOBBY = "Hobby is required";

    if (!formData.PR_MARRIED_YN)
      errors.PR_MARRIED_YN = "Married status is required";
    if (formData.PR_MARRIED_YN === "Yes" && !formData.PR_SPOUSE_NAME.trim()) {
      errors.PR_SPOUSE_NAME = "Spouse name is required";
    }

    if (!formData.PR_ADDRESS.trim()) errors.PR_ADDRESS = "Address is required";
    if (!formData.PR_AREA_NAME.trim()) errors.PR_AREA_NAME = "Area is required";
    if (!formData.PR_PIN_CODE) errors.PR_PIN_CODE = "Pincode is required";
    if (!formData.PR_CITY_CODE) errors.PR_CITY_CODE = "City is required";
    if (!formData.PR_DISTRICT_CODE)
      errors.PR_DISTRICT_CODE = "District is required";
    if (!formData.PR_STATE_CODE) errors.PR_STATE_CODE = "State is required";
    if (!formData.PR_EDUCATION) errors.PR_EDUCATION = "Education is required";
    if (!formData.PR_EDUCATION_DESC.trim())
      errors.PR_EDUCATION_DESC = "Education Description is required";
    if (!formData.PR_PROFESSION)
      errors.PR_PROFESSION = "Profession is required";
    if (!formData.PR_PROFESSION_DETA.trim())
      errors.PR_PROFESSION_DETA = "Profession Description is required";
    if (!formData.PR_BUSS_STREAM)
      errors.PR_BUSS_STREAM = "Business stream is required";
    if (!formData.PR_BUSS_TYPE)
      errors.PR_BUSS_TYPE = "Business type is required";


    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Generate OTP Function
  const getOTP = async () => {
    const res = await fetch(
      "https://node2-plum.vercel.app/api/admin/generate-otp",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mobileNo),
      }
    );

    const data = await res.json();

    console.log("OTP data: ", data);

    // const res = await postData("generate-otp", mobileNo)

    if (data.success) {
      setOtpSent(true);
      setOtpError("");
      console.log("OTP generate successfully!!");
      toast.success("OTP generated successfully!!");
    } else if (!data.success) {
      console.log("Error generating OTP");
      setOtpError(data.message);
    } else {
      console.log("Failed to generate OTP");
    }
  };

  console.log("Mobile no:", mobileNo);

  // Verify OTP
  const verifyOTP = async () => {
    if (formData.PR_FULL_NAME === "" && formData.PR_DOB === "") {
      console.log("Error: Check your name or DOB");
      setOtpError("Please enter your name and date of birth");
    } else {
      const res = await fetch(
        "https://node2-plum.vercel.app/api/admin/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...verify, otp }), // merging otp input with verify object
        }
      );

      const data = await res.json();
      console.log("Verify resposne: ", data);

      setPrId(data.PR_ID);

      console.log("PR_ID: ", data.PR_ID);

      if (data.success) {
        console.log("Success: ", data.message);
        toast.success("OTP verified successfully!!");
        setOtpError("");
        setOtpSent(false);
        setOtpVerified(true);
      } else {
        console.log("Error: ", data.message);
        setOtpError(data.message);
        toast.error("Error verifying OTP");
      }
    }
  };
  console.log("Verify: ", verify);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Narrow target to HTMLInputElement to safely access files property
    if (
      name === "PR_PHOTO_URL" &&
      e.target instanceof HTMLInputElement &&
      e.target.files &&
      e.target.files[0]
    ) {
      const file = e.target.files[0];
      const formDataImage = new FormData();
      formDataImage.append("image", file);

      try {
        const res = await fetch("/api/uploadImage", {
          method: "POST",
          body: formDataImage,
        });

        const data = await res.json();
        console.log("DATAAAAA: ", data);

        if (data.status === "success") {
          const imageUrl = `https://rangrezsamaj.kunxite.com/${data.url}`;
          console.log("Img url: ", imageUrl);

          setFormData((prev) => ({
            ...prev,
            PR_PHOTO_URL: imageUrl,
          }));
        } else {
          console.error("Image upload failed: ", data.message);
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
      }
      return;
    }

    // The rest of your logic remains unchanged
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
    } else if (name === "PR_PROFESSION") {
      const selectedProfession = professions.find((p) => p.PROF_NAME === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        PR_PROFESSION_ID: selectedProfession?.PROF_ID || "",
        PR_PROFESSION_DETA: selectedProfession?.PROF_DESC,
      }));
    } else if (name === "PR_BUSS_STREAM") {
      const selectedBusiness = business.find((b) => b.BUSS_STREM === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        PR_BUSS_CODE: selectedBusiness?.BUSS_ID,
        PR_BUSS_TYPE: selectedBusiness?.BUSS_TYPE,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name === "PR_MOBILE_NO") {
        setMobileNo({ PR_MOBILE_NO: value });

        setVerify((prev) => ({
          ...prev,
          PR_MOBILE_NO: value,
        }));
      }

      if (name === "PR_FULL_NAME" || name === "PR_DOB" || name === "PR_ROLE") {
        setVerify((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  // Registering User
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form", formData);

    if (!validateForm()) {
      toast.error("Please correct the errors before submitting");
      return;
    }
    // integrate API call here

    const res = await fetch(
      "https://node2-plum.vercel.app/api/user/edit-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // REQUIRED
          pr_id: String(prId),
        },
        body: JSON.stringify({ ...formData, Children: children }),
      }
    );

    const data = await res.json();

    console.log("Register user: ", data);

    if (data.success) {
      console.log("Data added successfully!!!");
      toast.success("User Added successfully!!!");
    } else if (!data.success) {
      console.log("Error: ", data.message);
      toast.error("Error adding user!!!", data.message);
    } else {
      console.log("Failed!!!");
    }

    // const res = await postData("register", formData)
    // if(res.success === true){
    //   console.log("Data updated successfully", res);
    // } else  if(res.success === false) {
    //   console.log("Error: ", res.message)
    // }
    // else {
    //   console.log("error updating data");
    // }
  };

  console.log("Form data: ", formData);
  return (
    <>
      <Toaster position="top-center" reverseOrder={true} />
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
            <div>
              <Select
                label="Role"
                name="PR_ROLE"
                value={formData.PR_ROLE}
                onChange={handleChange}
                options={["Admin", "End_User", "Master"]}
              />
              {formErrors.PR_ROLE && (
                <p className="text-sm relative -top-3 text-red-500">{formErrors.PR_ROLE}</p>
              )}
            </div>
            <div>
              <Input
                label="Full Name"
                name="PR_FULL_NAME"
                value={formData.PR_FULL_NAME}
                onChange={handleChange}
              />
              {formErrors.PR_FULL_NAME && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_FULL_NAME}
                </p>
              )}
            </div>
            <div>
              <ImageUpload
                name="PR_PHOTO_URL"
                imageUrl={formData.PR_PHOTO_URL}
                onChange={handleChange}
              />
              {formErrors.PR_PHOTO_URL && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_PHOTO_URL}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Father's Name"
                name="PR_FATHER_NAME"
                value={formData.PR_FATHER_NAME}
                onChange={handleChange}
              />
              {formErrors.PR_FATHER_NAME && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_FATHER_NAME}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Mother's Name"
                name="PR_MOTHER_NAME"
                value={formData.PR_MOTHER_NAME}
                onChange={handleChange}
              />
              {formErrors.PR_MOTHER_NAME && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_MOTHER_NAME}
                </p>
              )}
            </div>
            {/* <Input
              label="Father ID"
              type="number"
              name="PR_FATHER_ID"
              value={formData.PR_FATHER_ID}
              onChange={handleChange}
            />
            <Input
              label="Mother ID"
              type="number"
              name="PR_MOTHER_ID"
              value={formData.PR_MOTHER_ID}
              onChange={handleChange}
            /> */}
            <div>
              <Input
                label="Date of Birth"
                name="PR_DOB"
                type="date"
                value={formData.PR_DOB}
                onChange={handleChange}
              />
              {formErrors.PR_DOB && (
                <p className="text-sm text-red-500">{formErrors.PR_DOB}</p>
              )}
            </div>
            <div>
              <Select
                label="Gender"
                name="PR_GENDER"
                value={formData.PR_GENDER}
                onChange={handleChange}
                options={["Male", "Female", "Other"]}
              />
              {formErrors.PR_GENDER && (
                <p className="text-sm text-red-500">{formErrors.PR_GENDER}</p>
              )}
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-4 w-full relative -top-4">
              <div className="flex-1">
                <Input
                  label="Mobile Number"
                  name="PR_MOBILE_NO"
                  type="tel"
                  value={formData.PR_MOBILE_NO}
                  onChange={handleChange}
                />
                {formErrors.PR_MOBILE_NO && (
                  <p className="text-sm text-red-500">
                    {formErrors.PR_MOBILE_NO}
                  </p>
                )}
              </div>

              {!otpSent && formData.PR_MOBILE_NO && (
                <button
                  type="button"
                  onClick={getOTP}
                  className="bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded-md shadow hover:bg-blue-700 transition-all duration-200"
                >
                  Generate OTP
                </button>
              )}
              {/* Show OTP error if any */}
              {otpSent && (
                <div className="flex border flex-col items-start justify-between gap-1 w-auto absolute top-20 left-0 bg-white p-2 rounded-md shadow-lg">
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm w-[50%]"
                  />
                  {otpError?.trim() && (
                    <p className="text-red-500 text-sm mt-1">{otpError}</p>
                  )}
                  <button
                    type="button"
                    onClick={verifyOTP}
                    className="bg-green-600 text-white text-sm font-medium px-3 py-2 w-50 rounded-md shadow hover:bg-green-700 transition-all duration-200"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>

            {/* <Input label="Hobby" name="PR_HOBBY" value={formData.PR_HOBBY} onChange={handleChange} /> */}
            <div>
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
              {formErrors.PR_HOBBY && (
                <p className="text-sm text-red-500">{formErrors.PR_HOBBY}</p>
              )}
            </div>
          </div>
        </div>

        {/* Married Status */}
        <div>
          <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
            Married Status
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Married?"
                name="PR_MARRIED_YN"
                value={formData.PR_MARRIED_YN}
                onChange={handleChange}
                options={["Yes", "No"]}
              />
              {formErrors.PR_MARRIED_YN && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_MARRIED_YN}
                </p>
              )}
            </div>
            <Input
              label="Spouse Name"
              name="PR_SPOUSE_NAME"
              value={formData.PR_SPOUSE_NAME}
              onChange={handleChange}
            />
            {/* <Input
              label="Spouse ID"
              name="PR_SPOUSE_ID"
              value={formData.PR_SPOUSE_ID}
              onChange={handleChange}
            /> */}
          </div>
        </div>

        <div>
          <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
            Children Details
          </h3>

          {children.map((child, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 border p-4 rounded-md"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Child Name
                </label>
                <input
                  type="text"
                  value={child.name}
                  onChange={(e) => {
                    const newChildren = [...children];
                    newChildren[index].name = e.target.value;
                    setChildren(newChildren);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 shadow-sm rounded-lg"
                  placeholder="Enter child name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={child.dob}
                  onChange={(e) => {
                    const newChildren = [...children];
                    newChildren[index].dob = e.target.value;
                    setChildren(newChildren);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 shadow-sm rounded-lg"
                />
              </div>

              <div className="col-span-2 text-right">
                <button
                  type="button"
                  onClick={() =>
                    setChildren((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="text-right">
            <button
              type="button"
              onClick={() => setChildren([...children, { name: "", dob: "" }])}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              + Add Child
            </button>
          </div>
        </div>

        {/* Address Details */}
        <div>
          <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
            Address Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Address"
                name="PR_ADDRESS"
                value={formData.PR_ADDRESS}
                onChange={handleChange}
              />
              {formErrors.PR_ADDRESS && (
                <p className="text-sm text-red-500">{formErrors.PR_ADDRESS}</p>
              )}
            </div>
            <div>
              <Input
                label="Area"
                name="PR_AREA_NAME"
                value={formData.PR_AREA_NAME}
                onChange={handleChange}
              />
              {formErrors.PR_AREA_NAME && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_AREA_NAME}
                </p>
              )}
            </div>
            {/* <Input
            label="Pincode"
            name="PR_PIN_CODE"
            value={formData.PR_PIN_CODE}
            onChange={handleChange}
          /> */}
            <div>
              <Select
                label="Pincode"
                name="PR_PIN_CODE"
                value={formData.PR_PIN_CODE}
                onChange={handleChange}
                options={uniquePincodes}
              />
              {formErrors.PR_PIN_CODE && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_PIN_CODE}
                </p>
              )}
            </div>
            {/* <Input label="City" name="PR_CITY_CODE" value={formData.PR_CITY_CODE} onChange={handleChange} /> */}
            <div>
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
              {formErrors.PR_CITY_CODE && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_CITY_CODE}
                </p>
              )}
            </div>
            {/* <Input label="District" name="PR_DISTRICT_CODE" value={formData.PR_DISTRICT_CODE} onChange={handleChange} /> */}
            <div>
              <Select
                label="District"
                name="PR_DISTRICT_CODE"
                value={formData.PR_DISTRICT_CODE}
                onChange={handleChange}
                options={uniqueDistricts}
              />
              {formErrors.PR_DISTRICT_CODE && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_DISTRICT_CODE}
                </p>
              )}
            </div>
            {/* <Input label="State" name="PR_STATE_CODE" value={formData.PR_STATE_CODE} onChange={handleChange} /> */}
            <div>
              <Select
                label="State"
                name="PR_STATE_CODE"
                value={formData.PR_STATE_CODE}
                onChange={handleChange}
                options={uniqueStates}
              />
              {formErrors.PR_STATE_CODE && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_STATE_CODE}
                </p>
              )}
            </div>
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
            <div>
              <Select
                label="Education"
                name="PR_EDUCATION"
                value={formData.PR_EDUCATION}
                onChange={handleChange}
                options={edu.map((item) => ({
                  label: item.EDUCATION_NAME,
                  value: item.EDUCATION_NAME,
                }))}
              />
              {formErrors.PR_EDUCATION && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_EDUCATION}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Education Description"
                name="PR_EDUCATION_DESC"
                value={formData.PR_EDUCATION_DESC}
                onChange={handleChange}
              />
              {formErrors.PR_EDUCATION_DESC && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_EDUCATION_DESC}
                </p>
              )}
            </div>
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
            <div>
              <Select
                label="Profession"
                name="PR_PROFESSION"
                value={formData.PR_PROFESSION}
                onChange={handleChange}
                options={professions.map((item) => ({
                  label: item.PROF_NAME,
                  value: item.PROF_NAME,
                }))}
              />
              {formErrors.PR_PROFESSION && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_PROFESSION}
                </p>
              )}
            </div>
            {/* <Input
              label="Profession ID"
              name="PR_PROFESSION_ID"
              value={formData.PR_PROFESSION_ID}
              onChange={handleChange}
              disabled={true}
            /> */}
            <div>
              <Input
              type="text  "
              label="Profession Description"
              name="PR_PROFESSION_DETA"
              value={formData.PR_PROFESSION_DETA}
              onChange={handleChange}
            />
            {formErrors.PR_PROFESSION_DETA && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_PROFESSION_DETA}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div>
          <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
            Business Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <Input
              label="Business Code"
              name="PR_BUSS_CODE"
              value={formData.PR_BUSS_CODE}
              onChange={handleChange}
            /> */}
            {/* <Input
              label="Business Stream"
              name="PR_BUSS_STREAM"
              value={formData.PR_BUSS_STREAM}
              onChange={handleChange}
            /> */}
            <div>
              <Select
              label="Business"
              name="PR_BUSS_STREAM"
              value={formData.PR_BUSS_STREAM}
              onChange={handleChange}
              options={business.map((item) => ({
                label: item.BUSS_STREM,
                value: item.BUSS_STREM,
              }))}
            />
            {formErrors.PR_BUSS_STREAM && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_BUSS_STREAM}
                </p>
              )}
            </div>
            <div>
              <Input
              label="Business Type"
              name="PR_BUSS_TYPE"
              value={formData.PR_BUSS_TYPE}
              onChange={handleChange}
            />
            {formErrors.PR_BUSS_TYPE && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_BUSS_TYPE}
                </p>
              )}
            </div>
            <Input
              label="Business Intrest"
              name="PR_BUSS_INTER"
              value={formData.PR_BUSS_INTER}
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
    </>
  );
};

export default AddUserForm;
