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
exports.ProfileService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const createProfileIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: {
            id: userId,
        },
        select: { id: true, role: true, completedProfile: true },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    if (user.completedProfile) {
        throw new ApiErrors_1.default(400, "Profile already created");
    }
    const { reference } = payload, restData = __rest(payload, ["reference"]);
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const profile = yield prisma.profile.create({
            data: Object.assign(Object.assign({}, restData), { userId: user.id }),
        });
        yield prisma.user.update({
            where: { id: user.id },
            data: { completedProfile: true },
        });
        yield Promise.all(reference.map((number) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.userReference.create({
                data: {
                    phoneNumber: number,
                    userId: user.id,
                },
            });
        })));
        yield prisma.adminPayment.create({
            data: {
                amount: payload.paymentAmount,
                PaymentFor: "DRIVER_HIRE",
                paymentId: payload.paymentId,
                reviewerId: user.id,
            },
        });
        return profile;
    }));
    return result;
});
const createDriverProfile = (payload, userId, license) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            role: true,
            completedProfile: true,
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    if (!license) {
        throw new ApiErrors_1.default(400, "License is required");
    }
    if (user.completedProfile) {
        throw new ApiErrors_1.default(400, "Profile already created");
    }
    const drivingLicense = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(license))
        .Location;
    const { reference } = payload, restData = __rest(payload, ["reference"]);
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const profile = yield prisma.driverProfile.create({
            data: Object.assign(Object.assign({}, restData), { userId, drivingLicense }),
        });
        yield prisma.user.update({
            where: { id: user.id },
            data: { completedProfile: true },
        });
        yield Promise.all(reference.map((number) => __awaiter(void 0, void 0, void 0, function* () {
            yield prisma.userReference.create({
                data: {
                    phoneNumber: number,
                    userId: user.id,
                },
            });
        })));
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
const updateDriverProfile = (payload, userId, license) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const user = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            role: true,
            DriverProfile: { select: { drivingLicense: true } },
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    let drivingLicense = (_a = user.DriverProfile) === null || _a === void 0 ? void 0 : _a.drivingLicense;
    if (license) {
        drivingLicense = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(license))
            .Location;
    }
    const result = yield prisma_1.default.driverProfile.update({
        where: { userId: user.id },
        data: Object.assign(Object.assign({}, payload), { drivingLicense: drivingLicense }),
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
