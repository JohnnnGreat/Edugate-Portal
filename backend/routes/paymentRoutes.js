// routes/paymentRoutes.js

const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment"); // Import the Payment model
const axios = require("axios"); // For Paystack verification
const {
   createPayment,
   verifyPayment,
   getStudentPayments,
   getPaymentByReference,
   checkPayment,
   getPaymentListByLevel,
   checkMajorPayments,
   getAllPayments,
   exportTransactions,
   verifyTransaction,
   generatePaymentReport,
   generateRecords,
} = require("../controllers/Payments");
const verifyToken = require("../middleware/authMiddleware");

// Route to create a new payment
router.post("/create", verifyToken, createPayment);

// Route to verify a payment using its reference
router.get("/verify/:reference", verifyToken, verifyPayment);
router.post("/check-payment/", verifyToken, checkPayment);

// Route to get all payments for a particular student
router.get("/student/", verifyToken, getStudentPayments);

// Route to get payment details using the payment reference
router.get("/reference/:reference", getPaymentByReference);
router.get("/get-level-based-payments", verifyToken, getPaymentListByLevel);
router.get("/check-major-payments", verifyToken, checkMajorPayments);
router.get("/get-payments", getAllPayments);
router.get("/export", exportTransactions);
router.get("/verify-trx/:reference", verifyTransaction);
router.get("/generate-payment-report", generatePaymentReport);
router.get("/generate-records", generateRecords);

module.exports = router;
