"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidation = void 0;
const zod_1 = require("zod");
const ProfileValidationSchema = zod_1.z.object({
    country: zod_1.z.string(),
    state: zod_1.z.string(),
    city: zod_1.z.string(),
    driverCanHire: zod_1.z.number().int(),
    role: zod_1.z.enum(["AGENT", "EMPLOYER"]),
    paymentAmount: zod_1.z.number().int(),
    paymentId: zod_1.z.string(),
});
const ProfileUpdateSchema = zod_1.z.object({
    country: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    driverCanHire: zod_1.z.number().int().optional(),
});
const DriverProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    email: zod_1.z.string().email(),
    monthlyRate: zod_1.z.string(),
    about: zod_1.z.string().default(""),
    country: zod_1.z.string(),
    state: zod_1.z.string(),
    referenceNumber1: zod_1.z.string(),
    referenceNumber2: zod_1.z.string(),
    referenceEmail1: zod_1.z.string().email(),
    referenceEmail2: zod_1.z.string().email(),
});
const UpdateDriverProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    monthlyRate: zod_1.z.string().optional(),
    about: zod_1.z.string().default("").optional(),
    country: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
});
exports.ProfileValidation = {
    ProfileValidationSchema,
    ProfileUpdateSchema,
    DriverProfileSchema,
    UpdateDriverProfileSchema,
};
