import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.service";
import pick from "../../../shared/pick";
import { userFilterableFields } from "./user.costant";

const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUserIntoDb(req.body);
  sendResponse(res, {
    message: "User Registered successfully!",
    data: result,
  });
});

const getUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.getUsersFromDb(filters, options);
  sendResponse(res, {
    message: "Users retrieve successfully!",
    data: result,
  });
});

const singleUser = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await userService.singleUser(id);
  sendResponse(res, {
    message: "User profile retrieved successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const result = await userService.getMyProfile(id);
  sendResponse(res, {
    message: "User profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req?.user;
  const result = await userService.updateProfile(req.body, req.file, id);
  sendResponse(res, {
    message: "Profile updated successfully!",
    data: result,
  });
});

const provideReview = catchAsync(async (req, res) => {
  const result = await userService.provideReview(req.body, req.user.id);
  sendResponse(res, {
    message: "Review provided successfully!",
    data: result,
  });
});

const userReviews = catchAsync(async (req, res) => {
  const result = await userService.userReviews(
    req.params.id,
    req.user.id,
    req.user.role
  );
  sendResponse(res, {
    message: "Review retrieved successfully!",
    data: result,
  });
});

const blockUser = catchAsync(async (req, res) => {
  const result = await userService.blockUser(req.params.id);
  sendResponse(res, {
    message: "User is blocked successfully",
    data: result,
  });
});

const pendingReference = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.pendingReference(filters, options);
  sendResponse(res, {
    message: "Pending User successfully",
    data: result,
  });
});

const blockedUsers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await userService.blockedUsers(filters, options);
  sendResponse(res, {
    message: "Pending User successfully",
    data: result,
  });
});

export const userController = {
  createUser,
  getUsers,
  singleUser,
  getMyProfile,
  updateProfile,
  provideReview,
  userReviews,
  blockUser,
  pendingReference,
  blockedUsers
};
