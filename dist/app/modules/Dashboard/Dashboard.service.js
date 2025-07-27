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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const Driver_costant_1 = require("../Driver/Driver.costant");
const Dashboard_costant_1 = require("./Dashboard.costant");
const http_status_1 = __importDefault(require("http-status"));
const allHiring = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: Driver_costant_1.driverHireSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    let whereConditions = {
        AND: andConditions,
    };
    const result = yield prisma_1.default.driverHire.findMany({
        where: whereConditions,
        skip,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                adminApproved: "asc",
            },
        select: {
            id: true,
            offerAmount: true,
            status: true,
            user: {
                select: {
                    id: true,
                    image: true,
                    fullName: true,
                    avgRating: true,
                    role: true,
                },
            },
            driver: {
                select: {
                    id: true,
                    image: true,
                    fullName: true,
                    avgRating: true,
                    role: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.driverHire.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const approveHiring = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const driverHire = yield prisma_1.default.driverHire.findFirst({
        where: {
            id,
        },
        select: { id: true },
    });
    if (!driverHire) {
        throw new ApiErrors_1.default(404, "Driver Hire not found");
    }
    const result = yield prisma_1.default.driverHire.update({
        where: { id },
        data: { adminApproved: true },
    });
    return result;
});
const allJobApplication = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: Dashboard_costant_1.jobApplicationSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    let whereConditions = {
        AND: andConditions,
    };
    const result = yield prisma_1.default.jobApplication.findMany({
        where: whereConditions,
        skip,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                adminApproved: "asc",
            },
    });
    const total = yield prisma_1.default.jobApplication.count({
        where: whereConditions,
    });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const approveApplication = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield prisma_1.default.jobApplication.findFirst({
        where: { id },
        select: { id: true },
    });
    if (!application) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Application not found");
    }
    const res = yield prisma_1.default.jobApplication.update({
        where: { id },
        data: { adminApproved: true },
    });
    return res;
});
exports.DashboardService = {
    allHiring,
    approveHiring,
    allJobApplication,
    approveApplication,
};
