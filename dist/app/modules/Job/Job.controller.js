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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Job_costant_1 = require("./Job.costant");
const Job_service_1 = require("./Job.service");
const createJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Job_service_1.JobService.createJobIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Job Registered successfully!",
        data: result,
    });
}));
const myJobs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Job_service_1.JobService.myJobs(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Job retrieved successfully",
        data: result,
    });
}));
const getAllJobs = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, Job_costant_1.jobFilterableFields);
    const options = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = yield Job_service_1.JobService.getAllJobs(filters, options);
    (0, sendResponse_1.default)(res, {
        message: "Jobs retrieved successfully!",
        data: result,
    });
}));
const singleJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Job_service_1.JobService.singleJob(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Job retrieved successfully",
        data: result,
    });
}));
const updateJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Job_service_1.JobService.updateJob(req.body, req.user.id, req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Job updated successfully!",
        data: result,
    });
}));
const applyForJob = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Job_service_1.JobService.applyForJob(req.body, req.params.id, req.user.id, req.user.role);
    (0, sendResponse_1.default)(res, {
        message: "Job applied successfully",
        data: result,
    });
}));
const jobApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Job_service_1.JobService.jobApplications(req.params.id);
    (0, sendResponse_1.default)(res, {
        message: "Job applications retrieved successfully",
        data: result,
    });
}));
const acceptApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Job_service_1.JobService.acceptApplication(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Job applications accepted successfully",
        data: result,
    });
}));
const deleteApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Job_service_1.JobService.deleteApplication(req.params.id, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Applications deleted successfully",
        data: result,
    });
}));
exports.JobController = {
    createJob,
    myJobs,
    getAllJobs,
    singleJob,
    updateJob,
    applyForJob,
    jobApplications,
    acceptApplication,
    deleteApplication
};
