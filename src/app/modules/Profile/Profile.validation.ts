import { z } from "zod";

const ProfileValidationSchema = z.object({
  country: z.string(),
  state: z.string(),
  city: z.string(),
  driverCanHire: z.number().int(),
  role: z.enum(["AGENT", "EMPLOYER"]),
  paymentAmount: z.number().int(),
  paymentId: z.string(),
});

const ProfileUpdateSchema = z.object({
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  driverCanHire: z.number().int().optional(),
});

const DriverProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  monthlyRate: z.number().default(0),
  about: z.string().default(""),
  country: z.string(),
  state: z.string(),
  referenceNumber1: z.string(),
  referenceNumber2: z.string(),
  referenceEmail1: z.string().email(),
  referenceEmail2: z.string().email(),
});

export const ProfileValidation = {
  ProfileValidationSchema,
  ProfileUpdateSchema,
  DriverProfileSchema,
};
