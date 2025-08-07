import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { driverHireFilterableFields } from "../Driver/Driver.costant";
import { DashboardService } from "./Dashboard.service";

const allHiring = catchAsync(async (req, res) => {
  const filters = pick(req.query, driverHireFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DashboardService.allHiring(filters, options);
  sendResponse(res, {
    message: "Hiring retrieved successfully",
    data: result,
  });
});

const approveHiring = catchAsync(async (req, res) => {
  const result = await DashboardService.approveHiring(req.params.id);
  sendResponse(res, {
    message: "Hiring approved successfully!",
    data: result,
  });
});

const allJobApplication = catchAsync(async (req, res) => {
  const filters = pick(req.query, driverHireFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await DashboardService.allJobApplication(filters, options);
  sendResponse(res, {
    message: "Dashboard retrieved successfully",
    data: result,
  });
});

const approveApplication = catchAsync(async (req, res) => {
  const result = await DashboardService.approveApplication(req.params.id);
  sendResponse(res, {
    message: "Application approved successfully!",
    data: result,
  });
});

const overView = catchAsync(async (req, res) => {
  const result = await DashboardService.overView();
  sendResponse(res, {
    message: "Overview retrieved successfully!",
    data: result,
  });
});

const revenueChart = catchAsync(async (req, res) => {
  const result = await DashboardService.revenueChart();
  sendResponse(res, {
    message: "Revenue Chart retrieved successfully!",
    data: result,
  });
});

const admins = catchAsync(async (req, res) => {
  const result = await DashboardService.admins();
  sendResponse(res, {
    message: "All Admins retrieved successfully!",
    data: result,
  });
});

const createAdmin = catchAsync(async (req, res) => {
  const result = await DashboardService.createAdmin(req.body);
  sendResponse(res, {
    message: "All Admins retrieved successfully!",
    data: result,
  });
});

export const DashboardController = {
  allHiring,
  approveHiring,
  allJobApplication,
  approveApplication,
  overView,
  revenueChart,
  admins,
  createAdmin,
};
