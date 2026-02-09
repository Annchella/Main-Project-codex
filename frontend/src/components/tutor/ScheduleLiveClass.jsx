import React, { useState } from "react";
import api from "../../services/api";
import { Video, Calendar, Link as LinkIcon, Send, CheckCircle } from "lucide-react";

const ScheduleLiveClass = () => {
  const [form, setForm] = useState({
    title: "",
    meetingLink: "",
    schedule: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      await api.post("/live-classes/create", form);
      setSuccess(true);
      setForm({ title: "", meetingLink: "", schedule: "" });
    } catch (error) {
      console.error("Failed to create live class:", error);
      alert("Failed to schedule class. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      <main className="max-w-3xl mx-auto px-6 font-sans">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
            <Video className="w-4 h-4" />
            Tutor Portal
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Schedule <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Live Class</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            Fill in the details below to schedule a new live session for your students.
          </p>
        </header>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
          {/* Decorative Blur */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

          {success && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400 animate-in fade-in slide-in-from-top-4">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Live class scheduled successfully! Students can now see it.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Class Title</label>
              <div className="relative">
                <Send className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  name="title"
                  value={form.title}
                  placeholder="e.g. Advanced JavaScript Masterclass"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Meeting Link</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  name="meetingLink"
                  value={form.meetingLink}
                  placeholder="Google Meet or Zoom URL"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-600"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Schedule Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="datetime-local"
                  name="schedule"
                  value={form.schedule}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Schedule Live Session"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ScheduleLiveClass;
