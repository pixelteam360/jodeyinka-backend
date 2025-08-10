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
exports.StripService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const stripeAuth = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const accountLink = stripe.oauth.authorizeUrl({
        response_type: "code",
        scope: "read_write",
        client_id: process.env.STRIPE_CLIENT_ID,
        redirect_uri: "https://jodeyinka-server.vercel.app/api/v1/stripe/callback",
        state: userId,
    });
    return accountLink;
});
const stripeCallback = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { code, state, error } = req.query;
    if (error) {
        return res.status(400).send(`Error: ${error}`);
    }
    if (!code) {
        return res.status(400).send("Authorization code not provided");
    }
    try {
        // Exchange code for tokens & connected account ID
        const response = yield stripe.oauth.token({
            grant_type: "authorization_code",
            code: code,
        });
        const stripeAccountId = response.stripe_user_id;
        // state contains your userId
        const userId = state;
        // Update user with connected Stripe account ID
        yield prisma_1.default.user.update({
            where: { id: userId },
            data: { stripeAccountId },
        });
        // Redirect to success page or send JSON
        res.redirect("/success"); // Or send JSON: res.json({ success: true });
    }
    catch (err) {
        res.status(500).send("Stripe OAuth token exchange failed");
    }
});
const successStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        status: "success",
        message: "You account have successfully connected",
    };
});
const payProvider = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const unitPay = yield prisma_1.default.monthlyPayment.findFirst({
        where: { id: payload.monthlyPaymentId },
        select: { id: true, status: true },
    });
    if (!unitPay) {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Monthly Payment  not found");
    }
    if (unitPay.status === "PAID") {
        throw new ApiErrors_1.default(http_status_1.default.NOT_FOUND, "Monthly Payment already completed");
    }
    const receiver = yield prisma_1.default.user.findFirst({
        where: { id: payload.receiverId },
        select: { id: true, stripeAccountId: true },
    });
    if (!(receiver === null || receiver === void 0 ? void 0 : receiver.stripeAccountId)) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, "Receiver not connected to Stripe");
    }
    try {
        const customer = yield stripe.customers.create({
            payment_method: payload.paymentMethodId,
            description: `Customer for user ${userId}`,
        });
        yield stripe.paymentMethods.attach(payload.paymentMethodId, {
            customer: customer.id,
        });
        yield stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: payload.paymentMethodId,
            },
        });
        const paymentIntent = yield stripe.paymentIntents.create({
            amount: payload.amount * 100,
            currency: "usd",
            customer: customer.id,
            payment_method: payload.paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never",
            },
            transfer_data: {
                destination: receiver.stripeAccountId,
            },
        });
        yield prisma_1.default.monthlyPayment.update({
            where: { id: unitPay.id },
            data: { status: "PAID" },
        });
        yield prisma_1.default.payment.create({
            data: {
                amount: payload.amount,
                paymentIntentId: paymentIntent.id,
                senderId: userId,
                receiverId: payload.receiverId,
                monthlyPaymentId: payload.monthlyPaymentId,
            },
        });
        return {
            success: true,
            message: "Payment successful",
            paymentId: paymentIntent.id,
        };
    }
    catch (error) {
        throw new ApiErrors_1.default(http_status_1.default.BAD_REQUEST, (error === null || error === void 0 ? void 0 : error.message) || "Payment failed");
    }
});
exports.StripService = {
    stripeAuth,
    stripeCallback,
    successStatus,
    payProvider,
};
