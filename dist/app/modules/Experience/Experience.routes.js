"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Experience_controller_1 = require("./Experience.controller");
const client_1 = require("@prisma/client");
const Experience_validation_1 = require("./Experience.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(), Experience_controller_1.ExperienceController.myExperiences)
    .post((0, auth_1.default)(client_1.UserRole.DRIVER), (0, validateRequest_1.default)(Experience_validation_1.ExperienceValidation.ExperienceValidationSchema), Experience_controller_1.ExperienceController.createExperience);
router
    .route("/:id")
    .put((0, auth_1.default)(client_1.UserRole.DRIVER), (0, validateRequest_1.default)(Experience_validation_1.ExperienceValidation.ExperienceUpdateSchema), Experience_controller_1.ExperienceController.updateExperience);
exports.ExperienceRoutes = router;
