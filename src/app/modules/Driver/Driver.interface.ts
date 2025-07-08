import { HiringStatus } from "@prisma/client";

export type TDriverHire = {
  id: string;
  offerAmount: number;
  aboutOffer: string;
  status: HiringStatus
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  driverId: string;
};

export type IDriverFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};

export type IDriverHireFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
