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
exports.PaymentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paymentForMoreDriver = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.profile.update({
            where: { userId },
            data: {
                driverCanHire: { increment: payload.driverCanHire },
            },
        });
        const result = yield prisma.adminPayment.create({
            data: {
                amount: payload.paymentAmount,
                PaymentFor: "DRIVER_HIRE",
                paymentId: payload.paymentId,
                reviewerId: userId,
            },
        });
        return result;
    }));
    return result;
});
const paymentForReview = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({ where: { id: payload.reviewOwnerId } });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield prisma_1.default.adminPayment.create({
        data: {
            amount: payload.paymentAmount,
            PaymentFor: "REVIEW",
            paymentId: payload.paymentId,
            reviewerId: userId,
            reviewOwnerId: payload.reviewOwnerId,
        },
    });
    return result;
});
exports.PaymentService = {
    paymentForMoreDriver,
    paymentForReview,
};
