import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StripService } from "./Strip.service";

const stripeAuth = catchAsync(async (req, res) => {
  const result = await StripService.stripeAuth(req.user.id);
  sendResponse(res, {
    message: "Strip auth successfully!",
    data: result,
  });
});

const successStatus = catchAsync(async (req, res) => {
  const result = await StripService.successStatus();
  sendResponse(res, {
    message: "Strip auth successfully!",
    data: result,
  });
});

const payProvider = catchAsync(async (req, res) => {
  const result = await StripService.payProvider(req.body, req.user.id);
  sendResponse(res, {
    message: "Payment successfully!",
    data: result,
  });
});

export const StripController = {
  stripeAuth,
  successStatus,
  payProvider
};
