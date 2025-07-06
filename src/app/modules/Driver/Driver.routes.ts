import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpars/fileUploader";
import { DriverController } from "./Driver.controller";
import { UserRole } from "@prisma/client";
import { DriverValidation } from "./Driver.validation";

const router = express.Router();

router.route("/").get(auth(), DriverController.allDrivers);

router.route("/:id").get(auth(), DriverController.singleDriver);

export const DriverRoutes = router;
