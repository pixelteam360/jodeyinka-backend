import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { PaymentController } from "./Payment.controller";
import { UserRole } from "@prisma/client";
import { PaymentValidation } from "./Payment.validation";

const router = express.Router();

router
  .route("/")
  .get(
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    PaymentController.getAppPayment
  );

router
  .route("/extra-driver")
  .post(
    auth(),
    validateRequest(PaymentValidation.extraDriverPaymentSchema),
    PaymentController.paymentForMoreDriver
  );

router
  .route("/review")
  .post(
    auth(),
    validateRequest(PaymentValidation.reviewPaymentSchema),
    PaymentController.paymentForReview
  );

export const PaymentRoutes = router;
