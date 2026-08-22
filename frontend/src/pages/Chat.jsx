import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import { getSocket } from "../api/socket";
import { useAuth } from "../context/AuthContext";

export default function Chat() {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeId = searchParams.get("conversation");

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const [otherTyping, setOtherTyping] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const typingTimeout = useRef(null);
    const bottomRef = useRef(null);
    const socket = getSocket();

    // Load conversation list once
    useEffect(() => {
        api
          .get("/conversations")
          .then((res) => setConversations(res.data.conversations))
          .finally(() => setLoadingList(false));
    }, []);

    // Connect socket once, on mount
    useEffect(() => {
        socket.connect();
        return () => socket.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Switch active conversation: load history, join its socket room
    useEffect(() => {
        if (!activeId) return;
    
        api.get(`/conversations/${activeId}/messages`).then((res) => setMessages(res.data.messages));
        socket.emit("joinConversation", activeId);
        setOtherTyping(false);
    
        return () => socket.emit("leaveConversation", activeId);
    }, [activeId, socket]);

    // Live message + typing listeners
    useEffect(() => {
        const handleNewMessage = (msg) => {
          if (msg.conversation === activeId) {
            setMessages((prev) => [...prev, msg]);
          }
          // bump conversation to top of list with preview
          setConversations((prev) =>
            prev
              .map((c) => (c._id === msg.conversation ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt } : c))
              .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt))
          );
        };
        const handleTyping = () => setOtherTyping(true);
        const handleStopTyping = () => setOtherTyping(false);
    
        socket.on("newMessage", handleNewMessage);
        socket.on("typing", handleTyping);
        socket.on("stopTyping", handleStopTyping);
    
        return () => {
          socket.off("newMessage", handleNewMessage);
          socket.off("typing", handleTyping);
          socket.off("stopTyping", handleStopTyping);
        };
    }, [activeId, socket]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!text.trim() || !activeId) return;
        socket.emit("sendMessage", { conversationId: activeId, text: text.trim() });
        socket.emit("stopTyping", { conversationId: activeId });
        setText("");
    };

    const handleTypingInput = (e) => {
        setText(e.target.value);
        if (!activeId) return;
        socket.emit("typing", { conversationId: activeId });
        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
        socket.emit("stopTyping", { conversationId: activeId });
        }, 1500);
    };

    const otherParticipant = (conv) => conv.participants.find((p) => p._id !== user._id);
    const activeConv = conversations.find((c) => c._id === activeId);

    return (
        <div className="container" style={{ padding: "28px 20px" }}>
            <h1>Messages</h1>
            <div className="card" style={{ display: "flex", height: "65vh", overflow: "hidden" }}>
            {/* Conversation list */}
                <div style={{ width: 260, borderRight: "1px solid var(--color-border)", overflowY: "auto" }}>
                {loadingList && <div style={{ padding: 20 }}><div className="spinner" /></div>}
                {!loadingList && conversations.length === 0 && (
                    <p style={{ padding: 20, color: "var(--color-ink-soft)", fontSize: "0.9rem" }}>
                        No conversations yet. Start one from a profile page.
                    </p>
                )}
            {conversations.map((conv) => {
                const other = otherParticipant(conv);
                return (
                <button
                    key={conv._id}
                    onClick={() => setSearchParams({ conversation: conv._id })}
                    style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "14px 16px",
                        background: conv._id === activeId ? "var(--color-bg)" : "transparent",
                        border: "none",
                        borderBottom: "1px solid var(--color-border)",
                        cursor: "pointer",
                    }}
                >
                    <div style={{ fontWeight: 600 }}>{other?.name || "User"}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-ink-soft)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {conv.lastMessage || "Say hello"}
                    </div>
                </button>
                );
                })}
            </div>

            {/* Active thread */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                {!activeId ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-ink-soft)" }}>
                        Select a conversation to start chatting.
                    </div>
                ) : (
                <>
                    <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--color-border)", fontWeight: 600 }}>
                        {activeConv ? otherParticipant(activeConv)?.name : "Conversation"}
                    </div>

                    <div style={{ flex: 1, overflowY: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
                    {messages.map((m) => {
                        const mine = m.sender === user._id;
                        return (
                            <div
                                key={m._id}
                                style={{
                                    alignSelf: mine ? "flex-end" : "flex-start",
                                    background: mine ? "var(--color-primary)" : "var(--color-bg)",
                                    color: mine ? "white" : "var(--color-ink)",
                                    padding: "8px 14px",
                                    borderRadius: 14,
                                    maxWidth: "70%",
                                }}
                                  >
                            {m.text}
                            </div>
                        );
                        })}
                        {otherTyping && <div style={{ color: "var(--color-ink-soft)", fontSize: "0.85rem" }}>Typing…</div>}
                    <div ref={bottomRef} />
                </div>

                <form onSubmit={handleSend} style={{ display: "flex", gap: 10, padding: 14, borderTop: "1px solid var(--color-border)" }}>
                    <input
                        value={text}
                        onChange={handleTypingInput}
                        placeholder="Write a message…"
                        style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--color-border)" }}
                    />
                <button type="submit" className="btn btn-primary">Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}