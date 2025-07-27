"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardValidation = void 0;
const zod_1 = require("zod");
const DashboardValidationSchema = zod_1.z.object({
    company: zod_1.z.string(),
    position: zod_1.z.string(),
});
const DashboardUpdateSchema = zod_1.z.object({
    company: zod_1.z.string().optional(),
    position: zod_1.z.string().optional(),
});
exports.DashboardValidation = {
    DashboardValidationSchema,
    DashboardUpdateSchema,
};
