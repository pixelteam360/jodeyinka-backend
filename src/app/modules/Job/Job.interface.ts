import { HiringStatus, HiringType, JobStatus } from "@prisma/client";

export type TJob = {
  id: string;
  hiringType: HiringType;
  location: string;
  amount: string;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type TJobApplication = {
  id: string;
  amount: number;
  about: string;
  adminApproved: boolean;
  status: HiringStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  jobId: string;
};


export type IJobFilterRequest = {
  name?: string | undefined;
  email?: string | undefined;
  contactNumber?: string | undefined;
  searchTerm?: string | undefined;
};
