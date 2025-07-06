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

export const DriverController = {
  allDrivers,
  singleDriver,
  hireADriver
};
