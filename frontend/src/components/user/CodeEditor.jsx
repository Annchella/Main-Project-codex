import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import socket from "../../socket";
import api from "../../services/api";
import {
  Terminal, Play, MessageSquare, Send,
  ChevronRight, RefreshCw, Hash, Users,
  Settings, Clock, ShieldCheck, XCircle
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

  // 💬 Chat state
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

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
      setStatus("Online");
    });

    // 🔁 Code sync
    socket.on("receive-code", (newCode) => {
      setCode(newCode);
    });

    // 💬 Receive chat
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.emit("join-room", { roomId, password });

    return () => {
      socket.off("room-error");
      socket.off("joined");
      socket.off("receive-code");
      socket.off("receive-message");
    };
  }, [roomId, password, navigate]);

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
    <div className="h-screen bg-slate-950 text-white font-sans flex flex-col overflow-hidden">

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
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-[11px] font-bold text-slate-400 border border-slate-700/50">
              <Users className="w-3 h-3" />
              ACTIVE SESSION
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
            className="flex items-center gap-2 px-5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
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

        {/* 💬 CHAT PANEL (Right) */}
        <div className="w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col relative z-20">
          <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center group cursor-default">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm tracking-tight">TEAM CHAT</span>
            </div>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">Y</div>
              <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold">M</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-slate-900/50">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-600">
                  <Clock className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 font-medium">No messages yet.<br />Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.sender === userName;
                return (
                  <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                      {!isMe && <span className="text-[10px] font-black text-indigo-400 uppercase">{msg.sender}</span>}
                      <span className="text-[9px] font-bold text-slate-600">{msg.time}</span>
                    </div>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50'
                      }`}>
                      {msg.message}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendMessage} className="p-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800">
            <div className="relative group">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 p-4 pr-12 rounded-2xl text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-600"
                placeholder="Type your message..."
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all active:scale-90 disabled:opacity-30 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
