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
exports.PaymentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Payment_costant_1 = require("./Payment.costant");
const Payment_service_1 = require("./Payment.service");
const paymentForMoreDriver = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_service_1.PaymentService.paymentForMoreDriver(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Payment retrieved successfully",
        data: result,
    });
}));
const paymentForReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Payment_service_1.PaymentService.paymentForReview(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Payment retrieved successfully",
        data: result,
    });
}));
const getAppPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, Payment_costant_1.paymentFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield Payment_service_1.PaymentService.getAppPayment(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Payment retrieved successfully",
        data: result,
    });
}));
exports.PaymentController = {
    paymentForMoreDriver,
    paymentForReview,
    getAppPayment,
};
