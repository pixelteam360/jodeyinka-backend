import { UserRole } from "@prisma/client";

export type TProfile = {
  id: string;
  country: string;
  state: string;
  city: string;
  driverCanHire: number;
  createdAt: Date;
  userId: string;
  role: UserRole;
  paymentAmount: number;
  paymentId?: string;
};

export type TDriverProfile = {
  id: string;
  fullName: string;
  email: string;
  photo: string;
  monthlyRate: string;
  about: string;
  drivingLicense: string;
  country: string;
  state: string;
  referenceNumber1: string;
  referenceNumber2: string;
  referenceEmail1: string;
  referenceEmail2: string;
  createdAt: Date;
  userId: string;
};

