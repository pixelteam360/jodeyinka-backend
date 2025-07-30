import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { DriverController } from "./Driver.controller";
import { UserRole } from "@prisma/client";
import { DriverValidation } from "./Driver.validation";

const router = express.Router();

router
  .route("/")
  .get(auth(), DriverController.allDrivers)
  .post(
    auth(UserRole.AGENT, UserRole.EMPLOYER),
    validateRequest(DriverValidation.HireDriverSchema),
    DriverController.hireADriver
  );

router.get("/agent", auth(), DriverController.allAgent);

router
  .route("/bookmark")
  .get(
    auth(UserRole.AGENT, UserRole.EMPLOYER),
    DriverController.getMyBookMarks
  );

router.route("/my-hiring").get(auth(), DriverController.myhiring);

router.route("/:id").get(auth(), DriverController.singleDriver);

router
  .route("/my-hiring/:id")
  .get(auth(), DriverController.singleHiring)
  .patch(auth(UserRole.DRIVER), DriverController.acceptHiring)
  .delete(auth(UserRole.DRIVER), DriverController.deletehiring);

router
  .route("/bookmark/:id")
  .post(
    auth(UserRole.AGENT, UserRole.EMPLOYER),
    DriverController.bookmarkDriver
  );

export const DriverRoutes = router;
