import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
    Save, BookOpen, IndianRupee,
    Image as ImageIcon, AlignLeft,
    ChevronRight, Sparkles, ShieldCheck,
    Plus, Trash2, Video, FileText,
    ChevronDown, ChevronUp, Layers,
    ArrowLeft
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const EditCourse = () => {
    const { id } = useParams();
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        thumbnail: "",
        modules: []
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await api.get(`/courses/${id}`);
                setForm({
                    title: res.data.title || "",
                    description: res.data.description || "",
                    price: res.data.price || "",
                    thumbnail: res.data.thumbnail || "",
                    modules: res.data.modules || []
                });
            } catch (err) {
                console.error("Failed to fetch course");
                alert("Could not load course data");
                navigate("/tutor/manage-courses");
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id, navigate]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const addModule = () => {
        setForm({
            ...form,
            modules: [...form.modules, { title: "", lessons: [] }]
        });
    };

    const removeModule = (mIdx) => {
        const newModules = form.modules.filter((_, i) => i !== mIdx);
        setForm({ ...form, modules: newModules });
    };

    const handleModuleTitleChange = (mIdx, val) => {
        const newModules = [...form.modules];
        newModules[mIdx].title = val;
        setForm({ ...form, modules: newModules });
    };

    const addLesson = (mIdx) => {
        const newModules = [...form.modules];
        newModules[mIdx].lessons.push({ title: "", videoUrl: "", textContent: "" });
        setForm({ ...form, modules: newModules });
    };

    const removeLesson = (mIdx, lIdx) => {
        const newModules = [...form.modules];
        newModules[mIdx].lessons = newModules[mIdx].lessons.filter((_, i) => i !== lIdx);
        setForm({ ...form, modules: newModules });
    };

    const handleLessonChange = (mIdx, lIdx, field, val) => {
        const newModules = [...form.modules];
        newModules[mIdx].lessons[lIdx][field] = val;
        setForm({ ...form, modules: newModules });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Curriculum Validation
        const hasEmptyTitles = form.modules.some(m => !m.title.trim() || m.lessons.some(l => !l.title.trim()));
        if (hasEmptyTitles) {
            alert("Validation Error: All sections and lessons must have titles.");
            return;
        }

        try {
            setSaving(true);
            await api.put(`/courses/${id}`, form);
            alert("Course updated and submitted for re-approval! 🎉");
            navigate("/tutor/manage-courses");
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || "Failed to update course";
            alert(errorMsg);
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
        <div className="min-h-screen bg-[#020617] text-white font-sans pb-20">
            <main className="max-w-5xl mx-auto px-6 pt-10">
                <header className="mb-12">
                    <button
                        onClick={() => navigate("/tutor/manage-courses")}
                        className="flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors text-xs font-black tracking-widest uppercase"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Terminal
                    </button>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <Layers className="w-3.5 h-3.5" />
                        Curriculum Editor
                    </div>
                    <h1 className="text-5xl font-black tracking-tight mb-2 uppercase italic tracking-widest">
                        Refine Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Expertise</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Updating: "{form.title}"</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl space-y-8">
                        <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">1</span>
                            Intel Adjustment
                        </h2>

                        <div className="grid gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Meta Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-bold"
                                    required
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Core Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dataset Cost (₹)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Thumbnail Stream</label>
                                    <input
                                        type="text"
                                        name="thumbnail"
                                        value={form.thumbnail}
                                        onChange={handleChange}
                                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">2</span>
                                Structure Reconfiguration
                            </h2>
                            <button
                                type="button"
                                onClick={addModule}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all active:scale-95 text-xs shadow-lg shadow-blue-900/20"
                            >
                                <Plus className="w-4 h-4" /> NEW SECTION
                            </button>
                        </div>

                        <div className="space-y-8">
                            {form.modules.map((mod, mIdx) => (
                                <div key={mIdx} className="bg-slate-950/50 border border-slate-800 rounded-[2rem] overflow-hidden border-l-4 border-blue-500">
                                    <div className="p-6 bg-slate-900/50 border-b border-slate-800 flex items-center gap-4">
                                        <span className="text-xs font-black text-slate-600 uppercase">Sector {mIdx + 1}</span>
                                        <input
                                            type="text"
                                            placeholder="e.g. Master Class Sync"
                                            value={mod.title}
                                            onChange={(e) => handleModuleTitleChange(mIdx, e.target.value)}
                                            className="flex-1 bg-transparent border-none outline-none text-lg font-bold text-white placeholder:text-slate-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeModule(mIdx)}
                                            className="text-red-500/50 hover:text-red-500 transition-colors p-2"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="p-6 space-y-4 bg-slate-900/20">
                                        {mod.lessons.map((lesson, lIdx) => (
                                            <div key={lIdx} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase">
                                                        <Video className="w-3 h-3 text-blue-400" /> Unit {lIdx + 1}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeLesson(mIdx, lIdx)}
                                                        className="text-slate-600 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="Unit Identifier"
                                                        value={lesson.title}
                                                        onChange={(e) => handleLessonChange(mIdx, lIdx, 'title', e.target.value)}
                                                        className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Video Stream Link"
                                                        value={lesson.videoUrl}
                                                        onChange={(e) => handleLessonChange(mIdx, lIdx, 'videoUrl', e.target.value)}
                                                        className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                    />
                                                </div>
                                                <textarea
                                                    placeholder="Intel and annotations..."
                                                    value={lesson.textContent}
                                                    onChange={(e) => handleLessonChange(mIdx, lIdx, 'textContent', e.target.value)}
                                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                    rows="2"
                                                />
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => addLesson(mIdx)}
                                            className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600 hover:text-blue-500 hover:border-blue-500/30 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                                        >
                                            <Plus className="w-4 h-4" /> ATTACH UNIT TO SECTOR {mIdx + 1}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-indigo-500/5 border border-indigo-500/10 rounded-[3rem]">
                        <div className="flex items-center gap-4 text-sm text-indigo-400 font-bold">
                            <ShieldCheck className="w-12 h-12 opacity-30" />
                            <p className="max-w-xs leading-tight uppercase tracking-tighter italic">Re-submitting will trigger a fresh security audit of the curriculum content.</p>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="group flex items-center gap-4 px-16 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:bg-slate-800 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95 text-lg"
                        >
                            {saving ? "UPLOADING DATA..." : "SYNC REVISIONS"}
                            {!saving && <Save className="w-6 h-6" />}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default EditCourse;
