import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Users, BookOpen, Calendar, Search,
    Filter, ArrowRight, UserCheck,
    GraduationCap, Mail, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TutorEnrollments = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const { data } = await api.get("/enrollments/tutor");
                setEnrollments(data);
            } catch (err) {
                console.error("Failed to fetch tutor enrollments", err);
            } finally {
                setLoading(false);
            }
        };
        fetchEnrollments();
    }, []);

    const filteredEnrollments = enrollments.filter(e =>
        e.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
            <main className="max-w-7xl mx-auto px-6 pb-20">
                {/* Header Section */}
                <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <UserCheck className="w-3.5 h-3.5" />
                            Student Intelligence Directory
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black tracking-tighter uppercase italic leading-none"
                        >
                            Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Enrollments</span>
                        </motion.h1>
                        <p className="text-slate-500 font-medium max-w-md">Manage your academic footprint and track student acquisition across your modules.</p>
                    </div>

                    <div className="w-full md:w-96 relative group">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-400 transition-colors">
                            <Search className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="SEARCH ENROLLEES..."
                            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-6 text-xs font-black tracking-widest uppercase focus:outline-none focus:border-blue-500/50 focus:bg-slate-900 transition-all placeholder:text-slate-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <StatCard icon={<Users />} label="Total Students" value={enrollments.length} color="blue" />
                    <StatCard icon={<GraduationCap />} label="Unique Courses" value={new Set(enrollments.map(e => e.course?._id)).size} color="indigo" />
                    <StatCard icon={<Clock />} label="Recent (24h)" value={enrollments.filter(e => new Date(e.createdAt) > new Date(Date.now() - 86400000)).length} color="emerald" />
                    <StatCard icon={<UserCheck />} label="Verified" value={enrollments.length} color="cyan" />
                </div>

                {/* Enrollment List */}
                {loading ? (
                    <div className="grid gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-slate-900/40 border border-slate-800 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {filteredEnrollments.length > 0 ? (
                                filteredEnrollments.map((enrollee, index) => (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={enrollee._id}
                                        className="group relative flex flex-col lg:flex-row items-center gap-8 bg-slate-900/30 border border-slate-800/50 rounded-[2rem] p-6 hover:bg-slate-900/60 hover:border-blue-500/20 transition-all duration-500"
                                    >
                                        <div className="flex items-center gap-6 flex-1">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 flex items-center justify-center text-xl font-black text-blue-500 shadow-xl group-hover:scale-105 transition-transform duration-500">
                                                {enrollee.user?.name?.[0].toUpperCase()}
                                            </div>
                                            <div className="space-y-1">
                                                <h3 className="text-xl font-black uppercase italic tracking-tight">{enrollee.user?.name}</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                        <Mail className="w-3 h-3" /> {enrollee.user?.email}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="h-px lg:h-12 w-full lg:w-px bg-slate-800/50" />

                                        <div className="flex-1 space-y-2">
                                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Enrolled Module</div>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-800 shrink-0">
                                                    <img
                                                        src={enrollee.course?.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=200"}
                                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                                        alt="Course"
                                                    />
                                                </div>
                                                <span className="text-sm font-bold text-slate-300 uppercase leading-snug">{enrollee.course?.title}</span>
                                            </div>
                                        </div>

                                        <div className="h-px lg:h-12 w-full lg:w-px bg-slate-800/50" />

                                        <div className="flex flex-col items-start lg:items-end space-y-1 shrink-0">
                                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Access Granted</div>
                                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" /> {new Date(enrollee.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>

                                        <button className="p-4 bg-slate-950/50 border border-slate-800 rounded-2xl hover:bg-white hover:text-black transition-all group-hover:translate-x-1 duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="py-32 text-center bg-slate-950/30 rounded-[4rem] border border-dashed border-slate-800/50"
                                >
                                    <Users className="w-20 h-20 text-slate-800 mx-auto mb-6 opacity-20" />
                                    <h3 className="text-xl font-black text-slate-600 uppercase italic tracking-widest">No Student Protocols Found</h3>
                                    <p className="text-slate-700 mt-2 font-bold uppercase text-[10px]">Adjust your parameters or wait for new acquisition nodes.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </div>
    );
};

const StatCard = ({ icon, label, value, color }) => {
    const colors = {
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
        emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    };

    return (
        <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-3xl backdrop-blur-xl">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${colors[color]}`}>
                {React.cloneElement(icon, { className: "w-5 h-5" })}
            </div>
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">{label}</div>
            <div className="text-2xl font-black italic tracking-tighter">{value}</div>
        </div>
    );
};

export default TutorEnrollments;
