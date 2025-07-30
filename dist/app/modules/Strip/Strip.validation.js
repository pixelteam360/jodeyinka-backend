"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const paymentSchema = zod_1.z.object({
    receiverId: zod_1.z.string().min(1, "Receiver ID is required"),
    paymentMethodId: zod_1.z.string().min(1, "Payment Method ID is required"),
    amount: zod_1.z.number().positive("Amount must be greater than 0"),
    unitPaymentId: zod_1.z.string().min(1, "Unit Payment ID is required"),
    paymentType: zod_1.z.nativeEnum(client_1.paymentType),
});
exports.StripValidation = {
    paymentSchema
};
