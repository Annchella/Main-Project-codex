import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Terminal, ShieldCheck, Activity, Cpu, Database } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState(["BOOT_SEQUENCE_INITIATED..."]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const logSequence = [
      "CALIBRATING NEURAL MODELS...",
      "SYNCHRONIZING SECURE TUNNEL...",
      "FETCHING USER DATASETS...",
      "AUTHORIZING ACCESS PROTOCOLS...",
      "READY FOR DEPLOYMENT."
    ];

    let currentLog = 0;
    const logInterval = setInterval(() => {
      if (currentLog < logSequence.length) {
        setLogs(prev => {
          const newLogs = [...prev, logSequence[currentLog]];
          return newLogs.slice(-3); // Keep last 3 logs
        });
        currentLog++;
      }
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 100));
    }, 25);

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    const timeout = setTimeout(() => {
      const targetPath = !token ? "/login" : (role === "admin" ? "/admin" : (role === "tutor" ? "/tutor" : "/user"));
      navigate(targetPath);
    }, 3200); // Slightly longer for the animation to finish

    return () => {
      clearInterval(logInterval);
      clearInterval(progressInterval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center relative overflow-hidden font-mono select-none">
      {/* Visual background layers */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] animate-scan"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[160px]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-sm px-10">
        {/* Animated Icon Container */}
        <div className="relative mb-8 transform hover:scale-110 transition-transform duration-700">
          <div className="absolute -inset-6 bg-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          <div className="relative w-24 h-24 bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden">
            <img src="/integrax-logo.jpg" alt="IntegraX" className="w-full h-full object-cover opacity-80 animate-pulse" />

            {/* Corner Badges */}
            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1.5 shadow-lg shadow-blue-500/50 z-10">
              <Cpu className="w-3.5 h-3.5 text-white animate-spin-slow" />
            </div>
          </div>
        </div>

        {/* Brand Glitch */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white tracking-[0.2em] mb-2 flex items-center justify-center gap-3 italic">
            <span className="relative inline-block">
              LOADING...
              <span className="absolute inset-0 text-blue-500 opacity-70 animate-glitch-offset-1 translate-x-1">LOADING...</span>
              <span className="absolute inset-0 text-purple-500 opacity-70 animate-glitch-offset-2 -translate-x-1">LOADING...</span>
            </span>
          </h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em] opacity-30">IntegraX Core v4.0.ALPHA</p>
        </div>

        {/* Logs Console */}
        <div className="w-full bg-slate-950/80 border border-slate-900/50 p-6 rounded-2xl mb-8 backdrop-blur-md shadow-inner h-28 flex flex-col justify-end">
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 text-[9px] font-bold tracking-widest text-slate-400 uppercase animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                {log}
              </div>
            ))}
          </div>
        </div>

        {/* Cyber Progress Bar */}
        <div className="w-full space-y-3">
          <div className="flex justify-between items-end text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <span>SYNC_PROGRESS: {progress}%</span>
            <Activity className="w-3.5 h-3.5 animate-pulse text-blue-500" />
          </div>
          <div className="h-1.5 w-full bg-slate-900/50 border border-slate-800 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-300 relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 h-full w-8 bg-white/30 blur-sm"></div>
            </div>
          </div>
        </div>

        {/* Global Node Status */}
        <div className="mt-16 flex items-center gap-8 opacity-40">
          <div className="flex items-center gap-2">
            <Database className="w-3 h-3 text-slate-500" />
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">NRT_DB: ONLINE</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3 h-3 text-slate-500" />
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">SEC_TUN: ACTIVE</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 100%; }
        }
        .animate-scan { animation: scan 10s linear infinite; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        .animate-glitch { animation: glitch 0.3s infinite ease-in-out; }

        @keyframes glitch-o1 {
          0%, 100% { opacity: 0; transform: translate(0); }
          50% { opacity: 0.5; transform: translate(-4px, 2px); }
        }
        @keyframes glitch-o2 {
          0%, 100% { opacity: 0; transform: translate(0); }
          50% { opacity: 0.5; transform: translate(4px, -2px); }
        }
        .animate-glitch-offset-1 { animation: glitch-o1 1s infinite alternate; }
        .animate-glitch-offset-2 { animation: glitch-o2 1.3s infinite alternate; }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fade-in 0.5s ease-out forwards; }
      `}} />
    </div>
  );
};

export default Home;
