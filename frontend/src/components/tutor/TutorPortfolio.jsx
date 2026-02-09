import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
    User, Briefcase, GraduationCap,
    FileText, Camera, Upload,
    CheckCircle, Clock, AlertTriangle,
    ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

const TutorPortfolio = () => {
    const [formData, setFormData] = useState({
        qualification: "",
        experience: "",
        bio: "",
        specialization: "",
        photo: "",
    });
    const [status, setStatus] = useState("not_submitted");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/user/profile");
                setFormData({
                    qualification: res.data.qualification || "",
                    experience: res.data.experience || "",
                    bio: res.data.bio || "",
                    specialization: res.data.specialization || "",
                    photo: res.data.photo || "",
                });
                setStatus(res.data.tutorStatus || "not_submitted");
            } catch (err) {
                console.error("Failed to fetch profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/user/portfolio", formData);
            setStatus("pending");
            alert("Portfolio submitted for approval!");
        } catch (err) {
            alert("Failed to submit portfolio");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-400">
                            <User className="w-8 h-8" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight uppercase italic">Tutor <span className="text-blue-500">Portfolio</span></h1>
                            <p className="text-slate-500 text-sm font-medium">Build your professional identity on the platform</p>
                        </div>
                    </motion.div>

                    {/* Status Banner */}
                    <div className={`p-6 rounded-[2rem] border backdrop-blur-xl flex items-center justify-between gap-6 ${status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20' :
                            status === 'pending' ? 'bg-blue-500/10 border-blue-500/20' :
                                status === 'rejected' ? 'bg-red-500/10 border-red-500/20' :
                                    'bg-slate-900/40 border-slate-800'
                        }`}>
                        <div className="flex items-center gap-4">
                            {status === 'approved' ? <CheckCircle className="w-10 h-10 text-emerald-500" /> :
                                status === 'pending' ? <Clock className="w-10 h-10 text-blue-500 animate-pulse" /> :
                                    status === 'rejected' ? <AlertTriangle className="w-10 h-10 text-red-500" /> :
                                        <FileText className="w-10 h-10 text-slate-500" />}
                            <div>
                                <h3 className="text-lg font-black uppercase italic leading-none mb-1">
                                    {status === 'approved' ? 'Profile Verified' :
                                        status === 'pending' ? 'Verification Pending' :
                                            status === 'rejected' ? 'Action Required' :
                                                'Incomplete Portfolio'}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">
                                    {status === 'approved' ? 'Your profile is approved. You can now create and manage courses.' :
                                        status === 'pending' ? 'Admin is reviewing your credentials. This usually takes 24-48 hours.' :
                                            status === 'rejected' ? 'Your portfolio was not approved. Please review and resubmit.' :
                                                'Submit your details to enable course creation capabilities.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8 bg-slate-900/40 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-2xl">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <GraduationCap className="w-3 h-3" /> Highest Qualification
                            </label>
                            <input
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                placeholder="e.g. M.Tech in Computer Science"
                                className="w-full bg-slate-950/50 border border-slate-800 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white font-medium"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Briefcase className="w-3 h-3" /> Years of Experience
                            </label>
                            <input
                                name="experience"
                                value={formData.experience}
                                onChange={handleChange}
                                placeholder="e.g. 8+ Years in Software Engineering"
                                className="w-full bg-slate-950/50 border border-slate-800 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <ArrowRight className="w-3 h-3" /> Professional Specialization
                        </label>
                        <input
                            name="specialization"
                            value={formData.specialization}
                            onChange={handleChange}
                            placeholder="e.g. Full Stack Development, AI/ML Expert"
                            className="w-full bg-slate-950/50 border border-slate-800 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Camera className="w-3 h-3" /> Profile Photo URL
                        </label>
                        <div className="relative group">
                            <Upload className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 transition-colors" />
                            <input
                                name="photo"
                                value={formData.photo}
                                onChange={handleChange}
                                placeholder="Paste direct image link..."
                                className="w-full bg-slate-950/50 border border-slate-800 py-4 pl-16 pr-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white font-medium"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                            <FileText className="w-3 h-3" /> Professional Bio
                        </label>
                        <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows="6"
                            placeholder="Share your technical journey and teaching philosophy..."
                            className="w-full bg-slate-950/50 border border-slate-800 py-4 px-6 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white font-medium resize-none"
                            required
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={saving || status === 'pending'}
                        className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-900/20 hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100"
                    >
                        {saving ? "SYNCING DATA..." : status === 'pending' ? "UNDER REVIEW" : "UPDATE PORTFOLIO"}
                        {!saving && status !== 'pending' && <ArrowRight className="w-5 h-5" />}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TutorPortfolio;
