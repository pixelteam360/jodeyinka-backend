"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceValidation = void 0;
const zod_1 = require("zod");
const ExperienceValidationSchema = zod_1.z.object({
    company: zod_1.z.string(),
    position: zod_1.z.string(),
});
const ExperienceUpdateSchema = zod_1.z.object({
    company: zod_1.z.string().optional(),
    position: zod_1.z.string().optional(),
});
exports.ExperienceValidation = {
    ExperienceValidationSchema,
    ExperienceUpdateSchema,
};
