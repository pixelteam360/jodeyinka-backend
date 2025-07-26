import { HiringType, JobStatus } from "@prisma/client";

export type TJob = {
  id: string;
  hiringType: HiringType;
  location: string;
  amount: number;
  status: JobStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
};
