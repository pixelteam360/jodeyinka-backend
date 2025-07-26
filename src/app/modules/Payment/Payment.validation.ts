
import { z } from "zod";

const extraDriverPaymentSchema = z.object({
  driverCanHire: z.number().int(),
  paymentAmount: z.number().int(),
  paymentId: z.string(),
});

const reviewPaymentSchema = z.object({
  reviewOwnerId: z.string(),
  paymentAmount: z.number().int(),
  paymentId: z.string(),
});

export const PaymentValidation = {
  extraDriverPaymentSchema,
  reviewPaymentSchema
};
