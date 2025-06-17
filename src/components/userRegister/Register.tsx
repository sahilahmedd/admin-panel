// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import React, { useEffect, useState } from "react";
// import Input from "../Input";
// import Select from "../Select";
// import ImageUpload from "../ImageUpload";
// import toast, { Toaster } from "react-hot-toast";
// import { useRouter } from "next/navigation";
// import {
//   validateRegistrationForm,
//   UserFormData,
//   FormErrors,
// } from "./validationSchema";
// import useFormDataFetch from "../../hooks/useFormDataFetch"; // New hook
// import useOtpManagement from "../../hooks/useOtpManagement"; // New hook
// import useIdMapping from "../../hooks/useIdMapping"; // New hook
// import ChildrenDetails from "@/components/userRegister/ChildrenDetails"; // New component

// const AddUserForm = () => {
//   const [formData, setFormData] = useState<UserFormData>({
//     PR_ROLE: "",
//     PR_FULL_NAME: "",
//     PR_PHOTO_URL: "",
//     PR_FATHER_NAME: "",
//     PR_MOTHER_NAME: "",
//     PR_FATHER_ID: null,
//     PR_MOTHER_ID: null,
//     PR_DOB: "",
//     PR_GENDER: "",
//     PR_MOBILE_NO: "",
//     PR_HOBBY: "",
//     PR_MARRIED_YN: "",
//     PR_SPOUSE_NAME: "",
//     PR_SPOUSE_ID: null,
//     PR_ADDRESS: "",
//     PR_AREA_NAME: "",
//     PR_PIN_CODE: "",
//     PR_CITY_CODE: "",
//     PR_DISTRICT_CODE: "",
//     PR_STATE_CODE: "",
//     PR_EDUCATION: "",
//     PR_EDUCATION_DESC: "",
//     PR_PROFESSION: "",
//     PR_PROFESSION_DETA: "",
//     PR_PROFESSION_ID: "",
//     PR_BUSS_STREAM: "",
//     PR_BUSS_TYPE: "",
//     PR_BUSS_CODE: "",
//     PR_BUSS_INTER: "",
//   });

//   const [formErrors, setFormErrors] = useState<FormErrors>({});
//   const [children, setChildren] = useState([{ name: "", dob: "" }]);
//   const [childrenErrors, setChildrenErrors] = useState<
//     { name?: string; dob?: string }[]
//   >([]);

//   const router = useRouter();

//   // Use custom hook for form data fetching
//   const { hobby, city, edu, professions, business } = useFormDataFetch();

//   // Use custom hook for OTP management
//   const {
//     otpSent,
//     otpVerified,
//     otpError,
//     otp,
//     cooldown,
//     isLoadingOTP,
//     isVerifyingOTP,
//     prId, // Destructure prId from useOtpManagement
//     setOtp,
//     setOtpVerified,
//     getOTP,
//     verifyOTP,
//   } = useOtpManagement({
//     mobileNo: formData.PR_MOBILE_NO,
//     verifyData: {
//       PR_MOBILE_NO: formData.PR_MOBILE_NO,
//       PR_FULL_NAME: formData.PR_FULL_NAME,
//       PR_DOB: formData.PR_DOB,
//       PR_ROLE: formData.PR_ROLE,
//     },
//     setFormErrors, // Pass setFormErrors to allow OTP hook to update form errors
//   });

//   // Use custom hook for ID mapping
//   const {
//     fatherUniqueId,
//     setFatherUniqueId,
//     motherUniqueId,
//     setMotherUniqueId,
//     spouseUniqueId,
//     setSpouseUniqueId,
//     fatherName,
//     setFatherName,
//     motherName,
//     setMotherName,
//     spouseName,
//     setSpouseName,
//     genderErrors,
//     setGenderErrors,
//     mapUniqueIdToPrId,
//   } = useIdMapping(formData.PR_GENDER, setFormData, setFormErrors); // Pass setFormErrors to useIdMapping

//   // Effect to clear form errors when data changes
//   useEffect(() => {
//     // Only update form errors if they are already present for a field,
//     // or if the user has attempted to submit the form.
//     // This effect now only runs to *clear* errors when input is corrected.
//     // Full validation happens only on submit.

//     // If there are existing errors, re-validate to clear them if input becomes valid
//     if (
//       Object.keys(formErrors).length > 0 ||
//       (formErrors.children &&
//         formErrors.children.some((c) => Object.keys(c).length > 0))
//     ) {
//       const newErrors = validateRegistrationForm({
//         formData,
//         genderErrors,
//         children,
//         otpVerified,
//         fatherUniqueId,
//         motherUniqueId,
//         spouseUniqueId,
//       });
//       setFormErrors(newErrors);
//       setChildrenErrors(newErrors.children || []);
//     }
//   }, [
//     formData,
//     children,
//     genderErrors,
//     otpVerified,
//     fatherUniqueId,
//     motherUniqueId,
//     spouseUniqueId,
//   ]);

//   useEffect(() => {
//     if (formData.PR_MARRIED_YN === "No") {
//       setFormData((prev) => ({
//         ...prev,
//         PR_SPOUSE_NAME: "",
//         PR_SPOUSE_ID: null,
//       }));
//       setSpouseUniqueId("");
//       setSpouseName("");
//       setGenderErrors((prev) => ({ ...prev, spouse: "" }));
//       setChildren([{ name: "", dob: "" }]);
//       setChildrenErrors([]);
//       const newFormErrors = { ...formErrors }; // Create a mutable copy
//       delete newFormErrors.PR_SPOUSE_NAME;
//       delete newFormErrors.PR_SPOUSE_ID;
//       if (newFormErrors.children) {
//         delete newFormErrors.children;
//       }
//       setFormErrors(newFormErrors);
//     }
//   }, [formData.PR_MARRIED_YN, formErrors]); // Added formErrors to dependencies

