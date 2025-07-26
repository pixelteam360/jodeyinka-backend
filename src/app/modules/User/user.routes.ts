import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { UserValidation } from "./user.validation";
import { userController } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpars/fileUploader";

const router = express.Router();

router
  .route("/")
  .get(userController.getUsers)
  .post(
    validateRequest(UserValidation.CreateUserValidationSchema),
    userController.createUser
  );

router
  .route("/profile")
  .get(auth(), userController.getMyProfile)
  .put(
    auth(),
    fileUploader.uploadSingle,
    (req: Request, res: Response, next: NextFunction) => {
      req.body = JSON.parse(req.body.data);
      next();
    },
    validateRequest(UserValidation.userUpdateSchema),
    userController.updateProfile
  );

router
  .route("/review")
  .post(
    auth(),
    validateRequest(UserValidation.RatingSchema),
    userController.provideReview
  );
router.get("/review/:id", auth(), userController.userReviews);

router.route("/:id").get(auth(), userController.singleUser);

export const UserRoutes = router;
