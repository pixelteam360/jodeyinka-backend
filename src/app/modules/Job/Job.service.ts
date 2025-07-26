import prisma from "../../../shared/prisma";
import { Job } from "@prisma/client";
import { TJob } from "./Job.interface";

const createJobIntoDb = async (payload: TJob, userId: string) => {
  const user = await prisma.profile.findFirst({
    where: { userId },
    select: { driverCanHire: true },
  });

  const jobDriver = await prisma.job.count({
    where: { userId, hiringType: "DRIVER" },
  });
  const jobAgent = await prisma.job.count({
    where: { userId, hiringType: "AGENT" },
  });

  if (user?.driverCanHire! <= jobDriver) {
    throw new Error("You have reached your maximum job hiring limit.");
  }

  if (jobAgent) {
    throw new Error("You can only create a maximum of 1 jobs post for Agent.");
  }

  const result = await prisma.job.create({
    data: { ...payload, userId },
  });

  return result;
};

const myJobs = async (userId: string) => {
  const driverProfile = await prisma.job.findMany({
    where: {
      userId,
    },
  });

  return driverProfile;
};

const updateJob = async (payload: Job, userId: string, JobId: string) => {
  const Job = await prisma.job.findFirst({
    where: { id: JobId },
    select: { userId: true },
  });

  if (userId === Job?.userId) {
    throw new Error("You are not authorized to update this job.");
  }

  const result = await prisma.job.update({
    where: { id: JobId },
    data: payload,
  });

  return result;
};

export const JobService = {
  createJobIntoDb,
  myJobs,
  updateJob,
};
