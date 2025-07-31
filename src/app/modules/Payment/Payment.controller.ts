import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./Payment.service";

const paymentForMoreDriver = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await PaymentService.paymentForMoreDriver(
    req.body,
    req.user.id
  );
  sendResponse(res, {
    message: "Payment retrieved successfully",
    data: result,
  });
});

const paymentForReview = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await PaymentService.paymentForReview(req.body, req.user.id);
  sendResponse(res, {
    message: "Payment retrieved successfully",
    data: result,
  });
});

const getAppPayment = catchAsync(async (req, res) => {
  console.log(req.body);
  const result = await PaymentService.getAppPayment();
  sendResponse(res, {
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  paymentForMoreDriver,
  paymentForReview,
  getAppPayment
};
