import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { userFilterableFields } from "../User/user.costant";
import { DriverService } from "./Driver.service";

const allDrivers = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DriverService.allDrivers(filters, options);
  sendResponse(res, {
    message: "Driver retrieved successfully",
    data: result,
  });
});

const singleDriver = catchAsync(async (req, res) => {
  const result = await DriverService.singleDriver(req.params.id);
  sendResponse(res, {
    message: "Driver retrieved successfully!",
    data: result,
  });
});

const hireADriver = catchAsync(async (req, res) => {
  const result = await DriverService.hireADriver(req.body, req.user.id);
  sendResponse(res, {
    message: "Driver retrieved successfully!",
    data: result,
  });
});

const bookmarkDriver = catchAsync(async (req, res) => {
  const result = await DriverService.bookmarkDriver(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Driver bookmarked successfully!",
    data: result,
  });
});

const getMyBookMarks = catchAsync(async (req, res) => {
  const result = await DriverService.getMyBookMarks(req.user.id);
  sendResponse(res, {
    message: "Bookmarked retrieved successfully!",
    data: result,
  });
});

const myhiring = catchAsync(async (req, res) => {
  const filters = pick(req.query, userFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DriverService.myhiring(filters, options, req.user.id);
  sendResponse(res, {
    message: "Hiring retrieved successfully",
    data: result,
  });
});

const singleHiring = catchAsync(async (req, res) => {
  const result = await DriverService.singleHiring(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Hiring offer retrieved successfully!",
    data: result,
  });
});

const acceptHiring = catchAsync(async (req, res) => {
  const result = await DriverService.acceptHiring(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Driver accepted successfully!",
    data: result,
  });
});

const deletehiring = catchAsync(async (req, res) => {
  const result = await DriverService.deletehiring(req.params.id, req.user.id);
  sendResponse(res, {
    message: "Hiring deleted successfully!",
    data: result,
  });
});

export const DriverController = {
  allDrivers,
  singleDriver,
  hireADriver,
  bookmarkDriver,
  getMyBookMarks,
  myhiring,
  singleHiring,
  acceptHiring,
  deletehiring,
};
