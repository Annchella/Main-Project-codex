import React, { useState } from "react";
import api from "../../services/api";
import {
  PlusCircle, BookOpen, IndianRupee,
  Image as ImageIcon, AlignLeft,
  ChevronRight, Sparkles, ShieldCheck,
  Plus, Trash2, Video, FileText,
  ChevronDown, ChevronUp, Layers
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CreateCourse = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail: "",
    modules: []
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkApproval = async () => {
      try {
        const res = await api.get("/user/profile");
        if (!res.data.isApprovedTutor) {
          alert("Your tutor profile must be approved by an administrator before you can create courses. Redirecting to portfolio...");
          navigate("/tutor/portfolio");
        }
      } catch (err) {
        console.error("Failed to verify tutor status");
        navigate("/tutor");
      }
    };
    checkApproval();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Module/Lesson Management
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
    if (!form.title || !form.description || !form.price) {
      alert("Please fill in all required fields.");
      return;
    }

    // Curriculum Validation
    const hasEmptyTitles = form.modules.some(m => !m.title.trim() || m.lessons.some(l => !l.title.trim()));
    if (hasEmptyTitles) {
      alert("Validation Error: All sections and lessons must have titles.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/courses", form);
      alert("Course submitted for approval! 🎉");
      navigate("/tutor/manage-courses");
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || "Failed to create course";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans pb-20">
      <main className="max-w-5xl mx-auto px-6">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Course Builder
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-2 uppercase italic tracking-widest">
            Design Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Curriculum</span>
          </h1>
          <p className="text-slate-500 font-medium">Build a structured learning experience for your students.</p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Basic Info */}
          <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl space-y-8">
            <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm">1</span>
              Basic Info
            </h2>

            <div className="grid gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Course Title</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Fullstack React & Node.js"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-bold"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Description</label>
                <textarea
                  name="description"
                  placeholder="What will students learn?..."
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={form.price}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-bold"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Thumbnail URL</label>
                  <input
                    type="text"
                    name="thumbnail"
                    placeholder="https://..."
                    value={form.thumbnail}
                    onChange={handleChange}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-800 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Curriculum Builder */}
          <div className="bg-slate-900/40 border border-slate-800 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl shadow-2xl space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm">2</span>
                Curriculum Builder
              </h2>
              <button
                type="button"
                onClick={addModule}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl transition-all active:scale-95 text-xs shadow-lg shadow-blue-900/20"
              >
                <Plus className="w-4 h-4" /> ADD SECTION
              </button>
            </div>

            <div className="space-y-8">
              {form.modules.map((mod, mIdx) => (
                <div key={mIdx} className="bg-slate-950/50 border border-slate-800 rounded-[2rem] overflow-hidden">
                  <div className="p-6 bg-slate-900/50 border-b border-slate-800 flex items-center gap-4">
                    <span className="text-xs font-black text-slate-600 uppercase">Section {mIdx + 1}</span>
                    <input
                      type="text"
                      placeholder="Section Title (e.g. Introduction)"
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
                            <Video className="w-3 h-3" /> Lesson {lIdx + 1}
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
                            placeholder="Lesson Title"
                            value={lesson.title}
                            onChange={(e) => handleLessonChange(mIdx, lIdx, 'title', e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                          <input
                            type="text"
                            placeholder="YouTube Video URL (e.g. https://youtu.be/...)"
                            value={lesson.videoUrl}
                            onChange={(e) => handleLessonChange(mIdx, lIdx, 'videoUrl', e.target.value)}
                            className="bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>
                        <textarea
                          placeholder="Lesson description or notes..."
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
                      <PlusCircle className="w-4 h-4" /> ADD LESSON TO SECTION {mIdx + 1}
                    </button>
                  </div>
                </div>
              ))}

              {form.modules.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-[3rem] text-slate-700">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-full mb-4">
                    <Layers className="w-8 h-8 opacity-20" />
                  </div>
                  <p className="font-bold">No sections added yet.</p>
                  <p className="text-sm">Click "ADD SECTION" to start building your course.</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-8 bg-blue-500/5 border border-blue-500/10 rounded-[2.5rem]">
            <div className="flex items-center gap-4 text-sm text-blue-400 font-bold">
              <ShieldCheck className="w-10 h-10 opacity-20" />
              <p className="max-w-xs leading-tight">Your course will be verified for curriculum quality before being published.</p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="group flex items-center gap-4 px-12 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:bg-slate-800 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
              {loading ? "PROCESSING..." : "SUBMIT FOR APPROVAL"}
              {!loading && <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateCourse;
