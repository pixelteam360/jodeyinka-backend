import express from "express";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { UserRoutes } from "../modules/User/user.routes";
import { ProfileRoutes } from "../modules/Profile/Profile.routes";
import { ExperienceRoutes } from "../modules/Experience/Experience.routes";
import { DriverRoutes } from "../modules/Driver/Driver.routes";
import { PaymentRoutes } from "../modules/Payment/Payment.routes";
import { JobRoutes } from "../modules/Job/Job.routes";
import { DashboardRoutes } from "../modules/Dashboard/Dashboard.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/profile",
    route: ProfileRoutes,
  },
  {
    path: "/experience",
    route: ExperienceRoutes,
  },
  {
    path: "/driver",
    route: DriverRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/job",
    route: JobRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
