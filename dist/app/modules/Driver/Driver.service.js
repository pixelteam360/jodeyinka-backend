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
    console.log("asdg");
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: Driver_costant_1.driverSearchAbleFields.map((field) => ({
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
    const whereConditions = { AND: andConditions };
    const result = yield prisma_1.default.user.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { role: "DRIVER", DriverProfile: { hired: false } }),
        skip,
        take: limit,
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
            avgRating: true,
            DriverProfile: {
                select: { monthlyRate: true, state: true, city: true, country: true },
            },
        },
    });
    const total = yield prisma_1.default.user.count({
        where: Object.assign(Object.assign({}, whereConditions), { role: "DRIVER", DriverProfile: { hired: false } }),
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
const allAgent = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("asdg");
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: Driver_costant_1.driverSearchAbleFields.map((field) => ({
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
    const whereConditions = { AND: andConditions };
    const result = yield prisma_1.default.user.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { role: "AGENT" }),
        skip,
        take: limit,
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
            avgRating: true,
            Profile: true,
        },
    });
    const total = yield prisma_1.default.user.count({
        where: Object.assign(Object.assign({}, whereConditions), { role: "AGENT" }),
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
            avgRating: true,
            DriverProfile: {
                select: {
                    about: true,
                    country: true,
                    state: true,
                    city: true,
                    monthlyRate: true,
                    Experience: true,
                },
            },
            Profile: true,
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Driver not found");
    }
    return result;
});
const bookmarkDriver = (driverId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield prisma_1.default.user.findFirst({
        where: { id: driverId },
    });
    if (!driver) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const result = yield prisma_1.default.bookMarkDriver.create({
        data: { driverId, userId },
    });
    return result;
});
const getMyBookMarks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.bookMarkDriver.findMany({
        where: { userId },
        select: {
            driver: {
                select: {
                    id: true,
                    fullName: true,
                    image: true,
                    avgRating: true,
                    DriverProfile: {
                        select: {
                            country: true,
                            state: true,
                            city: true,
                            monthlyRate: true,
                        },
                    },
                    Profile: true,
                },
            },
        },
    });
    return res;
});
const hireADriver = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield prisma_1.default.user.findFirst({
        where: { id: payload.driverId },
        select: { id: true, role: true },
    });
    if (!driver) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Driver not found");
    }
    if (driver.role === "DRIVER") {
        const notHired = yield prisma_1.default.driverProfile.findFirst({
            where: { userId: driver.id, hired: false },
            select: { id: true },
        });
        if (!notHired) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Driver is already hired");
        }
    }
    const sendedHiring = yield prisma_1.default.driverHire.findFirst({
        where: { driverId: driver.id, userId },
        select: { id: true },
    });
    if (sendedHiring) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have already sended a request");
    }
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
        select: {
            id: true,
            role: true,
            Profile: { select: { driverCanHire: true } },
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.Profile === null) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User profile not found");
    }
    const acceptedHiring = yield prisma_1.default.driverHire.count({
        where: { userId, status: "ACCEPTED", driver: { role: "DRIVER" } },
    });
    const driverJob = yield prisma_1.default.job.count({
        where: { userId: user.id, status: "ACCEPTED", hiringType: "DRIVER" },
    });
    const totalDriverHired = acceptedHiring + driverJob;
    if (driver.role === "DRIVER" &&
        user.Profile.driverCanHire <= totalDriverHired) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have reached your maximum driver hiring limit.");
    }
    if (user.role === "EMPLOYER" && driver.role === "AGENT") {
        const job = yield prisma_1.default.job.findFirst({
            where: { userId: user.id, status: "ACCEPTED", hiringType: "AGENT" },
            select: { id: true },
        });
        const acceptedHiring = yield prisma_1.default.driverHire.count({
            where: { userId, status: "ACCEPTED", driver: { role: "AGENT" } },
        });
        if (job || acceptedHiring) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You have reached your maximum agent hiring limit.");
        }
    }
    const result = yield prisma_1.default.driverHire.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
const myhiring = (params, options, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
        select: { id: true, role: true },
    });
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
    if ((user === null || user === void 0 ? void 0 : user.role) === "DRIVER") {
        whereConditions.driverId = user.id;
        whereConditions.adminApproved = true;
    }
    else {
        whereConditions.userId = user === null || user === void 0 ? void 0 : user.id;
    }
    const result = yield prisma_1.default.driverHire.findMany({
        where: whereConditions,
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
                    Profile: { select: { address: true } },
                    DriverProfile: { select: { address: true } },
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
const singleHiring = (hiringId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
        select: { id: true, role: true },
    });
    const result = yield prisma_1.default.driverHire.findUnique({
        where: { id: hiringId },
        select: {
            id: true,
            offerAmount: true,
            aboutOffer: true,
            status: true,
            driver: {
                select: { id: true, image: true, fullName: true, avgRating: true },
            },
            user: {
                select: { id: true, image: true, fullName: true, avgRating: true },
            },
            monthlyPayment: true,
        },
    });
    if (!result) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    return result;
});
const acceptHiring = (hiringId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const offer = yield prisma_1.default.driverHire.findFirst({
        where: { id: hiringId },
        select: {
            id: true,
            driverId: true,
            user: {
                select: { id: true, Profile: { select: { driverCanHire: true } } },
            },
        },
    });
    if (!offer) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Hiring Offer not found");
    }
    if (offer.driverId !== userId) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorize access");
    }
    if (offer.user.Profile === null) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Owner profile not found");
    }
    const user = yield prisma_1.default.user.findFirst({
        where: { id: userId },
        select: {
            id: true,
            role: true,
            DriverProfile: { select: { hired: true } },
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    if (user.role === "DRIVER" && ((_a = user.DriverProfile) === null || _a === void 0 ? void 0 : _a.hired) === true) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "You are already hired");
    }
    const acceptedHiring = yield prisma_1.default.driverHire.count({
        where: { userId: offer.user.id, status: "ACCEPTED" },
    });
    const driverJob = yield prisma_1.default.job.count({
        where: { userId: offer.user.id, status: "ACCEPTED", hiringType: "DRIVER" },
    });
    const totalDriverHired = acceptedHiring + driverJob;
    if (user.role === "DRIVER" &&
        ((_b = offer.user.Profile) === null || _b === void 0 ? void 0 : _b.driverCanHire) <= totalDriverHired) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "The owner has reached their maximum driver hiring limit.");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const driverHire = yield prisma.driverHire.update({
            where: { id: offer.id },
            data: { status: "ACCEPTED" },
            select: { id: true, status: true },
        });
        if (user.role === "DRIVER") {
            yield prisma.driverProfile.update({
                where: { userId },
                data: { hired: true },
            });
        }
        yield prisma.monthlyPayment.create({
            data: { date: new Date(), driverHireId: driverHire.id },
        });
        return driverHire;
    }));
    return result;
});
const deletehiring = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const offer = yield prisma_1.default.driverHire.findFirst({
        where: { id },
        select: { id: true, userId: true, driverId: true, status: true },
    });
    if (!offer) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    if (offer.status === "ACCEPTED") {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You cannot delete accepted hiring");
    }
    if (offer.userId !== userId && offer.driverId !== userId) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorize access");
    }
    yield prisma_1.default.driverHire.delete({
        where: { id },
    });
    return { message: "Hiring Deleted successfully" };
});
exports.DriverService = {
    allDrivers,
    allAgent,
    singleDriver,
    hireADriver,
    bookmarkDriver,
    getMyBookMarks,
    myhiring,
    singleHiring,
    acceptHiring,
    deletehiring,
};
