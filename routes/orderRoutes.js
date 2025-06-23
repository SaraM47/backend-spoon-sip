const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/verifyToken");

// Public route – customers can place an order (with validation)
router.post(
  "/",
  [
    body("customerName").notEmpty().withMessage("Customer name is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
    body("time").notEmpty().withMessage("Time is required"),
    body("menuItemIds")
      .isArray({ min: 1 })
      .withMessage("At least one menu item must be selected"),
      body("people").optional().isInt({ min: 1 }).withMessage("People must be a number"),
      body("note").optional().isString().trim(),
  ],
  orderController.createOrder
);

// Protected routes – only logged-in users can access these
router.get("/", verifyToken, orderController.getOrders);
router.delete("/:id", verifyToken, orderController.deleteOrder);
router.patch("/:id", verifyToken, orderController.updateOrderStatus);
router.get("/completed", verifyToken, orderController.getCompletedOrders);
router.get("/pending", verifyToken, orderController.getPendingOrders);
router.get("/stats", verifyToken, orderController.getOrderStats);

module.exports = router;
