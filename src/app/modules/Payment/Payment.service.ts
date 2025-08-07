import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { IPaymentFilterRequest } from "./Payment.interface";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma } from "@prisma/client";
import { paymentSearchAbleFields } from "./Payment.costant";

const paymentForMoreDriver = async (
  payload: { paymentAmount: number; paymentId: string; driverCanHire: number },
  userId: string
) => {
  const result = await prisma.$transaction(async (prisma) => {
    await prisma.profile.update({
      where: { userId },
      data: {
        driverCanHire: { increment: payload.driverCanHire },
      },
    });

    const result = await prisma.adminPayment.create({
      data: {
        amount: payload.paymentAmount,
        PaymentFor: "DRIVER_HIRE",
        paymentId: payload.paymentId,
        reviewerId: userId,
      },
    });

    return result;
  });
  return result;
};

const paymentForReview = async (
  payload: { paymentAmount: number; paymentId: string; reviewOwnerId: string },
  userId: string
) => {
  const user = await prisma.user.findFirst({
    where: { id: payload.reviewOwnerId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await prisma.adminPayment.create({
    data: {
      amount: payload.paymentAmount,
      PaymentFor: "REVIEW",
      paymentId: payload.paymentId,
      reviewerId: userId,
      reviewOwnerId: payload.reviewOwnerId,
    },
  });

  return result;
};

const getAppPayment = async (
  params: IPaymentFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.AdminPaymentWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: paymentSearchAbleFields.map((field) => ({
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
  const whereConditions: Prisma.AdminPaymentWhereInput = { AND: andConditions };

  const result = await prisma.adminPayment.findMany({
    where: whereConditions,
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
    include: { reviewOwner: { select: { fullName: true } } },
  });
  const total = await prisma.adminPayment.count({
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

export const PaymentService = {
  paymentForMoreDriver,
  paymentForReview,
  getAppPayment,
};
