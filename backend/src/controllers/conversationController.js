const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

//create new conversation
const startConversation = async (req, res ) =>{
    try {
        const {recipientId } = req.body;
        if(!recipientId){
            return res.status(400).json({message: "Recipient id is required "});
        }
        if(recipientId === String(req.user._id)){
            return res.status(400).json({message: "Cannot start a conversation with yourself"});
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [req.user._id, recipientId], $size: 2},
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants: [req.user._id, recipientId],
            });
        }
        res.status(200).json({ conversation });
    } catch (err) {
        res.status(500).json({message: "Could not start a conversation", error: err.message});
    }
};

//list all conversations for the loged in user
const listConversations = async (req, res) =>{
    const conversations = await Conversation.find({participants: req.user._id})
    .populate("participants", "name role")
    .sort({ lastMessageAt: -1});
 res.json({ conversations});
};

// message history for one thread
const getMessages = async (req, res) =>{
    const conversation = await Conversation.findById(req.params.id);
    if(!conversation || !conversation.participants.some((p) =>p.equals(req.user._id)) ){
        return res.status(404).json({message: "Conversation not found"});
    }

    const messages = await Message.find({conversation: req.params.id}) .sort({ createdAt: 1});
    res.json({ messages });
};

//source of truth for persisting a message
const saveMessage = async ({ conversationId, senderId, text}) =>{
    const message = await Message.create({conversation: conversationId, sender: senderId, text});
    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: text,
        lastMessageAt: new Date(),
    });
    return message;
};

module.exports = { startConversation, listConversations, getMessages, saveMessage };