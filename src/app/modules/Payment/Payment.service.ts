import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";

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

const getAppPayment = async () => {
  const res = await prisma.adminPayment.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
  });
  return res;
};

export const PaymentService = {
  paymentForMoreDriver,
  paymentForReview,
  getAppPayment,
};
