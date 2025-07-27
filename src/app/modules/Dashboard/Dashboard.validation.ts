import { z } from "zod";

const DashboardValidationSchema = z.object({
  company: z.string(),
  position: z.string(),
});

const DashboardUpdateSchema = z.object({
  company: z.string().optional(),
  position: z.string().optional(),
});

export const DashboardValidation = {
  DashboardValidationSchema,
  DashboardUpdateSchema,
};
