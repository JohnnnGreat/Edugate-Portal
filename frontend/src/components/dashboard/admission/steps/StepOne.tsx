"use client";

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useRouter, useSearchParams } from "next/navigation";

// Component imports
import SelectField from "@/components/form/SelectField";
import TextField from "@/components/form/TextField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

// Utility functions
import { createAdmission } from "@/lib/api/admission";
import useUserData from "@/hooks/useUserData";
import { Save } from "lucide-react";

// Validation schema using Zod
const stepOneSchema = z.object({
   email: z.string().min(2, { message: "Email must be at least 2 characters." }),
   fullName: z.string().min(6, { message: "Full Name must be at least 6 characters" }),
   address: z.string().min(6, { message: "Address must be at least 6 characters" }),
   gender: z.string(),
   phoneNumber: z.string().min(6, { message: "Phone Number must be at least 6 characters" }),
});

// Type for form data based on Zod validation schema
type StepOneFormData = z.infer<typeof stepOneSchema>;

const StepOne: React.FC = () => {
   // Fetch user data
   const { data: response } = useUserData();
   const profileInformation = response?.data;

   // Initialize react-hook-form
   const form = useForm<StepOneFormData>({
      resolver: zodResolver(stepOneSchema),
      defaultValues: {},
   });

   // Populate form with user profile data if available
   useEffect(() => {
      if (profileInformation) {
         form.reset({
            email: profileInformation.email || "",
            fullName: `${profileInformation.firstName} ${profileInformation.lastName}`.trim(),
         });
      }
   }, [profileInformation, form]);

   // Get the current step level from the URL
   const stepLevel = useSearchParams().get("idx");
   const router = useRouter();
   const [isError, setIsError] = useState(false);

   // Track application level (placeholder, can be dynamic later)
   let applicationLevel = 0;

   // Mutation for form submission
   const { mutateAsync } = useMutation({
      mutationFn: (values: StepOneFormData) => createAdmission(values),
      onError: (error: any) => {
         toast.error(error.message);
         setIsError(true);
      },
      onSuccess: (data) => {
         toast.success(data.message);
         router.push("/accounts/user/dashboard/process-admission?idx=1");
         localStorage.setItem("applicationLevel", JSON.stringify(applicationLevel));
         localStorage.setItem("applicationStarted", JSON.stringify(true));
      },
   });

   // Form state validation and submission status
   const { isValid, isSubmitting } = form.formState;

   // Submit handler
   const onSubmit: SubmitHandler<StepOneFormData> = async (values) => {
      await mutateAsync(values);
      form.reset();
   };

   return (
      <div className="p-8 bg-white rounded-[20px] mt-4">
         <h1 className="text-xl font-bold mb-2">Your Personal Information</h1>
         <p className="text-base text-gray-500">Let’s start by getting to know you better</p>

         <Form {...form}>
            <form
               onSubmit={form.handleSubmit(onSubmit)}
               className="space-y-2"
            >
               {/* Email Field (Disabled) */}
               <TextField
                  placeholder="name@email.com"
                  label="Email Address"
                  form={form}
                  defaultValue={profileInformation?.email}
                  disabledField
                  name="email"
                  classname="border-gray-200 bg-gray-100"
               />

               {/* Gender Select */}
               <SelectField
                  items={[
                     { label: "Male", value: "Male" },
                     { label: "Female", value: "Female" },
                  ]}
                  name="gender"
                  placeholder="Choose Gender"
                  label="Gender"
                  form={form}
                  classname="border-gray-200 bg-gray-100"
               />

               {/* Full Name Field (Disabled) */}
               <TextField
                  placeholder="John Doe"
                  label="Full Name"
                  form={form}
                  defaultValue={`${profileInformation?.firstName} ${profileInformation?.lastName}`.trim()}
                  disabledField
                  name="fullName"
                  classname="border-gray-200 bg-gray-100"
               />

               {/* Phone Number Field */}
               <TextField
                  placeholder="9038457675"
                  label="Phone Number"
                  form={form}
                  name="phoneNumber"
                  classname="border-gray-200 bg-gray-100"
               />

               {/* Address Field */}
               <TextField
                  placeholder="Your Address"
                  label="Address"
                  form={form}
                  name="address"
                  classname="border-gray-200 bg-gray-100"
               />

               <div className="flex justify-between">
                  {/* Conditional Rendering of Previous Button */}
                  {stepLevel !== "0" && (
                     <Button
                        className="bg-gray-700 py-4 px-8 font-bold"
                        type="button"
                     >
                        Previous
                     </Button>
                  )}

                  {/* Submit Button */}
                  <Button
                     className="bg-[#02333F] py-[1.6rem] px-[2rem] font-bold"
                     type="submit"
                     disabled={!isValid || isSubmitting}
                  >
                     <Save />
                     Save and Continue
                  </Button>
               </div>
            </form>
         </Form>
      </div>
   );
};

export default StepOne;
