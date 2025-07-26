import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { Profile } from "@prisma/client";
import { TDriverProfile, TProfile } from "./Profile.interface";
import { fileUploader } from "../../../helpars/fileUploader";

const createProfileIntoDb = async (payload: TProfile, userId: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
    },
    select: { id: true, role: true, completedProfile: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.completedProfile) {
    throw new ApiError(400, "Profile already created");
  }

  const { reference, ...restData } = payload;

  const result = await prisma.$transaction(async (prisma) => {
    const profile = await prisma.profile.create({
      data: { ...restData, userId: user.id },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { completedProfile: true },
    });

    await Promise.all(
      reference.map(async (number) => {
        await prisma.userReference.create({
          data: {
            phoneNumber: number,
            userId: user.id,
          },
        });
      })
    );

    await prisma.adminPayment.create({
      data: {
        amount: payload.paymentAmount,
        PaymentFor: "DRIVER_HIRE",
        paymentId: payload.paymentId,
        reviewerId: user.id,
      },
    });

    return profile;
  });

  return result;
};

const createDriverProfile = async (
  payload: TDriverProfile,
  userId: string,
  license: any
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      completedProfile: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!license) {
    throw new ApiError(400, "License is required");
  }

  if (user.completedProfile) {
    throw new ApiError(400, "Profile already created");
  }
  const drivingLicense = (await fileUploader.uploadToDigitalOcean(license))
    .Location;

  const { reference, ...restData } = payload;

  const result = await prisma.$transaction(async (prisma) => {
    const profile = await prisma.driverProfile.create({
      data: { ...restData, userId, drivingLicense },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { completedProfile: true },
    });

    await Promise.all(
      reference.map(async (number) => {
        await prisma.userReference.create({
          data: {
            phoneNumber: number,
            userId: user.id,
          },
        });
      })
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "DRIVER" },
    });

    return profile;
  });

  return result;
};

const getProfilesFromDb = async () => {
  const result = await prisma.profile.findMany({
    select: {
      id: true,
      country: true,
      state: true,
      city: true,
      driverCanHire: true,
      userId: true,
    },
  });

  return result;
};

const myProfile = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id },
    select: { id: true, role: true },
  });
  if (user?.role === "DRIVER") {
    const profile = await prisma.driverProfile.findUnique({
      where: { userId: id },
    });

    if (!profile) {
      throw new ApiError(404, "Profile not found");
    }

    return profile;
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: id },
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

const updateProfile = async (payload: Profile, userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const result = await prisma.profile.update({
    where: { userId: user.id },
    data: payload,
  });

  return result;
};

const updateDriverProfile = async (
  payload: Partial<TDriverProfile>,
  userId: string,
  license: any
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      DriverProfile: { select: { drivingLicense: true } },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let drivingLicense = user.DriverProfile?.drivingLicense;

  if (license) {
    drivingLicense = (await fileUploader.uploadToDigitalOcean(license))
      .Location;
  }

  const result = await prisma.driverProfile.update({
    where: { userId: user.id },
    data: {
      ...payload,
      drivingLicense: drivingLicense,
    },
  });

  return result;
};

export const ProfileService = {
  createProfileIntoDb,
  createDriverProfile,
  getProfilesFromDb,
  myProfile,
  updateProfile,
  updateDriverProfile,
};
