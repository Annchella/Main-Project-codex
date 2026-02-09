import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Trash2, Edit, Eye,
    ShieldCheck, User,
    Layers, Search,
    ChevronRight, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";

const AdminCourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get("/admin/courses");
            setCourses(res.data);
        } catch (err) {
            console.error("Failed to fetch all courses");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm("CRITICAL ACTION: Are you sure you want to delete this course? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/courses/${courseId}`);
            setCourses(courses.filter(c => c._id !== courseId));
            alert("Course purged from system.");
        } catch (err) {
            alert("Operation failed.");
        }
    };

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.tutor?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#020617] text-white py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            <ShieldCheck className="w-4 h-4" />
                            Content Audit Core
                        </div>
                        <h1 className="text-5xl font-black tracking-tight uppercase italic leading-none">
                            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Course List</span>
                        </h1>
                    </div>

                    <div className="relative group w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH GLOBAL REPOSITORY..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900/40 border border-slate-800 py-3.5 pl-12 pr-6 rounded-2xl outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all text-xs font-black tracking-widest uppercase"
                        />
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center p-20">
                        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] overflow-hidden backdrop-blur-3xl">
                        <div className="grid grid-cols-12 gap-4 px-10 py-6 border-b border-slate-800 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                            <div className="col-span-5">Identity & Detail</div>
                            <div className="col-span-3">Tutor Source</div>
                            <div className="col-span-2">Security Status</div>
                            <div className="col-span-2 text-right">Direct Control</div>
                        </div>

                        <div className="divide-y divide-slate-800/30">
                            {filteredCourses.map((course) => (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    key={course._id}
                                    className="grid grid-cols-12 gap-4 px-10 py-8 items-center hover:bg-slate-800/30 transition-colors"
                                >
                                    <div className="col-span-5 flex gap-6 items-center">
                                        <div className="w-24 h-14 bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shrink-0">
                                            <img src={course.thumbnail} className="w-full h-full object-cover opacity-60" alt="" />
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-100 uppercase italic tracking-tighter leading-tight mb-1">{course.title}</div>
                                            <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 tracking-widest uppercase">
                                                <Layers className="w-3 h-3" /> {course.modules?.length || 0} Units • ₹{course.price}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="flex items-center gap-3 mb-1">
                                            <div className="w-6 h-6 rounded-lg bg-blue-500/20 flex items-center justify-center text-[10px] font-black text-blue-400">
                                                {course.tutor?.name?.[0]}
                                            </div>
                                            <span className="text-sm font-bold text-slate-300">{course.tutor?.name}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-600 font-black uppercase tracking-tighter ml-9 truncate">{course.tutor?.email}</div>
                                    </div>

                                    <div className="col-span-2">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${course.isApproved
                                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                                                : "bg-orange-500/10 border-orange-500/20 text-orange-400"
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${course.isApproved ? "bg-emerald-400 animate-pulse" : "bg-orange-400"}`}></div>
                                            {course.isApproved ? "SYNDICATED" : "IN REVIEW"}
                                        </span>
                                    </div>

                                    <div className="col-span-2 flex justify-end gap-3">
                                        <button
                                            className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl hover:bg-blue-500/20 transition-all"
                                            title="External Audit View"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
                                            className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl hover:bg-red-500/20 transition-all"
                                            title="Purge Data"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCourseManagement;
