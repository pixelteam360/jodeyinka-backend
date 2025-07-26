import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { JobController } from "./Job.controller";
import { UserRole } from "@prisma/client";
import { JobValidation } from "./Job.validation";

const router = express.Router();

router
  .route("/")
  .get(auth(), JobController.myJobs)
  .post(
    auth(UserRole.DRIVER),
    validateRequest(JobValidation.JobValidationSchema),
    JobController.createJob
  );

router
  .route("/:id")
  .put(
    auth(UserRole.DRIVER),
    validateRequest(JobValidation.JobUpdateSchema),
    JobController.updateJob
  );

export const JobRoutes = router;
