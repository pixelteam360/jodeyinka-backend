import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { DashboardController } from "./Dashboard.controller";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/all-hiring",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DashboardController.allHiring
);

router.get(
  "/job-applications",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DashboardController.allJobApplication
);

router.get(
  "/overview",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DashboardController.overView
);

router
  .route("/hiring-approve/:id")
  .patch(
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    DashboardController.approveHiring
  );

router.patch(
  "/job-applications-approve/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  DashboardController.approveApplication
);

export const DashboardRoutes = router;
