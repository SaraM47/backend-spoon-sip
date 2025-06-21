const { validationResult } = require("express-validator");
const Order = require("../models/Order");

// POST – Create a new order and generate an English receipt
exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, time, acai, smoothie, juice } = req.body;

    // Collect selected menu items
    const menuItemIds = [];
    if (acai) menuItemIds.push(acai);
    if (smoothie) menuItemIds.push(smoothie);
    if (juice) menuItemIds.push(juice);

    const order = new Order({
      customerName,
      phone,
      time,
      menuItemIds,
      status: "pending",
    });

    await order.save();
    await order.populate("menuItemIds");

    // Format receipt in English
    const items = order.menuItemIds
      .map((item) => `- ${item.name} – ${item.price} SEK`)
      .join("\n");

    const total = order.menuItemIds.reduce((sum, item) => sum + item.price, 0);

    const receipt = `
  Thank you for your order, ${order.customerName}!
  
  Order ID: ${order._id}
  Pickup time: ${new Date(order.time).toLocaleString("en-GB", {
    timeZone: "Europe/Stockholm",
  })}
  
  Ordered items:
  ${items}
  
  Total: ${total} SEK
  We will contact you at: ${order.phone}
  
  Welcome back, wishes Spoon & Sip!
      `.trim();

    res.status(201).json({ order, receipt });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Order creation failed", error: err.message });
  }
};

// GET – Fetch all orders, sorted by latest
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("menuItemIds");
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch orders", error: err.message });
  }
};

// GET – Fetch completed orders only
exports.getCompletedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "completed" })
      .sort({ createdAt: -1 })
      .populate("menuItemIds");
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Could not fetch completed orders",
        error: err.message,
      });
  }
};

// GET – Fetch pending orders only
exports.getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" })
      .sort({ createdAt: -1 })
      .populate("menuItemIds");
    res.status(200).json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch pending orders", error: err.message });
  }
};

// DELETE – Remove a specific order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: "Delete failed", error: err.message });
  }
};

// PATCH – Update the status of an existing order
exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "completed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};

// GET – Fetch statistics: number of pending, completed, and total orders
exports.getOrderStats = async (req, res) => {
  try {
    const pendingCount = await Order.countDocuments({ status: "pending" });
    const completedCount = await Order.countDocuments({ status: "completed" });
    const totalCount = await Order.countDocuments();

    res.status(200).json({
      pending: pendingCount,
      completed: completedCount,
      total: totalCount,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Could not fetch stats", error: err.message });
  }
};
