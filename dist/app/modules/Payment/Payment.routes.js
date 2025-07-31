"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Payment_controller_1 = require("./Payment.controller");
const client_1 = require("@prisma/client");
const Payment_validation_1 = require("./Payment.validation");
const router = express_1.default.Router();
router
    .route("/")
    .get((0, auth_1.default)(client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN), Payment_controller_1.PaymentController.getAppPayment);
router
    .route("/extra-driver")
    .post((0, auth_1.default)(), (0, validateRequest_1.default)(Payment_validation_1.PaymentValidation.extraDriverPaymentSchema), Payment_controller_1.PaymentController.paymentForMoreDriver);
router
    .route("/review")
    .post((0, auth_1.default)(), (0, validateRequest_1.default)(Payment_validation_1.PaymentValidation.reviewPaymentSchema), Payment_controller_1.PaymentController.paymentForReview);
exports.PaymentRoutes = router;