//   const handleChange = async (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     if (
//       name === "PR_PHOTO_URL" &&
//       e.target instanceof HTMLInputElement &&
//       e.target.files &&
//       e.target.files[0]
//     ) {
//       const file = e.target.files[0];
//       const formDataImage = new FormData();
//       formDataImage.append("image", file);

//       try {
//         const res = await fetch("/api/uploadImage", {
//           method: "POST",
//           body: formDataImage,
//         });

//         const data = await res.json();

//         if (data.status === "success") {
//           const imageUrl = `https://rangrezsamaj.kunxite.com/${data.url}`;
//           setFormData((prev) => ({
//             ...prev,
//             PR_PHOTO_URL: imageUrl,
//           }));
//         } else {
//           console.error("Image upload failed: ", data.message);
//           toast.error("Image upload failed");
//         }
//       } catch (error) {
//         console.error("Error uploading image: ", error);
//         toast.error("Error uploading image");
//       }
//       return;
//     }

//     if (
//       name === "PR_FATHER_ID" ||
//       name === "PR_MOTHER_ID" ||
//       name === "PR_SPOUSE_ID"
//     ) {
//       if (name === "PR_FATHER_ID") setFatherUniqueId(value);
//       if (name === "PR_MOTHER_ID") setMotherUniqueId(value);
//       if (name === "PR_SPOUSE_ID") setSpouseUniqueId(value);

//       const fieldType =
//         name === "PR_FATHER_ID"
//           ? "father"
//           : name === "PR_MOTHER_ID"
//           ? "mother"
//           : "spouse";

