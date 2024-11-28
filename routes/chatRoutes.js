const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/:userId/:contactId', chatController.getChatHistory);
router.post('/send', chatController.saveMessage);

module.exports = router;
