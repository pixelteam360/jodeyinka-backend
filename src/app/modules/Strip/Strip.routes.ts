import express from "express";
import auth from "../../middlewares/auth";
import { StripController } from "./Strip.controller";
import { StripService } from "./Strip.service";
import validateRequest from "../../middlewares/validateRequest";
import { StripValidation } from "./Strip.validation";

const router = express.Router();

router.route("/auth").get(auth(), StripController.stripeAuth);

router.get("/callback", StripService.stripeCallback);

router.get("/success", StripController.successStatus);

router.post(
  "/payment",
  auth(),
  validateRequest(StripValidation.paymentSchema),
  StripController.payProvider
);

export const StripRoutes = router;
