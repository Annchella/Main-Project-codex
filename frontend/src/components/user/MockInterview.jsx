import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { MessageSquare, Send, User, Bot, RefreshCw, Briefcase, BarChart, ChevronLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MockInterview = () => {
    const [mode, setMode] = useState("setup"); // setup, interview
    const [jobTitle, setJobTitle] = useState("Full Stack Developer");
    const [difficulty, setDifficulty] = useState("Medium");
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    const chatEndRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const startInterview = async () => {
        setLoading(true);
        try {
            const res = await api.post("/ai-interview/start", { jobTitle, difficulty });
            setMessages([{ role: "model", parts: [{ text: res.message }] }]);
            setSessionId(res.sessionId);
            setMode("interview");
        } catch (error) {
            console.error("Interview start failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", parts: [{ text: input }] };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const history = messages.map(m => ({ role: m.role, parts: m.parts }));
            const res = await api.post("/ai-interview/chat", {
                message: input,
                history,
                jobTitle
            });

            setMessages((prev) => [...prev, { role: "model", parts: [{ text: res.message }] }]);
        } catch (error) {
            console.error("Chat failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">

            <main className="flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto w-full px-6 pb-12">
                {mode === "setup" ? (
                    <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500">
                        <header className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-4">
                                <Briefcase className="w-4 h-4" />
                                Career Preparation
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
                                AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Mock Interview</span>
                            </h1>
                            <p className="text-slate-400">Configure your session and practice with our senior AI recruiter.</p>
                        </header>

                        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl backdrop-blur-sm shadow-2xl space-y-8">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Target Role</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
                                        <input
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                            placeholder="e.g. Frontend Engineer, Data Scientist"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Challenge Level</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {["Easy", "Medium", "Hard"].map(level => (
                                            <button
                                                key={level}
                                                onClick={() => setDifficulty(level)}
                                                className={`py-3 rounded-xl font-bold border transition-all ${difficulty === level ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-700'}`}
                                            >
                                                {level}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={startInterview}
                                disabled={loading}
                                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-6 h-6 group-hover:animate-pulse" />}
                                {loading ? "INITIALIZING INTERVIEW..." : "START MOCK INTERVIEW"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-[80vh] flex flex-col bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-8 duration-500">
                        {/* Header */}
                        <div className="px-8 py-4 bg-slate-800/40 border-b border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setMode("setup")} className="p-2 rounded-lg hover:bg-slate-700 transition-colors text-slate-400">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div>
                                    <h2 className="font-bold text-sm tracking-tight">{jobTitle} Interview</h2>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Live Session</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-tighter">
                                <BarChart className="w-3 h-3" />
                                Evaluation Active
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                            {messages.map((msg, i) => {
                                const isBot = msg.role === "model";
                                return (
                                    <div key={i} className={`flex gap-4 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
                                        <div className={`p-2 rounded-xl shrink-0 ${isBot ? 'bg-indigo-500/10 text-indigo-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {isBot ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                                        </div>
                                        <div className={`max-w-[80%] p-5 rounded-2xl leading-relaxed text-sm ${isBot ? 'bg-slate-800/60 rounded-tl-none border border-slate-800/80 text-slate-200' : 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/10'}`}>
                                            <div className="whitespace-pre-wrap">{msg.parts[0].text}</div>
                                        </div>
                                    </div>
                                );
                            })}
                            {loading && (
                                <div className="flex gap-4 items-start animate-pulse">
                                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                                        <Bot className="w-6 h-6" />
                                    </div>
                                    <div className="bg-slate-800/60 rounded-2xl rounded-tl-none p-5 w-24 border border-slate-800/80">
                                        <div className="flex gap-1 justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce duration-300"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce delay-75 duration-300"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce delay-150 duration-300"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Footer Input */}
                        <form onSubmit={handleSend} className="p-6 bg-slate-900/80 border-t border-slate-800 flex gap-4">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type your response..."
                                className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 outline-none focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="p-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center shadow-lg shadow-blue-600/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MockInterview;
