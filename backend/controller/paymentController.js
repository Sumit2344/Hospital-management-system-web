import crypto from "crypto";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

const createBasicAuthHeader = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new ErrorHandler("Razorpay keys are not configured on the server.", 500);
  }

  return `Basic ${Buffer.from(`${keyId}:${keySecret}`).toString("base64")}`;
};

export const getPaymentConfig = catchAsyncErrors(async (req, res) => {
  res.status(200).json({
    success: true,
    onlinePaymentsEnabled: Boolean(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ),
  });
});

export const createRazorpayOrder = catchAsyncErrors(async (req, res, next) => {
  const { amount, itemName } = req.body;
  const normalizedAmount = Number(amount);

  if (!normalizedAmount || normalizedAmount < 1) {
    return next(new ErrorHandler("Valid payment amount is required.", 400));
  }

  const receipt = `receipt_${Date.now()}`.slice(0, 40);
  const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: createBasicAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: normalizedAmount,
      currency: "INR",
      receipt,
      notes: {
        itemName: itemName || "Medicine Order",
      },
    }),
  });

  const data = await razorpayResponse.json();

  if (!razorpayResponse.ok) {
    return next(
      new ErrorHandler(
        data?.error?.description || "Unable to create Razorpay order.",
        razorpayResponse.status || 500
      )
    );
  }

  res.status(200).json({
    success: true,
    order: data,
    key: process.env.RAZORPAY_KEY_ID,
  });
});

export const verifyRazorpayPayment = catchAsyncErrors(async (req, res, next) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return next(new ErrorHandler("Incomplete payment details received.", 400));
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return next(new ErrorHandler("Payment verification failed.", 400));
  }

  res.status(200).json({
    success: true,
    message: "Payment verified successfully.",
  });
});
