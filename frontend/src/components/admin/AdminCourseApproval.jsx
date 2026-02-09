import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Check, X, Eye,
    ShieldCheck, AlertCircle,
    User, Calendar, Layers
} from "lucide-react";

const AdminCourseApproval = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPending = async () => {
            try {
                const res = await api.get("/courses/pending");
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch pending courses");
            } finally {
                setLoading(false);
            }
        };
        fetchPending();
    }, []);

    const handleDecision = async (courseId, status) => {
        try {
            await api.patch(`/courses/${courseId}/approve`, { status });
            setCourses(courses.filter(c => c._id !== courseId));
        } catch (err) {
            alert("Failed to update course status");
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <main className="max-w-6xl mx-auto px-6">
                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Administrative Portal
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                        Pending <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Approvals</span>
                    </h1>
                    <p className="text-slate-400">Review and verify new educational content before it goes live.</p>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm">
                        <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-800/50 border-b border-slate-700/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                            <div className="col-span-5">Course Details</div>
                            <div className="col-span-3">Tutor Info</div>
                            <div className="col-span-2">Date Submitted</div>
                            <div className="col-span-2 text-right">Actions</div>
                        </div>

                        <div className="divide-y divide-slate-800/50">
                            {courses.map((course) => (
                                <div key={course._id} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-slate-800/30 transition-colors">
                                    <div className="col-span-5 flex gap-4 items-center">
                                        <div className="w-20 h-12 bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                                            <img src={course.thumbnail} className="w-full h-full object-cover opacity-60" alt="" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-200 leading-tight mb-1">{course.title}</div>
                                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 tracking-tighter uppercase">
                                                <Layers className="w-3 h-3" /> {course.modules?.length || 0} Modules • ₹{course.price}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-span-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400 uppercase">
                                                {course.tutor?.name?.[0]}
                                            </div>
                                            <span className="text-sm font-semibold text-slate-300">{course.tutor?.name}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium ml-8 truncate">{course.tutor?.email}</div>
                                    </div>

                                    <div className="col-span-2 text-xs font-mono text-slate-500">
                                        {new Date(course.createdAt).toLocaleDateString()}
                                    </div>

                                    <div className="col-span-2 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleDecision(course._id, "approved")}
                                            className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl hover:bg-emerald-500/20 transition-all shadow-lg shadow-emerald-500/5"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDecision(course._id, "rejected")}
                                            className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all shadow-lg shadow-red-500/5"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-800/20 rounded-[3rem] border border-dashed border-slate-800">
                        <ShieldCheck className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">All caught up!</h3>
                        <p className="text-slate-600 mt-2">No pending courses awaiting approval.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminCourseApproval;
