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
import { subMonths, format, startOfMonth } from "date-fns";
import { TUser } from "../User/user.interface";
import config from "../../../config";
import * as bcrypt from "bcrypt";

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
      aboutOffer: true,
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
    include: { user: { select: { fullName: true } } },
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

  return {
    totalUsers,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalPayment,
  };
};

const revenueChart = async () => {
  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));

  const purchases = await prisma.adminPayment.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo,
      },
    },
    select: {
      createdAt: true,
      amount: true,
    },
  });

  const monthlyRevenueMap: Record<string, number> = {};

  for (const purchase of purchases) {
    const key = format(purchase.createdAt, "yyyy-MM");
    monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + purchase.amount;
  }

  const chartData = Array.from({ length: 6 }).map((_, index) => {
    const date = subMonths(new Date(), 5 - index);
    const key = format(date, "yyyy-MM");
    const monthName = format(date, "MMMM");

    return {
      month: monthName,
      totalRevenue: Number((monthlyRevenueMap[key] || 0).toFixed(2)),
    };
  });

  return chartData;
};

const admins = async () => {
  const res = await prisma.user.findMany({ where: { role: "ADMIN" } });

  return res;
};

const createAdmin = async (payload: TUser) => {

    const hashedPassword: string = await bcrypt.hash(
      payload.password,
      Number(config.bcrypt_salt_rounds)
    );
  

  const res = await prisma.user.create({ data: { ...payload, password: hashedPassword, role: "ADMIN" } });

  return res
};

export const monthlyJobPay = async () => {
  try {
    const currentMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const jobs = await prisma.job.findMany({
      where: { status: "ACCEPTED" },
      select: {
        JobApplication: {
          select: { id: true },
        },
      },
    });

    const paymentsToCreate: { jobApplicationId: string; date: Date }[] = [];

    for (const job of jobs) {
      for (const application of job.JobApplication) {
        const alreadyPaid = await prisma.monthlyPayment.findFirst({
          where: {
            jobApplicationId: application.id,
            date: {
              gte: currentMonthStart,
              lt: new Date(
                currentMonthStart.getFullYear(),
                currentMonthStart.getMonth() + 1,
                1
              ),
            },
          },
        });

        if (!alreadyPaid) {
          paymentsToCreate.push({
            date: new Date(),
            jobApplicationId: application.id,
          });
        }
      }
    }

    if (paymentsToCreate.length > 0) {
      await prisma.$transaction(
        paymentsToCreate.map((data) => prisma.monthlyPayment.create({ data }))
      );
    }

    console.log(`${paymentsToCreate.length} monthly job payments created.`);
  } catch (error) {
    console.error("Error in monthly job payments:", error);
  }
};

export const monthlyDriverPay = async () => {
  try {
    const currentMonthStart = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    const hires = await prisma.driverHire.findMany({
      where: { status: "ACCEPTED" },
      select: {
        id: true,
      },
    });

    const paymentsToCreate: { driverHireId: string; date: Date }[] = [];

    for (const hire of hires) {
      const alreadyPaid = await prisma.monthlyPayment.findFirst({
        where: {
          driverHireId: hire.id,
          date: {
            gte: currentMonthStart,
            lt: new Date(
              currentMonthStart.getFullYear(),
              currentMonthStart.getMonth() + 1,
              1
            ),
          },
        },
      });

      if (!alreadyPaid) {
        paymentsToCreate.push({
          date: new Date(),
          driverHireId: hire.id,
        });
      }
    }

    if (paymentsToCreate.length > 0) {
      await prisma.$transaction(
        paymentsToCreate.map((data) => prisma.monthlyPayment.create({ data }))
      );
    }

    console.log(`${paymentsToCreate.length} monthly driver payments created.`);
  } catch (error) {
    console.error("Error in monthly driver payments:", error);
  }
};

export const DashboardService = {
  allHiring,
  approveHiring,
  allJobApplication,
  approveApplication,
  overView,
  revenueChart,
  admins,
  createAdmin
};
