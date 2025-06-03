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
  PR_FATHER_ID: string | null;
  PR_MOTHER_ID: string | null;
  PR_DOB: string;
  PR_GENDER: string;
  PR_MOBILE_NO: string;
  PR_HOBBY: string;
  PR_MARRIED_YN: string;
  PR_SPOUSE_NAME: string;
  PR_ADDRESS: string;
  // PR_AREA_NAME: string;
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

type FormState = UserFormData & {
  PR_SPOUSE_ID: string | null;
  PR_PROFESSION_ID: string | null;
  PR_BUSS_CODE: string;
};

type FormErrors = Partial<Record<keyof UserFormData | "otp", string>>;

const AddUserForm = () => {
  const [formData, setFormData] = useState({
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
    // PR_AREA_NAME: "",
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
  const [cooldown, setCooldown] = useState(60);
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [childrenErrors, setChildrenErrors] = useState<
    { name?: string; dob?: string }[]
  >([]);
  const [childNameErrors, setChildNameErrors] = useState<string[]>([]);
  // Add these state variables after the existing useState declarations
  // Add these state variables after the existing useState declarations
  const [fatherUniqueId, setFatherUniqueId] = useState("");
  const [motherUniqueId, setMotherUniqueId] = useState("");
  const [spouseUniqueId, setSpouseUniqueId] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    if (cooldown > 0 && otpSent) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown, otpSent]);

  // Fetch all users
  const getAllUsers = async () => {
    try {
      const res = await fetch("https://node2-plum.vercel.app/api/admin/users"); // Adjust endpoint name as needed

      const data = await res.json();
      setAllUsers(data.users || data.data || data); // Adjust based on your API response structure
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // Function to map UNIQUE_ID to PR_ID using local data
  const mapUniqueIdToPrId = (uniqueId: string): string | null => {
    if (!uniqueId.trim()) return null;

    const user = allUsers.find((user) => user.PR_UNIQUE_ID === uniqueId);

    if (user) {
      return user.PR_ID;
    } else {
      toast.error(`User not found for Unique ID: ${uniqueId}`);
      return null;
    }
  };

  useEffect(() => {
    setOtpSent(false); // hide OTP input
    setOtpVerified(false); // reset verification
    setOtp(""); // clear old otp
    setOtpError(""); // clear old errors
  }, [formData.PR_MOBILE_NO]);

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

  // const validateForm = (): boolean => {
  //   const errors: FormErrors = {};

  //   if (!formData.PR_ROLE) errors.PR_ROLE = "Role is required";
  //   if (!formData.PR_FULL_NAME.trim())
  //     errors.PR_FULL_NAME = "Full name is required";
  //   // if (!formData.PR_PHOTO_URL) errors.PR_PHOTO_URL = "Photo is required";
  //   if (!formData.PR_FATHER_NAME.trim())
  //     errors.PR_FATHER_NAME = "Father's name is required";
  //   if (!formData.PR_MOTHER_NAME.trim())
  //     errors.PR_MOTHER_NAME = "Mother's name is required";
  //   if (!formData.PR_DOB) errors.PR_DOB = "Date of Birth is required";
  //   if (!formData.PR_GENDER) errors.PR_GENDER = "Gender is required";
  //   if (!formData.PR_MOBILE_NO || !/^\d{10}$/.test(formData.PR_MOBILE_NO)) {
  //     errors.PR_MOBILE_NO = "Valid 10-digit Mobile number is required";
  //   }
  //   if (!otpVerified) errors.otp = "OTP verification is required";
  //   if (!formData.PR_HOBBY) errors.PR_HOBBY = "Hobby is required";

  //   if (!formData.PR_MARRIED_YN)
  //     errors.PR_MARRIED_YN = "Married status is required";
  //   if (formData.PR_MARRIED_YN === "Yes" && !formData.PR_SPOUSE_NAME.trim()) {
  //     errors.PR_SPOUSE_NAME = "Spouse name is required";
  //   }

  //   if (!formData.PR_ADDRESS.trim()) errors.PR_ADDRESS = "Address is required";
  //   // if (!formData.PR_AREA_NAME.trim()) errors.PR_AREA_NAME = "Area is required";
  //   if (!formData.PR_PIN_CODE) errors.PR_PIN_CODE = "Pincode is required";
  //   if (!formData.PR_CITY_CODE) errors.PR_CITY_CODE = "City is required";
  //   if (!formData.PR_DISTRICT_CODE)
  //     errors.PR_DISTRICT_CODE = "District is required";
  //   if (!formData.PR_STATE_CODE) errors.PR_STATE_CODE = "State is required";
  //   if (!formData.PR_EDUCATION) errors.PR_EDUCATION = "Education is required";
  //   if (!formData.PR_EDUCATION_DESC.trim())
  //     errors.PR_EDUCATION_DESC = "Education Description is required";
  //   if (!formData.PR_PROFESSION)
  //     errors.PR_PROFESSION = "Profession is required";
  //   if (!formData.PR_PROFESSION_DETA.trim())
  //     errors.PR_PROFESSION_DETA = "Profession Description is required";
  //   if (!formData.PR_BUSS_STREAM)
  //     errors.PR_BUSS_STREAM = "Business stream is required";
  //   if (!formData.PR_BUSS_TYPE)
  //     errors.PR_BUSS_TYPE = "Business type is required";

  //   setFormErrors(errors);
  //   return Object.keys(errors).length === 0;
  // };

  // Generate OTP Function

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const today = new Date();
    const dobDate = new Date(formData.PR_DOB);

    // Basic required field validations
    if (!formData.PR_ROLE) errors.PR_ROLE = "Role is required";
    if (!formData.PR_FULL_NAME.trim())
      errors.PR_FULL_NAME = "Full name is required";
    if (!formData.PR_FATHER_NAME.trim())
      errors.PR_FATHER_NAME = "Father's name is required";
    if (!formData.PR_MOTHER_NAME.trim())
      errors.PR_MOTHER_NAME = "Mother's name is required";

    // Enhanced DOB validation
    if (!formData.PR_DOB) {
      errors.PR_DOB = "Date of Birth is required";
    } else if (dobDate > today) {
      errors.PR_DOB = "Date of Birth cannot be in the future";
    } else {
      let age = today.getFullYear() - dobDate.getFullYear();
      const monthDiff = today.getMonth() - dobDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dobDate.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        errors.PR_DOB = "Must be at least 18 years old";
      }
    }

    if (!formData.PR_GENDER) errors.PR_GENDER = "Gender is required";

    // Enhanced mobile validation
    if (!formData.PR_MOBILE_NO || !/^[6-9]\d{9}$/.test(formData.PR_MOBILE_NO)) {
      errors.PR_MOBILE_NO = "Valid 10-digit Indian mobile number is required";
    }

    if (!otpVerified) errors.otp = "OTP verification is required";
    if (!formData.PR_HOBBY) errors.PR_HOBBY = "Hobby is required";

    if (!formData.PR_MARRIED_YN)
      errors.PR_MARRIED_YN = "Married status is required";

    // Enhanced spouse validation
    if (formData.PR_MARRIED_YN === "Yes") {
      if (!formData.PR_SPOUSE_NAME.trim()) {
        errors.PR_SPOUSE_NAME = "Spouse name is required";
      } else {
        if (formData.PR_SPOUSE_NAME.trim().length < 3) {
          errors.PR_SPOUSE_NAME = "Spouse name must be at least 3 characters";
        }

        if (
          formData.PR_SPOUSE_NAME.trim().toLowerCase() ===
          formData.PR_FULL_NAME.trim().toLowerCase()
        ) {
          errors.PR_SPOUSE_NAME = "Spouse name cannot be the same as your name";
        }

        if (!/^[a-zA-Z\s]+$/.test(formData.PR_SPOUSE_NAME.trim())) {
          errors.PR_SPOUSE_NAME =
            "Spouse name can only contain letters and spaces";
        }
      }
    }

    if (!formData.PR_ADDRESS.trim()) errors.PR_ADDRESS = "Address is required";

    // Enhanced pincode validation
    if (!formData.PR_PIN_CODE) {
      errors.PR_PIN_CODE = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.PR_PIN_CODE)) {
      errors.PR_PIN_CODE = "Pincode must be 6 digits";
    }

    if (!formData.PR_CITY_CODE) errors.PR_CITY_CODE = "City is required";
    if (!formData.PR_DISTRICT_CODE)
      errors.PR_DISTRICT_CODE = "District is required";
    if (!formData.PR_STATE_CODE) errors.PR_STATE_CODE = "State is required";

    // Education validation
    if (!formData.PR_EDUCATION) errors.PR_EDUCATION = "Education is required";
    if (!formData.PR_EDUCATION_DESC.trim()) {
      errors.PR_EDUCATION_DESC = "Education Description is required";
    } else if (formData.PR_EDUCATION_DESC.trim().length < 10) {
      errors.PR_EDUCATION_DESC = "Description must be at least 10 characters";
    }

    // Profession validation
    if (!formData.PR_PROFESSION)
      errors.PR_PROFESSION = "Profession is required";
    if (!formData.PR_PROFESSION_DETA.trim()) {
      errors.PR_PROFESSION_DETA = "Profession Description is required";
    } else if (formData.PR_PROFESSION_DETA.trim().length < 10) {
      errors.PR_PROFESSION_DETA = "Description must be at least 10 characters";
    }

    if (!formData.PR_BUSS_STREAM)
      errors.PR_BUSS_STREAM = "Business stream is required";
    if (!formData.PR_BUSS_TYPE)
      errors.PR_BUSS_TYPE = "Business type is required";

    // Children validation
    const newChildNameErrors: string[] = [];
    const parentNames = [
      formData.PR_FULL_NAME.trim().toLowerCase(),
      formData.PR_SPOUSE_NAME.trim().toLowerCase(),
    ];

    children.forEach((child, index) => {
      let error = "";

      if (!child.name.trim() && child.dob) {
        error = "Child name is required when DOB is provided";
      } else if (child.name.trim() && !child.dob) {
        error = "Date of birth is required";
      } else if (child.name.trim() && child.dob) {
        if (child.name.trim().length < 2) {
          error = "Child name must be at least 2 characters";
        }

        if (parentNames.includes(child.name.trim().toLowerCase())) {
          error = "Child name cannot match parent names";
        }

        const childDob = new Date(child.dob);
        if (childDob > today) {
          error = "Date of birth cannot be in the future";
        }

        if (dobDate && childDob < dobDate) {
          error = "Child cannot be born before parent";
        }
      }

      newChildNameErrors[index] = error;
    });

    setChildNameErrors(newChildNameErrors);

    // Check if any child has errors
    const hasChildErrors = newChildNameErrors.some((error) => error !== "");
    if (hasChildErrors) {
      // errors.children = "Please correct child information";
    }

    // Limit number of children
    if (children.length > 10) {
      // errors.children = "Maximum of 10 children allowed";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const newErrors = { ...formErrors };

    // Clear errors when fields are corrected
    if (formData.PR_ROLE && newErrors.PR_ROLE) delete newErrors.PR_ROLE;
    if (formData.PR_FULL_NAME.trim() && newErrors.PR_FULL_NAME)
      delete newErrors.PR_FULL_NAME;
    if (formData.PR_FATHER_NAME.trim() && newErrors.PR_FATHER_NAME)
      delete newErrors.PR_FATHER_NAME;
    if (formData.PR_MOTHER_NAME.trim() && newErrors.PR_MOTHER_NAME)
      delete newErrors.PR_MOTHER_NAME;

    // Date of Birth validation clearing
    if (formData.PR_DOB) {
      const today = new Date();
      const dobDate = new Date(formData.PR_DOB);
      if (dobDate <= today && newErrors.PR_DOB) delete newErrors.PR_DOB;
    }

    // Mobile number validation clearing
    if (/^[6-9]\d{9}$/.test(formData.PR_MOBILE_NO) && newErrors.PR_MOBILE_NO) {
      delete newErrors.PR_MOBILE_NO;
    }

    // Married status validation clearing
    if (formData.PR_MARRIED_YN) {
      if (newErrors.PR_MARRIED_YN) delete newErrors.PR_MARRIED_YN;
      if (
        formData.PR_MARRIED_YN === "Yes" &&
        formData.PR_SPOUSE_NAME.trim().length >= 3 &&
        newErrors.PR_SPOUSE_NAME
      ) {
        delete newErrors.PR_SPOUSE_NAME;
      }
    }

    // Address validation clearing
    if (formData.PR_ADDRESS.trim() && newErrors.PR_ADDRESS)
      delete newErrors.PR_ADDRESS;
    if (/^\d{6}$/.test(formData.PR_PIN_CODE) && newErrors.PR_PIN_CODE)
      delete newErrors.PR_PIN_CODE;
    if (formData.PR_CITY_CODE && newErrors.PR_CITY_CODE)
      delete newErrors.PR_CITY_CODE;
    if (formData.PR_DISTRICT_CODE && newErrors.PR_DISTRICT_CODE)
      delete newErrors.PR_DISTRICT_CODE;
    if (formData.PR_STATE_CODE && newErrors.PR_STATE_CODE)
      delete newErrors.PR_STATE_CODE;

    // Education validation clearing
    if (formData.PR_EDUCATION && newErrors.PR_EDUCATION)
      delete newErrors.PR_EDUCATION;
    if (
      formData.PR_EDUCATION_DESC.trim().length >= 10 &&
      newErrors.PR_EDUCATION_DESC
    ) {
      delete newErrors.PR_EDUCATION_DESC;
    }

    // Profession validation clearing
    if (formData.PR_PROFESSION && newErrors.PR_PROFESSION)
      delete newErrors.PR_PROFESSION;
    if (
      formData.PR_PROFESSION_DETA.trim().length >= 10 &&
      newErrors.PR_PROFESSION_DETA
    ) {
      delete newErrors.PR_PROFESSION_DETA;
    }

    // Business validation clearing
    if (formData.PR_BUSS_STREAM && newErrors.PR_BUSS_STREAM)
      delete newErrors.PR_BUSS_STREAM;
    if (formData.PR_BUSS_TYPE && newErrors.PR_BUSS_TYPE)
      delete newErrors.PR_BUSS_TYPE;

    if (JSON.stringify(newErrors) !== JSON.stringify(formErrors)) {
      setFormErrors(newErrors);
    }
  }, [formData, formErrors]);

  useEffect(() => {
    if (formData.PR_MARRIED_YN === "No") {
      setFormData((prev) => ({
        ...prev,
        PR_SPOUSE_NAME: "",
        PR_SPOUSE_ID: null,
      }));
      setChildren([]);
    }
  }, [formData.PR_MARRIED_YN]);

  // For children validation, update the onChange handlers:
  const handleChildNameChange = (index: number, value: string) => {
    const newChildren = [...children];
    newChildren[index].name = value;
    setChildren(newChildren);

    // Clear name error if corrected
    if (childrenErrors[index]?.name && value.trim()) {
      const newErrors = [...childrenErrors];
      delete newErrors[index].name;
      setChildrenErrors(newErrors);
    }
  };

  const handleChildDobChange = (index: number, value: string) => {
    const newChildren = [...children];
    newChildren[index].dob = value;
    setChildren(newChildren);

    // Clear dob error if corrected
    if (childrenErrors[index]?.dob) {
      const today = new Date();
      const dobDate = new Date(value);
      if (value && dobDate <= today) {
        const newErrors = [...childrenErrors];
        delete newErrors[index].dob;
        setChildrenErrors(newErrors);
      }
    }
  };

  const getOTP = async () => {
    setIsLoadingOTP(true);
    setOtp(""); // reset OTP field value
    setOtpError(""); // reset error message
    setOtpSent(false); // reset to avoid flicker

    try {
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
    } catch (error) {
      setOtpError("Failed to send OTP");
    }
    setIsLoadingOTP(false);
  };

  console.log("Mobile no:", mobileNo);

  // Verify OTP
  const verifyOTP = async () => {
    if (otp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP.");
      return;
    }

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

  // const handleChange = async (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name, value } = e.target;

  //   // Narrow target to HTMLInputElement to safely access files property
  //   if (
  //     name === "PR_PHOTO_URL" &&
  //     e.target instanceof HTMLInputElement &&
  //     e.target.files &&
  //     e.target.files[0]
  //   ) {
  //     const file = e.target.files[0];
  //     const formDataImage = new FormData();
  //     formDataImage.append("image", file);

  //     try {
  //       const res = await fetch("/api/uploadImage", {
  //         method: "POST",
  //         body: formDataImage,
  //       });

  //       const data = await res.json();
  //       console.log("DATAAAAA: ", data);

  //       if (data.status === "success") {
  //         const imageUrl = `https://rangrezsamaj.kunxite.com/${data.url}`;
  //         console.log("Img url: ", imageUrl);

  //         setFormData((prev) => ({
  //           ...prev,
  //           PR_PHOTO_URL: imageUrl,
  //         }));
  //       } else {
  //         console.error("Image upload failed: ", data.message);
  //       }
  //     } catch (error) {
  //       console.error("Error uploading image: ", error);
  //     }
  //     return;
  //   }

  //   // The rest of your logic remains unchanged
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
  //       setFormData((prev) => ({
  //         ...prev,
  //         [name]: value,
  //       }));
  //     }
  //   } else if (name === "PR_PROFESSION") {
  //     const selectedProfession = professions.find((p) => p.PROF_NAME === value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //       PR_PROFESSION_ID: selectedProfession?.PROF_ID || "",
  //       PR_PROFESSION_DETA: selectedProfession?.PROF_DESC,
  //     }));
  //   } else if (name === "PR_BUSS_STREAM") {
  //     const selectedBusiness = business.find((b) => b.BUSS_STREM === value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //       PR_BUSS_CODE: selectedBusiness?.BUSS_ID,
  //       PR_BUSS_TYPE: selectedBusiness?.BUSS_TYPE,
  //     }));
  //   } else if (name === "PR_FATHER_ID") {
  //     setFatherUniqueId(value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value, // Keep the unique ID for display
  //     }));
  //   } else if (name === "PR_MOTHER_ID") {
  //     setMotherUniqueId(value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value, // Keep the unique ID for display
  //     }));
  //   } else if (name === "PR_SPOUSE_ID") {
  //     setSpouseUniqueId(value);
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value, // Keep the unique ID for display
  //     }));
  //   } else {
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));

  //     if (name === "PR_MOBILE_NO") {
  //       setMobileNo({ PR_MOBILE_NO: value });

  //       setVerify((prev) => ({
  //         ...prev,
  //         PR_MOBILE_NO: value,
  //       }));
  //     }

  //     if (name === "PR_FULL_NAME" || name === "PR_DOB" || name === "PR_ROLE") {
  //       setVerify((prev) => ({
  //         ...prev,
  //         [name]: value,
  //       }));
  //     }
  //   }
  // };

  // Registering User
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Submitting form", formData);

  //   if (!validateForm()) {
  //     toast.error("Please correct the errors before submitting");
  //     return;
  //   }
  //   // integrate API call here

  //   const res = await fetch(
  //     "https://node2-plum.vercel.app/api/user/edit-profile",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json", // REQUIRED
  //         pr_id: String(prId),
  //       },
  //       body: JSON.stringify({ ...formData, Children: children }),
  //     }
  //   );

  //   const data = await res.json();

  //   console.log("Register user: ", data);

  //   if (data.success) {
  //     console.log("Data added successfully!!!");
  //     toast.success("User Added successfully!!!");
  //   } else if (!data.success) {
  //     console.log("Error: ", data.message);
  //     toast.error("Error adding user!!!", data.message);
  //   } else {
  //     console.log("Failed!!!");
  //   }

  //   // const res = await postData("register", formData)
  //   // if(res.success === true){
  //   //   console.log("Data updated successfully", res);
  //   // } else  if(res.success === false) {
  //   //   console.log("Error: ", res.message)
  //   // }
  //   // else {
  //   //   console.log("error updating data");
  //   // }
  // };

  // Update the handleSubmit function - replace the existing API call section:

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Handle image upload
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
          toast.error("Image upload failed");
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
        toast.error("Error uploading image");
      }
      return;
    }

    // Handle fields requiring PR_ID mapping
    if (
      name === "PR_FATHER_ID" ||
      name === "PR_MOTHER_ID" ||
      name === "PR_SPOUSE_ID"
    ) {
      // Update the unique ID state for display in the input field
      if (name === "PR_FATHER_ID") setFatherUniqueId(value);
      if (name === "PR_MOTHER_ID") setMotherUniqueId(value);
      if (name === "PR_SPOUSE_ID") setSpouseUniqueId(value);

      // Map the entered UNIQUE_ID to PR_ID in real time
      const mappedPrId = mapUniqueIdToPrId(value);

      setFormData((prev) => ({
        ...prev,
        [name]: mappedPrId, // Store the mapped PR_ID in formData
      }));
    }
    // Handle PR_PIN_CODE
    else if (name === "PR_PIN_CODE") {
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
    // Handle PR_PROFESSION
    else if (name === "PR_PROFESSION") {
      const selectedProfession = professions.find((p) => p.PROF_NAME === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        PR_PROFESSION_ID: selectedProfession?.PROF_ID || "",
        PR_PROFESSION_DETA: selectedProfession?.PROF_DESC,
      }));
    }
    // Handle PR_BUSS_STREAM
    else if (name === "PR_BUSS_STREAM") {
      const selectedBusiness = business.find((b) => b.BUSS_STREM === value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        PR_BUSS_CODE: selectedBusiness?.BUSS_ID,
        PR_BUSS_TYPE: selectedBusiness?.BUSS_TYPE,
      }));
    }
    // Handle other fields
    else {
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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Submitting form", formData);

  //   if (!validateForm()) {
  //     toast.error("Please correct the errors before submitting");
  //     return;
  //   }

  //   // Map unique IDs to PR_IDs before submission
  //   const fatherPrId = mapUniqueIdToPrId(fatherUniqueId);
  //   const motherPrId = mapUniqueIdToPrId(motherUniqueId);
  //   const spousePrId =
  //     formData.PR_MARRIED_YN === "Yes"
  //       ? mapUniqueIdToPrId(spouseUniqueId)
  //       : null;

  //   // Create submission data with mapped PR_IDs
  //   const submissionData = {
  //     ...formData,
  //     PR_FATHER_ID: fatherPrId,
  //     PR_MOTHER_ID: motherPrId,
  //     PR_SPOUSE_ID: spousePrId,
  //     Children: children,
  //   };

  //   console.log("Submission data with mapped IDs:", submissionData);

  //   const res = await fetch(
  //     "https://node2-plum.vercel.app/api/user/edit-profile",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         pr_id: String(prId),
  //       },
  //       body: JSON.stringify(submissionData),
  //     }
  //   );

  //   const data = await res.json();

  //   console.log("Register user: ", data);

  //   if (data.success) {
  //     console.log("Data added successfully!!!");
  //     toast.success("User Added successfully!!!");
  //   } else if (!data.success) {
  //     console.log("Error: ", data.message);
  //     toast.error("Error adding user!!!");
  //   } else {
  //     console.log("Failed!!!");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form", formData);

    // if (!validateForm()) {
    //   toast.error("Please correct the errors before submitting");
    //   return;
    // }

    // No need to map IDs here since it’s done in real-time via handleChange
    const submissionData = {
      ...formData,
      Children: children,
    };

    console.log("Submission data:", submissionData);

    const res = await fetch(
      "https://node2-plum.vercel.app/api/user/edit-profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          pr_id: String(prId),
        },
        body: JSON.stringify(submissionData),
      }
    );

    const data = await res.json();

    console.log("Register user: ", data);

    if (data.success) {
      console.log("Data added successfully!!!");
      toast.success("User Added successfully!!!");
    } else if (!data.success) {
      console.log("Error: ", data.message);
      toast.error("Error adding user!!!");
    } else {
      console.log("Failed!!!");
    }
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
              {/* {formErrors.PR_PHOTO_URL && (
                <p className="text-sm text-red-500">
                  {formErrors.PR_PHOTO_URL}
                </p>
              )} */}
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
            <Input
              label="Father ID (Enter Unique ID)"
              type="text"
              name="PR_FATHER_ID"
              value={fatherUniqueId}
              onChange={(e) => {
                setFatherUniqueId(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  PR_FATHER_ID: e.target.value,
                }));
              }}
            />
            <Input
              label="Mother ID (Enter Unique ID)"
              type="text"
              name="PR_MOTHER_ID"
              value={motherUniqueId}
              onChange={(e) => {
                setMotherUniqueId(e.target.value);
                setFormData((prev) => ({
                  ...prev,
                  PR_MOTHER_ID: e.target.value,
                }));
              }}
            />
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

              {!otpSent && /^\d{10}$/.test(formData.PR_MOBILE_NO) && (
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
                  <p className="text-xs text-gray-500">
                    You can resend OTP in {cooldown}s
                  </p>
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

            {/* Conditionally show spouse name */}
            {/* {formData.PR_MARRIED_YN === "Yes" && (
              <Input
                label="Spouse Name"
                name="PR_SPOUSE_NAME"
                value={formData.PR_SPOUSE_NAME}
                onChange={handleChange}
              />
            )} */}

            {formData.PR_MARRIED_YN === "Yes" && (
              <>
                <Input
                  label="Spouse Name"
                  name="PR_SPOUSE_NAME"
                  value={formData.PR_SPOUSE_NAME}
                  onChange={handleChange}
                />
                <Input
                  label="Spouse ID (Enter Unique ID)"
                  type="text"
                  name="PR_SPOUSE_ID"
                  value={spouseUniqueId}
                  onChange={(e) => {
                    setSpouseUniqueId(e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      PR_SPOUSE_ID: e.target.value,
                    }));
                  }}
                />
              </>
            )}
          </div>
        </div>

        {/* Conditionally show children section */}
        {formData.PR_MARRIED_YN === "Yes" && (
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
                    onChange={(e) =>
                      handleChildNameChange(index, e.target.value)
                    }
                    className={`w-full px-3 py-2 border border-gray-300 shadow-sm rounded-lg ${
                      childrenErrors[index]?.name ? "border-red-500" : ""
                    }`}
                  />
                  {childrenErrors[index]?.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {childrenErrors[index]?.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={child.dob}
                    onChange={(e) =>
                      handleChildDobChange(index, e.target.value)
                    }
                    className={`w-full px-3 py-2 border border-gray-300 shadow-sm rounded-lg ${
                      childrenErrors[index]?.dob ? "border-red-500" : ""
                    }`}
                  />
                  {childrenErrors[index]?.dob && (
                    <p className="text-sm text-red-500 mt-1">
                      {childrenErrors[index]?.dob}
                    </p>
                  )}
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
                onClick={() =>
                  setChildren([...children, { name: "", dob: "" }])
                }
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + Add Child
              </button>
            </div>
          </div>
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
            Save
          </button>
        </div>
      </form>
    </>
  );
};

export default AddUserForm;
