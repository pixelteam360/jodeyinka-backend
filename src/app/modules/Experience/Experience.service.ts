import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { Experience } from "@prisma/client";
import { TExperience } from "./Experience.interface";

const createExperienceIntoDb = async (payload: TExperience, userId: string) => {
  const driverProfile = await prisma.driverProfile.findFirst({
    where: {
      userId,
    },
    select: { id: true },
  });

  if (!driverProfile) {
    throw new ApiError(404, "Driver Profile not found");
  }

  const result = await prisma.experience.create({
    data: { ...payload, driverProfileId: driverProfile.id },
  });

  return result;
};

const myExperiences = async (userId: string) => {
  const driverProfile = await prisma.driverProfile.findFirst({
    where: {
      userId,
    },
    select: { id: true },
  });

  const Experience = await prisma.experience.findMany({
    where: { driverProfileId: driverProfile?.id },
  });

  return Experience;
};

const updateExperience = async (payload: Experience, userId: string, experienceId: string) => {

  const experience = await prisma.experience.findFirst({
    where: {id: experienceId},
    select: {id: true, driverProfile: {select: {userId: true}}}
  }) 

  if(userId === experience?.driverProfile.userId){
    
  }

  const result = await prisma.experience.update({
    where: {id: experienceId },
    data: payload,
  });

  return result;
};

export const ExperienceService = {
  createExperienceIntoDb,
  myExperiences,
  updateExperience,
};
