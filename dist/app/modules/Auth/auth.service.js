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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../../helpars/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const http_status_1 = __importDefault(require("http-status"));
const crypto_1 = __importDefault(require("crypto"));
const emailSender_1 = require("../../../shared/emailSender");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
        select: {
            id: true,
            verifiedEmail: true,
            email: true,
            password: true,
            role: true,
            otp: true,
            expirationOtp: true,
        },
    });
    if (!(userData === null || userData === void 0 ? void 0 : userData.email)) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "User not found! with this email " + payload.email);
    }
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Password incorrect!");
    }
    if (!userData.verifiedEmail && userData.role !== "ADMIN") {
        // Generate a new OTP
        const otp = Number(crypto_1.default.randomInt(1000, 9999));
        // Set OTP expiration time to 10 minutes from now
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        // Create the email content
        const html = `
<div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    
    <div style="background-color: #1CAD4D; padding: 30px; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 26px;">Email verification OTP</h1>
      <p style="margin: 8px 0 0; color: #e0f7ec; font-size: 14px;">Your One-Time Password (OTP) is below</p>
    </div>
    
    <div style="padding: 30px; text-align: center;">
      <p style="font-size: 16px; color: #333333; margin-bottom: 10px;">Use the OTP below to verify your email:</p>
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
        yield (0, emailSender_1.emailSender)(userData.email, html, "Email varification OTP");
        yield prisma_1.default.user.update({
            where: { id: userData.id },
            data: {
                otp: otp,
                expirationOtp: otpExpires,
            },
        });
        return {
            message: "Email verification code sended successfully",
            verifiedEmail: userData.verifiedEmail,
        };
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: userData.id,
        email: userData.email,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        role: userData.role,
        verifiedEmail: userData.verifiedEmail,
        token: accessToken,
    };
});
const changePassword = (userToken, newPassword, oldPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = jwtHelpers_1.jwtHelpers.verifyToken(userToken, config_1.default.jwt.jwt_secret);
    const user = yield prisma_1.default.user.findUnique({
        where: { id: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.id },
    });
    if (!user) {
        throw new ApiErrors_1.default(404, "User not found");
    }
    const isPasswordValid = yield bcrypt.compare(oldPassword, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordValid) {
        throw new ApiErrors_1.default(401, "Incorrect old password");
    }
    const hashedPassword = yield bcrypt.hash(newPassword, 12);
    const result = yield prisma_1.default.user.update({
        where: {
            id: decodedToken.id,
        },
        data: {
            password: hashedPassword,
        },
    });
    return { message: "Password changed successfully" };
});
const forgotPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch user data or throw if not found
    console.log(payload);
    const userData = yield prisma_1.default.user.findFirstOrThrow({
        where: {
            email: payload.email,
        },
    });
    // Generate a new OTP
    const otp = Number(crypto_1.default.randomInt(1000, 9999));
    // Set OTP expiration time to 10 minutes from now
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    // Create the email content
    const html = `
<div style="font-family: Arial, sans-serif; color: #333; padding: 30px; background: linear-gradient(135deg, #6c63ff, #3f51b5); border-radius: 8px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
        <h2 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 20px;">
            <span style="color: #ffeb3b;">Forgot Password OTP</span>
        </h2>
        <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
            Your forgot password OTP code is below.
        </p>
        <p style="font-size: 32px; font-weight: bold; color: #ff4081; text-align: center; margin: 20px 0;">
            ${otp}
        </p>
        <div style="text-align: center; margin-bottom: 20px;">
            <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                This OTP will expire in <strong>10 minutes</strong>. If you did not request this, please ignore this email.
            </p>
            <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                If you need assistance, feel free to contact us.
            </p>
        </div>
        <div style="text-align: center; margin-top: 30px;">
            <p style="font-size: 12px; color: #999; text-align: center;">
                Best Regards,<br/>
                <span style="font-weight: bold; color: #3f51b5;">Nmbull Team</span><br/>
                <a href="mailto:support@nmbull.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
            </p>
        </div>
    </div>
</div> `;
    // Send the OTP email to the user
    yield (0, emailSender_1.emailSender)(userData.email, html, "Forgot Password OTP");
    // Update the user's OTP and expiration in the database
    yield prisma_1.default.user.update({
        where: { id: userData.id },
        data: {
            otp: otp,
            expirationOtp: otpExpires,
        },
    });
    return { message: "Reset password OTP sent to your email successfully" };
});
const resendOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const user = yield prisma_1.default.user.findUnique({
        where: { email: email },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    // Generate a new OTP
    const otp = Number(crypto_1.default.randomInt(1000, 9999));
    // Set OTP expiration time to 5 minutes from now
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    // Create email content
    const html = `
    <div style="font-family: Arial, sans-serif; color: #333; padding: 30px; background: linear-gradient(135deg, #6c63ff, #3f51b5); border-radius: 8px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <h2 style="color: #ffffff; font-size: 28px; text-align: center; margin-bottom: 20px;">
                <span style="color: #ffeb3b;">Resend OTP</span>
            </h2>
            <p style="font-size: 16px; color: #333; line-height: 1.5; text-align: center;">
                Here is your new OTP code to complete the process.
            </p>
            <p style="font-size: 32px; font-weight: bold; color: #ff4081; text-align: center; margin: 20px 0;">
                ${otp}
            </p>
            <div style="text-align: center; margin-bottom: 20px;">
                <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                    This OTP will expire in <strong>5 minutes</strong>. If you did not request this, please ignore this email.
                </p>
                <p style="font-size: 14px; color: #555; margin-bottom: 10px;">
                    If you need further assistance, feel free to contact us.
                </p>
            </div>
            <div style="text-align: center; margin-top: 30px;">
                <p style="font-size: 12px; color: #999; text-align: center;">
                    Best Regards,<br/>
                    <span style="font-weight: bold; color: #3f51b5;">levimusuc@team.com</span><br/>
                    <a href="mailto:support@booksy.buzz.com" style="color: #ffffff; text-decoration: none; font-weight: bold;">Contact Support</a>
                </p>
            </div>
        </div>
    </div>
  `;
    // Send the OTP to user's email
    yield (0, emailSender_1.emailSender)(user.email, html, "Resend OTP");
    // Update the user's profile with the new OTP and expiration
    const updatedUser = yield prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            otp: otp,
            expirationOtp: otpExpires,
        },
    });
    return { message: "OTP resent successfully" };
});
const verifyForgotPasswordOtp = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
        select: {
            id: true,
            email: true,
            role: true,
            otp: true,
            expirationOtp: true,
        },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    if (user.otp !== payload.otp ||
        !user.expirationOtp ||
        user.expirationOtp < new Date()) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Invalid OTP");
    }
    yield prisma_1.default.user.update({
        where: { id: user.id },
        data: {
            otp: null,
            expirationOtp: null,
            verifiedEmail: true,
        },
    });
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        message: "OTP verification successful",
        role: user.role,
        token: accessToken,
    };
});
const resetPassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if the user exists
    const user = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!user) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "This user is not found!");
    }
    // Hash the new password
    const hashedPassword = yield bcrypt.hash(payload.password, 10);
    // Update the user's password in the database
    yield prisma_1.default.user.update({
        where: { email: payload.email },
        data: {
            password: hashedPassword, // Update with the hashed password
            otp: null, // Clear the OTP
            expirationOtp: null, // Clear OTP expiration
        },
    });
    return { message: "Password reset successfully" };
});
exports.AuthServices = {
    loginUser,
    changePassword,
    forgotPassword,
    resetPassword,
    resendOtp,
    verifyForgotPasswordOtp,
};
