import express from "express";
import {
  getPaymentConfig,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controller/paymentController.js";

const router = express.Router();

router.get("/config", getPaymentConfig);
router.post("/create-order", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

export default router;
