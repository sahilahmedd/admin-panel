import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FormErrors } from "@/components/userRegister/validationSchema"; // Assuming relative path is correct

interface UseOtpManagementArgs {
  mobileNo: string;
  verifyData: {
    PR_MOBILE_NO: string;
    PR_FULL_NAME: string;
    PR_DOB: string;
    PR_ROLE: string;
  };
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
}

const useOtpManagement = ({ mobileNo, verifyData, setFormErrors }: UseOtpManagementArgs) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(60);
  const [isLoadingOTP, setIsLoadingOTP] = useState(false);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [prId, setPrId] = useState<string | number | undefined>(); // To store PR_ID after verification

  useEffect(() => {
    if (cooldown > 0 && otpSent) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (cooldown === 0 && otpSent) {
      setOtpSent(false); // Allow regenerating OTP after cooldown
    }
  }, [cooldown, otpSent]);

  // Reset OTP states when mobile number changes
  useEffect(() => {
    setOtpSent(false);
    setOtpVerified(false);
    setOtp("");
    setOtpError("");
    setCooldown(60); // Reset cooldown
  }, [mobileNo]);

  const getOTP = async () => {
    setIsLoadingOTP(true);
    setOtp("");
    setOtpError("");
    setOtpSent(false);
    setOtpVerified(false); // Ensure OTP is not marked as verified when requesting new one

    if (!/^[6-9]\d{9}$/.test(mobileNo)) {
      setFormErrors((prev) => ({ ...prev, PR_MOBILE_NO: "Valid 10-digit Indian mobile number is required" }));
      setIsLoadingOTP(false);
      return;
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.PR_MOBILE_NO;
        return newErrors;
      });
    }

    try {
      const res = await fetch(
        "https://node2-plum.vercel.app/api/admin/generate-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ PR_MOBILE_NO: mobileNo }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpError("");
        setCooldown(60); // Reset cooldown for new OTP
        toast.success("OTP generated successfully!!");
      } else {
        setOtpError(data.message || "Failed to generate OTP");
        toast.error(data.message || "Error generating OTP");
      }
    } catch (error) {
      setOtpError("Failed to send OTP");
      toast.error("Failed to send OTP");
    }
    setIsLoadingOTP(false);
  };

  const verifyOTP = async () => {
    if (otp.length !== 4) {
      setOtpError("Please enter a valid 4-digit OTP.");
      return;
    }

    // Add checks for name, DOB, and Role before verifying OTP
    const tempErrors: FormErrors = {};
    if (!verifyData.PR_FULL_NAME.trim()) tempErrors.PR_FULL_NAME = "Full name is required to verify OTP";
    if (!verifyData.PR_DOB) tempErrors.PR_DOB = "Date of Birth is required to verify OTP";
    if (!verifyData.PR_ROLE) tempErrors.PR_ROLE = "Role is required to verify OTP";

    if (Object.keys(tempErrors).length > 0) {
      setFormErrors((prev) => ({ ...prev, ...tempErrors }));
      setOtpError("Please fill in required personal details before verifying OTP.");
      return;
    } else {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.PR_FULL_NAME;
        delete newErrors.PR_DOB;
        delete newErrors.PR_ROLE;
        return newErrors;
      });
    }

    setIsVerifyingOTP(true);
    try {
      const res = await fetch(
        "https://node2-plum.vercel.app/api/admin/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...verifyData, otp }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("OTP verified successfully!!");
        setOtpError("");
        setOtpSent(false); // Hide OTP input after successful verification
        setOtpVerified(true);
        setPrId(data.PR_ID); // Store PR_ID
        setFormErrors((prev) => { // Clear OTP error on success
          const newErrors = { ...prev };
          delete newErrors.otp;
          return newErrors;
        });
      } else {
        setOtpError(data.message || "Error verifying OTP");
        toast.error(data.message || "Error verifying OTP");
        setOtpVerified(false);
      }
    } catch (error) {
      setOtpError("Failed to verify OTP");
      toast.error("Failed to verify OTP");
      setOtpVerified(false);
    }
    setIsVerifyingOTP(false);
  };

  return {
    otpSent,
    otpVerified,
    otpError,
    otp,
    cooldown,
    isLoadingOTP,
    isVerifyingOTP,
    prId,
    setOtp,
    setOtpVerified,
    getOTP,
    verifyOTP,
  };
};

export default useOtpManagement;
