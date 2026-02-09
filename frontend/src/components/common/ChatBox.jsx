import React, { useState, useEffect, useRef } from "react";
import { Send, User as UserIcon, X, MessageCircle } from "lucide-react";
import api from "../../services/api";
import socket from "../../socket";

const ChatBox = ({ courseId, tutorId, studentId, studentName, tutorName, isTutor, courseTitle, initialOpen = false, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [unreadCount, setUnreadCount] = useState(0);
    const scrollRef = useRef();

    useEffect(() => {
        const handleNewMessage = (e) => {
            const data = e.detail;
            // Only increment if chat is closed AND it's for this specific course/context
            if (!isOpen && data.courseId === courseId && data.studentId === studentId) {
                setUnreadCount(prev => prev + 1);
            }
        };

        window.addEventListener("new-chat-message", handleNewMessage);
        return () => window.removeEventListener("new-chat-message", handleNewMessage);
    }, [isOpen, courseId, studentId]);

    useEffect(() => {
        if (isOpen) setUnreadCount(0);
    }, [isOpen]);

    // Re-open if initialOpen changes
    useEffect(() => {
        if (initialOpen) setIsOpen(true);
    }, [initialOpen, studentId, courseId]);

    const otherUserId = isTutor ? studentId : tutorId;

    useEffect(() => {
        if (isOpen) {
            fetchHistory();

            // Join room
            const roomPayload = {
                courseId: String(courseId),
                studentId: String(studentId),
                tutorId: String(tutorId)
            };
            console.log("Joining Doubt Chat Room:", roomPayload);
            socket.emit("join-doubt-chat", roomPayload);

            // Listen for messages
            const handleReceiveDoubt = (data) => {
                setMessages((prev) => [...prev, {
                    sender: { _id: data.senderId, name: data.senderName },
                    message: data.message,
                    createdAt: new Date().toISOString()
                }]);
            };

            socket.on("receive-doubt", handleReceiveDoubt);

            return () => {
                socket.off("receive-doubt", handleReceiveDoubt);
            };
        }
    }, [isOpen, courseId, studentId, tutorId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchHistory = async () => {
        if (!courseId || !otherUserId || courseId === "undefined" || otherUserId === "undefined") {
            console.warn("Skipping fetchHistory due to missing IDs:", { courseId, otherUserId });
            return;
        }

        try {
            const res = await api.get(`/chats/history/${courseId}/${otherUserId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Failed to load chat history", err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        if (!otherUserId || otherUserId === "undefined") {
            console.error("Cannot send message: recipient ID is missing.");
            return;
        }

        const messageData = {
            recipientId: otherUserId,
            courseId,
            message: newMessage,
        };

        try {
            // Save to DB
            const res = await api.post("/chats/send", messageData);

            const payload = {
                courseId: String(courseId),
                courseTitle,
                studentId: String(studentId),
                studentName,
                tutorId: String(tutorId),
                tutorName,
                message: newMessage,
                senderId: String(localStorage.getItem("userId")),
                senderName: localStorage.getItem("name") || (isTutor ? "Tutor" : "Student"),
            };

            console.log("Emitting send-doubt:", payload);
            socket.emit("send-doubt", payload);

            setNewMessage("");
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-2xl transition-all active:scale-90 z-[100] group"
            >
                <div className="relative">
                    <MessageCircle className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <div className="absolute -top-2 -right-2 flex items-center justify-center">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40"></div>
                            <div className="relative min-w-[20px] h-5 px-1.5 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-950 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                                {unreadCount}
                            </div>
                        </div>
                    )}
                </div>
                <span className="absolute right-full mr-3 bg-slate-900 border border-slate-800 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {isTutor ? "View Doubts" : "Ask Doubt"}
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                        <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-xs font-black text-white uppercase tracking-tight">
                            {isTutor ? `Student: ${studentName}` : `Tutor: ${tutorName}`}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Doubt Clearing</p>
                    </div>
                </div>
                <button onClick={() => {
                    setIsOpen(false);
                    if (onClose) onClose();
                }} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-all">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                        <MessageCircle className="w-12 h-12 mb-2" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Start a conversation</p>
                    </div>
                )}
                {messages.map((msg, i) => {
                    const senderId = typeof msg.sender === 'object' ? msg.sender._id : msg.sender;
                    const senderDisplayName = typeof msg.sender === 'object' ? msg.sender.name : (isTutor ? studentName : tutorName);
                    const isMe = senderId === localStorage.getItem("userId");

                    return (
                        <div key={i} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                            {!isMe && (
                                <span className="text-[10px] font-black uppercase text-slate-500 ml-2 mb-1 tracking-widest leading-none">
                                    {senderDisplayName}
                                </span>
                            )}
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${isMe
                                ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20"
                                : "bg-slate-800 text-slate-200 rounded-tl-none"
                                }`}>
                                <p className="leading-relaxed">{msg.message}</p>
                                <p className={`text-[8px] mt-2 font-bold uppercase ${isMe ? "text-blue-200" : "text-slate-500"}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    )
                })}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/50 border-t border-slate-800">
                <div className="relative">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your doubt..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-all active:scale-90"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChatBox;
