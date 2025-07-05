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
    select: { id: true, role: true },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "USER") {
    throw new ApiError(409, "Profile already exists");
  }

  const result = await prisma.$transaction(async (prisma) => {
    const profile = await prisma.profile.create({
      data: {
        city: payload.city,
        userId: user.id,
        country: payload.country,
        state: payload.state,
        driverCanHire: payload.driverCanHire,
      },
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { role: payload.role },
    });

    await prisma.adminPayment.create({
      data: {
        amount: payload.paymentAmount,
        PaymentFor: "DRIVER_HIRE",
        paymentId: payload.paymentId,
        userId: user.id,
      },
    });

    return profile;
  });

  return result;
};

const createDriverProfile = async (
  payload: TDriverProfile,
  userId: string,
  photo: Express.Multer.File,
  licence: Express.Multer.File
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "USER") {
    throw new ApiError(409, "Profile already exists");
  }

  if (!photo || !licence) {
    throw new ApiError(400, "Photo and licence are required");
  }

  const photoUrl = (await fileUploader.uploadToDigitalOcean(photo)).Location;
  const licenceUrl = (await fileUploader.uploadToDigitalOcean(licence))
    .Location;

  const result = await prisma.$transaction(async (prisma) => {
    const profile = await prisma.driverProfile.create({
      data: {
        ...payload,
        photo: photoUrl,
        drivingLicense: licenceUrl,
        userId: user.id,
      },
    });

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
    select: {
      id: true,
      country: true,
      state: true,
      city: true,
      driverCanHire: true,
      userId: true,
    },
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
  photo: any,
  licence: any
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      DriverProfile: { select: { photo: true, drivingLicense: true } },
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "USER") {
    throw new ApiError(409, "Profile already exists");
  }

  let photoUrl = user.DriverProfile?.photo;

  if (photo) {
    photoUrl = (await fileUploader.uploadToDigitalOcean(photo)).Location;
  }
  let licenceUrl = user.DriverProfile?.drivingLicense;

  if (licenceUrl) {
    licenceUrl = (await fileUploader.uploadToDigitalOcean(licence)).Location;
  }

  const result = await prisma.driverProfile.update({
    where: { userId: user.id },
    data: {
      ...payload,
      photo: photoUrl!,
      drivingLicense: licenceUrl!,
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
