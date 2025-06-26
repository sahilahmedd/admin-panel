// Define types for form data and errors to ensure type safety
type UserFormData = {
  PR_ROLE: string;
  PR_FULL_NAME: string;
  PR_PHOTO_URL: string;
  PR_FATHER_NAME: string;
  PR_MOTHER_NAME: string;
  PR_FATHER_ID: string | number | null;
  PR_MOTHER_ID: string | number | null;
  PR_DOB: string;
  PR_GENDER: string;
  PR_MOBILE_NO: string;
  PR_HOBBY: string;
  PR_MARRIED_YN: string;
  PR_SPOUSE_NAME: string;
  PR_SPOUSE_ID: string | number | null;
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
  PR_PROFESSION_ID: string; // Added PR_PROFESSION_ID
  PR_BUSS_STREAM: string;
  PR_BUSS_TYPE: string;
  PR_BUSS_CODE: string; // Added PR_BUSS_CODE
  PR_BUSS_INTER: string;
  PR_LANG: string; // Added language field
};

type FormErrors = Partial<Record<keyof UserFormData | "otp", string>> & {
  children?: { name?: string; dob?: string }[]; // Added children errors to FormErrors
};

type Child = {
  name: string;
  dob: string;
};

type GenderErrors = {
  father: string;
  mother: string;
  spouse: string;
};

interface ValidateFormArgs {
  formData: UserFormData;
  genderErrors: GenderErrors;
  children: Child[];
  otpVerified: boolean;
  fatherUniqueId: string; // Used for cross-validation with spouse
  motherUniqueId: string; // Used for cross-validation with spouse
  spouseUniqueId: string; // Used for cross-validation with spouse
}

export const validateRegistrationForm = ({
  formData,
  genderErrors,
  children,
  otpVerified,
  fatherUniqueId,
  motherUniqueId,
  spouseUniqueId,
}: ValidateFormArgs): FormErrors => {
  const errors: FormErrors = {};
  const today = new Date();
  const dobDate = new Date(formData.PR_DOB);

  // Validate Father/Mother/Spouse Gender Errors from external check
  if (genderErrors.father) errors.PR_FATHER_ID = genderErrors.father;
  if (genderErrors.mother) errors.PR_MOTHER_ID = genderErrors.mother;
  if (genderErrors.spouse) errors.PR_SPOUSE_ID = genderErrors.spouse;

  // Basic required field validations
  if (!formData.PR_ROLE) errors.PR_ROLE = "Role is required";
  if (!formData.PR_FULL_NAME.trim())
    errors.PR_FULL_NAME = "Full name is required";
  if (!formData.PR_LANG) errors.PR_LANG = "Language is required";
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
    // if (age < 18) {
    //   errors.PR_DOB = "Must be at least 18 years old";
    // }
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

      // Cross-validation for spouse ID
      if (
        spouseUniqueId &&
        (spouseUniqueId === fatherUniqueId || spouseUniqueId === motherUniqueId)
      ) {
        errors.PR_SPOUSE_ID =
          "Spouse ID cannot be the same as Father or Mother ID";
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
    errors.PR_EDUCATION_DESC = "Education Stream is required";
  }

  // Profession validation
  if (!formData.PR_PROFESSION) errors.PR_PROFESSION = "Profession is required";
  if (!formData.PR_PROFESSION_DETA.trim()) {
    errors.PR_PROFESSION_DETA = "Profession Description is required";
  } else if (formData.PR_PROFESSION_DETA.trim().length < 10) {
    errors.PR_PROFESSION_DETA = "Description must be at least 10 characters";
  }

  // Business validation: Only require if user is interested
  if (formData.PR_BUSS_INTER === "Yes") {
    if (!formData.PR_BUSS_STREAM)
      errors.PR_BUSS_STREAM = "Business stream is required";
    if (!formData.PR_BUSS_TYPE)
      errors.PR_BUSS_TYPE = "Business type is required";
    if (!formData.PR_BUSS_CODE) errors.PR_BUSS_CODE = "Business ID is required";
  }

  // Children validation
  const childValidationErrors: { name?: string; dob?: string }[] = [];
  const parentNames = [
    formData.PR_FULL_NAME.trim().toLowerCase(),
    formData.PR_MARRIED_YN === "Yes"
      ? formData.PR_SPOUSE_NAME.trim().toLowerCase()
      : "",
  ].filter(Boolean); // Filter out empty strings

  children.forEach((child, index) => {
    const childErrors: { name?: string; dob?: string } = {};

    if (!child.name.trim() && child.dob) {
      childErrors.name = "Child name is required when DOB is provided";
    } else if (child.name.trim() && !child.dob) {
      childErrors.dob = "Date of birth is required";
    } else if (child.name.trim() && child.dob) {
      if (child.name.trim().length < 2) {
        childErrors.name = "Child name must be at least 2 characters";
      }

      if (parentNames.includes(child.name.trim().toLowerCase())) {
        childErrors.name = "Child name cannot match parent names";
      }

      const childDob = new Date(child.dob);
      if (childDob > today) {
        childErrors.dob = "Date of birth cannot be in the future";
      }

      if (dobDate && childDob < dobDate) {
        childErrors.dob = "Child cannot be born before parent";
      }
    }
    childValidationErrors[index] = childErrors;
  });

  // Assign the collected child errors to the main errors object
  errors.children = childValidationErrors;

  return errors;
};

// Also export the types for use in other files
export type { UserFormData, FormErrors, Child, GenderErrors };