//       mapUniqueIdToPrId(value, fieldType); // Use the hook's function
//     } else if (name === "PR_PIN_CODE") {
//       const selectedCity = city.find((c: any) => c.CITY_PIN_CODE === value);
//       if (selectedCity) {
//         setFormData((prev) => ({
//           ...prev,
//           [name]: value,
//           PR_CITY_CODE: selectedCity.CITY_ID,
//           PR_DISTRICT_CODE: selectedCity.CITY_DS_CODE,
//           PR_STATE_CODE: selectedCity.CITY_ST_CODE,
//         }));
//       }
//       else {
//         setFormData((prev) => ({
//           ...prev,
//           [name]: value,
//         }));
//       }
//     } else if (name === "PR_PROFESSION") {
//       const selectedProfession = professions.find(
//         (p: any) => p.PROF_NAME === value
//       );
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//         PR_PROFESSION_ID: selectedProfession?.PROF_ID || "",
//         PR_PROFESSION_DETA: selectedProfession?.PROF_DESC || "",
//       }));
//     } else if (name === "PR_BUSS_STREAM") {
//       const selectedBusiness = business.find(
//         (b: any) => b.BUSS_STREM === value
//       );
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//         PR_BUSS_CODE: selectedBusiness?.BUSS_ID || "",
//         PR_BUSS_TYPE: selectedBusiness?.BUSS_TYPE || "",
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const errors = validateRegistrationForm({
//       formData,
//       genderErrors,
//       children,
//       otpVerified,
//       fatherUniqueId,
//       motherUniqueId,
//       spouseUniqueId,
//     });

//     setFormErrors(errors); // Always set all errors on submission

//     const hasErrors = Object.keys(errors).some((key) => {
//       if (key === "children") {
//         return errors.children?.some(
//           (childErr) => Object.keys(childErr).length > 0
//         );
//       }
//       return !!errors[key];
//     });

//     if (hasErrors) {
//       toast.error("Please correct the form errors.");
//       return;
//     }

//     const submissionData = {
//       ...formData,
//       Children: children,
//     };

//     try {
//       const res = await fetch(
//         "https://node2-plum.vercel.app/api/user/edit-profile",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             pr_id: String(prId), // Ensure prId is passed correctly from the OTP hook
//           },
//           body: JSON.stringify(submissionData),
//         }
//       );

//       const data = await res.json();

//       if (data.success) {
//         toast.success("User Added successfully!!!");
//         // Reset form data and states
//         setFormData({
//           PR_ROLE: "",
//           PR_FULL_NAME: "",
//           PR_PHOTO_URL: "",
//           PR_FATHER_NAME: "",
//           PR_MOTHER_NAME: "",
//           PR_FATHER_ID: null,
//           PR_MOTHER_ID: null,
//           PR_DOB: "",
//           PR_GENDER: "",
//           PR_MOBILE_NO: "",
//           PR_HOBBY: "",
//           PR_MARRIED_YN: "",
//           PR_SPOUSE_NAME: "",
//           PR_SPOUSE_ID: null,
//           PR_ADDRESS: "",
//           PR_AREA_NAME: "",
//           PR_PIN_CODE: "",
//           PR_CITY_CODE: "",
//           PR_DISTRICT_CODE: "",
//           PR_STATE_CODE: "",
//           PR_EDUCATION: "",
//           PR_EDUCATION_DESC: "",
//           PR_PROFESSION_ID: "",
//           PR_PROFESSION: "",
//           PR_PROFESSION_DETA: "",
//           PR_BUSS_CODE: "",
//           PR_BUSS_STREAM: "",
//           PR_BUSS_TYPE: "",
//           PR_BUSS_INTER: "",
//         });
//         setChildren([{ name: "", dob: "" }]);
//         setFatherUniqueId("");
//         setMotherUniqueId("");
//         setSpouseUniqueId("");
//         setFatherName("");
//         setMotherName("");
//         setSpouseName("");
//         setGenderErrors({ father: "", mother: "", spouse: "" });
//         setChildrenErrors([]);
//         setOtpVerified(false);
//         setOtp(""); // Clear OTP input
//         // setOtpSent(false);

//         router.push("/family/userview");
//       } else {
//         toast.error(data.message || "Error adding user!!!");
//       }
//     } catch (error) {
//       console.error("Submission error:", error);
//       toast.error("Failed to submit form due to a network error.");
//     }
//   };

//   const getUniqueOptions = (
//     items: any[],
//     labelKey: string,
//     valueKey: string
//   ) => {
//     return Array.from(
//       new Map(
//         items.map((item) => [
//           item[valueKey],
//           { label: item[labelKey], value: item[valueKey] },
//         ])
//       ).values()
//     );
//   };

//   const uniquePincodes = getUniqueOptions(
//     city,
//     "CITY_PIN_CODE",
//     "CITY_PIN_CODE"
//   );
//   const uniqueDistricts = getUniqueOptions(
//     city,
//     "CITY_DS_NAME",
//     "CITY_DS_CODE"
//   );
//   const uniqueStates = getUniqueOptions(city, "CITY_ST_NAME", "CITY_ST_CODE");

//   return (
//     <>
//       <Toaster position="top-center" reverseOrder={true} />
//       <form
//         onSubmit={handleSubmit}
//         className="max-w-6xl mx-auto p-6 border-1 border-gray-300 bg-white shadow-md rounded-md space-y-8"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
//           Add User
//         </h2>

//         {/* Personal Details */}
//         <div>
//           <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
//             Personal Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Select
//                 label="Role"
//                 name="PR_ROLE"
//                 value={formData.PR_ROLE}
//                 onChange={handleChange}
//                 options={["Admin", "End_User", "Master"]}
//               />
//               {formErrors.PR_ROLE && (
//                 <p className="text-sm relative -top-3 text-red-500">
//                   {formErrors.PR_ROLE}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Input
//                 label="Full Name"
//                 name="PR_FULL_NAME"
//                 value={formData.PR_FULL_NAME}
//                 onChange={handleChange}
//               />
//               {formErrors.PR_FULL_NAME && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_FULL_NAME}
//                 </p>
//               )}
//             </div>
//             <div>
//               <ImageUpload
//                 name="PR_PHOTO_URL"
//                 imageUrl={formData.PR_PHOTO_URL}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <Input
//                 label="Father's Name"
//                 name="PR_FATHER_NAME"
//                 value={fatherName || formData.PR_FATHER_NAME}
//                 onChange={(e) => {
//                   setFatherName(e.target.value);
//                   setFormData((prev) => ({
//                     ...prev,
//                     PR_FATHER_NAME: e.target.value,
//                   }));
//                 }}
//               />
//               {formErrors.PR_FATHER_NAME && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_FATHER_NAME}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Input
//                 label="Mother's Name"
//                 name="PR_MOTHER_NAME"
//                 value={motherName || formData.PR_MOTHER_NAME}
//                 onChange={(e) => {
//                   setMotherName(e.target.value);
//                   setFormData((prev) => ({
//                     ...prev,
//                     PR_MOTHER_NAME: e.target.value,
//                   }));
//                 }}
//               />
//               {formErrors.PR_MOTHER_NAME && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_MOTHER_NAME}
//                 </p>
//               )}
//             </div>

//             <div>
//               <Input
//                 label="Father ID (Enter Unique ID)"
//                 type="text"
//                 name="PR_FATHER_ID"
//                 value={fatherUniqueId}
//                 onChange={(e) => {
//                   setFatherUniqueId(e.target.value);
//                   mapUniqueIdToPrId(e.target.value, "father");
//                 }}
//               />
//               {genderErrors.father && (
//                 <p className="text-sm text-red-500 mt-1">
//                   {genderErrors.father}
//                 </p>
//               )}
//               {formErrors.PR_FATHER_ID && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_FATHER_ID}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Input
//                 label="Mother ID (Enter Unique ID)"
//                 type="text"
//                 name="PR_MOTHER_ID"
//                 value={motherUniqueId}
//                 onChange={(e) => {
//                   setMotherUniqueId(e.target.value);
//                   mapUniqueIdToPrId(e.target.value, "mother");
//                 }}
//               />
//               {genderErrors.mother && (
//                 <p className="text-sm text-red-500 mt-1">
//                   {genderErrors.mother}
//                 </p>
//               )}
//               {formErrors.PR_MOTHER_ID && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_MOTHER_ID}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Input
//                 label="Date of Birth"
//                 name="PR_DOB"
//                 type="date"
//                 value={formData.PR_DOB}
//                 onChange={handleChange}
//               />
//               {formErrors.PR_DOB && (
//                 <p className="text-sm text-red-500">{formErrors.PR_DOB}</p>
//               )}
//             </div>
//             <div>
//               <Select
//                 label="Gender"
//                 name="PR_GENDER"
//                 value={formData.PR_GENDER}
//                 onChange={handleChange}
//                 options={["Male", "Female", "Other"]}
//               />
//               {formErrors.PR_GENDER && (
//                 <p className="text-sm text-red-500">{formErrors.PR_GENDER}</p>
//               )}
//             </div>

//             {/* OTP UI */}
//             <div className="flex flex-col md:flex-row md:items-end gap-4 w-full relative -top-4">
//               <div className="flex-1">
//                 <Input
//                   label="Mobile Number"
//                   name="PR_MOBILE_NO"
//                   type="tel"
//                   value={formData.PR_MOBILE_NO}
//                   onChange={handleChange}
//                 />
//                 {formErrors.PR_MOBILE_NO && (
//                   <p className="text-sm text-red-500">
//                     {formErrors.PR_MOBILE_NO}
//                   </p>
//                 )}
//               </div>

//               {!otpSent &&
//                 /^\d{10}$/.test(formData.PR_MOBILE_NO) &&
//                 !otpVerified && (
//                   <button
//                     type="button"
//                     onClick={getOTP}
//                     disabled={isLoadingOTP}
//                     className="bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded-md shadow hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isLoadingOTP ? "Sending OTP..." : "Generate OTP"}
//                   </button>
//                 )}
//               {otpSent && !otpVerified && (
//                 <div className="flex border flex-col items-start justify-between gap-1 w-auto absolute top-20 left-0 bg-white p-2 rounded-md shadow-lg z-10">
//                   <input
//                     type="text"
//                     name="otp"
//                     placeholder="Enter OTP"
//                     value={otp}
//                     onChange={(e) => setOtp(e.target.value)}
//                     className="border border-gray-300 rounded px-3 py-1 text-sm w-[50%]"
//                   />
//                   {otpError?.trim() && (
//                     <p className="text-red-500 text-sm mt-1">{otpError}</p>
//                   )}
//                   {formErrors.otp && (
//                     <p className="text-sm text-red-500 mt-1">
//                       {formErrors.otp}
//                     </p>
//                   )}
//                   <button
//                     type="button"
//                     onClick={verifyOTP}
//                     disabled={isVerifyingOTP}
//                     className="bg-green-600 text-white text-sm font-medium px-3 py-2 w-50 rounded-md shadow hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isVerifyingOTP ? "Verifying..." : "Verify"}
//                   </button>
//                   <p className="text-xs text-gray-500">
//                     You can resend OTP in {cooldown}s
//                   </p>
//                 </div>
//               )}
//               {otpVerified && (
//                 <p className="text-sm text-green-600 ml-2 mt-1">
//                   &#10004; OTP Verified!
//                 </p>
//               )}
//             </div>

//             <div>
//               <Select
//                 label="Hobby"
//                 name="PR_HOBBY"
//                 value={formData.PR_HOBBY}
//                 onChange={handleChange}
//                 options={hobby.map((item: any) => ({
//                   label: item.HOBBY_NAME,
//                   value: item.HOBBY_NAME,
//                 }))}
//               />
//               {formErrors.PR_HOBBY && (
//                 <p className="text-sm text-red-500">{formErrors.PR_HOBBY}</p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Married Status */}
//         <div>
//           <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
//             Married Status
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Select
//                 label="Married?"
//                 name="PR_MARRIED_YN"
//                 value={formData.PR_MARRIED_YN}
//                 onChange={handleChange}
//                 options={["Yes", "No"]}
//               />
//               {formErrors.PR_MARRIED_YN && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_MARRIED_YN}
//                 </p>
//               )}
//             </div>

//             {formData.PR_MARRIED_YN === "Yes" && (
//               <>
//                 <div>
//                   <Input
//                     label="Spouse Name"
//                     name="PR_SPOUSE_NAME"
//                     value={spouseName || formData.PR_SPOUSE_NAME}
//                     onChange={(e) => {
//                       setSpouseName(e.target.value);
//                       setFormData((prev) => ({
//                         ...prev,
//                         PR_SPOUSE_NAME: e.target.value,
//                       }));
//                     }}
//                   />
//                   {formErrors.PR_SPOUSE_NAME && (
//                     <p className="text-sm text-red-500">
//                       {formErrors.PR_SPOUSE_NAME}
//                     </p>
//                   )}
//                 </div>
//                 <div>
//                   <Input
//                     label="Spouse ID (Enter Unique ID)"
//                     type="text"
//                     name="PR_SPOUSE_ID"
//                     value={spouseUniqueId}
//                     onChange={(e) => {
//                       setSpouseUniqueId(e.target.value);
//                       mapUniqueIdToPrId(e.target.value, "spouse");
//                     }}
//                   />
//                   {formErrors.PR_SPOUSE_ID && (
//                     <p className="text-sm text-red-500">
//                       {formErrors.PR_SPOUSE_ID}
//                     </p>
//                   )}
//                   {genderErrors.spouse && (
//                     <p className="text-sm text-red-500 mt-1">
//                       {genderErrors.spouse}
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Conditionally show children section */}
//         {formData.PR_MARRIED_YN === "Yes" && (
//           <ChildrenDetails
//             children={children}
//             setChildren={setChildren}
//             childrenErrors={childrenErrors}
//           />
//         )}

//         {/* Address Details */}
//         <div>
//           <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
//             Address Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Input
//                 label="Address"
//                 name="PR_ADDRESS"
//                 value={formData.PR_ADDRESS}
//                 onChange={handleChange}
//               />
//               {formErrors.PR_ADDRESS && (
//                 <p className="text-sm text-red-500">{formErrors.PR_ADDRESS}</p>
//               )}
//             </div>

//             <div>
//               <Select
//                 label="Pincode"
//                 name="PR_PIN_CODE"
//                 value={formData.PR_PIN_CODE}
//                 onChange={handleChange}
//                 options={uniquePincodes}
//               />
//               {formErrors.PR_PIN_CODE && (
//                 <p className="text-sm relative -top-4 text-red-500">
//                   {formErrors.PR_PIN_CODE}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Select
//                 label="City"
//                 name="PR_CITY_CODE"
//                 value={formData.PR_CITY_CODE}
//                 onChange={handleChange}
//                 options={city.map((item: any) => ({
//                   label: item.CITY_NAME,
//                   value: item.CITY_ID,
//                 }))}
//               />
//               {formErrors.PR_CITY_CODE && (
//                 <p className="text-sm relative -top-4 text-red-500">
//                   {formErrors.PR_CITY_CODE}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Select
//                 label="District"
//                 name="PR_DISTRICT_CODE"
//                 value={formData.PR_DISTRICT_CODE}
//                 onChange={handleChange}
//                 options={uniqueDistricts}
//               />
//               {formErrors.PR_DISTRICT_CODE && (
//                 <p className="text-sm relative -top-4 text-red-500">
//                   {formErrors.PR_DISTRICT_CODE}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Select
//                 label="State"
//                 name="PR_STATE_CODE"
//                 value={formData.PR_STATE_CODE}
//                 onChange={handleChange}
//                 options={uniqueStates}
//               />
//               {formErrors.PR_STATE_CODE && (
//                 <p className="text-sm relative -top-4 text-red-500">
//                   {formErrors.PR_STATE_CODE}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Education Details */}
//         <div>
//           <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
//             Education Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Select
//                 label="Education"
//                 name="PR_EDUCATION"
//                 value={formData.PR_EDUCATION}
//                 onChange={handleChange}
//                 options={edu.map((item: any) => ({
//                   label: item.EDUCATION_NAME,
//                   value: item.EDUCATION_NAME,
//                 }))}
//               />
//               {formErrors.PR_EDUCATION && (
//                 <p className="text-sm relative -top-4 text-red-500">
//                   {formErrors.PR_EDUCATION}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Input
//                 label="Education Description"
//                 name="PR_EDUCATION_DESC"
//                 value={formData.PR_EDUCATION_DESC}
//                 onChange={handleChange}
//               />
//               {formErrors.PR_EDUCATION_DESC && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_EDUCATION_DESC}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Professional Details */}
//         <div>
//           <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
//             Professional Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Select
//                 label="Profession"
//                 name="PR_PROFESSION"
//                 value={formData.PR_PROFESSION}
//                 onChange={handleChange}
//                 options={professions.map((item: any) => ({
//                   label: item.PROF_NAME,
//                   value: item.PROF_NAME,
//                 }))}
//               />
//               {formErrors.PR_PROFESSION && (
//                 <p className="text-sm relative -top-4 text-red-500">
//                   {formErrors.PR_PROFESSION}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Input
//                 type="text"
//                 label="Profession Description"
//                 name="PR_PROFESSION_DETA"
//                 value={formData.PR_PROFESSION_DETA}
//                 onChange={handleChange}
//               />
//               {formErrors.PR_PROFESSION_DETA && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_PROFESSION_DETA}
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Business Details */}
//         <div>
//           <h3 className="text-xl p-2 bg-gray-200 rounded font-medium mb-3">
//             Business Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <Select
//                 label="Business"
//                 name="PR_BUSS_STREAM"
//                 value={formData.PR_BUSS_STREAM}
//                 onChange={handleChange}
//                 options={business.map((item: any) => ({
//                   label: item.BUSS_STREM,
//                   value: item.BUSS_STREM,
//                 }))}
//               />
//               {formErrors.PR_BUSS_STREAM && (
//                 <p className="text-sm relative -top-4 text-red-500">
//                   {formErrors.PR_BUSS_STREAM}
//                 </p>
//               )}
//             </div>
//             <div>
//               <Input
//                 label="Business Type"
//                 name="PR_BUSS_TYPE"
//                 value={formData.PR_BUSS_TYPE}
//                 onChange={handleChange}
//               />
//               {formErrors.PR_BUSS_TYPE && (
//                 <p className="text-sm text-red-500">
//                   {formErrors.PR_BUSS_TYPE}
//                 </p>
//               )}
//             </div>
//             <Select
//               label="Business Intrest"
//               name="PR_BUSS_INTER"
//               value={formData.PR_BUSS_INTER}
//               onChange={handleChange}
//               options={["Yes", "No"]}
//             />
//           </div>
//         </div>

