import { z } from "zod";
import { HiringType } from "@prisma/client";

const JobValidationSchema = z.object({
  hiringType: z.nativeEnum(HiringType),
  location: z.string(),
  amount: z.string(),
});

const JobUpdateSchema = z.object({
  hiringType: z.nativeEnum(HiringType).optional(),
  location: z.string().optional(),
  amount: z.string().optional(),
});

const JobApplicationSchema = z.object({
  amount: z.number(),
  about: z.string(),
});

export const JobValidation = {
  JobValidationSchema,
  JobUpdateSchema,
  JobApplicationSchema,
};
