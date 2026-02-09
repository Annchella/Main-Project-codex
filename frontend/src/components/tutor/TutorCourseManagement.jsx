import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Plus, Edit, Trash2, CheckCircle,
    Clock, AlertCircle, Layers,
    Users, ExternalLink, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const TutorCourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await api.get("/courses/my");
                setCourses(res.data);
            } catch (err) {
                console.error("Failed to fetch courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const handleDelete = async (courseId) => {
        if (!window.confirm("Are you sure you want to delete this course?")) return;
        try {
            await api.delete(`/courses/${courseId}`);
            setCourses(courses.filter(c => c._id !== courseId));
        } catch (err) {
            alert("Failed to delete course");
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "approved": return "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
            case "rejected": return "bg-red-500/10 border-red-500/20 text-red-400";
            default: return "bg-orange-500/10 border-orange-500/20 text-orange-400";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "approved": return <CheckCircle className="w-3 h-3" />;
            case "rejected": return <AlertCircle className="w-3 h-3" />;
            default: return <Clock className="w-3 h-3" />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <main className="max-w-7xl mx-auto px-6">
                <header className="mb-12 flex justify-between items-end gap-6 flex-wrap">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                            Course <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Management</span>
                        </h1>
                        <p className="text-slate-400">Manage your curriculum, track approvals, and build your legacy.</p>
                    </div>
                    <button
                        onClick={() => navigate("/tutor/create-course")}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
                    >
                        <Plus className="w-5 h-5" /> CREATE NEW COURSE
                    </button>
                </header>

                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid gap-6">
                        {courses.map((course) => (
                            <div key={course._id} className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center hover:bg-slate-800/60 transition-colors">
                                <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden shrink-0 border border-slate-700">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} className="w-full h-full object-cover" alt={course.title} />
                                    ) : (
                                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-700">
                                            <Layers className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${getStatusStyle(course.status)}`}>
                                            {getStatusIcon(course.status)}
                                            {course.status}
                                        </span>
                                        <span className="text-slate-500 text-xs font-bold font-mono tracking-tighter">ID: {course._id.slice(-8)}</span>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{course.title}</h3>
                                    <p className="text-slate-400 text-sm line-clamp-1 mb-6">{course.description}</p>

                                    <div className="flex flex-wrap gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        <div className="flex items-center gap-2 group/metric hover:text-blue-400 transition-colors">
                                            <Layers className="w-4 h-4 text-blue-500" />
                                            <span>{course.modules?.length || 0} Modules</span>
                                        </div>
                                        <div className="flex items-center gap-2 group/metric hover:text-emerald-400 transition-colors">
                                            <Users className="w-4 h-4 text-emerald-500" />
                                            <span className="text-emerald-500 font-black">{course.studentCount || 0} Students</span>
                                        </div>
                                        <div className="flex items-center gap-2 group/metric hover:text-white transition-colors">
                                            <CheckCircle className="w-4 h-4 text-slate-500" />
                                            <span>{course.isApproved ? "Public" : "Private (Hidden)"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                                    <button
                                        onClick={() => navigate(`/tutor/courses/${course._id}/player`)}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 border border-slate-700 text-slate-200 font-bold rounded-xl hover:bg-slate-800 transition-all text-xs"
                                    >
                                        PREVIEW <ExternalLink className="w-3.5 h-3.5" />
                                    </button>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate(`/tutor/courses/${course._id}/edit`)}
                                            className="flex-1 p-3 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-600/20 transition-all"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(course._id)}
                                            className="flex-1 p-3 bg-red-600/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-600/20 transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/20 rounded-[3rem] border border-dashed border-slate-800">
                        <Layers className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">You haven't created any courses yet.</h3>
                        <button
                            onClick={() => navigate("/tutor/create-course")}
                            className="mt-6 text-blue-400 font-bold hover:underline"
                        >
                            Create your first course now
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default TutorCourseManagement;