//         <div className="text-center mt-8 flex justify-center gap-4">
//           <button
//             type="submit"
//             className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
//           >
//             Save
//           </button>
//           <button
//             type="button"
//             onClick={() => router.push("/family/userview")}
//             className="bg-gray-500 text-white font-semibold px-6 py-2 rounded hover:bg-gray-600 transition"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </>
//   );
// };

// export default AddUserForm;


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Input from "../Input";
import Select from "../Select";
import ImageUpload from "../ImageUpload";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  validateRegistrationForm,
  UserFormData,
  FormErrors,
} from "./validationSchema";
import useFormDataFetch from "../../hooks/useFormDataFetch"; // New hook
import useOtpManagement from "../../hooks/useOtpManagement"; // New hook
import useIdMapping from "../../hooks/useIdMapping"; // New hook
import ChildrenDetails from "@/components/userRegister/ChildrenDetails"; // New component

const AddUserForm = () => {
  const [formData, setFormData] = useState<UserFormData>({
    PR_ROLE: "",
    PR_FULL_NAME: "",
    PR_PHOTO_URL: "",
    PR_FATHER_NAME: "",
    PR_MOTHER_NAME: "",
    PR_FATHER_ID: null,
    PR_MOTHER_ID: null,
    PR_DOB: "",
    PR_GENDER: "",
    PR_MOBILE_NO: "",
    PR_HOBBY: "",
    PR_MARRIED_YN: "",
    PR_SPOUSE_NAME: "",
    PR_SPOUSE_ID: null,
    PR_ADDRESS: "",
    PR_AREA_NAME: "",
    PR_PIN_CODE: "",
    PR_CITY_CODE: "",
    PR_DISTRICT_CODE: "",
    PR_STATE_CODE: "",
    PR_EDUCATION: "",
    PR_EDUCATION_DESC: "",
    PR_PROFESSION: "",
    PR_PROFESSION_DETA: "",
    PR_PROFESSION_ID: "",
    PR_BUSS_STREAM: "",
    PR_BUSS_TYPE: "",
    PR_BUSS_CODE: "",
    PR_BUSS_INTER: "",
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [children, setChildren] = useState([{ name: "", dob: "" }]);
  const [childrenErrors, setChildrenErrors] = useState<
    { name?: string; dob?: string }[]
  >([]);

  // State to hold cities filtered by selected pincode
  const [filteredCities, setFilteredCities] = useState<any[]>([]);

  const router = useRouter();

  // Use custom hook for form data fetching
  const { hobby, city, edu, professions, business } = useFormDataFetch();

  // Use custom hook for OTP management
  const {
    otpSent,
    otpVerified,
    otpError,
    otp,
    cooldown,
    isLoadingOTP,
    isVerifyingOTP,
    prId, // Destructure prId from useOtpManagement
    setOtp,
    setOtpVerified,
    getOTP,
    verifyOTP,
  } = useOtpManagement({
    mobileNo: formData.PR_MOBILE_NO,
    verifyData: {
      PR_MOBILE_NO: formData.PR_MOBILE_NO,
      PR_FULL_NAME: formData.PR_FULL_NAME,
      PR_DOB: formData.PR_DOB,
      PR_ROLE: formData.PR_ROLE,
    },
    setFormErrors, // Pass setFormErrors to allow OTP hook to update form errors
  });

  // Use custom hook for ID mapping
  const {
    fatherUniqueId,
    setFatherUniqueId,
    motherUniqueId,
    setMotherUniqueId,
    spouseUniqueId,
    setSpouseUniqueId,
    fatherName,
    setFatherName,
    motherName,
    setMotherName,
    spouseName,
    setSpouseName,
    genderErrors,
    setGenderErrors,
    mapUniqueIdToPrId,
  } = useIdMapping(formData.PR_GENDER, setFormData, setFormErrors); // Pass setFormErrors to useIdMapping

  // Effect to clear form errors when data changes
  useEffect(() => {
    if (
      Object.keys(formErrors).length > 0 ||
      (formErrors.children &&
        formErrors.children.some((c) => Object.keys(c).length > 0))
    ) {
      const newErrors = validateRegistrationForm({
        formData,
        genderErrors,
        children,
        otpVerified,
        fatherUniqueId,
        motherUniqueId,
        spouseUniqueId,
      });
      setFormErrors(newErrors);
      setChildrenErrors(newErrors.children || []);
    }
  }, [
    formData,
    children,
    genderErrors,
    otpVerified,
    fatherUniqueId,
    motherUniqueId,
    spouseUniqueId,
  ]);

  // Effect to handle Married status change
  useEffect(() => {
    if (formData.PR_MARRIED_YN === "No") {
      setFormData((prev) => ({
        ...prev,
        PR_SPOUSE_NAME: "",
        PR_SPOUSE_ID: null,
      }));
      setSpouseUniqueId("");
      setSpouseName("");
      setGenderErrors((prev) => ({ ...prev, spouse: "" }));
      setChildren([{ name: "", dob: "" }]);
      setChildrenErrors([]);
      const newFormErrors = { ...formErrors }; // Create a mutable copy
      delete newFormErrors.PR_SPOUSE_NAME;
      delete newFormErrors.PR_SPOUSE_ID;
      if (newFormErrors.children) {
        delete newFormErrors.children;
      }
      setFormErrors(newFormErrors);
    }
  }, [formData.PR_MARRIED_YN, formErrors]);

  // Effect to log formData on every change
  useEffect(() => {
    console.log("Current formData:", formData);
  }, [formData]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

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

        if (data.status === "success") {
          const imageUrl = `https://rangrezsamaj.kunxite.com/${data.url}`;
          setFormData((prev) => ({
            ...prev,
            PR_PHOTO_URL: imageUrl,
          }));
        } else {
          console.error("Image upload failed: ", data.message);
          toast.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
        toast.error("Error uploading image");
      }
      return;
    }

    if (
      name === "PR_FATHER_ID" ||
      name === "PR_MOTHER_ID" ||
      name === "PR_SPOUSE_ID"
    ) {
      if (name === "PR_FATHER_ID") setFatherUniqueId(value);
      if (name === "PR_MOTHER_ID") setMotherUniqueId(value);
      if (name === "PR_SPOUSE_ID") setSpouseUniqueId(value);

      const fieldType =
        name === "PR_FATHER_ID"
          ? "father"
          : name === "PR_MOTHER_ID"
          ? "mother"
          : "spouse";

      mapUniqueIdToPrId(value, fieldType); // Use the hook's function
    } else if (name === "PR_PIN_CODE") {
      const selectedCitiesForPincode = city.filter(
        (c: any) => c.CITY_PIN_CODE === value
      );

      // Set filtered cities. Add an empty option as the first choice to "Select City".
      setFilteredCities(
        selectedCitiesForPincode.length > 0
          ? [{ CITY_ID: "", CITY_NAME: "Select City", CITY_PIN_CODE: "", CITY_DS_CODE: "", CITY_ST_CODE: "" }, ...selectedCitiesForPincode]
          : [] // If no cities for pincode, clear options
      );

      // Prepare updated formData: Always clear City, District, State, and Area Name when Pincode changes
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Set the selected pincode
        PR_CITY_CODE: "",
        PR_DISTRICT_CODE: "",
        PR_STATE_CODE: "",
        PR_AREA_NAME: "",
      }));

    } else if (name === "PR_CITY_CODE") {
      const selectedCity = city.find((c: any) => String(c.CITY_ID) === value);
      
      // If a city is found, update relevant fields based on that city
      if (selectedCity) {
        setFormData((prev) => ({
          ...prev,
          [name]: value, // Set the selected city's ID
          PR_AREA_NAME: selectedCity.CITY_NAME, // Set Area Name
          PR_PIN_CODE: selectedCity.CITY_PIN_CODE, // Ensure Pincode matches selected City
          PR_DISTRICT_CODE: selectedCity.CITY_DS_CODE, // Update District Code
          PR_STATE_CODE: selectedCity.CITY_ST_CODE, // Update State Code
        }));
      } else {
        // If no city is selected (e.g., value becomes empty or "Select City"), clear dependent fields
        setFormData((prev) => ({
          ...prev,
          [name]: value, // Keep the empty value
          PR_AREA_NAME: "",
          PR_DISTRICT_CODE: "",
          PR_STATE_CODE: "",
          // Do NOT clear PR_PIN_CODE here if it was set by pincode selection
          // as the user might want to select a new city under the same pincode later.
        }));
      }
    } else if (name === "PR_PROFESSION") {
      const selectedProfession = professions.find(
        (p: any) => p.PROF_NAME === value
      );
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        PR_PROFESSION_ID: selectedProfession?.PROF_ID || "",
        PR_PROFESSION_DETA: selectedProfession?.PROF_DESC || "",
      }));
    } else if (name === "PR_BUSS_STREAM") {
      const selectedBusiness = business.find(
        (b: any) => b.BUSS_STREM === value
      );
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        PR_BUSS_CODE: selectedBusiness?.BUSS_ID || "",
        PR_BUSS_TYPE: selectedBusiness?.BUSS_TYPE || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateRegistrationForm({
      formData,
      genderErrors,
      children,
      otpVerified,
      fatherUniqueId,
      motherUniqueId,
      spouseUniqueId,
    });

    setFormErrors(errors); // Always set all errors on submission

    const hasErrors = Object.keys(errors).some((key) => {
      if (key === "children") {
        return errors.children?.some(
          (childErr) => Object.keys(childErr).length > 0
        );
      }
      return !!errors[key];
    });

    if (hasErrors) {
      toast.error("Please correct the form errors.");
      return;
    }

    const submissionData = {
      ...formData,
      Children: children,
    };

    try {
      const res = await fetch(
        "https://node2-plum.vercel.app/api/user/edit-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            pr_id: String(prId), // Ensure prId is passed correctly from the OTP hook
          },
          body: JSON.stringify(submissionData),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("User Added successfully!!!");
        // Reset form data and states
        setFormData({
          PR_ROLE: "",
          PR_FULL_NAME: "",
          PR_PHOTO_URL: "",
          PR_FATHER_NAME: "",
          PR_MOTHER_NAME: "",
          PR_FATHER_ID: null,
          PR_MOTHER_ID: null,
          PR_DOB: "",
          PR_GENDER: "",
          PR_MOBILE_NO: "",
          PR_HOBBY: "",
          PR_MARRIED_YN: "",
          PR_SPOUSE_NAME: "",
          PR_SPOUSE_ID: null,
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
          PR_BUSS_INTER: "",
          
        });
        setChildren([{ name: "", dob: "" }]);
        setFatherUniqueId("");
        setMotherUniqueId("");
        setSpouseUniqueId("");
        setFatherName("");
        setMotherName("");
        setSpouseName("");
        setGenderErrors({ father: "", mother: "", spouse: "" });
        setChildrenErrors([]);
        setOtpVerified(false);
        setOtp(""); // Clear OTP input
        setFilteredCities([]); // Clear filtered cities on form reset

        router.push("/family/userview");
      } else {
        toast.error(data.message || "Error adding user!!!");
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit form due to a network error.");
    }
  };

  const getUniqueOptions = (
    items: any[],
    labelKey: string,
    valueKey: string
  ) => {
    return Array.from(
      new Map(
        items.map((item) => [
          item[valueKey],
          { label: item[labelKey], value: item[valueKey] },
        ])
      ).values()
    );
  };

  const uniquePincodes = getUniqueOptions(
    city,
    "CITY_PIN_CODE",
    "CITY_PIN_CODE"
  );
  const uniqueDistricts = getUniqueOptions(
    city,
    "CITY_DS_NAME",
    "CITY_DS_CODE"
  );
  const uniqueStates = getUniqueOptions(city, "CITY_ST_NAME", "CITY_ST_CODE");

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
                <p className="text-sm relative -top-3 text-red-500">
                  {formErrors.PR_ROLE}
                </p>
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
            </div>

            <div>
              <Input
                label="Father's Name"
                name="PR_FATHER_NAME"
                value={fatherName || formData.PR_FATHER_NAME}
                onChange={(e) => {
                  setFatherName(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    PR_FATHER_NAME: e.target.value,
                  }));
                }}
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
                value={motherName || formData.PR_MOTHER_NAME}
                onChange={(e) => {
                  setMotherName(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    PR_MOTHER_NAME: e.target.value,
                  }));
                }}
              />
              {formErrors.PR_MOTHER_NAME && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_MOTHER_NAME}
                </p>
              )}
            </div>

            <div>
              <Input
                label="Father ID (Enter Unique ID)"
                type="text"
                name="PR_FATHER_ID"
                value={fatherUniqueId}
                onChange={(e) => {
                  setFatherUniqueId(e.target.value);
                  mapUniqueIdToPrId(e.target.value, "father");
                }}
              />
              {genderErrors.father && (
                <p className="text-sm text-red-500 mt-1">
                  {genderErrors.father}
                </p>
              )}
              {formErrors.PR_FATHER_ID && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_FATHER_ID}
                </p>
              )}
            </div>
            <div>
              <Input
                label="Mother ID (Enter Unique ID)"
                type="text"
                name="PR_MOTHER_ID"
                value={motherUniqueId}
                onChange={(e) => {
                  setMotherUniqueId(e.target.value);
                  mapUniqueIdToPrId(e.target.value, "mother");
                }}
              />
              {genderErrors.mother && (
                <p className="text-sm text-red-500 mt-1">
                  {genderErrors.mother}
                </p>
              )}
              {formErrors.PR_MOTHER_ID && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_MOTHER_ID}
                </p>
              )}
            </div>
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

            {/* OTP UI */}
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

              {!otpSent &&
                /^\d{10}$/.test(formData.PR_MOBILE_NO) &&
                !otpVerified && (
                  <button
                    type="button"
                    onClick={getOTP}
                    disabled={isLoadingOTP}
                    className="bg-gray-600 text-white text-sm font-medium px-3 py-2 rounded-md shadow hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingOTP ? "Sending OTP..." : "Generate OTP"}
                  </button>
                )}
              {otpSent && !otpVerified && (
                <div className="flex border flex-col items-start justify-between gap-1 w-auto absolute top-20 left-0 bg-white p-2 rounded-md shadow-lg z-10">
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
                  {formErrors.otp && (
                    <p className="text-sm text-red-500 mt-1">
                      {formErrors.otp}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={isVerifyingOTP}
                    className="bg-green-600 text-white text-sm font-medium px-3 py-2 w-50 rounded-md shadow hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifyingOTP ? "Verifying..." : "Verify"}
                  </button>
                  <p className="text-xs text-gray-500">
                    You can resend OTP in {cooldown}s
                  </p>
                </div>
              )}
              {otpVerified && (
                <p className="text-sm text-green-600 ml-2 mt-1">
                  &#10004; OTP Verified!
                </p>
              )}
            </div>

            <div>
              <Select
                label="Hobby"
                name="PR_HOBBY"
                value={formData.PR_HOBBY}
                onChange={handleChange}
                options={hobby.map((item: any) => ({
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

            {formData.PR_MARRIED_YN === "Yes" && (
              <>
                <div>
                  <Input
                    label="Spouse Name"
                    name="PR_SPOUSE_NAME"
                    value={spouseName || formData.PR_SPOUSE_NAME}
                    onChange={(e) => {
                      setSpouseName(e.target.value);
                      setFormData((prev) => ({
                        ...prev,
                        PR_SPOUSE_NAME: e.target.value,
                      }));
                    }}
                  />
                  {formErrors.PR_SPOUSE_NAME && (
                    <p className="text-sm text-red-500">
                      {formErrors.PR_SPOUSE_NAME}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    label="Spouse ID (Enter Unique ID)"
                    type="text"
                    name="PR_SPOUSE_ID"
                    value={spouseUniqueId}
                    onChange={(e) => {
                      setSpouseUniqueId(e.target.value);
                      mapUniqueIdToPrId(e.target.value, "spouse");
                    }}
                  />
                  {formErrors.PR_SPOUSE_ID && (
                    <p className="text-sm text-red-500">
                      {formErrors.PR_SPOUSE_ID}
                    </p>
                  )}
                  {genderErrors.spouse && (
                    <p className="text-sm text-red-500 mt-1">
                      {genderErrors.spouse}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Conditionally show children section */}
        {formData.PR_MARRIED_YN === "Yes" && (
          <ChildrenDetails
            children={children}
            setChildren={setChildren}
            childrenErrors={childrenErrors}
          />
        )}

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
            <div>
              {/* City dropdown now uses filteredCities */}
              <Select
                label="City"
                name="PR_CITY_CODE"
                value={formData.PR_CITY_CODE}
                onChange={handleChange}
                options={filteredCities.map((item: any) => ({
                  label: item.CITY_NAME,
                  value: item.CITY_ID,
                }))}
                // Disable if no pincode selected or no cities found for pincode
                // disabled={!formData.PR_PIN_CODE || filteredCities.length <= 1} // Check for >1 because of "Select City" option
              />
              {formErrors.PR_CITY_CODE && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_CITY_CODE}
                </p>
              )}
            </div>
            {/* PR_AREA_NAME will be an Input field, its value set by pincode or city selection */}
            <div>
              <Input
                label="Area Name"
                name="PR_AREA_NAME"
                value={formData.PR_AREA_NAME}
                onChange={handleChange} // Allow manual override if needed
              />
              {formErrors.PR_AREA_NAME && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_AREA_NAME}
                </p>
              )}
            </div>
            <div>
              <Select
                label="District"
                name="PR_DISTRICT_CODE"
                value={formData.PR_DISTRICT_CODE}
                onChange={handleChange}
                options={uniqueDistricts}
                // disabled={!formData.PR_CITY_CODE} // Disable if city not selected
              />
              {formErrors.PR_DISTRICT_CODE && (
                <p className="text-sm relative -top-4 text-red-500">
                  {formErrors.PR_DISTRICT_CODE}
                </p>
              )}
            </div>
            <div>
              <Select
                label="State"
                name="PR_STATE_CODE"
                value={formData.PR_STATE_CODE}
                onChange={handleChange}
                options={uniqueStates}
                // disabled={!formData.PR_CITY_CODE} // Disable if city not selected
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
            <div>
              <Select
                label="Education"
                name="PR_EDUCATION"
                value={formData.PR_EDUCATION}
                onChange={handleChange}
                options={edu.map((item: any) => ({
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
            <div>
              <Select
                label="Profession"
                name="PR_PROFESSION"
                value={formData.PR_PROFESSION}
                onChange={handleChange}
                options={professions.map((item: any) => ({
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
            <div>
              <Input
                type="text"
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
            <div>
              <Select
                label="Business"
                name="PR_BUSS_STREAM"
                value={formData.PR_BUSS_STREAM}
                onChange={handleChange}
                options={business.map((item: any) => ({
                  label: item.BUSS_STREM,
                  value: item.BUSS_CODE,
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
            <Select
              label="Business Intrest"
              name="PR_BUSS_INTER"
              value={formData.PR_BUSS_INTER}
              onChange={handleChange}
              options={["Yes", "No"]}
            />
          </div>
        </div>

        <div className="text-center mt-8 flex justify-center gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => router.push("/family/userview")}
            className="bg-gray-500 text-white font-semibold px-6 py-2 rounded hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};

export default AddUserForm;
