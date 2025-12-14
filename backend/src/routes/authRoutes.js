const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

// REGISTER
router.post("/register", [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("password").isLength({ min: 6 })
], authController.register);

// LOGIN
router.post("/login", [
  body("email").isEmail(),
  body("password").notEmpty()
], authController.login);

// PROFILE
router.get("/me", authMiddleware, authController.getProfile);

// CHANGE PASSWORD
router.put("/change-password", authMiddleware, [
  body("currentPassword").notEmpty(),
  body("newPassword").isLength({ min: 6 })
], authController.changePassword);

module.exports = router;
