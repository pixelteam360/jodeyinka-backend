import { z } from "zod";

const ExperienceValidationSchema = z.object({
  company: z.string(),
  position: z.string(),
});

const ExperienceUpdateSchema = z.object({
  company: z.string().optional(),
  position: z.string().optional(),
});

export const ExperienceValidation = {
  ExperienceValidationSchema,
  ExperienceUpdateSchema,
};
