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
exports.ExperienceService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const createExperienceIntoDb = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driverProfile = yield prisma_1.default.driverProfile.findFirst({
        where: {
            userId,
        },
        select: { id: true },
    });
    if (!driverProfile) {
        throw new ApiErrors_1.default(404, "Driver Profile not found");
    }
    const result = yield prisma_1.default.experience.create({
        data: Object.assign(Object.assign({}, payload), { driverProfileId: driverProfile.id }),
    });
    return result;
});
const myExperiences = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const driverProfile = yield prisma_1.default.driverProfile.findFirst({
        where: {
            userId,
        },
        select: { id: true },
    });
    const Experience = yield prisma_1.default.experience.findMany({
        where: { driverProfileId: driverProfile === null || driverProfile === void 0 ? void 0 : driverProfile.id },
    });
    return Experience;
});
const updateExperience = (payload, userId, experienceId) => __awaiter(void 0, void 0, void 0, function* () {
    const experience = yield prisma_1.default.experience.findFirst({
        where: { id: experienceId },
        select: { id: true, driverProfile: { select: { userId: true } } }
    });
    if (userId === (experience === null || experience === void 0 ? void 0 : experience.driverProfile.userId)) {
    }
    const result = yield prisma_1.default.experience.update({
        where: { id: experienceId },
        data: payload,
    });
    return result;
});
exports.ExperienceService = {
    createExperienceIntoDb,
    myExperiences,
    updateExperience,
};
