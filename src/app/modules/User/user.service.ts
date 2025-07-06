import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import * as bcrypt from "bcrypt";
import { IPaginationOptions } from "../../../interfaces/paginations";
import { paginationHelper } from "../../../helpars/paginationHelper";
import { Prisma, User } from "@prisma/client";
import { userSearchAbleFields } from "./user.costant";
import config from "../../../config";
import { fileUploader } from "../../../helpars/fileUploader";
import { IUserFilterRequest, TUser } from "./user.interface";
import { emailSender } from "../../../shared/emailSender";
import crypto from "crypto";
import httpStatus from "http-status";

const createUserIntoDb = async (payload: TUser) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
    },
  });

  if (existingUser) {
    throw new ApiError(
      400,
      `User with this email ${payload.email} already exists`
    );
  }

  const otp = Number(crypto.randomInt(1000, 9999));

  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const html = `
<div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    
    <div style="background-color: #1CAD4D; padding: 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 26px;">Forgot Password</h1>
      <p style="margin: 8px 0 0; color: #e0f7ec; font-size: 14px;">Your One-Time Password (OTP) is below</p>
    </div>
    
    <div style="padding: 30px; text-align: center;">
      <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">Use the OTP below to reset your password:</p>
      <p style="font-size: 36px; font-weight: bold; color: #1CAD4D; margin: 20px 0;">${otp}</p>
      <p style="font-size: 14px; color: #666666; margin: 0 0 20px;">This code will expire in <strong>10 minutes</strong>.</p>
    </div>

    <div style="padding: 0 30px 30px; text-align: center;">
      <p style="font-size: 14px; color: #999999; margin: 0;">If you didn’t request this, you can safely ignore this email.</p>
      <p style="font-size: 14px; color: #999999; margin: 8px 0 0;">Need help? Contact us at <a href="mailto:support@nmbull.com" style="color: #1CAD4D; text-decoration: none; font-weight: 500;">support@nmbull.com</a></p>
    </div>

    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
      Best regards,<br/>
      <strong style="color: #1CAD4D;">Nmbull Team</strong>
    </div>

  </div>
</div>`;

  const hashedPassword: string = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const result = await prisma.$transaction(async (prisma) => {
    const user = await prisma.user.create({
      data: {
        ...payload,
        password: hashedPassword,
        otp: otp,
        expirationOtp: otpExpires,
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    await emailSender(user.email, html, "Verification OTP");

    return {
      message: "Verification OTP sent to your email successfully",
    };
  });

  return result;
};

const getUsersFromDb = async (
  params: IUserFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
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
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditons,
  });

  if (!result || result.length === 0) {
    throw new ApiError(404, "No active users found");
  }
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfile = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id },
    select: { id: true, role: true },
  });

  if (user?.role === "DRIVER") {
    const userProfile = await prisma.user.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        location: true,
        image: true,
        role: true,
        phoneNumber: true,
        avgRating: true,
        DriverProfile: {
          select: {
            id: true,
            fullName: true,
            email: true,
            photo: true,
            monthlyRate: true,
            drivingLicense: true,
            country: true,
            state: true,
            about: true,
          },
        },
      },
    });
    return userProfile;
  }

  const userProfile = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      location: true,
      image: true,
      role: true,
      phoneNumber: true,
      avgRating: true,
      Profile: true,
    },
  });

  return userProfile;
};

const updateProfile = async (payload: User, imageFile: any, userId: string) => {
  const existingUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, image: true },
  });

  const result = await prisma.$transaction(async (prisma) => {
    let image = existingUser?.image || "";
    if (imageFile) {
      image = (await fileUploader.uploadToDigitalOcean(imageFile)).Location;
    }

    const createUserProfile = await prisma.user.update({
      where: { id: userId },
      data: { ...payload, image },
    });

    return { message: "Profile updated successfully" };
  });

  return result;
};

const provideReview = async (
  payload: { rating: number; message: string; receiverId: string },
  senderId: string
) => {
  const user = await prisma.user.findFirst({
    where: { id: senderId },
  });

  if (payload.rating > 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Rating must be under 5");
  }

  const driver = await prisma.user.findFirst({
    where: { id: payload.receiverId, role: "DRIVER" },
  });

  if (!driver) {
    throw new ApiError(httpStatus.NOT_FOUND, "Receiver not found");
  }

  const result = await prisma.$transaction(async (prisma) => {
    const serviceRating = await prisma.userRating.create({
      data: {
        rating: payload.rating,
        message: payload.message,
        senderId,
        receiverId: payload.receiverId,
      },
    });

    const averageRating = await prisma.userRating.aggregate({
      _avg: { rating: true },
    });

    await prisma.user.update({
      where: { id: user?.id },
      data: { avgRating: averageRating._avg.rating },
    });

    return serviceRating;
  });
  return result;
};

const userReviews = async (id: string) => {
  const result = await prisma.userRating.findMany({
    where: { receiverId: id },
    select: {
      id: true,
      rating: true,
      message: true,
      createdAt: true,
      sender: { select: { fullName: true, image: true, location: true } },
    },
  });

  return result;
};

export const userService = {
  createUserIntoDb,
  getUsersFromDb,
  getMyProfile,
  updateProfile,
  provideReview,
  userReviews,
};
