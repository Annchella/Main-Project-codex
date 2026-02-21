import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../socket";
import api from "../../services/api";
import {
  Terminal, Play, MessageSquare, Send,
  ChevronRight, RefreshCw, Hash, Users,
  Settings, Clock, ShieldCheck, XCircle, User
} from "lucide-react";

const CodeEditor = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const chatEndRef = useRef(null);

  const password = localStorage.getItem("roomPassword");
  const role = localStorage.getItem("role") || "User";
  const userName = localStorage.getItem("name") || "Anonymous";

  const [code, setCode] = useState("// Start your collaborative session here...\n\nfunction main() {\n  console.log('Hello CodeRoom!');\n}\n\nmain();");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [status, setStatus] = useState("Connecting");
  const [loading, setLoading] = useState(false);
  const [roomMembers, setRoomMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);

  // 💬 Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    if (!password) {
      navigate("/code-room");
      return;
    }

    // 🔐 Room error
    socket.on("room-error", (msg) => {
      alert(msg);
      localStorage.removeItem("roomPassword");
      navigate("/code-room");
    });

    socket.on("joined", () => {
      console.log("Socket joined room. Status: Online");
      setStatus("Online");
    });

    // 👥 Room members update
    socket.on("room-users", (users) => {
      console.log("Received room members:", users);
      setRoomMembers(users);
    });

    // 🔁 Code sync
    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    // 💬 Receive chat
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    console.log("Joining room with userName:", userName);
    socket.emit("join-room", { roomId, password, userName });

    return () => {
      socket.off("room-error");
      socket.off("joined");
      socket.off("room-users");
      socket.off("receive-code");
      socket.off("receive-message");
    };
  }, [roomId, password, navigate, userName]);

  useEffect(() => {
    // Scroll chat to bottom
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✍️ Code change
  const handleEditorChange = (value) => {
    setCode(value);
    socket.emit("code-change", { roomId, code: value });
  };

  // ▶ RUN CODE
  const runCode = async () => {
    setLoading(true);
    setOutput("");
    try {
      const res = await api.post("/compile/run", {
        code,
        language,
      });
      setOutput(res.data.output);
    } catch (err) {
      setOutput("Error: Internal execution failure.");
    } finally {
      setLoading(false);
    }
  };

  // 💬 Send chat
  const sendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    socket.emit("send-message", {
      roomId,
      message: chatInput,
      sender: userName,
      time: time
    });

    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col overflow-hidden relative">

      {/* 🔝 HEADER / CONTROLS */}
      <div className="flex justify-between items-center px-6 py-3 bg-slate-900/80 border-b border-slate-800 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight leading-none">CODE ROOM</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <Hash className="w-3 h-3" /> {roomId}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:flex h-8 w-[1px] bg-slate-800 mx-2"></div>

          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${status === 'Online' ? 'bg-emerald-400 animate-pulse' : 'bg-yellow-400'}`}></span>
              {status.toUpperCase()}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMembers(!showMembers)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] font-bold text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Users className="w-3 h-3" />
                {roomMembers.length} MEMBERS
              </button>

              {showMembers && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                  <div className="p-2 border-b border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-3">
                    Connected Members
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar">
                    {roomMembers.map((member, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-800 transition-colors">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-medium text-slate-300 truncate">{member.name}</span>
                        {member.name === userName && <span className="text-[9px] bg-slate-700 text-slate-400 px-1 rounded ml-auto">YOU</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Settings className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 group-hover:text-blue-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 border border-slate-700 pl-8 pr-4 py-1.5 rounded-xl text-xs font-semibold appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500 hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
            </select>
          </div>

          <button
            onClick={runCode}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            RUN CODE
          </button>
        </div>
      </div>

      {/* 🔽 MAIN WORKSPACE */}
      <div className="flex flex-1 overflow-hidden">
        {/* 🧠 EDITOR & CONSOLE (Left-Middle) */}
        <div className="flex-1 flex flex-col bg-slate-900 divide-y divide-slate-800">
          <div className="flex-1 relative">
            <Editor
              height="100%"
              language={language}
              theme="vs-dark"
              value={code}
              options={{
                fontSize: 14,
                lineNumbers: "on",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 20 },
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
              onChange={handleEditorChange}
            />
          </div>

          {/* OUTPUT / CONSOLE */}
          <div className="h-[25vh] bg-slate-950 p-5 overflow-auto custom-scrollbar flex flex-col">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Console Output
              </h3>
              {loading && <div className="text-[10px] text-blue-400 animate-pulse font-bold uppercase">Executing...</div>}
            </div>

            <pre className="font-mono text-xs leading-relaxed flex-1">
              {output ? (
                <div className={output.includes("Error") ? "text-red-400" : "text-emerald-400"}>
                  <span className="opacity-50 mr-2">$</span> {output}
                </div>
              ) : (
                <div className="text-slate-600 italic">Ready for input. Write some code and hit run!</div>
              )}
            </pre>
          </div>
        </div>
      </div>

      {/* 💬 FLOATING CHAT WINDOW (Same as CoursePlayer style) */}
      {showChat && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white uppercase tracking-tight">Team Chat</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Collaborative Session</p>
              </div>
            </div>
            <button onClick={() => setShowChat(false)} className="p-2 hover:bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-all">
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                <Clock className="w-12 h-12 mb-2" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">No messages yet</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender === userName;
                return (
                  <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      {!isMe && <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none">{msg.sender}</span>}
                    </div>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${isMe
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/10'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
                      }`}>
                      <p className="leading-relaxed">{msg.message}</p>
                      <p className={`text-[8px] mt-2 font-bold uppercase ${isMe ? "text-blue-200" : "text-slate-500"}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-4 bg-slate-900/50 border-t border-slate-800">
            <div className="relative">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg transition-all active:scale-90"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 🔮 FLOATING CHAT TOGGLE */}
      {!showChat && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-[100] group animate-bounce-subtle border-2 border-slate-950"
          title="Open Team Chat"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            {messages.length > 0 && (
              <div className="absolute -top-3 -right-3 flex items-center justify-center">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40"></div>
                <div className="relative min-w-[20px] h-5 px-1.5 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-slate-950 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
                  {messages.length}
                </div>
              </div>
            )}
          </div>
        </button>
      )}
    </div>
  );
};

export default CodeEditor;
