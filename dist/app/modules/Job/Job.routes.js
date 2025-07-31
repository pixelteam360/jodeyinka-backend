"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Job_controller_1 = require("./Job.controller");
const client_1 = require("@prisma/client");
const Job_validation_1 = require("./Job.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(), Job_controller_1.JobController.getAllJobs)
    .post((0, auth_1.default)(client_1.UserRole.EMPLOYER, client_1.UserRole.AGENT), (0, validateRequest_1.default)(Job_validation_1.JobValidation.JobValidationSchema), Job_controller_1.JobController.createJob);
router.get("/my", (0, auth_1.default)(client_1.UserRole.EMPLOYER, client_1.UserRole.AGENT), Job_controller_1.JobController.myJobs);
router.get("/my-applied", (0, auth_1.default)(client_1.UserRole.DRIVER), Job_controller_1.JobController.myAppliedJobs);
router
    .route("/:id")
    .get((0, auth_1.default)(), Job_controller_1.JobController.singleJob)
    .put((0, auth_1.default)(client_1.UserRole.DRIVER), (0, validateRequest_1.default)(Job_validation_1.JobValidation.JobUpdateSchema), Job_controller_1.JobController.updateJob)
    .post((0, auth_1.default)(client_1.UserRole.AGENT, client_1.UserRole.DRIVER), Job_controller_1.JobController.applyForJob);
router.get("/:id/applications", (0, auth_1.default)(client_1.UserRole.AGENT, client_1.UserRole.EMPLOYER), Job_controller_1.JobController.jobApplications);
router
    .route("/application/:id")
    .patch((0, auth_1.default)(client_1.UserRole.AGENT, client_1.UserRole.EMPLOYER), Job_controller_1.JobController.acceptApplication)
    .delete((0, auth_1.default)(client_1.UserRole.EMPLOYER, client_1.UserRole.AGENT), Job_controller_1.JobController.deleteApplication);
exports.JobRoutes = router;
