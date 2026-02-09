import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Check, X, Eye,
    ShieldCheck, User,
    Briefcase, GraduationCap,
    Mail, MapPin, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AdminTutorApproval = () => {
    const [tutors, setTutors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTutor, setSelectedTutor] = useState(null);

    useEffect(() => {
        fetchPendingTutors();
    }, []);

    const fetchPendingTutors = async () => {
        try {
            const res = await api.get("/admin/tutors/pending");
            setTutors(res.data);
        } catch (err) {
            console.error("Failed to fetch pending tutors");
        } finally {
            setLoading(false);
        }
    };

    const handleDecision = async (tutorId, status) => {
        try {
            await api.patch(`/admin/tutors/${tutorId}/approve`, { status });
            setTutors(tutors.filter(t => t._id !== tutorId));
            setSelectedTutor(null);
            alert(`Tutor ${status} successfully`);
        } catch (err) {
            alert("Failed to update tutor status");
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        <ShieldCheck className="w-4 h-4" />
                        Platform Authority
                    </div>
                    <h1 className="text-5xl font-black tracking-tight uppercase italic leading-none">
                        Tutor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Verification</span>
                    </h1>
                </header>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : tutors.length > 0 ? (
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            {tutors.map((tutor) => (
                                <motion.div
                                    layoutId={tutor._id}
                                    key={tutor._id}
                                    onClick={() => setSelectedTutor(tutor)}
                                    className={`p-6 rounded-[2.5rem] border transition-all cursor-pointer group ${selectedTutor?._id === tutor._id
                                            ? "bg-blue-600/10 border-blue-500/50"
                                            : "bg-slate-900/40 border-slate-800 hover:border-slate-700"
                                        }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-800 shrink-0">
                                            <img src={tutor.photo || "/placeholder-avatar.jpg"} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-black uppercase italic leading-none mb-2 group-hover:text-blue-400 transition-colors">{tutor.name}</h3>
                                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {tutor.experience}</span>
                                                <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {tutor.email}</span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Eye className="w-6 h-6 text-blue-500" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Detail View */}
                        <div className="hidden lg:block">
                            <AnimatePresence mode="wait">
                                {selectedTutor ? (
                                    <motion.div
                                        key={selectedTutor._id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="sticky top-24 bg-slate-900/60 border border-slate-800 rounded-[3rem] p-10 backdrop-blur-3xl overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-10 opacity-5">
                                            <ShieldCheck className="w-40 h-40" />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="flex items-end gap-6 mb-10">
                                                <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-2 border-blue-500/30 shadow-2xl">
                                                    <img src={selectedTutor.photo} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div className="pb-2">
                                                    <h2 className="text-3xl font-black uppercase italic leading-none mb-2">{selectedTutor.name}</h2>
                                                    <div className="text-blue-400 text-xs font-black uppercase tracking-widest">{selectedTutor.specialization}</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-6 mb-10">
                                                <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                                                    <GraduationCap className="w-6 h-6 text-purple-500 mb-3" />
                                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Qualification</div>
                                                    <div className="text-sm font-bold text-slate-200">{selectedTutor.qualification}</div>
                                                </div>
                                                <div className="p-6 bg-slate-950/50 rounded-3xl border border-slate-800/50">
                                                    <Briefcase className="w-6 h-6 text-orange-500 mb-3" />
                                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Experience</div>
                                                    <div className="text-sm font-bold text-slate-200">{selectedTutor.experience}</div>
                                                </div>
                                            </div>

                                            <div className="mb-10">
                                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    Professional Biography
                                                </div>
                                                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                                    {selectedTutor.bio}
                                                </p>
                                            </div>

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleDecision(selectedTutor._id, "approved")}
                                                    className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20"
                                                >
                                                    <Check className="w-5 h-5" /> APPROVE ENTRY
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(selectedTutor._id, "rejected")}
                                                    className="flex-1 py-4 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-black rounded-2xl flex items-center justify-center gap-3 transition-all"
                                                >
                                                    <X className="w-5 h-5" /> REJECT SIGNAL
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center p-20 bg-slate-900/20 border border-dashed border-slate-800 rounded-[3rem]">
                                        <User className="w-16 h-16 text-slate-800 mb-4" />
                                        <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">Select a tutor to review</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-32 bg-slate-900/20 rounded-[4rem] border border-dashed border-slate-800/50">
                        <ShieldCheck className="w-24 h-24 text-slate-800 mx-auto mb-8 opacity-20" />
                        <h3 className="text-2xl font-black text-slate-600 uppercase italic tracking-widest">No Pending Signatures</h3>
                        <p className="text-slate-700 mt-4 font-bold">The neural network is currently synchronized. All tutors verified.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTutorApproval;
