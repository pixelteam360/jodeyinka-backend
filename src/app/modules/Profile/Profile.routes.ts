import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { ProfileController } from "./Profile.controller";
import { UserRole } from "@prisma/client";
import { ProfileValidation } from "./Profile.validation";

const router = express.Router();

router
  .route("/")
  .get(auth(), ProfileController.myProfile)
  .post(
    auth(UserRole.AGENT, UserRole.EMPLOYER),
    validateRequest(ProfileValidation.ProfileValidationSchema),
    ProfileController.createProfile
  )
  .put(
    auth(UserRole.AGENT, UserRole.EMPLOYER),
    validateRequest(ProfileValidation.ProfileUpdateSchema),
    ProfileController.updateProfile
  );

router
  .route("/driver")
  .post(
    auth(UserRole.DRIVER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(ProfileValidation.DriverProfileSchema),
    ProfileController.createDriverProfile
  )
  .put(
    auth(UserRole.DRIVER),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(ProfileValidation.UpdateDriverProfileSchema),
    ProfileController.updateDriverProfile
  );

export const ProfileRoutes = router;
