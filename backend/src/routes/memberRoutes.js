// backend/src/routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getMembers,
  addMember,
  getMemberById,
  updateMember,
  deleteMember,
  getMemberStats,
  renewMembership
} = require("../controllers/memberController");

// Validation rules
const memberValidation = [
  body("fullName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage("Please provide a valid 10-digit phone number"),
  body("address")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Address must be between 5 and 200 characters"),
  body("packageType")
    .isIn(["basic", "premium", "elite", "trial"])
    .withMessage("Invalid package type")
];

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.get("/", getMembers);
router.get("/stats", getMemberStats);
router.post("/", memberValidation, addMember);
router.get("/:id", getMemberById);
router.put("/:id", memberValidation, updateMember);
router.delete("/:id", deleteMember);
router.post("/:id/renew", renewMembership);

module.exports = router;