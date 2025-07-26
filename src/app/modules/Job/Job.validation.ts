import { z } from "zod";
import { HiringType } from "@prisma/client";

const JobValidationSchema = z.object({
  hiringType: z.nativeEnum(HiringType),
  location: z.string(),
  amount: z.number(),
});

const JobUpdateSchema = z.object({
  hiringType: z.nativeEnum(HiringType).optional(),
  location: z.string().optional(),
  amount: z.number().optional(),
});

export const JobValidation = {
  JobValidationSchema,
  JobUpdateSchema,
};
