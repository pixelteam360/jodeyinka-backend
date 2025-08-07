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

export type IPaymentFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};