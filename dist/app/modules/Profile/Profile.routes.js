"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const Profile_controller_1 = require("./Profile.controller");
const client_1 = require("@prisma/client");
const Profile_validation_1 = require("./Profile.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(), Profile_controller_1.ProfileController.myProfile)
    .post((0, auth_1.default)(client_1.UserRole.AGENT, client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(Profile_validation_1.ProfileValidation.ProfileValidationSchema), Profile_controller_1.ProfileController.createProfile)
    .put((0, auth_1.default)(client_1.UserRole.AGENT, client_1.UserRole.EMPLOYER), (0, validateRequest_1.default)(Profile_validation_1.ProfileValidation.ProfileUpdateSchema), Profile_controller_1.ProfileController.updateProfile);
router
    .route("/driver")
    .post((0, auth_1.default)(client_1.UserRole.DRIVER), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(Profile_validation_1.ProfileValidation.DriverProfileSchema), Profile_controller_1.ProfileController.createDriverProfile)
    .put((0, auth_1.default)(client_1.UserRole.DRIVER), fileUploader_1.fileUploader.uploadSingle, (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(Profile_validation_1.ProfileValidation.UpdateDriverProfileSchema), Profile_controller_1.ProfileController.updateDriverProfile);
exports.ProfileRoutes = router;
