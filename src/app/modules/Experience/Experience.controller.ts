import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ExperienceService } from "./Experience.service";

const createExperience = catchAsync(async (req, res) => {
  const result = await ExperienceService.createExperienceIntoDb(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Experience Registered successfully!",
    data: result,
  });
});

const myExperiences = catchAsync(async (req, res) => {
  const result = await ExperienceService.myExperiences(req.user.id);
  sendResponse(res, {
    message: "Experience retrieved successfully",
    data: result,
  });
});

const updateExperience = catchAsync(async (req, res) => {
  const result = await ExperienceService.updateExperience(
    req.body,
    req.user.id,
    req.params.id
  );
  sendResponse(res, {
    message: "Experience updated successfully!",
    data: result,
  });
});

export const ExperienceController = {
  createExperience,
  myExperiences,
  updateExperience,
};
