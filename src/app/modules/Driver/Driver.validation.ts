import { z } from "zod";



const DriverUpdateSchema = z.object({
  rating: z.number(),
  message: z.string(),
  senderId: z.string(),
});

export const DriverValidation = {
  DriverUpdateSchema,
};
