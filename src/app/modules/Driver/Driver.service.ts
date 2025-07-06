import prisma from "../../../shared/prisma";
import { Prisma } from "@prisma/client";
import { IDriverFilterRequest, TDriverHire } from "./Driver.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { driverSearchAbleFields } from "./Driver.costant";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";

const allDrivers = async (
  params: IDriverFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: driverSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  const whereConditons: Prisma.UserWhereInput = { AND: andCondions };

  const result = await prisma.user.findMany({
    where: { ...whereConditons, role: "DRIVER" },
    skip,
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
      fullName: true,
      image: true,
      location: true,
      avgRating: true,
      DriverProfile: { select: { monthlyRate: true } },
    },
  });
  const total = await prisma.user.count({
    where: { ...whereConditons, role: "DRIVER" },
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

const singleDriver = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      fullName: true,
      image: true,
      location: true,
      avgRating: true,
      DriverProfile: {
        select: { monthlyRate: true, about: true, Experience: true },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
  }

  return result;
};

const hireADriver = async (payload: TDriverHire, userId: string) => {
  const driver = await prisma.user.findFirst({
    where: { id: payload.driverId, role: "DRIVER" },
    select: { id: true },
  });

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
  }

  const alreadyHired = await prisma.driverHire.findFirst({
    where: { driverId: driver.id, status: "ACCEPTED" },
    select: { id: true },
  });

  if (alreadyHired) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver is already hired");
  }

  const sendedHiring = await prisma.driverHire.findFirst({
    where: { driverId: driver.id, userId },
    select: { id: true },
  });

  if (sendedHiring) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "You have already sended a request"
    );
  }

  const result = await prisma.driverHire.create({
    data: { ...payload, userId },
  });

  return result;
};

export const DriverService = {
  allDrivers,
  singleDriver,
  hireADriver,
};
