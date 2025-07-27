"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentValidation = void 0;
const zod_1 = require("zod");
const extraDriverPaymentSchema = zod_1.z.object({
    driverCanHire: zod_1.z.number().int(),
    paymentAmount: zod_1.z.number().int(),
    paymentId: zod_1.z.string(),
});
const reviewPaymentSchema = zod_1.z.object({
    reviewOwnerId: zod_1.z.string(),
    paymentAmount: zod_1.z.number().int(),
    paymentId: zod_1.z.string(),
});
exports.PaymentValidation = {
    extraDriverPaymentSchema,
    reviewPaymentSchema
};
