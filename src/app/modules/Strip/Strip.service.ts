import httpStatus from "http-status";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import { Request, Response } from "express";
import { TPayProvider } from "./Strip.interface";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const stripeAuth = async (userId: string) => {
  const accountLink = stripe.oauth.authorizeUrl({
    response_type: "code",
    scope: "read_write",
    client_id: process.env.STRIPE_CLIENT_ID,
    redirect_uri: "https://jodeyinka-server.vercel.app/api/v1/stripe/callback",
    state: userId,
  });

  return accountLink;
};

const stripeCallback = async (req: Request, res: Response) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).send(`Error: ${error}`);
  }

  if (!code) {
    return res.status(400).send("Authorization code not provided");
  }

  try {
    // Exchange code for tokens & connected account ID

    const response = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code as string,
    });

    const stripeAccountId = response.stripe_user_id;

    // state contains your userId
    const userId = state as string;

    // Update user with connected Stripe account ID
    await prisma.user.update({
      where: { id: userId },
      data: { stripeAccountId },
    });

    // Redirect to success page or send JSON
    res.redirect("/success"); // Or send JSON: res.json({ success: true });
  } catch (err) {
    res.status(500).send("Stripe OAuth token exchange failed");
  }
};

const successStatus = async () => {
  return {
    status: "success",
    message: "You account have successfully connected",
  };
};

const payProvider = async (payload: TPayProvider, userId: string) => {
  const unitPay = await prisma.monthlyPayment.findFirst({
    where: { id: payload.monthlyPaymentId },
    select: { id: true, status: true },
  });

  if (!unitPay) {
    throw new ApiError(httpStatus.NOT_FOUND, "Monthly Payment  not found");
  }

  if (unitPay.status === "PAID") {
    throw new ApiError(httpStatus.NOT_FOUND, "Monthly Payment already completed");
  }

  const receiver = await prisma.user.findFirst({
    where: { id: payload.receiverId },

    select: { id: true, stripeAccountId: true },
  });

  if (!receiver?.stripeAccountId) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Receiver not connected to Stripe"
    );
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: payload.amount,
      currency: "usd",
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

    await prisma.monthlyPayment.update({
      where: { id: unitPay.id },
      data: { status: "PAID" },
    });

    await prisma.payment.create({
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
  } catch (error: any) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      error?.message || "Payment failed"
    );
  }
};

export const StripService = {
  stripeAuth,
  stripeCallback,
  successStatus,
  payProvider,
};
