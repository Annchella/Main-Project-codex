const express = require("express");
const router = express.Router();
const {
    createOrder,
    verifyPayment,
    getAllPurchases,
    getTutorPurchases
} = require("../controllers/paymentController");
const { protect, adminOnly, tutorOnly } = require("../middleware/authMiddleware");

router.post("/create-order", protect, createOrder);
router.post("/verify", protect, verifyPayment);
router.get("/admin/all", protect, adminOnly, getAllPurchases);
router.get("/tutor/my", protect, tutorOnly, getTutorPurchases);

module.exports = router;
