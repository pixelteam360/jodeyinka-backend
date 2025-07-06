import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { ExperienceController } from "./Experience.controller";
import { UserRole } from "@prisma/client";
import { ExperienceValidation } from "./Experience.validation";

const router = express.Router();

router
  .route("/")
  .get(auth(), ExperienceController.myExperiences)
  .post(
    auth(UserRole.DRIVER),
    validateRequest(ExperienceValidation.ExperienceValidationSchema),
    ExperienceController.createExperience
  );

router
  .route("/:id")
  .put(
    auth(UserRole.DRIVER),
    validateRequest(ExperienceValidation.ExperienceUpdateSchema),
    ExperienceController.updateExperience
  );

export const ExperienceRoutes = router;
