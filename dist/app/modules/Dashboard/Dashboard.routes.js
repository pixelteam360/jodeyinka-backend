"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Dashboard_controller_1 = require("./Dashboard.controller");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.get("/all-hiring", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Dashboard_controller_1.DashboardController.allHiring);
router.get("/job-applications", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Dashboard_controller_1.DashboardController.allJobApplication);
router.get("/overview", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Dashboard_controller_1.DashboardController.overView);
router.get("/revenue-chart", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Dashboard_controller_1.DashboardController.revenueChart);
router
    .route("/hiring-approve/:id")
    .patch((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Dashboard_controller_1.DashboardController.approveHiring);
router.patch("/job-applications-approve/:id", (0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Dashboard_controller_1.DashboardController.approveApplication);
exports.DashboardRoutes = router;
