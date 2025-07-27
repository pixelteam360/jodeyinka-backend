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
exports.JobService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const Job_costant_1 = require("./Job.costant");
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const createJobIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.profile.findFirst({
        where: { userId },
        select: { driverCanHire: true },
    });
    const jobDriver = yield prisma_1.default.job.count({
        where: { userId, hiringType: "DRIVER" },
    });
    const jobAgent = yield prisma_1.default.job.count({
        where: { userId, hiringType: "AGENT" },
    });
    if ((user === null || user === void 0 ? void 0 : user.driverCanHire) <= jobDriver) {
        throw new Error("You have reached your maximum job hiring limit.");
    }
    if (jobAgent) {
        throw new Error("You can only create a maximum of 1 jobs post for Agent.");
    }
    const result = yield prisma_1.default.job.create({
        data: Object.assign(Object.assign({}, payload), { userId }),
    });
    return result;
});
const myJobs = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driverProfile = yield prisma_1.default.job.findMany({
        where: {
            userId,
        },
    });
    return driverProfile;
});
const getAllJobs = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: Job_costant_1.jobSearchAbleFields.map((field) => ({
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
    const result = yield prisma_1.default.job.findMany({
        where: Object.assign(Object.assign({}, whereConditions), { status: "PENDING" }),
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
            location: true,
            amount: true,
            user: {
                select: {
                    id: true,
                    fullName: true,
                    image: true,
                    avgRating: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.job.count({
        where: Object.assign(Object.assign({}, whereConditions), { status: "PENDING" }),
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
const singleJob = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield prisma_1.default.job.findFirst({
        where: { id },
        select: {
            id: true,
            location: true,
            amount: true,
            user: {
                select: {
                    id: true,
                    fullName: true,
                    image: true,
                    avgRating: true,
                    Profile: { select: { about: true } },
                },
            },
        },
    });
    if (!job) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Job not found");
    }
    return job;
});
const updateJob = (payload, userId, JobId) => __awaiter(void 0, void 0, void 0, function* () {
    const Job = yield prisma_1.default.job.findFirst({
        where: { id: JobId },
        select: { userId: true },
    });
    if (userId === (Job === null || Job === void 0 ? void 0 : Job.userId)) {
        throw new Error("You are not authorized to update this job.");
    }
    const result = yield prisma_1.default.job.update({
        where: { id: JobId },
        data: payload,
    });
    return result;
});
const applyForJob = (payload, jobId, userId, UserRole) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield prisma_1.default.job.findFirst({
        where: { id: jobId },
        select: { id: true, status: true, hiringType: true },
    });
    if (!job) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Job not found");
    }
    if (job.status !== "PENDING") {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "This Job is already assigned");
    }
    if (UserRole !== job.hiringType) {
        throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "You are not authorized to apply for this job");
    }
    const existingApplication = yield prisma_1.default.jobApplication.findFirst({
        where: { jobId, userId },
    });
    if (existingApplication) {
        throw new ApiErrors_1.default(http_status_1.default.CONFLICT, "You have already applied for this job");
    }
    const res = yield prisma_1.default.jobApplication.create({
        data: Object.assign(Object.assign({}, payload), { userId, jobId }),
    });
    return res;
});
const jobApplications = (jobId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.jobApplication.findMany({
        where: { jobId, adminApproved: true },
        select: {
            id: true,
            amount: true,
            about: true,
            user: { select: { id: true, fullName: true, image: true } },
        },
    });
    return res;
});
const acceptApplication = (applicationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield prisma_1.default.jobApplication.findFirst({
        where: { id: applicationId },
        select: {
            id: true,
            user: { select: { role: true, id: true } },
            job: {
                select: { userId: true, id: true },
            },
        },
    });
    if (!application) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Application not found");
    }
    if (application.job.userId !== userId) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized to accept this application");
    }
    if (application.user.role === "DRIVER") {
        const isHired = yield prisma_1.default.driverProfile.findFirst({
            where: { userId: application.user.id, hired: true },
            select: { id: true, hired: true },
        });
        if (isHired) {
            throw new ApiErrors_1.default(http_status_1.default.FORBIDDEN, "Driver is already hired");
        }
    }
    const driverHiring = yield prisma_1.default.driverHire.count({
        where: { userId, status: "ACCEPTED" },
    });
    const jobHire = yield prisma_1.default.jobApplication.count({
        where: { userId, status: "ACCEPTED", job: { hiringType: "DRIVER" } },
    });
    const totalDriverHire = driverHiring + jobHire;
    const userProfile = yield prisma_1.default.profile.findFirst({
        where: { userId },
        select: { driverCanHire: true },
    });
    if ((userProfile === null || userProfile === void 0 ? void 0 : userProfile.driverCanHire) <= totalDriverHire) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "User have reached her maximum driver hiring limit.");
    }
    if (application.user.role === "AGENT") {
        const jobHire = yield prisma_1.default.jobApplication.count({
            where: { userId, status: "ACCEPTED", job: { hiringType: "AGENT" } },
        });
        if (jobHire) {
            throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "User have reached her maximum agent hiring limit.");
        }
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const jobApplication = yield prisma.jobApplication.update({
            where: { id: application.id },
            data: { status: "ACCEPTED", job: { update: { status: "ACCEPTED" } } },
            select: { id: true, status: true },
        });
        if (application.user.role === "DRIVER") {
            yield prisma.driverProfile.update({
                where: { userId: application.user.id },
                data: { hired: true },
            });
        }
        return jobApplication;
    }));
    return result;
});
const deleteApplication = (applicationId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const application = yield prisma_1.default.jobApplication.findFirst({
        where: { id: applicationId },
        select: { id: true, status: true, job: { select: { userId: true } } },
    });
    if (!application) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Data not found");
    }
    if (application.status === "ACCEPTED") {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "You cannot delete accepted application");
    }
    if (application.job.userId !== userId) {
        throw new ApiErrors_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorize access");
    }
    yield prisma_1.default.jobApplication.delete({
        where: { id: applicationId },
    });
    return { message: "Application Deleted successfully" };
});
exports.JobService = {
    createJobIntoDb,
    myJobs,
    getAllJobs,
    singleJob,
    updateJob,
    applyForJob,
    jobApplications,
    acceptApplication,
    deleteApplication,
};
