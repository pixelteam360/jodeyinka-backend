import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ProfileService } from "./Profile.service";

const createProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.createProfileIntoDb(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Profile Registered successfully!",
    data: result,
  });
});

const createDriverProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.createDriverProfile(
    req.body,
    req.user.id,
    req.file
  );
  sendResponse(res, {
    message: "Driver Profile Registered successfully!",
    data: result,
  });
});

const getProfiles = catchAsync(async (req, res) => {
  const result = await ProfileService.getProfilesFromDb();
  sendResponse(res, {
    message: "Profiles retrieve successfully!",
    data: result,
  });
});

const myProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.myProfile(req.user.id);
  sendResponse(res, {
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.updateProfile(req.body, req.user.id);
  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const updateDriverProfile = catchAsync(async (req, res) => {
  const result = await ProfileService.updateDriverProfile(
    req.body,
    req.user.id,
    req.file
  );
  sendResponse(res, {
    message: "Driver Profile Updated successfully!",
    data: result,
  });
});

export const ProfileController = {
  createProfile,
  createDriverProfile,
  getProfiles,
  myProfile,
  updateProfile,
  updateDriverProfile,
};
