const ContactMessage = require('../models/ContactMessage');

// POST – Create a new contact message from user input
exports.createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMsg = new ContactMessage({ name, email, message });
    await newMsg.save();
    res.status(201).json({ message: 'Message sent successfully', data: newMsg });
  } catch (err) {
    res.status(400).json({ message: 'Failed to send message', error: err.message });
  }
};

// GET – Retrieve all contact messages (admin only)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }); // Newest first
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch messages', error: err.message });
  }
};

// DELETE – Remove a specific contact message by ID (admin only)
exports.deleteMessage = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.status(204).end(); // No content on successful deletion
  } catch (err) {
    res.status(400).json({ message: 'Failed to delete message', error: err.message });
  }
};
