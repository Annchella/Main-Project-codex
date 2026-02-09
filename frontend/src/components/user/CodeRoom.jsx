import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Terminal, Plus, LogIn, ChevronLeft, Key, Hash, ShieldCheck } from "lucide-react";

const CodeRoom = () => {
  const [mode, setMode] = useState("");
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomId || !password) {
      return;
    }

    localStorage.setItem("roomPassword", password);
    navigate(`/code-room/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      <main className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <Terminal className="w-4 h-4" />
            Collaborative Coding
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Code Rooms</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
            Create a private space to code together with mentors or peers. Synchronized editing, zero friction.
          </p>
        </div>

        {/* Main Interaction Card */}
        <div className="w-full max-w-md bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden shadow-2xl">
          {/* Decorative Background Blur */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>

          {!mode ? (
            <div className="relative z-10 space-y-4 py-4">
              <button
                onClick={() => setMode("create")}
                className="group w-full flex items-center justify-between p-6 bg-slate-900/50 border border-slate-700 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Create New Room</h3>
                    <p className="text-xs text-slate-500">Generate a fresh ID and secure it</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setMode("join")}
                className="group w-full flex items-center justify-between p-6 bg-slate-900/50 border border-slate-700 rounded-2xl hover:border-purple-500/50 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 text-left">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
                    <LogIn className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Join Existing Room</h3>
                    <p className="text-xs text-slate-500">Enter via ID and password</p>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex justify-between items-center mb-2">
                <button
                  type="button"
                  onClick={() => setMode("")}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group"
                >
                  <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Go Back
                </button>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {mode === "create" ? "Generation" : "Verification"}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Room Identity</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      placeholder="e.g. project-x-alpha"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-700"
                      onChange={(e) => setRoomId(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Privacy Password</label>
                  <div className="relative">
                    <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-700"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`w-full py-4 bg-gradient-to-r ${mode === 'create' ? 'from-blue-600 to-blue-500' : 'from-purple-600 to-purple-500'} text-white font-bold rounded-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2`}
              >
                <ShieldCheck className="w-5 h-5" />
                {mode === "create" ? "Create & Initialize" : "Enter Secure Room"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default CodeRoom;
