import React, { useState, useEffect } from "react";
import {
  User, Mail, Phone, FileText, Plus, Trash2, Save, Eye,
  Download, ChevronRight, ChevronLeft, Briefcase, GraduationCap,
  Award, Terminal, Globe, Link as LinkIcon, Layout, CheckCircle2,
  Printer, ArrowLeft, Loader2
} from "lucide-react";
import api from "../../services/api";

const ResumeBuilder = () => {
  const [step, setStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("classic");
  const [savedResumes, setSavedResumes] = useState([]);
  const [activeResumeId, setActiveResumeId] = useState(null);

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
      jobTitle: "",
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
      setResumeData(prev => ({
        ...prev,
        [type]: [...prev[type], currentItem],
      }));
      setCurrentItem(typeof currentItem === 'string' ? "" : Object.keys(currentItem).reduce((acc, key) => ({ ...acc, [key]: "" }), {}));
    } else {
      alert(`Please fill in at least the ${validateFields.join(' and ')} fields before adding.`);
    }
  };

  const removeItem = (type, index) => {
    setResumeData({
      ...resumeData,
      [type]: resumeData[type].filter((_, i) => i !== index),
    });
  };

  useEffect(() => {
    fetchSavedResumes();
  }, []);

  const fetchSavedResumes = async () => {
    try {
      const response = await api.get("/resumes/user");
      setSavedResumes(response.data);
    } catch (error) {
      console.error("Error fetching resumes:", error);
    }
  };

  const loadResume = (resume) => {
    setResumeData(resume);
    setActiveResumeId(resume._id);
    setActiveTemplate(resume.template || "classic");
    setPreviewMode(false);
    alert(`Loaded draft: ${resume.title}`);
  };

  const saveResume = async () => {
    setLoading(true);
    try {
      const payload = {
        ...resumeData,
        template: activeTemplate,
      };

      if (activeResumeId) {
        await api.put(`/resumes/${activeResumeId}`, payload);
        alert("Resume updated successfully!");
      } else {
        const response = await api.post("/resumes", payload);
        setActiveResumeId(response.data._id);
        alert("Resume saved as new draft!");
      }
      fetchSavedResumes();
    } catch (error) {
      console.error("Error saving resume:", error);
      alert("Failed to save resume.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  const steps = [
    { title: "Personal Details", icon: <User className="w-5 h-5" /> },
    { title: "Experience", icon: <Briefcase className="w-5 h-5" /> },
    { title: "Education", icon: <GraduationCap className="w-5 h-5" /> },
    { title: "Skills", icon: <Terminal className="w-5 h-5" /> },
    { title: "Projects", icon: <Globe className="w-5 h-5" /> },
    { title: "Certificates", icon: <Award className="w-5 h-5" /> },
  ];

  const templates = [
    { id: "classic", name: "Executive Classic" },
    { id: "modern", name: "Modern Professional" },
    { id: "tech", name: "Technical Minimal" },
  ];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Resume Draft Name</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                <input
                  type="text"
                  value={resumeData.title}
                  onChange={(e) => setResumeData({ ...resumeData, title: e.target.value })}
                  className="w-full bg-slate-900 border border-blue-500/20 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-700 font-bold"
                  placeholder="e.g. Software Engineer Resume 2024"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", name: "name", icon: User, placeholder: "John Doe" },
                { label: "Job Title", name: "jobTitle", icon: Briefcase, placeholder: "Full Stack Developer" },
                { label: "Email Address", name: "email", icon: Mail, placeholder: "john@example.com" },
                { label: "Phone Number", name: "phone", icon: Phone, placeholder: "+1 234 567 890" },
                { label: "Location", name: "location", icon: Globe, placeholder: "New York, USA" },
                { label: "Website/Portfolio", name: "website", icon: Globe, placeholder: "portfolio.com" },
                { label: "LinkedIn", name: "linkedin", icon: LinkIcon, placeholder: "linkedin.com/in/johndoe" },
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">{field.label}</label>
                  <div className="relative">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      name={field.name}
                      value={resumeData.personal[field.name]}
                      onChange={handlePersonalChange}
                      className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-700"
                      placeholder={field.placeholder}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">Professional Summary</label>
              <textarea
                name="summary"
                value={resumeData.personal.summary}
                onChange={handlePersonalChange}
                rows="5"
                className="w-full bg-slate-900 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-700"
                placeholder="Briefly describe your career objectives and success metrics..."
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Company Name" value={currentExp.company} onChange={(v) => setCurrentExp({ ...currentExp, company: v })} />
                <Input placeholder="Job Title" value={currentExp.role} onChange={(v) => setCurrentExp({ ...currentExp, role: v })} />
                <Input placeholder="Start Date" value={currentExp.startDate} onChange={(v) => setCurrentExp({ ...currentExp, startDate: v })} />
                <Input placeholder="End Date (or 'Present')" value={currentExp.endDate} onChange={(v) => setCurrentExp({ ...currentExp, endDate: v })} />
              </div>
              <textarea
                placeholder="Bullet points of achievements..."
                value={currentExp.description}
                onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                rows="3"
              />
              <button
                onClick={() => addItem('experience', currentExp, setCurrentExp, ['company', 'role'])}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Append Experience
              </button>
            </div>
            <div className="space-y-4">
              {resumeData.experience.map((exp, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/60 border border-white/5 p-6 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-white uppercase italic">{exp.role}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                  </div>
                  <button onClick={() => removeItem('experience', i)} className="text-slate-500 hover:text-red-500 transition-colors p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Institution" value={currentEdu.institution} onChange={(v) => setCurrentEdu({ ...currentEdu, institution: v })} />
                <Input placeholder="Degree / Certificate" value={currentEdu.degree} onChange={(v) => setCurrentEdu({ ...currentEdu, degree: v })} />
                <Input placeholder="Graduation Year" value={currentEdu.year} onChange={(v) => setCurrentEdu({ ...currentEdu, year: v })} />
              </div>
              <button onClick={() => addItem('education', currentEdu, setCurrentEdu, ['institution', 'degree'])} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Add Academic Level
              </button>
            </div>
            <div className="space-y-4">
              {resumeData.education.map((edu, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/60 border border-white/5 p-6 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-white uppercase italic">{edu.degree}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{edu.institution} • {edu.year}</p>
                  </div>
                  <button onClick={() => removeItem('education', i)} className="text-slate-500 hover:text-red-500 transition-colors p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="e.g. React.js, Strategic Planning, Python"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && currentSkill && (setResumeData({ ...resumeData, skills: [...resumeData.skills, currentSkill] }), setCurrentSkill(""))}
                className="flex-1 bg-slate-900 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
              <button
                onClick={() => currentSkill && (setResumeData({ ...resumeData, skills: [...resumeData.skills, currentSkill] }), setCurrentSkill(""))}
                className="px-8 bg-blue-600 hover:bg-blue-500 rounded-2xl text-white font-black"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              {resumeData.skills.map((skill, i) => (
                <span key={i} className="px-5 py-2 bg-blue-500/5 border border-blue-500/20 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                  {skill}
                  <button onClick={() => removeItem('skills', i)} className="hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </span>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 space-y-6">
              <Input placeholder="Project Title" value={currentProject.title} onChange={(v) => setCurrentProject({ ...currentProject, title: v })} />
              <Input placeholder="Project URL (Optional)" value={currentProject.link} onChange={(v) => setCurrentProject({ ...currentProject, link: v })} />
              <textarea
                placeholder="Key deliverables and technologies..."
                value={currentProject.description}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
                rows="3"
              />
              <button onClick={() => addItem('projects', currentProject, setCurrentProject, ['title'])} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Catalog Project
              </button>
            </div>
            <div className="space-y-4">
              {resumeData.projects.map((proj, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/60 border border-white/5 p-6 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-white uppercase italic">{proj.title}</h4>
                    {proj.link && <p className="text-[9px] text-blue-400 font-bold uppercase">{proj.link}</p>}
                  </div>
                  <button onClick={() => removeItem('projects', i)} className="text-slate-500 hover:text-red-500 transition-colors p-2"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-8">
            <div className="bg-slate-900/40 p-8 rounded-3xl border border-white/5 space-y-6">
              <Input placeholder="Credential Name" value={currentCert.name} onChange={(v) => setCurrentCert({ ...currentCert, name: v })} />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Issuing Organization" value={currentCert.issuer} onChange={(v) => setCurrentCert({ ...currentCert, issuer: v })} />
                <Input placeholder="Date Issued" value={currentCert.date} onChange={(v) => setCurrentCert({ ...currentCert, date: v })} />
              </div>
              <button onClick={() => addItem('certificates', currentCert, setCurrentCert, ['name', 'issuer'])} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Plus className="w-5 h-5" /> Log Credential
              </button>
            </div>
            <div className="space-y-4">
              {resumeData.certificates.map((cert, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-900/60 border border-white/5 p-6 rounded-2xl">
                  <div>
                    <h4 className="font-bold text-white uppercase italic">{cert.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{cert.issuer} | {cert.date}</p>
                  </div>
                  <button onClick={() => removeItem('certificates', i)} className="text-slate-500 hover:text-red-500 transition-colors p-2"><Trash2 className="w-5 h-5" /></button>
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
    <div id="resume-a4" className="bg-white p-16 text-slate-900 font-serif leading-relaxed min-h-[297mm] w-[210mm] mx-auto shadow-2xl print:shadow-none print:m-0 print:p-12">
      {/* Name and Contact Header */}
      <div className="text-center border-b-2 border-slate-900 pb-6 mb-8">
        <h1 className="text-3xl font-black uppercase tracking-widest mb-1 text-slate-900">{resumeData.personal.name || "YOUR FULL NAME"}</h1>
        {resumeData.personal.jobTitle && <p className="text-[12px] font-bold text-blue-700 uppercase tracking-[0.2em] mb-4">{resumeData.personal.jobTitle}</p>}
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <span>{resumeData.personal.email}</span>
          {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
          {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
          {resumeData.personal.linkedin && <span>• {resumeData.personal.linkedin}</span>}
        </div>
      </div>

      <div className="space-y-8">
        {/* Professional Summary */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] border-b border-slate-200 pb-1.5 mb-3 text-slate-800">Executive Summary</h2>
          <p className="text-[10.5px] leading-relaxed text-slate-700 text-justify">{resumeData.personal.summary || "Strategically focused professional with a background in engineering and project management..."}</p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-[11px] font-black uppercase tracking-[0.25em] border-b border-slate-200 pb-1.5 mb-4 text-slate-800">Professional Experience</h2>
          <div className="space-y-6">
            {resumeData.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-[12px] font-black uppercase text-slate-900">{exp.role}</h4>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">{exp.company}</p>
                  <p className="text-[9px] font-bold text-slate-400 italic">Core Module</p>
                </div>
                <p className="text-[10px] text-slate-700 leading-relaxed whitespace-pre-line pl-2 border-l border-slate-100 italic">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-12">
          {/* Education */}
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] border-b border-slate-200 pb-1.5 mb-4 text-slate-800">Academic History</h2>
            <div className="space-y-4">
              {resumeData.education.map((edu, i) => (
                <div key={i} className="relative pl-3">
                  <div className="absolute left-0 top-1.5 w-1 h-1 bg-slate-400 rounded-full"></div>
                  <h4 className="text-[10.5px] font-black text-slate-800 uppercase leading-tight">{edu.degree}</h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{edu.institution} | {edu.year}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-[11px] font-black uppercase tracking-[0.25em] border-b border-slate-200 pb-1.5 mb-4 text-slate-800">Core Expertise</h2>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {resumeData.skills.map((s, i) => (
                <span key={i} className="text-[9.5px] font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded tracking-wide uppercase">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        {/* Projects / Certificates Grid */}
        <div className="grid grid-cols-2 gap-12">
          {resumeData.projects.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] border-b border-slate-200 pb-1.5 mb-4 text-slate-800">Key Deliverables</h2>
              <div className="space-y-3">
                {resumeData.projects.map((proj, i) => (
                  <div key={i}>
                    <h4 className="text-[10px] font-black uppercase text-slate-800">{proj.title}</h4>
                    <p className="text-[9px] text-slate-600 line-clamp-2 leading-tight">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {resumeData.certificates.length > 0 && (
            <section>
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] border-b border-slate-200 pb-1.5 mb-4 text-slate-800">Verified Credentials</h2>
              <div className="space-y-3">
                {resumeData.certificates.map((cert, i) => (
                  <div key={i}>
                    <h4 className="text-[10px] font-black uppercase text-slate-800">{cert.name}</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">{cert.issuer} | {cert.date}</p>
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
    <div id="resume-a4" className="bg-[#f8fafc] text-slate-900 font-sans min-h-[297mm] w-[210mm] mx-auto shadow-2xl flex overflow-hidden print:shadow-none print:m-0">
      <div className="w-[75mm] bg-[#1e293b] text-white p-10 flex flex-col pt-16 print:pt-10">
        <h1 className="text-3xl font-black leading-tight mb-2 uppercase tracking-tighter">{resumeData.personal.name || "Name"}</h1>
        <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12">{resumeData.personal.jobTitle || "Industry Specialist"}</p>

        <div className="space-y-8">
          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">Direct Lines</h2>
            <div className="space-y-2 text-[10px] text-slate-400 leading-tight">
              <p className="flex items-center gap-2"><Mail className="w-3 h-3" /> {resumeData.personal.email}</p>
              <p className="flex items-center gap-2"><Phone className="w-3 h-3" /> {resumeData.personal.phone}</p>
              <p className="flex items-center gap-2"><Globe className="w-3 h-3" /> {resumeData.personal.location}</p>
            </div>
          </section>

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-4">Core Stack</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((s, i) => <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase">{s}</span>)}
            </div>
          </section>
        </div>
      </div>
      <div className="flex-1 p-16 space-y-12 print:p-10">
        <section>
          <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-blue-600 pl-4 mb-8">Career Trajectory</h2>
          <div className="space-y-10">
            {resumeData.experience.map((exp, i) => (
              <div key={i}>
                <h4 className="font-black text-sm uppercase">{exp.role}</h4>
                <div className="flex items-center gap-2 text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-3">
                  <span>{exp.company}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className="text-slate-500">{exp.startDate} - {exp.endDate}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-black uppercase tracking-tighter border-l-4 border-blue-600 pl-4 mb-8">Qualifications</h2>
          <div className="grid grid-cols-2 gap-6">
            {resumeData.education.map((edu, i) => (
              <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl">
                <h4 className="font-black text-[10px] uppercase text-slate-800">{edu.degree}</h4>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">{edu.institution}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderTechPreview = () => (
    <div id="resume-a4" className="bg-[#0f172a] text-slate-300 font-mono p-16 text-[11px] leading-relaxed min-h-[297mm] w-[210mm] mx-auto shadow-2xl print:shadow-none print:m-0 print:p-10">
      <div className="mb-12 border-b border-slate-800 pb-12">
        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase mb-4">
          /{resumeData.personal.name?.replace(/\s+/g, '_').toLowerCase() || "user"}
        </h1>
        <div className="grid grid-cols-2 gap-y-2 uppercase text-[10px]">
          <p><span className="text-slate-600">contact:</span> <span className="text-blue-400">{resumeData.personal.email}</span></p>
          <p><span className="text-slate-600">tel:</span> <span className="text-blue-400">{resumeData.personal.phone}</span></p>
          <p><span className="text-slate-600">location:</span> <span className="text-blue-400">{resumeData.personal.location}</span></p>
          <p><span className="text-slate-600">role:</span> <span className="text-emerald-500 uppercase">{resumeData.personal.jobTitle || "DEVELOPER"}</span></p>
        </div>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-blue-500 font-black mb-6 uppercase tracking-[0.2em]">// Career_Logic</h2>
          <p className="border-l-2 border-slate-800 pl-8 italic text-slate-400">{resumeData.personal.summary}</p>
        </section>

        <section>
          <h2 className="text-blue-500 font-black mb-8 uppercase tracking-[0.2em]">// Experience_Modules</h2>
          <div className="space-y-10">
            {resumeData.experience.map((exp, i) => (
              <div key={i} className="relative pl-6">
                <div className="absolute left-0 top-0 w-1 h-full bg-slate-800"></div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-white font-black uppercase">{exp.role} @ {exp.company}</h4>
                  <span className="text-slate-600 text-[10px]">[{exp.startDate} - {exp.endDate}]</span>
                </div>
                <p className="text-slate-500 whitespace-pre-line leading-relaxed italic">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-blue-500 font-black mb-8 uppercase tracking-[0.2em]">// Stack_Configuration</h2>
          <div className="flex flex-wrap gap-3">
            {resumeData.skills.map((s, i) => <span key={i} className="px-4 py-2 bg-slate-900 border border-slate-800 text-blue-400 font-black tracking-widest uppercase text-[10px]">{s}</span>)}
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
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      <div className="print:hidden">
        {/* Navbar for Resume Builder */}
        {/* Secondary Header for Resume Builder Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pb-8 border-b border-white/5 pt-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase leading-tight">Professional <span className="text-blue-500">Resume</span></h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Enterprise Builder v2.0</p>
                {activeResumeId && (
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[8px] font-bold rounded-full border border-emerald-500/20 uppercase">Editing Draft</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 w-full md:w-auto">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border ${previewMode ? "bg-white text-black border-white shadow-xl shadow-white/10" : "bg-slate-900 border-white/5 text-slate-500 hover:border-blue-500"}`}
            >
              {previewMode ? <Terminal className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewMode ? "Back to Editor" : "Live Preview"}
            </button>
            <button
              onClick={saveResume}
              className="flex items-center gap-3 px-6 py-3 bg-slate-900 border border-white/5 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-blue-500 transition-all hover:text-white"
            >
              <Save className="w-4 h-4" /> Save Draft
            </button>
            <button
              onClick={downloadPDF}
              className="flex items-center gap-3 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"
            >
              <Printer className="w-4 h-4" /> Export as PDF
            </button>
          </div>
        </div>

        <main className="flex-1 pb-20">
          {!previewMode ? (
            <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-start">
              {/* Sidebar Stepper */}
              <div className="lg:col-span-3 sticky top-40 space-y-4">
                {steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i + 1)}
                    className={`w-full p-6 bg-slate-900/50 border rounded-[2rem] flex items-center gap-4 group transition-all ${step === i + 1 ? "border-blue-500/50 bg-blue-600/5" : "border-white/5 hover:border-white/10"}`}
                  >
                    <div className={`p-3 rounded-2xl ${step === i + 1 ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" : "bg-slate-800 text-slate-600 group-hover:bg-slate-700"}`}>
                      {s.icon}
                    </div>
                    <div className="text-left font-black tracking-tighter uppercase italic">
                      <div className="text-[8px] opacity-30">Selection 0{i + 1}</div>
                      <div className={`text-sm ${step === i + 1 ? "text-blue-400" : "text-slate-500"}`}>{s.title}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Editor Content */}
              <div className="lg:col-span-9 bg-[#0f172a]/60 border border-white/5 rounded-[3rem] p-12 backdrop-blur-2xl">
                <div className="flex items-center justify-between mb-12 pb-8 border-b border-white/5">
                  <div>
                    <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{steps[step - 1].title}</h2>
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2">{step === 1 ? 'Personal communication meta' : 'Append professional modules'}</p>
                  </div>
                </div>
                {renderStep()}

                <div className="mt-12 pt-8 border-t border-white/5 flex justify-between">
                  <button
                    disabled={step === 1}
                    onClick={() => setStep(step - 1)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 disabled:opacity-20 hover:text-white transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    disabled={step === steps.length}
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-3 px-10 py-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl font-black uppercase text-[10px] tracking-widest text-blue-400 disabled:opacity-20 hover:bg-blue-600 hover:text-white transition-all"
                  >
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
              {/* Template Selector */}
              <div className="lg:col-span-1 space-y-8">
                <div className="p-8 bg-slate-900/60 border border-white/5 rounded-[2.5rem] backdrop-blur-xl">
                  <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-8">Executive Skin Selector</h3>
                  <div className="space-y-4">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setActiveTemplate(t.id)}
                        className={`w-full p-6 rounded-22 border transition-all text-left group rounded-2xl ${activeTemplate === t.id ? "bg-blue-600 border-blue-500 shadow-xl shadow-blue-900/20" : "bg-slate-950/50 border-white/5 hover:border-white/10"}`}
                      >
                        <div className={`text-[11px] font-black uppercase tracking-widest italic leading-none transition-colors ${activeTemplate === t.id ? "text-white" : "text-slate-500 group-hover:text-slate-300"}`}>{t.name}</div>
                        {activeTemplate === t.id && <div className="text-[8px] font-bold text-blue-200 uppercase tracking-[.2em] mt-2">Active Protocol</div>}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-8 border border-white/5 rounded-[2.5rem] bg-slate-900/40">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 bg-emerald-600/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                      <Save className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Saved Drafts</span>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-auto no-scrollbar">
                    {savedResumes.length === 0 ? (
                      <p className="text-[9px] text-slate-600 uppercase italic">No drafts saved yet</p>
                    ) : (
                      savedResumes.map(r => (
                        <button
                          key={r._id}
                          onClick={() => loadResume(r)}
                          className={`w-full p-4 rounded-xl border text-left transition-all ${activeResumeId === r._id ? "bg-emerald-600/20 border-emerald-500/50" : "bg-slate-950/50 border-white/5 hover:border-white/10"}`}
                        >
                          <div className="text-[10px] font-bold text-white uppercase truncate">{r.title || "Untitled Resume"}</div>
                          <div className="text-[8px] text-slate-500 mt-1 uppercase tracking-widest">{new Date(r.updatedAt).toLocaleDateString()}</div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Live Resume Preview */}
              <div className="lg:col-span-3 overflow-auto max-h-[1000px] no-scrollbar pb-20">
                <div className="scale-[0.85] lg:scale-[0.95] origin-top transform transition-transform">
                  {renderPreview()}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <div className="hidden print:block">
        {renderPreview()}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          @page { size: A4; margin: 0; }
          body { background: white !important; margin: 0; padding: 0; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          #resume-a4 { box-shadow: none !important; margin: 0 !important; width: 210mm !important; min-height: 297mm !important; }
        }
        
        #resume-a4 { line-height: 1.5; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}} />
    </div>
  );
};

const Input = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    {label && <label className="text-[11px] font-black uppercase tracking-widest text-slate-500">{label}</label>}
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-slate-950 border border-white/5 rounded-2xl py-4 px-6 text-white text-sm outline-none focus:ring-2 focus:ring-blue-500/30 transition-all placeholder:text-slate-800"
    />
  </div>
);

const Monitor = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

export default ResumeBuilder;
