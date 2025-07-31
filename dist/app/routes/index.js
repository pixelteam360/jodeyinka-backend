"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/Auth/auth.routes");
const user_routes_1 = require("../modules/User/user.routes");
const Profile_routes_1 = require("../modules/Profile/Profile.routes");
const Experience_routes_1 = require("../modules/Experience/Experience.routes");
const Driver_routes_1 = require("../modules/Driver/Driver.routes");
const Payment_routes_1 = require("../modules/Payment/Payment.routes");
const Job_routes_1 = require("../modules/Job/Job.routes");
const Dashboard_routes_1 = require("../modules/Dashboard/Dashboard.routes");
const Strip_routes_1 = require("../modules/Strip/Strip.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.UserRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/profile",
        route: Profile_routes_1.ProfileRoutes,
    },
    {
        path: "/experience",
        route: Experience_routes_1.ExperienceRoutes,
    },
    {
        path: "/driver",
        route: Driver_routes_1.DriverRoutes,
    },
    {
        path: "/payment",
        route: Payment_routes_1.PaymentRoutes,
    },
    {
        path: "/job",
        route: Job_routes_1.JobRoutes,
    },
    {
        path: "/dashboard",
        route: Dashboard_routes_1.DashboardRoutes,
    },
    {
        path: "/stripe",
        route: Strip_routes_1.StripRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
