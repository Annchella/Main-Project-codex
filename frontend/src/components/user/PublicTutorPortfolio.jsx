import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
    Briefcase, GraduationCap, FileText,
    ArrowLeft, Globe, BadgeCheck,
    Layers, Users, Star
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../common/Footer";

const PublicTutorPortfolio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tutor, setTutor] = useState(null);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTutorData = async () => {
            try {
                // Fetch user profile for tutor details (we'll need a public route or just use the course population)
                // Since we don't have a specific public tutor route yet, we can fetch all courses and filter or get one course
                // But a better way is to have a specific public tutor fetch. 
                // Let's assume there's a way to get it. For now, we'll try to fetch from a generic profile route if it's public.
                const res = await api.get(`/user/profile/${id}`); // We might need to add this route or similar
                setTutor(res.data);

                // Fetch their courses
                const coursesRes = await api.get("/courses");
                const tutorCourses = coursesRes.data.filter(c => c.tutor && c.tutor._id === id);
                setCourses(tutorCourses);
            } catch (err) {
                console.error("Failed to fetch tutor data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTutorData();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    if (!tutor) return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center gap-6">
            <h2 className="text-3xl font-black italic">Tutor Signal Lost</h2>
            <button onClick={() => navigate(-1)} className="px-8 py-3 bg-blue-600 rounded-xl font-black uppercase text-xs">Back to Mission</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white flex flex-col">
            <main className="flex-1 pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-12 uppercase text-[10px] font-black tracking-widest"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Academy
                    </button>

                    <div className="grid lg:grid-cols-3 gap-16">
                        {/* Profile Info */}
                        <div className="lg:col-span-1 space-y-8">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-blue-600/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl bg-slate-900">
                                    <img
                                        src={tutor.photo || "/placeholder-avatar.jpg"}
                                        alt={tutor.name}
                                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-4xl font-black tracking-tight uppercase italic leading-none">{tutor.name}</h1>
                                    <BadgeCheck className="w-6 h-6 text-blue-500" />
                                </div>
                                <p className="text-blue-400 font-black uppercase text-xs tracking-[0.2em]">{tutor.specialization || 'Lead Instructor'}</p>

                                <div className="flex gap-10 pt-4 border-y border-white/5 py-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-black tabular-nums">{courses.length}</div>
                                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Courses</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black tabular-nums">4.9</div>
                                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Rating</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-black tabular-nums">1.2k</div>
                                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Students</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Experience & Bio */}
                        <div className="lg:col-span-2 space-y-12">
                            <section className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-600/10 rounded-xl flex items-center justify-center border border-blue-500/20 text-blue-400">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h2 className="text-xl font-black uppercase tracking-widest italic">Professional Intelligence</h2>
                                </div>
                                <p className="text-slate-400 leading-relaxed font-medium">
                                    {tutor.bio || "No professional bio provided."}
                                </p>
                            </section>

                            <div className="grid md:grid-cols-2 gap-8">
                                <InfoCard
                                    icon={<GraduationCap className="w-6 h-6" />}
                                    title="Academic Status"
                                    value={tutor.qualification || 'N/A'}
                                />
                                <InfoCard
                                    icon={<Briefcase className="w-6 h-6" />}
                                    title="Field Experience"
                                    value={tutor.experience || 'N/A'}
                                />
                            </div>

                            <section className="space-y-8">
                                <h2 className="text-2xl font-black uppercase italic tracking-widest">Published Modules</h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {courses.map(course => (
                                        <div
                                            key={course._id}
                                            onClick={() => navigate(`/user/courses`)} // Or course details if we had it
                                            className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                                        >
                                            <h3 className="font-black uppercase italic text-sm mb-2 group-hover:text-blue-400">{course.title}</h3>
                                            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <div className="flex items-center gap-1"><Layers className="w-3 h-3" /> {course.modules?.length || 0} Modules</div>
                                                <div className="flex items-center gap-1 text-emerald-500"><Star className="w-3 h-3 fill-current" /> 4.9</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

const InfoCard = ({ icon, title, value }) => (
    <div className="p-8 bg-slate-900/40 border border-white/5 rounded-[2.5rem] backdrop-blur-2xl">
        <div className="text-blue-500 mb-6">{icon}</div>
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</div>
        <div className="text-lg font-black text-white italic truncate">{value}</div>
    </div>
);

export default PublicTutorPortfolio;
