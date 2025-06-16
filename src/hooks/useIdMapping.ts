import { useState } from "react";
import toast from "react-hot-toast";
import { UserFormData, FormErrors } from "@/components/userRegister/validationSchema"; // Assuming relative path is correct

type FieldType = "father" | "mother" | "spouse";

const useIdMapping = (
  currentUserGender: string,
  setFormData: React.Dispatch<React.SetStateAction<UserFormData>>,
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>> // Add setFormErrors
) => {
  const [fatherUniqueId, setFatherUniqueId] = useState("");
  const [motherUniqueId, setMotherUniqueId] = useState("");
  const [spouseUniqueId, setSpouseUniqueId] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [spouseName, setSpouseName] = useState("");
  const [genderErrors, setGenderErrors] = useState({
    father: "",
    mother: "",
    spouse: "",
  });

  const getUserByUniqueId = async (uniqueId: string) => {
    if (!uniqueId.trim()) return null;

    try {
      const encodedUniqueId = encodeURIComponent(uniqueId);
      const res = await fetch(
        `https://node2-plum.vercel.app/api/admin/users/uniqueid/${encodedUniqueId}`
      );
      // const res = await fetch(
      //   `http://localhost:5000/api/admin/users/uniqueid/${encodedUniqueId}`
      // );
      const data = await res.json();

      if (data.success && data.data) {
        return data.data;
      } else {
        toast.error(`User not found for Unique ID: ${uniqueId}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Error fetching user data");
      return null;
    }
  };

  const mapUniqueIdToPrId = async (
    uniqueId: string,
    fieldType: FieldType
  ) => {
    // Clear the name and gender error when input is empty
    if (!uniqueId.trim()) {
      if (fieldType === "father") {
        setFatherName("");
        setFormData((prev) => ({ ...prev, PR_FATHER_NAME: "" }));
        setGenderErrors((prev) => ({ ...prev, father: "" }));
        setFormErrors((prev) => { const newErrors = { ...prev }; delete newErrors.PR_FATHER_ID; return newErrors; }); // Clear form error
      }
      if (fieldType === "mother") {
        setMotherName("");
        setFormData((prev) => ({ ...prev, PR_MOTHER_NAME: "" }));
        setGenderErrors((prev) => ({ ...prev, mother: "" }));
        setFormErrors((prev) => { const newErrors = { ...prev }; delete newErrors.PR_MOTHER_ID; return newErrors; }); // Clear form error
      }
      if (fieldType === "spouse") {
        setSpouseName("");
        setFormData((prev) => ({ ...prev, PR_SPOUSE_NAME: "" }));
        setGenderErrors((prev) => ({ ...prev, spouse: "" }));
        setFormErrors((prev) => { const newErrors = { ...prev }; delete newErrors.PR_SPOUSE_ID; return newErrors; }); // Clear form error
      }
      setFormData((prev) => ({ ...prev, [`PR_${fieldType.toUpperCase()}_ID`]: null }));
      return;
    }

    const userData = await getUserByUniqueId(uniqueId);

    if (userData) {
      let genderValidationError = "";
      let spouseIdValidationError = ""; // For cross-validation

      if (fieldType === "father" && userData.PR_GENDER !== "M") {
        genderValidationError = "Father must be Male";
      } else if (fieldType === "mother" && userData.PR_GENDER !== "F") {
        genderValidationError = "Mother must be Female";
      } else if (fieldType === "spouse") {
        if (currentUserGender === "M" && userData.PR_GENDER !== "F") {
          genderValidationError = "Spouse gender should be Female";
        } else if (currentUserGender === "F" && userData.PR_GENDER !== "M") {
          genderValidationError = "Spouse gender should be Male";
        }
      }

      setGenderErrors((prev) => ({ ...prev, [fieldType]: genderValidationError }));

      // Handle cross-validation for spouse ID
      if (fieldType === "spouse" && uniqueId) {
        if (uniqueId === fatherUniqueId) {
          spouseIdValidationError = "Spouse ID cannot be same as Father ID";
        } else if (uniqueId === motherUniqueId) {
          spouseIdValidationError = "Spouse ID cannot be same as Mother ID";
        }
      }
      setFormErrors((prev) => ({
        ...prev,
        [`PR_${fieldType.toUpperCase()}_ID`]: genderValidationError || spouseIdValidationError || undefined,
      }));


      if (genderValidationError || spouseIdValidationError) {
        // Clear the names and IDs if validation fails
        if (fieldType === "father") {
          setFatherName("");
          setFormData((prev) => ({ ...prev, PR_FATHER_NAME: "", PR_FATHER_ID: null }));
        }
        if (fieldType === "mother") {
          setMotherName("");
          setFormData((prev) => ({ ...prev, PR_MOTHER_NAME: "", PR_MOTHER_ID: null }));
        }
        if (fieldType === "spouse") {
          setSpouseName("");
          setFormData((prev) => ({ ...prev, PR_SPOUSE_NAME: "", PR_SPOUSE_ID: null }));
        }
        toast.error(genderValidationError || spouseIdValidationError);
      } else {
        // If validation passes, set the name for display AND in form data
        if (fieldType === "father") {
          setFatherName(userData.PR_FULL_NAME);
          setFormData((prev) => ({
            ...prev,
            PR_FATHER_NAME: userData.PR_FULL_NAME,
            PR_FATHER_ID: userData.PR_ID,
          }));
        }
        if (fieldType === "mother") {
          setMotherName(userData.PR_FULL_NAME);
          setFormData((prev) => ({
            ...prev,
            PR_MOTHER_NAME: userData.PR_FULL_NAME,
            PR_MOTHER_ID: userData.PR_ID,
          }));
        }
        if (fieldType === "spouse") {
          setSpouseName(userData.PR_FULL_NAME);
          setFormData((prev) => ({
            ...prev,
            PR_SPOUSE_NAME: userData.PR_FULL_NAME,
            PR_SPOUSE_ID: userData.PR_ID,
          }));
        }
      }
    } else {
      // Clear the name and gender error if user not found
      if (fieldType === "father") {
        setFatherName("");
        setFormData((prev) => ({ ...prev, PR_FATHER_NAME: "", PR_FATHER_ID: null }));
        setGenderErrors((prev) => ({ ...prev, father: "" }));
        setFormErrors((prev) => { const newErrors = { ...prev }; delete newErrors.PR_FATHER_ID; return newErrors; }); // Clear form error
      }
      if (fieldType === "mother") {
        setMotherName("");
        setFormData((prev) => ({ ...prev, PR_MOTHER_NAME: "", PR_MOTHER_ID: null }));
        setGenderErrors((prev) => ({ ...prev, mother: "" }));
        setFormErrors((prev) => { const newErrors = { ...prev }; delete newErrors.PR_MOTHER_ID; return newErrors; }); // Clear form error
      }
      if (fieldType === "spouse") {
        setSpouseName("");
        setFormData((prev) => ({ ...prev, PR_SPOUSE_NAME: "", PR_SPOUSE_ID: null }));
        setGenderErrors((prev) => ({ ...prev, spouse: "" }));
        setFormErrors((prev) => { const newErrors = { ...prev }; delete newErrors.PR_SPOUSE_ID; return newErrors; }); // Clear form error
      }
    }
  };

  return {
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
  };
};

export default useIdMapping;
