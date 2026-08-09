require("dotenv").config();
const express = require("express")
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const initChatSocket = require("./sockets/chatSocket");

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {origin: process.env.CLIENT_URL, credentials: true },
});

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/conversations", conversationRoutes);

app.get("/api/health", (req, res) => res.json({ status: "ok"}));

initChatSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log(`Usafi API running on port ${PORT}`));