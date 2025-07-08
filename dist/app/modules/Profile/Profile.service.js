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
exports.ProfileService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const createProfileIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
        select: { id: true, role: true },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    if (user.role !== "USER") {
        throw new ApiErrors_1.default(409, "Profile already exists");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const profile = yield prisma.profile.create({
            data: {
                city: payload.city,
                userId: user.id,
                country: payload.country,
                state: payload.state,
                driverCanHire: payload.driverCanHire,
            },
        });
        yield prisma.user.update({
            where: { id: user.id },
            data: { role: payload.role },
        });
        yield prisma.adminPayment.create({
            data: {
                amount: payload.paymentAmount,
                PaymentFor: "DRIVER_HIRE",
                paymentId: payload.paymentId,
                userId: user.id,
            },
        });
        return profile;
    }));
    return result;
});
const createDriverProfile = (payload, userId, photo, licence) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            role: true,
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    if (user.role !== "USER") {
        throw new ApiErrors_1.default(409, "Profile already exists");
    }
    if (!photo || !licence) {
        throw new ApiErrors_1.default(400, "Photo and licence are required");
    }
    const photoUrl = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(photo)).Location;
    const licenceUrl = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(licence))
        .Location;
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const profile = yield prisma.driverProfile.create({
            data: Object.assign(Object.assign({}, payload), { photo: photoUrl, drivingLicense: licenceUrl, userId: user.id }),
        });
        yield prisma.user.update({
            where: { id: user.id },
            data: { role: "DRIVER" },
        });
        return profile;
    }));
    return result;
});
const getProfilesFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.profile.findMany({
        select: {
            id: true,
            country: true,
            state: true,
            city: true,
            driverCanHire: true,
            userId: true,
        },
    });
    return result;
});
const myProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { id },
        select: { id: true, role: true },
    });
    if ((user === null || user === void 0 ? void 0 : user.role) === "DRIVER") {
        const profile = yield prisma_1.default.driverProfile.findUnique({
            where: { userId: id },
        });
        if (!profile) {
            throw new ApiErrors_1.default(404, "Profile not found");
        }
        return profile;
    }
    const profile = yield prisma_1.default.profile.findUnique({
        where: { userId: id },
        select: {
            id: true,
            country: true,
            state: true,
            city: true,
            driverCanHire: true,
            userId: true,
        },
    });
    if (!profile) {
        throw new ApiErrors_1.default(404, "Profile not found");
    }
    return profile;
});
const updateProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    const result = yield prisma_1.default.profile.update({
        where: { userId: user.id },
        data: payload,
    });
    return result;
});
const updateDriverProfile = (payload, userId, photo, licence) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            role: true,
            DriverProfile: { select: { photo: true, drivingLicense: true } },
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    let photoUrl = (_a = user.DriverProfile) === null || _a === void 0 ? void 0 : _a.photo;
    if (photo) {
        photoUrl = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(photo)).Location;
    }
    let licenceUrl = (_b = user.DriverProfile) === null || _b === void 0 ? void 0 : _b.drivingLicense;
    if (licence) {
        licenceUrl = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(licence)).Location;
    }
    const result = yield prisma_1.default.driverProfile.update({
        where: { userId: user.id },
        data: Object.assign(Object.assign({}, payload), { photo: photoUrl, drivingLicense: licenceUrl }),
    });
    return result;
});
exports.ProfileService = {
    createProfileIntoDb,
    createDriverProfile,
    getProfilesFromDb,
    myProfile,
    updateProfile,
    updateDriverProfile,
};
