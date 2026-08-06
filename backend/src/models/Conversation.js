const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    participant: [
        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    ],
    lastMessage: { type: String, default: ""},
    lastMessageAt: { type: Date, default: Date.now},
    }, 
    {timestamps: true}
);

conversationSchema.index({participants: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);