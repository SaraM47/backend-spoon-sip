const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

// GET /api/users - Admin only
router.get("/", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password").sort({
      account_created: -1,
    });
    res.status(200).json(users);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
});

// DELETE /api/users/:id
// This route returns a list of all registered users (admin only).
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  // Kontrollera att ID är ett giltigt MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    // Prevent admin from deleting themselves
    if (req.user.userId === id) {
      return res.status(403).json({ message: "You cannot delete yourself" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
});

module.exports = router;
