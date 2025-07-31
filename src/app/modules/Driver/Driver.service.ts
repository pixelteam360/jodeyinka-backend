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
  console.log("asdg");
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: driverSearchAbleFields.map((field) => ({
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
  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: {
      ...whereConditions,
      role: "DRIVER",
      DriverProfile: { hired: false },
    },
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
      ...whereConditions,
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

const allAgent = async (
  params: IDriverFilterRequest,
  options: IPaginationOptions
) => {
  console.log("asdg");
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: driverSearchAbleFields.map((field) => ({
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
  const whereConditions: Prisma.UserWhereInput = { AND: andConditions };

  const result = await prisma.user.findMany({
    where: {
      ...whereConditions,
      role: "AGENT",
    },
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
      fullName: true,
      image: true,
      avgRating: true,
      Profile: true,
    },
  });

  const total = await prisma.user.count({
    where: {
      ...whereConditions,
      role: "AGENT",
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
          monthlyRate: true,
          Experience: true,
        },
      },
      Profile: true,
    },
  });

  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
  }

  return result;
};

const bookmarkDriver = async (driverId: string, userId: string) => {
  const driver = await prisma.user.findFirst({
    where: { id: driverId },
  });
  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
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
          id: true,
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
          Profile: true,
        },
      },
    },
  });

  return res;
};

const hireADriver = async (payload: TDriverHire, userId: string) => {
  const driver = await prisma.user.findFirst({
    where: { id: payload.driverId },
    select: { id: true, role: true },
  });

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, "Driver not found");
  }

  if (driver.role === "DRIVER") {
    const notHired = await prisma.driverProfile.findFirst({
      where: { userId: driver.id, hired: false },
      select: { id: true },
    });

    if (!notHired) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Driver is already hired");
    }
  }

  const sendedHiring = await prisma.driverHire.findFirst({
    where: { driverId: driver.id, userId },
    select: { id: true },
  });

  if (sendedHiring) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have already sended a request"
    );
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      Profile: { select: { driverCanHire: true } },
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.Profile === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
  }

  const acceptedHiring = await prisma.driverHire.count({
    where: { userId, status: "ACCEPTED", driver: { role: "DRIVER" } },
  });

  const driverJob = await prisma.job.count({
    where: { userId: user.id, status: "ACCEPTED", hiringType: "DRIVER" },
  });

  const totalDriverHired = acceptedHiring + driverJob;

  if (
    driver.role === "DRIVER" &&
    user.Profile.driverCanHire <= totalDriverHired
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You have reached your maximum driver hiring limit."
    );
  }

  if (user.role === "EMPLOYER" && driver.role === "AGENT") {
    const job = await prisma.job.findFirst({
      where: { userId: user.id, status: "ACCEPTED", hiringType: "AGENT" },
      select: { id: true },
    });

    const acceptedHiring = await prisma.driverHire.count({
      where: { userId, status: "ACCEPTED", driver: { role: "AGENT" } },
    });

    if (job || acceptedHiring) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "You have reached your maximum agent hiring limit."
      );
    }
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

  if (user?.role === "DRIVER") {
    whereConditions.driverId = user.id;
    whereConditions.adminApproved = true;
  } else {
    whereConditions.userId = user?.id;
  }

  const result = await prisma.driverHire.findMany({
    where: whereConditions,
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
          Profile: { select: { address: true } },
          DriverProfile: { select: { address: true } },
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

const singleHiring = async (hiringId: string, userId: string) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, role: true },
  });

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
      user: {
        select: { id: true, image: true, fullName: true, avgRating: true },
      },
      monthlyPayment: true,
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

  if (!offer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Hiring Offer not found");
  }

  if (offer.driverId !== userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorize access");
  }

  if (offer.user.Profile === null) {
    throw new ApiError(httpStatus.NOT_FOUND, "Owner profile not found");
  }

  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      DriverProfile: { select: { hired: true } },
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  if (user.role === "DRIVER" && user.DriverProfile?.hired === true) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are already hired");
  }

  const acceptedHiring = await prisma.driverHire.count({
    where: { userId: offer.user.id, status: "ACCEPTED" },
  });

  const driverJob = await prisma.job.count({
    where: { userId: offer.user.id, status: "ACCEPTED", hiringType: "DRIVER" },
  });

  const totalDriverHired = acceptedHiring + driverJob;

  if (
    user.role === "DRIVER" &&
    offer.user.Profile?.driverCanHire <= totalDriverHired
  ) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "The owner has reached their maximum driver hiring limit."
    );
  }

  const result = await prisma.$transaction(async (prisma) => {
    const driverHire = await prisma.driverHire.update({
      where: { id: offer.id },
      data: { status: "ACCEPTED" },
      select: { id: true, status: true },
    });

    if (user.role === "DRIVER") {
      await prisma.driverProfile.update({
        where: { userId },
        data: { hired: true },
      });
    }

    await prisma.monthlyPayment.create({
      data: { date: new Date(), driverHireId: driverHire.id },
    });

    return driverHire;
  });

  return result;
};

const deletehiring = async (id: string, userId: string) => {
  const offer = await prisma.driverHire.findFirst({
    where: { id },
    select: { id: true, userId: true, driverId: true, status: true },
  });

  if (!offer) {
    throw new ApiError(httpStatus.NOT_FOUND, "Data not found");
  }

  if (offer.status === "ACCEPTED") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You cannot delete accepted hiring"
    );
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
  allAgent,
  singleDriver,
  hireADriver,
  bookmarkDriver,
  getMyBookMarks,
  myhiring,
  singleHiring,
  acceptHiring,
  deletehiring,
};
