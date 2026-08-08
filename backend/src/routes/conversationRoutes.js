const express = require("express");
const router = express.Router();
const { startConversation, listConversations, getMessages, saveMessage } = require("../controllers/conversationController");
const { protect } = require("../middleware/auth");

router.post("/", protect, startConversation);
router.get("/", protect, listConversations);
router.get("/:id/messages", protect, getMessages);

module.exports = router;