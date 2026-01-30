import React from "react";
import Navbar from "../common/Navbar";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Video, Users,
  PlusCircle, LayoutDashboard,
  Settings, ArrowRight, Play,
  BarChart3, Award
} from "lucide-react";

const TutorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              Professional Instructor Portal
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight">
              Empower the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                Next Generation
              </span>
              <br /> of Engineers.
            </h1>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Create, manage, and scale your educational footprint. Use our live coding tools to provide an immersive learning experience for students worldwide.
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => navigate("/tutor/create-course")}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl shadow-lg shadow-blue-600/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                Launch New Course <PlusCircle className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/code-room")}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 hover:border-slate-600 transition-all active:scale-95"
              >
                Go to Code Room
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070"
              alt="Tutor"
              className="relative rounded-[2rem] border border-slate-700 object-cover aspect-video shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-6 right-6 p-4 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 flex items-center gap-4 transition-transform duration-500 group-hover:-translate-y-2">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="text-xs font-black text-slate-500 uppercase tracking-widest">Live Now</div>
                <div className="text-sm font-bold">1.2k Students Watching</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tools Section */}
        <section className="pt-20 border-t border-slate-800/50">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Instructor Toolkit</h2>
              <p className="text-slate-500 max-w-md">Everything you need to manage your courses and interact with your community.</p>
            </div>
            <button className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-[0.2em] hover:text-blue-300 transition-colors">
              View All Tools <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureItem
              icon={<LayoutDashboard className="w-8 h-8 text-blue-400" />}
              title="Course Management"
              desc="Update content, track approval status, and manage modules."
              onClick={() => navigate("/tutor/manage-courses")}
              color="from-blue-500/10 to-transparent"
            />
            <FeatureItem
              icon={<BarChart3 className="w-8 h-8 text-purple-400" />}
              title="Performance Stats"
              desc="Track enrollment trends and revenue performance."
              onClick={() => navigate("/tutor/purchases")}
              color="from-purple-500/10 to-transparent"
            />
            <FeatureItem
              icon={<Video className="w-8 h-8 text-pink-400" />}
              title="Live Masterclass"
              desc="Schedule and launch real-time collaborative coding sessions."
              onClick={() => navigate("/tutor/schedule-live-class")}
              color="from-pink-500/10 to-transparent"
            />
            <FeatureItem
              icon={<Award className="w-8 h-8 text-emerald-400" />}
              title="Certificates"
              desc="Issue verifiable certificates for course completion."
              onClick={() => { }}
              color="from-emerald-500/10 to-transparent"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc, onClick, color }) => (
  <div
    onClick={onClick}
    className={`group p-8 rounded-[2rem] bg-gradient-to-b ${color} border border-slate-800/50 hover:border-slate-700 hover:bg-slate-800/20 transition-all cursor-pointer flex flex-col items-center text-center`}
  >
    <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform duration-500">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default TutorDashboard;
