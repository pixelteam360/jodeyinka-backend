import { HiringStatus } from "@prisma/client";
import { z } from "zod";

const HireDriverSchema = z.object({
  offerAmount: z.number(),
  aboutOffer: z.string(),
  driverId: z.string(),
});

export const DriverValidation = {
  HireDriverSchema,
};
