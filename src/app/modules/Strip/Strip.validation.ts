
import { z } from "zod";



const paymentSchema = z.object({
  receiverId: z.string().min(1, "Receiver ID is required"),
  paymentMethodId: z.string().min(1, "Payment Method ID is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  monthlyPaymentId: z.string().min(1, "Unit Payment ID is required")
});

export const StripValidation = {
  paymentSchema
};
