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
exports.ProfileController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const Profile_service_1 = require("./Profile.service");
const createProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Profile_service_1.ProfileService.createProfileIntoDb(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Profile Registered successfully!",
        data: result,
    });
}));
const createDriverProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { photo, licence } = req.files;
    const result = yield Profile_service_1.ProfileService.createDriverProfile(req.body, req.user.id, photo[0], licence[0]);
    (0, sendResponse_1.default)(res, {
        message: "Driver Profile Registered successfully!",
        data: result,
    });
}));
const getProfiles = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Profile_service_1.ProfileService.getProfilesFromDb();
    (0, sendResponse_1.default)(res, {
        message: "Profiles retrieve successfully!",
        data: result,
    });
}));
const myProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Profile_service_1.ProfileService.myProfile(req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Profile retrieved successfully",
        data: result,
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Profile_service_1.ProfileService.updateProfile(req.body, req.user.id);
    (0, sendResponse_1.default)(res, {
        message: "Profile updated successfully!",
        data: result,
    });
}));
const updateDriverProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const files = req.files;
    const photoFile = Array.isArray(files.photo) && files.photo.length > 0
        ? files.photo[0]
        : undefined;
    const licenceFile = Array.isArray(files.licence) && files.licence.length > 0
        ? files.licence[0]
        : undefined;
    const result = yield Profile_service_1.ProfileService.updateDriverProfile(req.body, req.user.id, photoFile, licenceFile);
    (0, sendResponse_1.default)(res, {
        message: "Driver Profile Updated successfully!",
        data: result,
    });
}));
exports.ProfileController = {
    createProfile,
    createDriverProfile,
    getProfiles,
    myProfile,
    updateProfile,
    updateDriverProfile,
};
