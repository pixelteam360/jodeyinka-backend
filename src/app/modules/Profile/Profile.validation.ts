import { z } from "zod";

const ProfileValidationSchema = z.object({
  companyName: z.string(),
  fullName: z.string(),
  address: z.string(),
  state: z.string(),
  city: z.string(),
  country: z.string(),
  gender: z.string(),
  age: z.number().int(),
  dateOfBirth: z.string().datetime(),
  phoneNumber: z.string(),
  salaryRange: z.string(),
  typeOfVehicleOwned: z.string(),
  hiredDriverBefore: z.boolean(),
  driverPaymentMethod: z.string(),
  driverGiniPaymentMethod: z.string(),
  reference: z.array(z.string()),
});

const ProfileUpdateSchema = z.object({
  companyName: z.string().optional(),
  fullName: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  age: z.number().int().optional(),
  dateOfBirth: z.string().datetime().optional(),
  phoneNumber: z.string().optional(),
  salaryRange: z.string().optional(),
  typeOfVehicleOwned: z.string().optional(),
  hiredDriverBefore: z.boolean().optional(),
  driverPaymentMethod: z.string().optional(),
  driverGiniPaymentMethod: z.string().optional(),
});

const DriverProfileSchema = z.object({
  fullName: z.string(),
  address: z.string(),
  state: z.string(),
  city: z.string(),
  country: z.string(),
  gender: z.string(),
  age: z.number().int(),
  dateOfBirth: z.string().datetime(),
  typeOfVehicle: z.string(),
  salaryRange: z.string(),
  reference: z.array(z.string()),
  monthlyRate: z.string(),
});

const UpdateDriverProfileSchema = z.object({
  fullName: z.string().optional(),
  address: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  age: z.number().int().optional(),
  dateOfBirth: z.string().datetime().optional(),
  typeOfVehicle: z.string().optional(),
  salaryRange: z.string().optional(),
  monthlyRate: z.string().optional(),
});

export const ProfileValidation = {
  ProfileValidationSchema,
  ProfileUpdateSchema,
  DriverProfileSchema,
  UpdateDriverProfileSchema,
};
