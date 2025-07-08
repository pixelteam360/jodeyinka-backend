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
exports.DriverService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const Driver_costant_1 = require("./Driver.costant");
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const allDrivers = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: Driver_costant_1.driverSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditons = { AND: andCondions };
    const result = yield prisma_1.default.user.findMany({
        where: Object.assign(Object.assign({}, whereConditons), { role: "DRIVER" }),
        skip,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            fullName: true,
            image: true,
            location: true,
            avgRating: true,
            DriverProfile: { select: { monthlyRate: true } },
        },
    });
    const total = yield prisma_1.default.user.count({
        where: Object.assign(Object.assign({}, whereConditons), { role: "DRIVER" }),
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
const singleDriver = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: { id },
        select: {
            id: true,
            fullName: true,
            image: true,
            location: true,
            avgRating: true,
            DriverProfile: {
                select: { monthlyRate: true, about: true, Experience: true },
            },
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Driver not found");
    }
    return result;
});
const hireADriver = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield prisma_1.default.user.findFirst({
        where: { id: payload.driverId, role: "DRIVER" },
        select: { id: true },
    });
    if (!driver) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Driver not found");
    }
    const alreadyHired = yield prisma_1.default.driverHire.findFirst({
        where: { driverId: driver.id, status: "ACCEPTED" },
        select: { id: true },
    });
    if (alreadyHired) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Driver is already hired");
    }
    const sendedHiring = yield prisma_1.default.driverHire.findFirst({
        where: { driverId: driver.id, userId },
        select: { id: true },
    });
    if (sendedHiring) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "You have already sended a request");
    }
    const result = yield prisma_1.default.driverHire.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
exports.DriverService = {
    allDrivers,
    singleDriver,
    hireADriver,
};
