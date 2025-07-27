import prisma from "../../../shared/prisma";
import { Job, Prisma } from "@prisma/client";
import { IJobFilterRequest, TJob, TJobApplication } from "./Job.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { jobSearchAbleFields } from "./Job.costant";
import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";

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

const getAllJobs = async (
  params: IJobFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.JobWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: jobSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditions: Prisma.JobWhereInput = { AND: andConditions };

  const result = await prisma.job.findMany({
    where: { ...whereConditions, status: "PENDING" },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },

    select: {
      id: true,
      location: true,
      amount: true,
      user: {
        select: {
          id: true,
          fullName: true,
          image: true,
          avgRating: true,
        },
      },
    },
  });

  const total = await prisma.job.count({
    where: { ...whereConditions, status: "PENDING" },
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const singleJob = async (id: string) => {
  const job = await prisma.job.findFirst({
    where: { id },
    select: {
      id: true,
      location: true,
      amount: true,
      user: {
        select: {
          id: true,
          fullName: true,
          image: true,
          avgRating: true,
          Profile: { select: { about: true } },
        },
      },
    },
  });

  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  return job;
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

const applyForJob = async (
  payload: TJobApplication,
  jobId: string,
  userId: string,
  UserRole: string
) => {
  const job = await prisma.job.findFirst({
    where: { id: jobId },
    select: { id: true, status: true, hiringType: true },
  });

  if (!job) {
    throw new ApiError(httpStatus.NOT_FOUND, "Job not found");
  }

  if (job.status !== "PENDING") {
    throw new ApiError(httpStatus.NOT_FOUND, "This Job is already assigned");
  }

  if (UserRole !== job.hiringType) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "You are not authorized to apply for this job"
    );
  }

  const existingApplication = await prisma.jobApplication.findFirst({
    where: { jobId, userId },
  });

  if (existingApplication) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "You have already applied for this job"
    );
  }

  const res = await prisma.jobApplication.create({
    data: { ...payload, userId, jobId },
  });

  return res;
};

const jobApplications = async (jobId: string) => {
  const res = await prisma.jobApplication.findMany({
    where: { jobId, adminApproved: true },

    select: {
      id: true,
      amount: true,
      about: true,
      user: { select: { id: true, fullName: true, image: true } },
    },
  });

  return res;
};

const acceptApplication = async (applicationId: string, userId: string) => {
  const application = await prisma.jobApplication.findFirst({
    where: { id: applicationId },
    select: {
      id: true,
      user: { select: { role: true, id: true } },
      job: {
        select: { userId: true, id: true },
      },
    },
  });

  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  if (application.job.userId !== userId) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to accept this application"
    );
  }

  if (application.user.role === "DRIVER") {
    const isHired = await prisma.driverProfile.findFirst({
      where: { userId: application.user.id, hired: true },
      select: { id: true, hired: true },
    });

    if (isHired) {
      throw new ApiError(httpStatus.FORBIDDEN, "Driver is already hired");
    }
  }

  const driverHiring = await prisma.driverHire.count({
    where: { userId, status: "ACCEPTED" },
  });

  const jobHire = await prisma.jobApplication.count({
    where: { userId, status: "ACCEPTED", job: { hiringType: "DRIVER" } },
  });

  const totalDriverHire = driverHiring + jobHire;

  const userProfile = await prisma.profile.findFirst({
    where: { userId },
    select: { driverCanHire: true },
  });

  if (userProfile?.driverCanHire! <= totalDriverHire) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User have reached her maximum driver hiring limit."
    );
  }

  if (application.user.role === "AGENT") {
    const jobHire = await prisma.jobApplication.count({
      where: { userId, status: "ACCEPTED", job: { hiringType: "AGENT" } },
    });

    if (jobHire) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "User have reached her maximum agent hiring limit."
      );
    }
  }

  const result = await prisma.$transaction(async (prisma) => {
    const jobApplication = await prisma.jobApplication.update({
      where: { id: application.id },
      data: { status: "ACCEPTED", job: { update: { status: "ACCEPTED" } } },
      select: { id: true, status: true },
    });

    if (application.user.role === "DRIVER") {
      await prisma.driverProfile.update({
        where: { userId: application.user.id },
        data: { hired: true },
      });
    }

    return jobApplication;
  });

  return result;
};

const deleteApplication = async (applicationId: string, userId: string) => {
  const application = await prisma.jobApplication.findFirst({
    where: { id: applicationId },
    select: { id: true, status: true, job: { select: { userId: true } } },
  });

  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }

  if (application.status === "ACCEPTED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cannot delete accepted application"
    );
  }

  if (application.job.userId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize access");
  }

  await prisma.jobApplication.delete({
    where: { id: applicationId },
  });

  return { message: "Application Deleted successfully" };
};

export const JobService = {
  createJobIntoDb,
  myJobs,
  getAllJobs,
  singleJob,
  updateJob,
  applyForJob,
  jobApplications,
  acceptApplication,
  deleteApplication,
};
