import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Video, Clock, User, ExternalLink, Calendar } from "lucide-react";

const LiveClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveClasses = async () => {
      try {
        const res = await api.get("/live-classes/upcoming");
        setClasses(res.data);
      } catch (error) {
        console.error("Error fetching live classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveClasses();
  }, []);

  const canJoin = (schedule) => {
    const classTime = new Date(schedule).getTime();
    const currentTime = new Date().getTime();
    const diff = (classTime - currentTime) / (1000 * 60); // Difference in minutes
    return diff <= 5; // Enable 5 minutes before
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-blue-500 selection:text-white">

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <header className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Live Classes</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
            Join interactive sessions with industry experts. Level up your coding skills with real-time mentorship and Q&A.
          </p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((cls) => (
              <ClassCard key={cls._id} cls={cls} canJoin={canJoin} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-800/30 rounded-3xl border border-slate-800">
            <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-300">No upcoming classes scheduled</h3>
            <p className="text-slate-500 mt-2">Check back later for new sessions!</p>
          </div>
        )}
      </main>
    </div>
  );
};

const ClassCard = ({ cls, canJoin }) => {
  const isJoinable = canJoin(cls.schedule);
  const formattedDate = new Date(cls.schedule).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const formattedTime = new Date(cls.schedule).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 hover:border-blue-500/30 overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <Video className="w-6 h-6" />
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${isJoinable ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"}`}>
            {isJoinable ? "● LIVE NOW" : "UPCOMING"}
          </div>
        </div>

        <h3 className="text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-400 transition-colors">
          {cls.title || cls.course?.title || "Live Masterclass"}
        </h3>

        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <User className="w-4 h-4 text-blue-400" />
            <span>{cls.tutor?.name || "Expert Mentor"}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Clock className="w-4 h-4 text-pink-400" />
            <span>{formattedTime}</span>
          </div>
        </div>

        <div className="mt-auto">
          {isJoinable ? (
            <a
              href={cls.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
            >
              Join Meet <ExternalLink className="w-4 h-4" />
            </a>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-slate-700/50 text-slate-500 font-semibold rounded-xl border border-slate-700 cursor-not-allowed flex items-center justify-center gap-2"
            >
              Starts Soon <Clock className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveClasses;
