import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  FileText,
  Plus,
  Trash2,
  Save,
  Eye,
  Download,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  GraduationCap,
  Award,
  Terminal,
  Globe,
  Link as LinkIcon,
  Layout,
  CheckCircle2,
  Moon,
  Sun,
  Palette
} from "lucide-react";
import api from "../../services/api";

const ResumeBuilder = () => {
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("classic");

  const [resumeData, setResumeData] = useState({
    title: "My Professional Resume",
    personal: {
      name: "",
      email: "",
      phone: "",
      summary: "",
      location: "",
      website: "",
      linkedin: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certificates: [],
    template: "classic",
  });

  const [currentExp, setCurrentExp] = useState({ company: "", role: "", startDate: "", endDate: "", description: "" });
  const [currentEdu, setCurrentEdu] = useState({ institution: "", degree: "", year: "" });
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentProject, setCurrentProject] = useState({ title: "", link: "", description: "" });
  const [currentCert, setCurrentCert] = useState({ name: "", issuer: "", date: "" });

  const handlePersonalChange = (e) => {
    setResumeData({
      ...resumeData,
      personal: { ...resumeData.personal, [e.target.name]: e.target.value },
    });
  };

  const addItem = (type, currentItem, setCurrentItem, validateFields) => {
    if (validateFields.every(field => currentItem[field])) {
      setResumeData({
        ...resumeData,
        [type]: [...resumeData[type], currentItem],
      });
      setCurrentItem(typeof currentItem === 'string' ? "" : Object.keys(currentItem).reduce((acc, key) => ({ ...acc, [key]: "" }), {}));
    }
  };

  const removeItem = (type, index) => {
    setResumeData({
      ...resumeData,
      [type]: resumeData[type].filter((_, i) => i !== index),
    });
  };

  const saveResume = async () => {
    setLoading(true);
    try {
      await api.post("/resumes", {
        ...resumeData,
        template: activeTemplate,
        userId: localStorage.getItem("userId"),
      });
      alert("Resume saved successfully!");
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Personal Details", icon: <User className="w-5 h-5" /> },
    { title: "Work Experience", icon: <Briefcase className="w-5 h-5" /> },
    { title: "Education", icon: <GraduationCap className="w-5 h-5" /> },
    { title: "Skills", icon: <Terminal className="w-5 h-5" /> },
    { title: "Projects", icon: <Globe className="w-5 h-5" /> },
    { title: "Certificates", icon: <Award className="w-5 h-5" /> },
  ];

  const templates = [
    { id: "classic", name: "Classic Serif", desc: "Traditional academic layout", icon: <FileText className="w-4 h-4" /> },
    { id: "modern", name: "Modern Minimal", desc: "Clean & contemporary", icon: <Layout className="w-4 h-4" /> },
    { id: "creative", name: "Creative Edge", desc: "Bold & high-impact", icon: <Palette className="w-4 h-4" /> },
    { id: "tech", name: "Tech Focused", desc: "Optimized for developers", icon: <Terminal className="w-4 h-4" /> },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", name: "name", icon: User, placeholder: "John Doe" },
                { label: "Email Address", name: "email", icon: Mail, placeholder: "john@example.com" },
                { label: "Phone Number", name: "phone", icon: Phone, placeholder: "+1 234 567 890" },
                { label: "Location", name: "location", icon: Globe, placeholder: "New York, USA" },
                { label: "Website/Portfolio", name: "website", icon: Globe, placeholder: "portfolio.com" },
                { label: "LinkedIn", name: "linkedin", icon: LinkIcon, placeholder: "linkedin.com/in/johndoe" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-semibold text-slate-400">{field.label}</label>
                  <div className="relative">
                    <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      name={field.name}
                      value={resumeData.personal[field.name]}
                      onChange={handlePersonalChange}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder={field.placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400">Professional Summary</label>
              <textarea
                name="summary"
                value={resumeData.personal.summary}
                onChange={handlePersonalChange}
                rows="4"
                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Briefly describe your career goals and key achievements..."
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Company" value={currentExp.company} onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
                <input type="text" placeholder="Role" value={currentExp.role} onChange={(e) => setCurrentExp({ ...currentExp, role: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
                <input type="text" placeholder="Start Date" value={currentExp.startDate} onChange={(e) => setCurrentExp({ ...currentExp, startDate: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
                <input type="text" placeholder="End Date" value={currentExp.endDate} onChange={(e) => setCurrentExp({ ...currentExp, endDate: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
              </div>
              <textarea placeholder="Description" value={currentExp.description} onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" rows="2" />
              <button onClick={() => addItem('experience', currentExp, setCurrentExp, ['company', 'role'])} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Add Experience</button>
            </div>
            <div className="space-y-3">
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                  <div><h4 className="font-bold text-white">{exp.role}</h4><p className="text-xs text-slate-400">{exp.company} | {exp.startDate} - {exp.endDate}</p></div>
                  <button onClick={() => removeItem('experience', i)} className="text-red-400 hover:text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Institution" value={currentEdu.institution} onChange={(e) => setCurrentEdu({ ...currentEdu, institution: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
                <input type="text" placeholder="Degree" value={currentEdu.degree} onChange={(e) => setCurrentEdu({ ...currentEdu, degree: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
                <input type="text" placeholder="Year" value={currentEdu.year} onChange={(e) => setCurrentEdu({ ...currentEdu, year: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
              </div>
              <button onClick={() => addItem('education', currentEdu, setCurrentEdu, ['institution', 'degree'])} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Add Education</button>
            </div>
            <div className="space-y-3">
              {resumeData.education.map((edu, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                  <div><h4 className="font-bold text-white">{edu.degree}</h4><p className="text-xs text-slate-400">{edu.institution} | {edu.year}</p></div>
                  <button onClick={() => removeItem('education', i)} className="text-red-400 hover:text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Skill (e.g. React, Python)"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && currentSkill && (setResumeData({ ...resumeData, skills: [...resumeData.skills, currentSkill] }), setCurrentSkill(""))}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none"
              />
              <button onClick={() => currentSkill && (setResumeData({ ...resumeData, skills: [...resumeData.skills, currentSkill] }), setCurrentSkill(""))} className="px-6 bg-blue-600 rounded-xl font-bold"><Plus className="w-5 h-5" /></button>
            </div>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold flex items-center gap-2">
                  {skill}
                  <button onClick={() => removeItem('skills', i)}><Trash2 className="w-3 h-3 text-red-400" /></button>
                </span>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-4">
              <input type="text" placeholder="Project Title" value={currentProject.title} onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
              <input type="text" placeholder="Project Link (Optional)" value={currentProject.link} onChange={(e) => setCurrentProject({ ...currentProject, link: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
              <textarea placeholder="Description" value={currentProject.description} onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" rows="2" />
              <button onClick={() => addItem('projects', currentProject, setCurrentProject, ['title'])} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Add Project</button>
            </div>
            <div className="space-y-3">
              {resumeData.projects.map((proj, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                  <div><h4 className="font-bold text-white">{proj.title}</h4>{proj.link && <p className="text-[10px] text-blue-400">{proj.link}</p>}</div>
                  <button onClick={() => removeItem('projects', i)} className="text-red-400 hover:text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 space-y-4">
              <input type="text" placeholder="Certificate Name" value={currentCert.name} onChange={(e) => setCurrentCert({ ...currentCert, name: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Issuer" value={currentCert.issuer} onChange={(e) => setCurrentCert({ ...currentCert, issuer: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
                <input type="text" placeholder="Date" value={currentCert.date} onChange={(e) => setCurrentCert({ ...currentCert, date: e.target.value })} className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-4 text-white outline-none" />
              </div>
              <button onClick={() => addItem('certificates', currentCert, setCurrentCert, ['name', 'issuer'])} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"><Plus className="w-5 h-5" /> Add Certificate</button>
            </div>
            <div className="space-y-3">
              {resumeData.certificates.map((cert, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/50 border border-slate-800 p-4 rounded-xl">
                  <div><h4 className="font-bold text-white">{cert.name}</h4><p className="text-xs text-slate-400">{cert.issuer} | {cert.date}</p></div>
                  <button onClick={() => removeItem('certificates', i)} className="text-red-400 hover:text-red-500 p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderClassicPreview = () => (
    <div className="bg-white p-12 text-slate-900 shadow-2xl font-serif">
      <div className="border-b-4 border-slate-900 pb-8 mb-8 text-center uppercase">
        <h1 className="text-5xl font-black tracking-tighter mb-2">{resumeData.personal.name || "YOUR NAME"}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-bold text-slate-600 tracking-widest">
          <span>{resumeData.personal.email}</span>
          {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
          {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
          {resumeData.personal.website && <span>• {resumeData.personal.website}</span>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-12">
        <div className="col-span-1 space-y-8">
          <section>
            <h2 className="text-xs font-black border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-[0.3em]">Profile</h2>
            <p className="text-[11px] leading-relaxed italic text-slate-700">{resumeData.personal.summary || "Summary goes here..."}</p>
          </section>
          {resumeData.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-black border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-[0.3em]">Expertise</h2>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {resumeData.skills.map((s, i) => <span key={i} className="text-[10px] font-bold text-slate-600">[{s}]</span>)}
              </div>
            </section>
          )}
          {resumeData.education.length > 0 && (
            <section>
              <h2 className="text-xs font-black border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-[0.3em]">Foundation</h2>
              <div className="space-y-4">
                {resumeData.education.map((edu, i) => (
                  <div key={i}>
                    <h4 className="font-black text-[10px]">{edu.institution}</h4>
                    <p className="text-[9px] text-slate-500">{edu.degree} | {edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="col-span-2 space-y-8">
          {resumeData.experience.length > 0 && (
            <section>
              <h2 className="text-xs font-black border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-[0.3em]">Professional History</h2>
              <div className="space-y-6">
                {resumeData.experience.map((exp, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h4 className="font-black text-sm uppercase">{exp.role}</h4>
                      <span className="text-[9px] font-bold text-slate-400">{exp.startDate} — {exp.endDate}</span>
                    </div>
                    <p className="text-blue-600 font-bold text-[10px] uppercase mb-2">{exp.company}</p>
                    <p className="text-[10px] text-slate-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
          {resumeData.projects.length > 0 && (
            <section>
              <h2 className="text-xs font-black border-l-4 border-blue-600 pl-3 mb-4 uppercase tracking-[0.3em]">Core Projects</h2>
              <div className="space-y-4">
                {resumeData.projects.map((proj, i) => (
                  <div key={i}>
                    <h4 className="font-black text-[10px]">{proj.title} <span className="text-blue-500 font-normal ml-2">{proj.link}</span></h4>
                    <p className="text-[10px] text-slate-700">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );

  const renderModernPreview = () => (
    <div className="bg-[#f8fafc] text-slate-900 shadow-2xl font-sans overflow-hidden flex min-h-[1000px]">
      <div className="w-1/3 bg-[#1e293b] text-white p-10 space-y-10">
        <div className="space-y-4">
          <div className="w-24 h-24 bg-blue-500 rounded-3xl mb-6"></div>
          <h1 className="text-3xl font-black leading-none">{resumeData.personal.name || "Name"}</h1>
          <p className="text-blue-400 text-xs font-bold tracking-widest uppercase">Specialist</p>
        </div>
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Contact</h2>
          <div className="space-y-2 text-[10px] text-slate-400">
            <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {resumeData.personal.email}</p>
            <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {resumeData.personal.phone}</p>
            <p className="flex items-center gap-2"><Globe className="w-3 h-3" /> {resumeData.personal.location}</p>
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((s, i) => <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[9px] font-bold">{s}</span>)}
          </div>
        </section>
      </div>
      <div className="w-2/3 p-12 space-y-12">
        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="h-1 w-8 bg-blue-500"></div> Experience
          </h2>
          <div className="space-y-8">
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="relative pl-6 border-l border-slate-200">
                <div className="absolute -left-[5px] top-0 w-[9px] h-[9px] bg-blue-500 rounded-full"></div>
                <h4 className="font-black text-sm">{exp.role}</h4>
                <p className="text-slate-500 text-[10px] font-bold mb-2">{exp.company} • {exp.startDate}-{exp.endDate}</p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
            <div className="h-1 w-8 bg-blue-500"></div> Education
          </h2>
          <div className="grid grid-cols-2 gap-6">
            {resumeData.education.map((edu, i) => (
              <div key={i} className="p-4 bg-slate-100 rounded-2xl">
                <h4 className="font-black text-[10px]">{edu.degree}</h4>
                <p className="text-[9px] text-slate-500">{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderTechPreview = () => (
    <div className="bg-[#0f172a] text-slate-300 shadow-2xl font-mono p-12 text-xs leading-relaxed">
      <div className="mb-12">
        <p className="text-blue-500 font-bold mb-2"># Root Directory</p>
        <h1 className="text-4xl font-black text-white uppercase italic">/{resumeData.personal.name?.replace(/\s+/g, '_').toLowerCase() || "user"}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-[10px] uppercase">
          <p className="text-slate-500">_email: <span className="text-emerald-400">{resumeData.personal.email}</span></p>
          <p className="text-slate-500">_tel: <span className="text-emerald-400">{resumeData.personal.phone}</span></p>
          <p className="text-slate-500">_status: <span className="text-blue-400">ACTIVE</span></p>
          <p className="text-slate-500">_node: <span className="text-blue-400">{resumeData.personal.location}</span></p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <p className="text-blue-500 font-bold mb-4">// System Summary</p>
          <p className="border-l-2 border-slate-800 pl-6 italic">{resumeData.personal.summary}</p>
        </section>

        <section>
          <p className="text-blue-500 font-bold mb-4">// Main Modules (Experience)</p>
          <div className="space-y-8">
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="group">
                <div className="flex justify-between border-b border-slate-800 pb-2 mb-3">
                  <h4 className="text-white font-black">{exp.role} @ {exp.company}</h4>
                  <span className="text-slate-500">[{exp.startDate} - {exp.endDate}]</span>
                </div>
                <p className="opacity-80">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="text-blue-500 font-bold mb-4">// Technical Stack</p>
          <div className="grid grid-cols-4 gap-3">
            {resumeData.skills.map((s, i) => <div key={i} className="p-3 bg-slate-900 border border-slate-800 text-center text-blue-400 font-bold uppercase">{s}</div>)}
          </div>
        </section>
      </div>
    </div>
  );

  const renderPreview = () => {
    switch (activeTemplate) {
      case "modern": return renderModernPreview();
      case "tech": return renderTechPreview();
      default: return renderClassicPreview();
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4 italic">
              <div className="p-3 bg-blue-600 rounded-3xl shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                <FileText className="w-8 h-8 text-white" />
              </div>
              FORGE<span className="text-blue-500">RESUME</span>
            </h1>
            <p className="text-slate-500 mt-2 font-black uppercase tracking-[0.3em] text-[10px]">Neural Interface v4.0.1</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border ${previewMode ? "bg-white text-black border-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:border-blue-500"
                }`}
            >
              {previewMode ? <Terminal className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? "Edit Logic" : "View Alpha"}
            </button>
            <button
              onClick={saveResume}
              disabled={loading}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 shadow-[0_0_25px_rgba(37,99,235,0.3)] transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? "Syncing..." : "Push Target"}
            </button>
          </div>
        </div>

        {!previewMode ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Stepper Navigation */}
            <div className="lg:col-span-3 space-y-3">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Module Sequence</div>
              {steps.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i + 1)}
                  className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all relative overflow-hidden group ${step === i + 1
                    ? "bg-blue-600/10 border-blue-500 text-blue-400"
                    : "bg-slate-900/50 border-slate-800 text-slate-500 hover:border-slate-700"
                    }`}
                >
                  <div className={`p-2.5 rounded-xl transition-colors ${step === i + 1 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-800 group-hover:bg-slate-700"}`}>
                    {s.icon}
                  </div>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-50 mb-1">Module 0{i + 1}</span>
                    <span className="font-black uppercase italic tracking-tighter text-sm">{s.title}</span>
                  </div>
                  {step === i + 1 && <div className="absolute right-4"><CheckCircle2 className="w-4 h-4 text-blue-500" /></div>}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className="lg:col-span-9 space-y-8">
              <div className="bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-10 backdrop-blur-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                  {steps[step - 1].icon && React.cloneElement(steps[step - 1].icon, { className: "w-64 h-64 rotate-12" })}
                </div>
                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-800/50">
                  <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">{steps[step - 1].title}</h2>
                    <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mt-1">Populating environment data</p>
                  </div>
                  <div className="flex gap-3">
                    <button disabled={step === 1} onClick={() => setStep(step - 1)} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 disabled:opacity-30 transition-all"><ChevronLeft className="w-5 h-5" /></button>
                    <button disabled={step === steps.length} onClick={() => setStep(step + 1)} className="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 disabled:opacity-30 transition-all"><ChevronRight className="w-5 h-5" /></button>
                  </div>
                </div>
                {renderStep()}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">Skin Selection</h3>
                <div className="space-y-4">
                  {templates.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setActiveTemplate(t.id)}
                      className={`w-full p-4 rounded-2xl border transition-all text-left flex items-start gap-3 group ${activeTemplate === t.id ? "bg-blue-600 border-blue-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}
                    >
                      <div className={`p-2 rounded-lg ${activeTemplate === t.id ? "bg-white text-blue-600" : "bg-slate-800 group-hover:bg-slate-700"}`}>{t.icon}</div>
                      <div className="flex flex-col">
                        <span className={`text-xs font-black uppercase italic ${activeTemplate === t.id ? "text-white" : "text-slate-300"}`}>{t.name}</span>
                        <span className={`text-[8px] font-bold uppercase tracking-widest ${activeTemplate === t.id ? "text-blue-200" : "text-slate-500"}`}>{t.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-blue-600/10 border border-blue-500/20 rounded-3xl">
                <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <Palette className="w-3 h-3" /> Rendering Engine
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">All templates are optimized for ATS parsers and high-resolution printing.</p>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative rounded-[2.5rem] overflow-hidden">
                  {renderPreview()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes zoom-in { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
        .animate-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .zoom-in { animation: zoom-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        * { scroll-behavior: smooth; }
        selection { background: rgba(37, 99, 235, 0.3); color: white; }
      `}} />
    </div>
  );
};

export default ResumeBuilder;
