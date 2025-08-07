"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.DashboardService = exports.monthlyDriverPay = exports.monthlyJobPay = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const Driver_costant_1 = require("../Driver/Driver.costant");
const Dashboard_costant_1 = require("./Dashboard.costant");
const http_status_1 = __importDefault(require("http-status"));
const date_fns_1 = require("date-fns");
const config_1 = __importDefault(require("../../../config"));
const bcrypt = __importStar(require("bcrypt"));
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
            aboutOffer: true,
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
        include: { user: { select: { fullName: true } } },
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
const overView = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield prisma_1.default.user.count();
    const totalPayment = yield prisma_1.default.adminPayment.count();
    const totalRevenue = yield prisma_1.default.adminPayment.aggregate({
        _sum: {
            amount: true,
        },
    });
    return {
        totalUsers,
        totalRevenue: totalRevenue._sum.amount || 0,
        totalPayment,
    };
});
const revenueChart = () => __awaiter(void 0, void 0, void 0, function* () {
    const sixMonthsAgo = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(new Date(), 5));
    const purchases = yield prisma_1.default.adminPayment.findMany({
        where: {
            createdAt: {
                gte: sixMonthsAgo,
            },
        },
        select: {
            createdAt: true,
            amount: true,
        },
    });
    const monthlyRevenueMap = {};
    for (const purchase of purchases) {
        const key = (0, date_fns_1.format)(purchase.createdAt, "yyyy-MM");
        monthlyRevenueMap[key] = (monthlyRevenueMap[key] || 0) + purchase.amount;
    }
    const chartData = Array.from({ length: 6 }).map((_, index) => {
        const date = (0, date_fns_1.subMonths)(new Date(), 5 - index);
        const key = (0, date_fns_1.format)(date, "yyyy-MM");
        const monthName = (0, date_fns_1.format)(date, "MMMM");
        return {
            month: monthName,
            totalRevenue: Number((monthlyRevenueMap[key] || 0).toFixed(2)),
        };
    });
    return chartData;
});
const admins = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.user.findMany({ where: { role: "ADMIN" } });
    return res;
});
const createAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const res = yield prisma_1.default.user.create({ data: Object.assign(Object.assign({}, payload), { password: hashedPassword, role: "ADMIN" }) });
    return res;
});
const monthlyJobPay = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const jobs = yield prisma_1.default.job.findMany({
            where: { status: "ACCEPTED" },
            select: {
                JobApplication: {
                    select: { id: true },
                },
            },
        });
        const paymentsToCreate = [];
        for (const job of jobs) {
            for (const application of job.JobApplication) {
                const alreadyPaid = yield prisma_1.default.monthlyPayment.findFirst({
                    where: {
                        jobApplicationId: application.id,
                        date: {
                            gte: currentMonthStart,
                            lt: new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 1),
                        },
                    },
                });
                if (!alreadyPaid) {
                    paymentsToCreate.push({
                        date: new Date(),
                        jobApplicationId: application.id,
                    });
                }
            }
        }
        if (paymentsToCreate.length > 0) {
            yield prisma_1.default.$transaction(paymentsToCreate.map((data) => prisma_1.default.monthlyPayment.create({ data })));
        }
        console.log(`${paymentsToCreate.length} monthly job payments created.`);
    }
    catch (error) {
        console.error("Error in monthly job payments:", error);
    }
});
exports.monthlyJobPay = monthlyJobPay;
const monthlyDriverPay = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const hires = yield prisma_1.default.driverHire.findMany({
            where: { status: "ACCEPTED" },
            select: {
                id: true,
            },
        });
        const paymentsToCreate = [];
        for (const hire of hires) {
            const alreadyPaid = yield prisma_1.default.monthlyPayment.findFirst({
                where: {
                    driverHireId: hire.id,
                    date: {
                        gte: currentMonthStart,
                        lt: new Date(currentMonthStart.getFullYear(), currentMonthStart.getMonth() + 1, 1),
                    },
                },
            });
            if (!alreadyPaid) {
                paymentsToCreate.push({
                    date: new Date(),
                    driverHireId: hire.id,
                });
            }
        }
        if (paymentsToCreate.length > 0) {
            yield prisma_1.default.$transaction(paymentsToCreate.map((data) => prisma_1.default.monthlyPayment.create({ data })));
        }
        console.log(`${paymentsToCreate.length} monthly driver payments created.`);
    }
    catch (error) {
        console.error("Error in monthly driver payments:", error);
    }
});
exports.monthlyDriverPay = monthlyDriverPay;
exports.DashboardService = {
    allHiring,
    approveHiring,
    allJobApplication,
    approveApplication,
    overView,
    revenueChart,
    admins,
    createAdmin
};
