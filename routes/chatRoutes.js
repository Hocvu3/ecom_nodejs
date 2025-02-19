const express = require('express');
const chatController = require('../controllers/chatController');

const router = express.Router();

router.get('/:userId/:contactId', chatController.getChatHistory);
router.post('/send', chatController.saveMessage);
// test tinh nang git rebase
// test tinh nang git rebase 2
module.exports = router;
// test main branch
