"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobValidation = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const JobValidationSchema = zod_1.z.object({
    hiringType: zod_1.z.nativeEnum(client_1.HiringType),
    location: zod_1.z.string(),
    amount: zod_1.z.string(),
});
const JobUpdateSchema = zod_1.z.object({
    hiringType: zod_1.z.nativeEnum(client_1.HiringType).optional(),
    location: zod_1.z.string().optional(),
    amount: zod_1.z.string().optional(),
});
const JobApplicationSchema = zod_1.z.object({
    amount: zod_1.z.number(),
    about: zod_1.z.string(),
});
exports.JobValidation = {
    JobValidationSchema,
    JobUpdateSchema,
    JobApplicationSchema,
};
