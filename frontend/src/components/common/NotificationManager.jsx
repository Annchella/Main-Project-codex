import React, { useEffect, useState, useCallback } from "react";
import socket from "../../socket";
import { MessageSquare, X, Zap, Bell, Navigation } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

// 🔊 Synthetic Neural Ping (Professional Audio without external files)
const playNeuralPing = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High pitch
        oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1); // Quick drop

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.2);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
        console.warn("Audio Context blocked or unsupported");
    }
};

const NotificationManager = () => {
    const [notifications, setNotifications] = useState([]);
    const [lobbyJoined, setLobbyJoined] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleJump = useCallback((n) => {
        const role = localStorage.getItem("role");
        if (role === "tutor") {
            // Tutor jumps to Doubts Dashboard
            navigate("/tutor/doubts");
        } else {
            // Student jumps to specific Course Player
            navigate(`/user/courses/${n.courseId}/player`);
        }
        // Remove notification after jump
        setNotifications(prev => prev.filter(item => item.id !== n.id));
    }, [navigate]);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const role = localStorage.getItem("role");

        if (!userId) {
            setLobbyJoined(null);
            return;
        }

        if (lobbyJoined !== userId) {
            if (role === "tutor") {
                console.log(`[NotificationManager] Joining tutor lobby: ${userId}`);
                socket.emit("join-tutor-lobby", String(userId));
            } else {
                console.log(`[NotificationManager] Joining user lobby: ${userId}`);
                socket.emit("join-user-lobby", String(userId));
            }
            setLobbyJoined(userId);
        }

        const handleNewNotification = (data) => {
            const currentUserId = localStorage.getItem("userId");
            console.log(`[NotificationManager] Event Check: sender=${data.senderId}, me=${currentUserId}`);

            if (String(data.senderId) !== String(currentUserId)) {
                const id = Date.now();
                setNotifications(prev => [...prev, { ...data, id }]);

                // Play Professional Audio
                playNeuralPing();

                setTimeout(() => {
                    setNotifications(prev => prev.filter(n => n.id !== id));
                }, 8000); // Longer duration for premium feel

                window.dispatchEvent(new CustomEvent("new-chat-message", { detail: data }));
            }
        };

        socket.on("new-message-notification", handleNewNotification);

        // Handle Reconnection
        const onConnect = () => {
            const currentUserId = localStorage.getItem("userId");
            const currentRole = localStorage.getItem("role");
            if (currentUserId) {
                if (currentRole === "tutor") socket.emit("join-tutor-lobby", String(currentUserId));
                else socket.emit("join-user-lobby", String(currentUserId));
            }
        };
        socket.on("connect", onConnect);

        return () => {
            socket.off("new-message-notification", handleNewNotification);
            socket.off("connect", onConnect);
        };
    }, [lobbyJoined, location.pathname]);

    return (
        <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: 100, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.8, x: 50, filter: "blur(10px)" }}
                        whileHover={{ scale: 1.02 }}
                        className="pointer-events-auto relative group"
                    >
                        {/* High-Tech Background Glow */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                        <div
                            onClick={() => handleJump(n)}
                            className="relative bg-slate-900/90 border border-slate-800/50 rounded-[2rem] p-5 shadow-2xl flex items-center gap-5 min-w-[340px] max-w-md backdrop-blur-2xl cursor-pointer overflow-hidden border-l-4 border-l-blue-500"
                        >
                            {/* Neural Scan Animation */}
                            <motion.div
                                animate={{ top: ["-100%", "200%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-400/30 to-transparent pointer-events-none"
                            />

                            <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-blue-400 shrink-0 border border-slate-800 group-hover:border-blue-500/50 transition-colors relative overflow-hidden">
                                <MessageSquare className="w-6 h-6 z-10" />
                                <div className="absolute inset-0 bg-blue-500/5 animate-pulse"></div>
                            </div>

                            <div className="flex-1 overflow-hidden">
                                <div className="flex items-center gap-2 mb-1">
                                    <Zap className="w-3 h-3 text-orange-500 fill-current" />
                                    <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] truncate">
                                        {n.courseTitle}
                                    </h4>
                                </div>
                                <p className="text-white text-[13px] font-black tracking-tight flex items-center gap-2">
                                    {n.senderName}
                                    <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest">• NEW INTEL</span>
                                </p>
                                <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-1 mt-1 font-medium italic">
                                    "{n.message}"
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setNotifications(prev => prev.filter(item => item.id !== n.id));
                                    }}
                                    className="p-2 bg-slate-950/50 hover:bg-red-500/10 rounded-xl text-slate-600 hover:text-red-400 transition-all border border-slate-800/50"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="p-2 bg-blue-600/10 rounded-xl text-blue-400 animate-pulse">
                                    <Navigation className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationManager;
