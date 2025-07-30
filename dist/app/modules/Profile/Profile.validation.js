"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileValidation = void 0;
const zod_1 = require("zod");
const ProfileValidationSchema = zod_1.z.object({
    companyName: zod_1.z.string(),
    fullName: zod_1.z.string(),
    address: zod_1.z.string(),
    state: zod_1.z.string(),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
    gender: zod_1.z.string(),
    age: zod_1.z.number().int(),
    dateOfBirth: zod_1.z.string().datetime(),
    phoneNumber: zod_1.z.string(),
    salaryRange: zod_1.z.string(),
    typeOfVehicleOwned: zod_1.z.string(),
    hiredDriverBefore: zod_1.z.boolean(),
    driverPaymentMethod: zod_1.z.string(),
    driverGiniPaymentMethod: zod_1.z.string(),
    reference: zod_1.z.array(zod_1.z.string()),
});
const ProfileUpdateSchema = zod_1.z.object({
    companyName: zod_1.z.string().optional(),
    fullName: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    age: zod_1.z.number().int().optional(),
    dateOfBirth: zod_1.z.string().datetime().optional(),
    phoneNumber: zod_1.z.string().optional(),
    salaryRange: zod_1.z.string().optional(),
    typeOfVehicleOwned: zod_1.z.string().optional(),
    hiredDriverBefore: zod_1.z.boolean().optional(),
    driverPaymentMethod: zod_1.z.string().optional(),
    driverGiniPaymentMethod: zod_1.z.string().optional(),
});
const DriverProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string(),
    address: zod_1.z.string(),
    state: zod_1.z.string(),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
    gender: zod_1.z.string(),
    age: zod_1.z.number().int(),
    dateOfBirth: zod_1.z.string().datetime(),
    typeOfVehicle: zod_1.z.string(),
    salaryRange: zod_1.z.string(),
    reference: zod_1.z.array(zod_1.z.string()),
    monthlyRate: zod_1.z.string(),
});
const UpdateDriverProfileSchema = zod_1.z.object({
    fullName: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    state: zod_1.z.string().optional(),
    city: zod_1.z.string().optional(),
    country: zod_1.z.string().optional(),
    gender: zod_1.z.string().optional(),
    age: zod_1.z.number().int().optional(),
    dateOfBirth: zod_1.z.string().datetime().optional(),
    typeOfVehicle: zod_1.z.string().optional(),
    salaryRange: zod_1.z.string().optional(),
    monthlyRate: zod_1.z.string().optional(),
});
exports.ProfileValidation = {
    ProfileValidationSchema,
    ProfileUpdateSchema,
    DriverProfileSchema,
    UpdateDriverProfileSchema,
};
