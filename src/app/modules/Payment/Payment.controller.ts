import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";
import { paymentFilterableFields } from "./Payment.costant";
import { PaymentService } from "./Payment.service";

const paymentForMoreDriver = catchAsync(async (req, res) => {
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
  const result = await PaymentService.paymentForReview(req.body, req.user.id);
  sendResponse(res, {
    message: "Payment retrieved successfully",
    data: result,
  });
});

const getAppPayment = catchAsync(async (req, res) => {
  const filters = pick(req.query, paymentFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const result = await PaymentService.getAppPayment(filters, options);
  sendResponse(res, {
    message: "Payment retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  paymentForMoreDriver,
  paymentForReview,
  getAppPayment,
};
