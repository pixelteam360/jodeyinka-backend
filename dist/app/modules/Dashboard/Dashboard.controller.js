"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Driver_costant_1 = require("../Driver/Driver.costant");
const Dashboard_service_1 = require("./Dashboard.service");
const allHiring = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, Driver_costant_1.driverHireFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield Dashboard_service_1.DashboardService.allHiring(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Hiring retrieved successfully",
        data: result,
    });
}));
const approveHiring = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.approveHiring(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Hiring approved successfully!",
        data: result,
    });
}));
const allJobApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, Driver_costant_1.driverHireFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield Dashboard_service_1.DashboardService.allJobApplication(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Dashboard retrieved successfully",
        data: result,
    });
}));
const approveApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.approveApplication(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Application approved successfully!",
        data: result,
    });
}));
const overView = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.overView();
    (0, sendResponse_1.default)(res, {
        message: "Overview retrieved successfully!",
        data: result,
    });
}));
const revenueChart = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.revenueChart();
    (0, sendResponse_1.default)(res, {
        message: "Revenue Chart retrieved successfully!",
        data: result,
    });
}));
const admins = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.admins();
    (0, sendResponse_1.default)(res, {
        message: "All Admins retrieved successfully!",
        data: result,
    });
}));
const createAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Dashboard_service_1.DashboardService.createAdmin(req.body);
    (0, sendResponse_1.default)(res, {
        message: "All Admins retrieved successfully!",
        data: result,
    });
}));
exports.DashboardController = {
    allHiring,
    approveHiring,
    allJobApplication,
    approveApplication,
    overView,
    revenueChart,
    admins,
    createAdmin,
};
