const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const User = require("../models/User");
const { saveMessage } = require("../controllers/conversationController");

//authenticate socket connection using same httponly cookie
const authenticateSocket = async (socket, next) =>{
    try {
        const rawCookie = socket.handshake.headers.cookie;
        if(!rawCookie) return next(new Error("No Auth Cookie"));

        const {token } = cookie.parse(rawCookie);
        if(!token) return next(new Error("No token"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if(!user) return next(new Error("User not found"));

        socket.user = user;
        next();
    } catch (err) {
        next(new Error("Socket auth failed!"));
    }
};

const initChatSocket = (io) =>{
    io.use(authenticateSocket);

    io.on("connection", (socket) =>{
        //join a room named after conversation id so as messages only broadcast to 2 participants and not others
        socket.on("joinConversation", (conversationId) =>{
            socket.join(conversationId);
        });

        socket.on("leaveConversation", (conversationId) =>{
            socket.leave(conversationId);
        });

        //conversationId, text
        socket.on("sendMessage", async ({ conversationId, text})=>{
            if(!text || !text.trim()) return;
            try {
                const message = await saveMessage({
                    conversationId,
                    senderId: socket.user._id,
                    text: text.trim(),
                });

                //broadcast to everyone in the room including sender
                io.to(conversationId).emit("newMessage", {
                    _id: message._id,
                    conversation: conversationId,
                    sender: socket.user._id,
                    text: message.text,
                    createdAt: message.createdAt,
                });
            } catch (err) {
                socket.emit("messageError", { message: "Could not send message"});
            }
        });

        socket.on("typing", ({conversationId}) =>{
            socket.to(conversationId).emit("typing", {userId: socket.user._id});
        });

        socket.on("stop typing", ({conversationId})=>{
            socket.to(conversationId).emit("stup typing", {userId: socket.user._id});
        });
    });
};

module.exports = initChatSocket;