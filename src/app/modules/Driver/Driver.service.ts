import prisma from "../../../shared/prisma";
import { Prisma } from "@prisma/client";
import {
  IDriverFilterRequest,
  IDriverHireFilterRequest,
  TDriverHire,
} from "./Driver.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import {
  driverHireSearchAbleFields,
  driverSearchAbleFields,
} from "./Driver.costant";
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
    where: {
      ...whereConditons,
      role: "DRIVER",
      DriverProfile: { hired: false },
    },
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
      avgRating: true,
      DriverProfile: {
        select: { monthlyRate: true, state: true, city: true, country: true },
      },
    },
  });
  const total = await prisma.user.count({
    where: {
      ...whereConditons,
      role: "DRIVER",
      DriverProfile: { hired: false },
    },
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
      avgRating: true,
      DriverProfile: {
        select: {
          about: true,
          country: true,
          state: true,
          city: true,
          Experience: true,
        },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
  }

  return result;
};

const bookmarkDriver = async (driverId: string, userId: string) => {
  const driver = await prisma.user.findFirst({
    where: { id: driverId, role: "DRIVER" },
  });
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
  }

  const result = await prisma.bookMarkDriver.create({
    data: { driverId, userId },
  });

  return result;
};

const getMyBookMarks = async (userId: string) => {
  const res = await prisma.bookMarkDriver.findMany({
    where: { userId },
    select: {
      driver: {
        select: {
          fullName: true,
          image: true,
          avgRating: true,
          DriverProfile: {
            select: {
              country: true,
              state: true,
              city: true,
              monthlyRate: true,
            },
          },
        },
      },
    },
  });

  return res;
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

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, Profile: { select: { driverCanHire: true } } },
  });

  const acceptedHiring = await prisma.driverHire.count({
    where: { userId, status: "ACCEPTED" },
  });

  if (user?.Profile?.driverCanHire! <= acceptedHiring) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have reached your maximum driver hiring limit."
    );
  }

  const result = await prisma.driverHire.create({
    data: { ...payload, userId },
  });

  return result;
};

const myhiring = async (
  params: IDriverHireFilterRequest,
  options: IPaginationOptions,
  userId: string
) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, role: true },
  });

  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.DriverHireWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: driverHireSearchAbleFields.map((field) => ({
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

  let whereConditons: Prisma.DriverHireWhereInput = {
    AND: andCondions,
  };

  if (user?.role === "DRIVER") {
    whereConditons.driverId = user.id;
  } else {
    whereConditons.userId = user?.id;
  }

  const result = await prisma.driverHire.findMany({
    where: whereConditons,
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
      offerAmount: true,
      status: true,
      user: {
        select: { id: true, image: true, fullName: true, avgRating: true },
      },
      driver: {
        select: { id: true, image: true, fullName: true, avgRating: true },
      },
    },
  });

  const total = await prisma.driverHire.count({
    where: whereConditons,
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

const singleHiring = async (hiringId: string, userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (user?.role === "DRIVER") {
    const result = await prisma.driverHire.findUnique({
      where: { id: hiringId },
      select: {
        id: true,
        offerAmount: true,
        aboutOffer: true,
        status: true,
        user: {
          select: { id: true, image: true, fullName: true, avgRating: true },
        },
      },
    });

    if (!result) {
      throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
    }

    return result;
  }

  const result = await prisma.driverHire.findUnique({
    where: { id: hiringId },
    select: {
      id: true,
      offerAmount: true,
      aboutOffer: true,
      status: true,
      driver: {
        select: { id: true, image: true, fullName: true, avgRating: true },
      },
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }

  return result;
};

const acceptHiring = async (hiringId: string, userId: string) => {
  const offer = await prisma.driverHire.findFirst({
    where: { id: hiringId },
    select: {
      id: true,
      driverId: true,
      user: {
        select: { id: true, Profile: { select: { driverCanHire: true } } },
      },
    },
  });

  if (offer?.driverId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize access");
  }

  const isHired = await prisma.driverProfile.findFirst({
    where: { userId, hired: true },
  });

  if (isHired) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are already hired");
  }

  const acceptedHiring = await prisma.driverHire.count({
    where: { userId: offer.user.id, status: "ACCEPTED" },
  });

  if (offer.user.Profile?.driverCanHire! <= acceptedHiring) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User have reached her maximum driver hiring limit."
    );
  }

  const result = await prisma.driverHire.update({
    where: { id: offer.id },
    data: { status: "ACCEPTED" },
    select: { id: true, status: true },
  });

  return result;
};

const deletehiring = async (id: string, userId: string) => {
  const offer = await prisma.driverHire.findFirst({
    where: { id },
    select: { id: true, userId: true, driverId: true },
  });

  if (!offer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }

  if (offer.userId !== userId && offer.driverId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize access");
  }

  await prisma.driverHire.delete({
    where: { id },
  });

  return { message: "Hiring Deleted successfully" };
};

export const DriverService = {
  allDrivers,
  singleDriver,
  hireADriver,
  bookmarkDriver,
  getMyBookMarks,
  myhiring,
  singleHiring,
  acceptHiring,
  deletehiring,
};
