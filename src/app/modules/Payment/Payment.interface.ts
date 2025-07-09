import { HiringStatus } from "@prisma/client";

export type TPaymentHire = {
  id: string;
  offerAmount: number;
  aboutOffer: string;
  status: HiringStatus
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  PaymentId: string;
};
