import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { Prisma } from "@prisma/client";
import { IDriverHireFilterRequest } from "../Driver/Driver.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { driverHireSearchAbleFields } from "../Driver/Driver.costant";
import { IJobApplicationFilterRequest } from "./Dashboard.interface";
import { jobApplicationSearchAbleFields } from "./Dashboard.costant";
import httpStatus from "http-status";

const allHiring = async (
  params: IDriverHireFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.DriverHireWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: driverHireSearchAbleFields.map((field) => ({
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

  let whereConditions: Prisma.DriverHireWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.driverHire.findMany({
    where: whereConditions,
    skip,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            adminApproved: "asc",
          },

    select: {
      id: true,
      offerAmount: true,
      status: true,
      user: {
        select: {
          id: true,
          image: true,
          fullName: true,
          avgRating: true,
          role: true,
        },
      },
      driver: {
        select: {
          id: true,
          image: true,
          fullName: true,
          avgRating: true,
          role: true,
        },
      },
    },
  });

  const total = await prisma.driverHire.count({
    where: whereConditions,
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

const approveHiring = async (id: string) => {
  const driverHire = await prisma.driverHire.findFirst({
    where: {
      id,
    },
    select: { id: true },
  });

  if (!driverHire) {
    throw new ApiError(404, "Driver Hire not found");
  }

  const result = await prisma.driverHire.update({
    where: { id },
    data: { adminApproved: true },
  });

  return result;
};

const allJobApplication = async (
  params: IJobApplicationFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.JobApplicationWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: jobApplicationSearchAbleFields.map((field) => ({
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

  let whereConditions: Prisma.JobApplicationWhereInput = {
    AND: andConditions,
  };

  const result = await prisma.jobApplication.findMany({
    where: whereConditions,
    skip,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            adminApproved: "asc",
          },
  });

  const total = await prisma.jobApplication.count({
    where: whereConditions,
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

const approveApplication = async (id: string) => {
  const application = await prisma.jobApplication.findFirst({
    where: { id },
    select: { id: true },
  });

  if (!application) {
    throw new ApiError(httpStatus.NOT_FOUND, "Application not found");
  }

  const res = await prisma.jobApplication.update({
    where: { id },
    data: { adminApproved: true },
  });

  return res;
};

const overView = async () => {
  const totalUsers = await prisma.user.count();
  const totalPayment = await prisma.adminPayment.count();
  const totalRevenue = await prisma.adminPayment.aggregate({
    _sum: {
      amount: true,
    },
  });

  return { totalUsers, totalRevenue: totalRevenue._sum.amount || 0 , totalPayment};
};

export const DashboardService = {
  allHiring,
  approveHiring,
  allJobApplication,
  approveApplication,
  overView
};
