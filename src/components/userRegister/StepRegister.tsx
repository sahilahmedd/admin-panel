"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "react-hot-toast";

// Zod schema
const formSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dob: z.string().min(1, "DOB is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  otp: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const AddUserStepper = () => {
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dob: "",
      phone: "",
      otp: "",
    },
  });

  const watchPhone = form.watch("phone");

  const handleOtpSend = () => {
    if (watchPhone === "9999999999") {
      toast.success("This number is already verified.");
      setOtpVerified(true);
      return;
    }

    setOtpSent(true);
    toast.success("OTP sent to phone.");
  };

  const handleOtpVerify = () => {
    const enteredOtp = form.getValues("otp");
    if (enteredOtp === "123456") {
      toast.success("OTP Verified!");
      setOtpVerified(true);
    } else {
      toast.error("Invalid OTP.");
    }
  };

  const handleNextStep = async () => {
    const valid = await form.trigger(["fullName", "dob", "phone"]);
    if (!valid) {
      return toast.error("Please fill all required fields.");
    }

    if (!otpVerified) {
      return toast.error("Please verify your OTP.");
    }

    setStep(2);
  };

  return (
    <div className="max-w-lg mx-auto">
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!otpVerified && (
                <>
                  <Button type="button" className="mt-2" onClick={handleOtpSend}>
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </Button>

                  {otpSent && (
                    <>
                      <FormField
                        control={form.control}
                        name="otp"
                        render={({ field }) => (
                          <FormItem className="mt-4">
                            <FormLabel>Enter OTP</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="123456" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="button" className="mt-2" onClick={handleOtpVerify}>
                        {otpVerified ? "Verified ✅" : "Verify OTP"}
                      </Button>
                    </>
                  )}
                </>
              )}

              {otpVerified && (
                <p className="text-green-600 mt-2">Phone number verified ✅</p>
              )}

              <Button type="button" className="mt-6" onClick={handleNextStep}>
                Next Step
              </Button>
            </>
          )}

          {step === 2 && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-4">Step 2 Content Here</h2>
              {/* Add step 2 inputs and logic */}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AddUserStepper;
