import React, { useState, useEffect } from "react";
import Navbar from "../common/Navbar";
import { useNavigate } from "react-router-dom";
import {
  Code, BookOpen, Video, Terminal, ArrowRight,
  Zap, Users, Globe, Award, Trophy,
  MessageSquare, Layout
} from "lucide-react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import api from "../../services/api";

const TypingCode = () => {
  const [text, setText] = useState("");
  const fullText = `instance Environment = new NeuralLink();\nlet potential = Infinity;\nEnvironment.unlock(potential);\n// System core initialized...`;

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [fullText]);

  return (
    <div className="font-mono text-xs leading-relaxed text-blue-400/80">
      {text.split("\n").map((line, i) => (
        <div key={i} className="flex gap-4">
          <span className="text-slate-700 w-4">{String(i + 1).padStart(2, "0")}</span>
          <span>{line}</span>
        </div>
      ))}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-2 h-4 bg-blue-500 ml-1"
      />
    </div>
  );
};

const CircularProgress = ({ progress, size = 60 }) => {
  const radius = size / 2 - 4;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="rotate-[-90deg]" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-slate-800 fill-none"
          strokeWidth="4"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-blue-500 fill-none"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
        {progress}%
      </div>
    </div>
  );
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("User");
  const [stats, setStats] = useState({ xp: 0, level: 1, badges: [] });
  const [isVisible, setIsVisible] = useState(false);
  const [lastCourse] = useState({ title: "Full Stack Web Development", progress: 65, id: "fs-101" });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({ x: (clientX / window.innerWidth - 0.5) * 20, y: (clientY / window.innerHeight - 0.5) * 20 });
  };

  useEffect(() => {
    setIsVisible(true);
    const savedName = localStorage.getItem("name");
    if (savedName) setUserName(savedName);

    const fetchStats = async () => {
      try {
        const res = await api.get("/user/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden"
    >
      <Navbar />

      {/* Cinematic Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Advanced Background System */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Animated Grid with Perspective */}
          <motion.div
            animate={{
              rotateX: mousePos.y * 0.5,
              rotateY: mousePos.x * 0.5,
              z: 100
            }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
            className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
            style={{ perspective: "1000px" }}
          ></motion.div>

          {/* Floating Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-500/40 rounded-full blur-[1px]"
              animate={{
                y: [0, -200, 0],
                x: [0, Math.random() * 100 - 50, 0],
                opacity: [0, 0.8, 0],
                scale: [0, 2, 0],
              }}
              transition={{
                duration: 7 + Math.random() * 7,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${80 + Math.random() * 20}%`,
              }}
            />
          ))}

          {/* Dynamic Background Glows */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-[10%] w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[150px]"
          ></motion.div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              <div className="lg:w-7/12 space-y-8">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-900/40 border border-slate-800/50 backdrop-blur-xl text-slate-300 text-sm font-bold shadow-2xl"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                  <span className="uppercase tracking-[0.2em] text-[10px]">Neural Link Established</span>
                  <div className="h-4 w-px bg-slate-700 mx-2"></div>
                  <span className="text-blue-400 font-mono">ID_{userName.toUpperCase()}</span>
                </motion.div>

                <div className="space-y-6">
                  <motion.h1
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-7xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase italic"
                  >
                    Forge <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 animate-gradient-text">
                      Excellence
                    </span>
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl text-slate-400 max-w-xl leading-relaxed font-medium border-l-2 border-blue-500/30 pl-6"
                  >
                    Your technical evolution continues. Harness elite industry tracks, real-time collaboration, and AI-driven growth metrics.
                  </motion.p>
                </div>

                <div className="flex flex-wrap gap-10">
                  {/* Progress Orb Widget */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center gap-6 p-6 bg-slate-900/30 border border-slate-800/50 rounded-[2.5rem] backdrop-blur-2xl group hover:border-blue-500/30 transition-all duration-500"
                  >
                    <CircularProgress progress={Math.round((stats.xp / (stats.level * 100)) * 100)} size={80} />
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">XP Progression</div>
                      <div className="text-2xl font-black tabular-nums">{stats.xp} <span className="text-slate-600 text-sm">/ {stats.level * 100}</span></div>
                      <div className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Level {stats.level} Overseer</div>
                    </div>
                  </motion.div>

                  {/* Floating Code Terminal */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="hidden md:block flex-1 max-w-sm p-6 bg-slate-950/50 border border-slate-800/30 rounded-[2rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Code className="w-12 h-12 text-blue-500" />
                    </div>
                    <TypingCode />
                  </motion.div>
                </div>
              </div>

              {/* Resume Learning Card - Modernized */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="lg:w-5/12 relative group"
              >
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition duration-1000"></div>

                <div className="relative bg-[#020617]/80 border border-slate-800/50 rounded-[3rem] p-10 backdrop-blur-3xl overflow-hidden shadow-2xl shadow-blue-500/5">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] rounded-full"></div>

                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="space-y-1">
                      <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-2">Resume Session</h3>
                      <p className="text-2xl font-black tracking-tight leading-tight">{lastCourse.title}</p>
                    </div>
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity }}
                      className="p-4 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-400 shadow-inner"
                    >
                      <BookOpen className="w-7 h-7" />
                    </motion.div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>Module Integrity</span>
                      <span className="text-blue-400">{lastCourse.progress}% Completed</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800/50">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${lastCourse.progress}%` }}
                        transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full relative"
                      >
                        <motion.div
                          animate={{ x: ["-100%", "300%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute top-0 h-full w-20 bg-white/20 blur-sm"
                        ></motion.div>
                      </motion.div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "#fff" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/user/course/${lastCourse.id}`)}
                    className="mt-10 w-full py-5 bg-slate-100 text-black font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-white/5 active:shadow-none"
                  >
                    CONTINUE STUDY <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Daily Status & Activity */}
      <section className="pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {/* Daily Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2rem] backdrop-blur-md flex items-center gap-6 group hover:border-orange-500/30 transition-all duration-500"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
            >
              <Zap className="w-8 h-8 fill-current" />
            </motion.div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Streak</div>
              <div className="text-3xl font-black">12 <span className="text-sm text-slate-500 font-bold uppercase tracking-tight">Days</span></div>
            </div>
          </motion.div>

          {/* Goals Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2rem] backdrop-blur-md flex items-center gap-6 group hover:border-emerald-500/30 transition-all duration-500"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: -5 }}
              className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            >
              <Trophy className="w-8 h-8" />
            </motion.div>
            <div className="flex-1">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Daily Goal</div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black text-white">4/5 Tasks</span>
                <span className="text-[10px] font-bold text-emerald-400">80%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "80%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-emerald-500 rounded-full"
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* Global Rank */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-8 bg-slate-900/40 border border-slate-800 rounded-[2rem] backdrop-blur-md flex items-center gap-6 group hover:border-purple-500/30 transition-all duration-500"
          >
            <motion.div
              whileHover={{ scale: 1.1, y: -5 }}
              className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.1)]"
            >
              <Award className="w-8 h-8" />
            </motion.div>
            <div>
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Standing</div>
              <div className="text-3xl font-black">#1,242 <span className="text-sm text-slate-500 font-bold uppercase tracking-tight">Top 2%</span></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Tool Grid */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.03)_0%,transparent_100%)]"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div>
              <h2 className="text-5xl font-black tracking-tight mb-4 uppercase italic">
                Engineering <span className="text-slate-500">Modules</span>
              </h2>
              <p className="text-slate-400 max-w-md font-medium leading-relaxed">
                Access high-performance training environments designed for modern software engineers.
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Systems Status</span>
                <div className="flex gap-2">
                  <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-emerald-500 flex items-center gap-2 text-[10px] font-black uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    All Systems Nominal
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code className="w-8 h-8 text-blue-400" />}
              title="Code Room"
              desc="Collaborative cloud IDE for pair programming and deep technical drills."
              onClick={() => navigate("/code-room")}
              color="blue"
              index={0}
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-indigo-400" />}
              title="Academy"
              desc="Structured learning paths curated by industry experts and AI mentors."
              onClick={() => navigate("/user/courses")}
              color="indigo"
              index={1}
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-pink-500" />}
              title="AI Recruiter"
              desc="Simulate high-stakes technical interviews with our advanced LLM agent."
              onClick={() => navigate("/user/mock-interview")}
              color="pink"
              index={2}
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-orange-500" />}
              title="Challenges"
              desc="Competitive algorithmic puzzles to sharpen your problem-solving speed."
              onClick={() => navigate("/user/challenges")}
              color="orange"
              index={3}
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8 text-emerald-500" />}
              title="Leaderboard"
              desc="Check your global standing and earn prestige among top talent."
              onClick={() => navigate("/user/leaderboard")}
              color="emerald"
              index={4}
            />
            <FeatureCard
              icon={<Video className="w-8 h-8 text-red-500" />}
              title="Live Ops"
              desc="Join real-time masterclasses and interactive coding sessions."
              onClick={() => navigate("/user/live-classes")}
              color="red"
              index={5}
            />
            <FeatureCard
              icon={<Award className="w-8 h-8 text-cyan-400" />}
              title="Practice Sandbox"
              desc="Zero-config isolated environments for testing architectural patterns."
              onClick={() => navigate("/user/practice-editor")}
              color="cyan"
              index={6}
            />
            <FeatureCard
              icon={<Terminal className="w-8 h-8 text-slate-400" />}
              title="Resume Builder"
              desc="Craft a high-impact technical resume with AI-driven optimizations."
              onClick={() => navigate("/resume-builder")}
              color="slate"
              index={7}
            />
            <div className="flex flex-col items-center justify-center p-12 rounded-[2.5rem] border border-dashed border-slate-800 bg-slate-900/10 group overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <Layout className="w-12 h-12 mb-4 text-slate-700 group-hover:text-slate-500 transition-colors" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-700 group-hover:text-slate-500 transition-colors">Sector Locked</span>
            </div>
          </div>
        </div>
      </section>

      {/* Community / Footer Lite */}
      < footer className="py-20 border-t border-slate-900 mx-6" >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-8">
            <StatusItem icon={<Users className="w-4 h-4" />} text="12.4k Active" />
            <StatusItem icon={<Globe className="w-4 h-4" />} text="Global Node" />
          </div>
          <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.5em] animate-pulse">
            System Core v4.0.0_Elite_Motion
          </div>
        </div>
      </footer >

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-reveal { animation: reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }

        @keyframes gradient-text {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 5s linear infinite;
        }

        .perspective-1000 { perspective: 1000px; }
        .rotate-y-12 { transform: rotateY(12deg); }
        .rotate-x-6 { transform: rotateX(6deg); }
      `}} />
    </div >
  );
};

const FeatureCard = ({ icon, title, desc, onClick, color, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-150, 150], [-10, 10]);

  const handleCardMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleCardMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const colors = {
    blue: "rgba(59, 130, 246, 0.5)",
    indigo: "rgba(99, 102, 241, 0.5)",
    pink: "rgba(236, 72, 153, 0.5)",
    orange: "rgba(249, 115, 22, 0.5)",
    emerald: "rgba(16, 185, 129, 0.5)",
    red: "rgba(239, 68, 68, 0.5)",
    cyan: "rgba(6, 182, 212, 0.5)",
    slate: "rgba(100, 116, 139, 0.5)",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className="group relative p-1 leading-none rounded-[2.5rem] bg-transparent cursor-pointer"
    >
      {/* Dynamic Border Glow */}
      <div
        className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mouseX.get() + 150}px ${mouseY.get() + 100}px, ${colors[color]}, transparent 80%)`,
          padding: '1px'
        }}
      ></div>

      <div className="relative h-full w-full bg-[#020617]/90 rounded-[2.5rem] p-8 backdrop-blur-3xl overflow-hidden border border-slate-800/50 group-hover:border-transparent transition-colors duration-500">
        {/* Cursor Spotlight Overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mouseX.get() + 150}px ${mouseY.get() + 100}px, white, transparent 40%)`
          }}
        ></motion.div>

        <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.1] transition-all duration-700 pointer-events-none translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0">
          {React.cloneElement(icon, { className: "w-48 h-48 rotate-12 transition-transform duration-700 group-hover:rotate-0" })}
        </div>

        <div className="relative z-10 space-y-6">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className={`w-16 h-16 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-2xl group-hover:border-${color}-500/50 transition-colors duration-500`}
            style={{ boxShadow: `0 0 20px ${colors[color].replace('0.5', '0.1')}` }}
          >
            {React.cloneElement(icon, { className: `w-8 h-8 text-${color}-400` })}
          </motion.div>

          <div className="space-y-3">
            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter transition-colors group-hover:text-white">
              {title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed font-medium group-hover:text-slate-300 transition-colors line-clamp-2">
              {desc}
            </p>
          </div>

          <div className="flex items-center gap-2 pt-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Initiate Protocol</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-2 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatusItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-slate-600 group transition-colors hover:text-white">
    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 transition-all group-hover:border-blue-500/50">
      {icon}
    </div>
    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{text}</span>
  </div>
);

export default UserDashboard;
