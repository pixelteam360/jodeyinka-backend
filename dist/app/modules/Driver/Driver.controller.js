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
exports.DriverController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const user_costant_1 = require("../User/user.costant");
const Driver_service_1 = require("./Driver.service");
const allDrivers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, user_costant_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield Driver_service_1.DriverService.allDrivers(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Driver retrieved successfully",
        data: result,
    });
}));
const singleDriver = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Driver_service_1.DriverService.singleDriver(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Driver retrieved successfully!",
        data: result,
    });
}));
const hireADriver = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Driver_service_1.DriverService.hireADriver(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Driver retrieved successfully!",
        data: result,
    });
}));
exports.DriverController = {
    allDrivers,
    singleDriver,
    hireADriver
};
