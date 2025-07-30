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
exports.StripController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Strip_service_1 = require("./Strip.service");
const stripeAuth = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Strip_service_1.StripService.stripeAuth(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Strip auth successfully!",
        data: result,
    });
}));
const successStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Strip_service_1.StripService.successStatus();
    (0, sendResponse_1.default)(res, {
        message: "Strip auth successfully!",
        data: result,
    });
}));
const payProvider = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Strip_service_1.StripService.payProvider(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Payment successfully!",
        data: result,
    });
}));
exports.StripController = {
    stripeAuth,
    successStatus,
    payProvider
};
