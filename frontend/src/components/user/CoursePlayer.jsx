import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
    Play, CheckCircle, ChevronRight, ChevronLeft,
    BookOpen, Layers, Video, FileText, Star, AlertCircle
} from "lucide-react";
import ChatBox from "../common/ChatBox";

const CoursePlayer = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${courseId}`);
                setCourse(res.data);
                if (res.data.modules?.[0]?.lessons?.[0]) {
                    const firstLesson = res.data.modules[0].lessons[0];
                    setActiveLesson(firstLesson);
                }
            } catch (err) {
                console.error("Failed to fetch course details", err);
                setError(err.response?.data?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [courseId]);

    const handleLessonSelect = (lesson) => {
        setActiveLesson(lesson);
    };

    // Utility to get YouTube Embed URL
    const getEmbedUrl = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11)
            ? `https://www.youtube.com/embed/${match[2]}`
            : url;
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">Access Restricted</h1>
                <p className="text-slate-400 mb-8 font-medium">{error}</p>
                <button
                    onClick={() => navigate('/user/courses')}
                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl transition-all active:scale-95"
                >
                    BROWSE COURSES
                </button>
            </div>
        </div>
    );

    if (!course) return <div className="p-20 text-center text-white">Course not found.</div>;

    return (
        <div className="h-screen bg-slate-950 text-white font-sans flex flex-col overflow-hidden">
            <div className="flex-1 flex overflow-hidden">
                {/* LEFT: Sidebar Navigation */}
                <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto custom-scrollbar">
                    <div className="p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 z-20 backdrop-blur-md">
                        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Curriculum</h2>
                        <h3 className="font-bold text-lg leading-tight truncate text-blue-400">{course.title}</h3>
                    </div>

                    <div className="flex-1">
                        {course.modules?.map((module, mIdx) => (
                            <div key={mIdx} className="border-b border-slate-800 last:border-0">
                                <div className="px-6 py-4 bg-slate-800/20 font-black text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Layers className="w-3 h-3 text-blue-500" />
                                    {module.title || `Module ${mIdx + 1}`}
                                </div>
                                <div className="py-1">
                                    {module.lessons?.map((lesson, lIdx) => (
                                        <button
                                            key={lIdx}
                                            onClick={() => handleLessonSelect(lesson)}
                                            className={`w-full px-6 py-4 flex items-center gap-3 text-left transition-all ${activeLesson?.title === lesson.title ? 'bg-blue-600/10 border-l-4 border-blue-500 text-blue-400' : 'text-slate-400 hover:bg-slate-800/30'}`}
                                        >
                                            {activeLesson?.title === lesson.title ? <Play className="w-3.5 h-3.5 fill-current" /> : <Video className="w-3.5 h-3.5 opacity-30" />}
                                            <span className="text-sm font-bold tracking-tight">{lesson.title}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* MIDDLE: Content Area */}
                <main className="flex-1 flex flex-col relative bg-[#020617]">
                    {/* Header with Title */}
                    <div className="px-8 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30 backdrop-blur-xl sticky top-0 z-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 shadow-lg shadow-blue-900/10">
                                <Video className="w-4 h-4" />
                            </div>
                            <h1 className="font-black text-white tracking-tight text-lg">{activeLesson?.title || "Select a lesson"}</h1>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-lg">
                            <Star className="w-3 h-3 fill-current animate-pulse" /> Live Session
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        {/* Video Player */}
                        <div className="w-full max-w-5xl mx-auto mt-8 aspect-video bg-black relative group shadow-2xl rounded-3xl overflow-hidden border border-slate-800">
                            {activeLesson?.videoUrl ? (
                                <iframe
                                    src={getEmbedUrl(activeLesson.videoUrl)}
                                    className="w-full h-full"
                                    title="Lesson Video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-800 bg-slate-950">
                                    <Video className="w-16 h-16 mb-4 opacity-5" />
                                    <p className="font-black text-xs uppercase tracking-widest opacity-20">Stream unavailable for this unit</p>
                                </div>
                            )}
                        </div>

                        {/* Lesson Text Content */}
                        <div className="p-12 max-w-5xl mx-auto">
                            <h2 className="text-sm font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                                <FileText className="w-4 h-4 text-blue-500" /> Lesson Intel
                            </h2>
                            <div className="text-slate-400 leading-relaxed whitespace-pre-wrap text-lg font-medium">
                                {activeLesson?.textContent || "Enjoy the lesson. Use the sidebar to navigate through the curriculum."}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Navigation Footer */}
            <footer className="h-20 bg-slate-900/50 backdrop-blur-xl border-t border-slate-800 px-10 flex justify-between items-center z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                <button className="flex items-center gap-2 text-slate-500 hover:text-white transition-all text-xs font-black uppercase tracking-widest group">
                    <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Prev Unit
                </button>
                <div className="flex items-center gap-4">
                    <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full w-1/3 shadow-[0_0_10px_rgba(37,99,235,0.3)]"></div>
                    </div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">In Progress</span>
                </div>
                <button className="flex items-center gap-2 px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-xs font-black uppercase tracking-widest transition-all group">
                    Next Unit <ChevronRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                </button>
            </footer>

            {/* Float Chat for Doubts */}
            {course && (
                <ChatBox
                    courseId={course._id || course.id}
                    courseTitle={course.title}
                    tutorId={course.tutor?._id || course.tutor}
                    tutorName={course.tutor?.name || "Instructor"}
                    studentId={localStorage.getItem("userId")}
                    studentName={localStorage.getItem("name") || "Student"}
                    isTutor={false}
                />
            )}
        </div>
    );
};

export default CoursePlayer;
