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
exports.userService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const bcrypt = __importStar(require("bcrypt"));
const paginationHelper_1 = require("../../../helpars/paginationHelper");
const user_costant_1 = require("./user.costant");
const config_1 = __importDefault(require("../../../config"));
const fileUploader_1 = require("../../../helpars/fileUploader");
const emailSender_1 = require("../../../shared/emailSender");
const crypto_1 = __importDefault(require("crypto"));
const http_status_1 = __importDefault(require("http-status"));
const createUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findFirst({
        where: {
            email: payload.email,
        },
    });
    if (existingUser) {
        throw new ApiErrors_1.default(400, `User with this email ${payload.email} already exists`);
    }
    const otp = Number(crypto_1.default.randomInt(1000, 9999));
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const html = `
<div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    
    <div style="background-color: #1CAD4D; padding: 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 26px;">Forgot Password</h1>
      <p style="margin: 8px 0 0; color: #e0f7ec; font-size: 14px;">Your One-Time Password (OTP) is below</p>
    </div>
    
    <div style="padding: 30px; text-align: center;">
      <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">Use the OTP below to reset your password:</p>
      <p style="font-size: 36px; font-weight: bold; color: #1CAD4D; margin: 20px 0;">${otp}</p>
      <p style="font-size: 14px; color: #666666; margin: 0 0 20px;">This code will expire in <strong>10 minutes</strong>.</p>
    </div>

    <div style="padding: 0 30px 30px; text-align: center;">
      <p style="font-size: 14px; color: #999999; margin: 0;">If you didn’t request this, you can safely ignore this email.</p>
      <p style="font-size: 14px; color: #999999; margin: 8px 0 0;">Need help? Contact us at <a href="mailto:support@nmbull.com" style="color: #1CAD4D; text-decoration: none; font-weight: 500;">support@nmbull.com</a></p>
    </div>

    <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 12px; color: #999999;">
      Best regards,<br/>
      <strong style="color: #1CAD4D;">Nmbull Team</strong>
    </div>

  </div>
</div>`;
    const hashedPassword = yield bcrypt.hash(payload.password, Number(config_1.default.bcrypt_salt_rounds));
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield prisma.user.create({
            data: Object.assign(Object.assign({}, payload), { password: hashedPassword, otp: otp, expirationOtp: otpExpires }),
            select: {
                id: true,
                email: true,
                role: true,
            },
        });
        yield (0, emailSender_1.emailSender)(user.email, html, "Verification OTP");
        return {
            message: "Verification OTP sent to your email successfully",
        };
    }));
    return result;
});
const getUsersFromDb = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andCondions = [];
    if (params.searchTerm) {
        andCondions.push({
            OR: user_costant_1.userSearchAbleFields.map((field) => ({
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
        where: whereConditons,
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
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.default.user.count({
        where: whereConditons,
    });
    if (!result || result.length === 0) {
        throw new ApiErrors_1.default(404, "No active users found");
    }
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getMyProfile = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { id },
        select: { id: true, role: true },
    });
    if ((user === null || user === void 0 ? void 0 : user.role) === "DRIVER") {
        const userProfile = yield prisma_1.default.user.findUnique({
            where: {
                id: id,
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                location: true,
                image: true,
                role: true,
                phoneNumber: true,
                avgRating: true,
                DriverProfile: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        photo: true,
                        monthlyRate: true,
                        drivingLicense: true,
                        country: true,
                        state: true,
                        about: true,
                    },
                },
            },
        });
        return userProfile;
    }
    const userProfile = yield prisma_1.default.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            location: true,
            image: true,
            role: true,
            phoneNumber: true,
            avgRating: true,
            Profile: true,
        },
    });
    return userProfile;
});
const updateProfile = (payload, imageFile, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, image: true },
    });
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        let image = (existingUser === null || existingUser === void 0 ? void 0 : existingUser.image) || "";
        if (imageFile) {
            image = (yield fileUploader_1.fileUploader.uploadToDigitalOcean(imageFile)).Location;
        }
        const createUserProfile = yield prisma.user.update({
            where: { id: userId },
            data: Object.assign(Object.assign({}, payload), { image }),
        });
        return { message: "Profile updated successfully" };
    }));
    return result;
});
const provideReview = (payload, senderId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findFirst({
        where: { id: senderId },
    });
    if (payload.rating > 5) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Rating must be under 5");
    }
    const driver = yield prisma_1.default.user.findFirst({
        where: { id: payload.receiverId, role: "DRIVER" },
    });
    if (!driver) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Receiver not found");
    }
    if (senderId === payload.receiverId) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Receiver and sender can not be same.");
    }
    const threeMonthAgo = new Date();
    threeMonthAgo.setMonth(threeMonthAgo.getMonth() - 3);
    const existingReview = yield prisma_1.default.userRating.findFirst({
        where: {
            receiverId: payload.receiverId,
            senderId,
            createdAt: { gte: threeMonthAgo },
        },
    });
    if (existingReview) {
        throw new ApiErrors_1.default(400, "You already submitted a review to this user within the last 3 months");
    }
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const serviceRating = yield prisma.userRating.create({
            data: {
                rating: payload.rating,
                message: payload.message,
                senderId,
                receiverId: payload.receiverId,
            },
        });
        const averageRating = yield prisma.userRating.aggregate({
            _avg: { rating: true },
        });
        yield prisma.user.update({
            where: { id: user === null || user === void 0 ? void 0 : user.id },
            data: { avgRating: averageRating._avg.rating },
        });
        return serviceRating;
    }));
    return result;
});
const userReviews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.userRating.findMany({
        where: { receiverId: id },
        select: {
            id: true,
            rating: true,
            message: true,
            createdAt: true,
            sender: { select: { fullName: true, image: true, location: true } },
        },
    });
    const groupedRating = yield prisma_1.default.userRating.groupBy({
        by: ["rating"],
        where: { receiverId: id },
        _count: { rating: true },
        orderBy: { rating: "desc" },
    });
    return { groupedRating, result };
});
exports.userService = {
    createUserIntoDb,
    getUsersFromDb,
    getMyProfile,
    updateProfile,
    provideReview,
    userReviews,
};
