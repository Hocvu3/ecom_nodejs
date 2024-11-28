const Message = require('../models/chatModel');

// Save a message to the database
exports.saveMessage = async (sender, recipient, content) => {
  const message = new Message({ sender, recipient, content });
  await message.save();
};

// Retrieve chat history between two users
exports.getChatHistory = async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json({
      status: 'success',
      data: messages,
    });
  } catch (err) {
    res.status(500).json({ status: 'fail', message: err.message });
  }
};
