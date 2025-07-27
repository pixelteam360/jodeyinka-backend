import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { JobController } from "./Job.controller";
import { UserRole } from "@prisma/client";
import { JobValidation } from "./Job.validation";

const router = express.Router();

router
  .route("/")
  .get(auth(), JobController.getAllJobs)
  .post(
    auth(UserRole.EMPLOYER, UserRole.AGENT),
    validateRequest(JobValidation.JobValidationSchema),
    JobController.createJob
  );

router.get(
  "/my",
  auth(UserRole.EMPLOYER, UserRole.AGENT),
  JobController.myJobs
);

router
  .route("/:id")
  .get(auth(), JobController.singleJob)
  .put(
    auth(UserRole.DRIVER),
    validateRequest(JobValidation.JobUpdateSchema),
    JobController.updateJob
  )
  .post(auth(UserRole.AGENT, UserRole.DRIVER), JobController.applyForJob);

router.get(
  "/:id/applications",
  auth(UserRole.AGENT, UserRole.EMPLOYER),
  JobController.jobApplications
);

router
  .route("/application/:id")
  .patch(
    auth(UserRole.AGENT, UserRole.EMPLOYER),
    JobController.acceptApplication
  )
  .delete(
    auth(UserRole.EMPLOYER, UserRole.AGENT),
    JobController.deleteApplication
  );

export const JobRoutes = router;
