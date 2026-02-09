import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { MessageSquare, User, Clock, ChevronRight, Search, BookOpen } from "lucide-react";
import ChatBox from "../common/ChatBox";

import socket from "../../socket";

const TutorDoubts = () => {
    const [doubts, setDoubts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDoubt, setSelectedDoubt] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchDoubts();

        const tutorId = localStorage.getItem("userId");
        socket.emit("join-tutor-lobby", tutorId);

        const handleNewNotification = (data) => {
            setDoubts((prev) => {
                const existingIdx = prev.findIndex(d =>
                    String(d.studentId) === String(data.studentId) &&
                    String(d.courseId) === String(data.courseId)
                );

                const newDoubt = {
                    studentId: data.studentId,
                    studentName: data.studentName,
                    courseId: data.courseId,
                    courseTitle: data.courseTitle,
                    lastMessage: data.message,
                    lastTimestamp: new Date().toISOString()
                };

                if (existingIdx !== -1) {
                    const updated = [...prev];
                    updated[existingIdx] = newDoubt;
                    return updated.sort((a, b) => new Date(b.lastTimestamp) - new Date(a.lastTimestamp));
                } else {
                    return [newDoubt, ...prev];
                }
            });
        };

        socket.on("new-message-notification", handleNewNotification);

        return () => {
            socket.off("new-message-notification", handleNewNotification);
        };
    }, []);

    const fetchDoubts = async () => {
        try {
            const res = await api.get("/chats/tutor/doubts");
            setDoubts(res.data);
        } catch (err) {
            console.error("Failed to fetch doubts", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredDoubts = doubts.filter(d =>
        String(d.studentName).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(d.courseTitle).toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/20">
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            Student <span className="text-blue-500">Doubts</span>
                        </h1>
                        <p className="text-slate-500 mt-2 font-bold uppercase tracking-widest text-[10px]">Neural Response Interface v1.0</p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Filter by student or course..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {filteredDoubts.length === 0 ? (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-20 text-center">
                        <MessageSquare className="w-16 h-16 text-slate-800 mx-auto mb-6 opacity-20" />
                        <h2 className="text-xl font-black text-slate-700 uppercase tracking-tight">No doubts found</h2>
                        <p className="text-slate-500 mt-2">When students ask questions in your courses, they will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoubts.map((doubt) => (
                            <div
                                key={doubt.studentId + doubt.courseId}
                                className="group bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-3xl p-6 transition-all hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
                                onClick={() => setSelectedDoubt(doubt)}
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform">
                                    <MessageSquare className="w-32 h-32 rotate-12" />
                                </div>

                                <div className="flex items-start justify-between mb-6">
                                    <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <User className="w-7 h-7" />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-500">
                                        <Clock className="w-3 h-3" />
                                        {new Date(doubt.lastTimestamp).toLocaleDateString()}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{doubt.studentName}</h3>
                                        <div className="flex items-center gap-2 text-slate-500 mt-1">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            <span className="text-[10px] font-bold uppercase tracking-wider truncate">{doubt.courseTitle}</span>
                                        </div>
                                    </div>

                                    <div className="bg-slate-950/50 border border-slate-800/50 rounded-2xl p-4">
                                        <p className="text-xs text-slate-400 italic line-clamp-2">"{doubt.lastMessage}"</p>
                                    </div>

                                    <button className="w-full py-3 bg-slate-800 hover:bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2">
                                        Open Channel <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Chat for selected Doubt */}
            {selectedDoubt && (
                <ChatBox
                    key={`${selectedDoubt.studentId}-${selectedDoubt.courseId}`}
                    courseId={selectedDoubt.courseId}
                    courseTitle={selectedDoubt.courseTitle}
                    studentId={selectedDoubt.studentId}
                    studentName={selectedDoubt.studentName}
                    tutorId={localStorage.getItem("userId")}
                    tutorName={localStorage.getItem("name")}
                    isTutor={true}
                    initialOpen={true}
                    onClose={() => setSelectedDoubt(null)}
                />
            )}
        </div>
    );
};

export default TutorDoubts;
