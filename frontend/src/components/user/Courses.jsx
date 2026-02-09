import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Star, Clock, Users, User,
  ChevronRight, PlayCircle, Layers,
  Search, ShieldCheck, Layout,
  Trophy, BadgeCheck, Globe,
  BarChart, Filter, Sparkles, TrendingUp,
  Monitor, Smartphone, Award,
  CheckCircle2, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CheckoutModal from "./CheckoutModal";
import Footer from "../common/Footer";

const HorizontalCourseCard = ({ course, isEnrolled, onPurchase, navigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col md:flex-row bg-[#0f172a]/40 border border-white/5 rounded-3xl overflow-hidden hover:bg-[#0f172a]/60 transition-all duration-300 hover:border-blue-500/30 shadow-2xl"
    >
      {/* Thumbnail Part */}
      <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0 overflow-hidden">
        <img
          src={course.thumbnail || "/course-placeholder.jpg"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          alt={course.title}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f172a]/20"></div>
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-xl">
            {course.level || 'Intermediate'}
          </span>
        </div>
      </div>

      {/* Content Part */}
      <div className="flex-1 p-6 md:p-8 flex flex-col lg:flex-row gap-6 lg:items-center">
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
              {course.title}
            </h3>
            <p className="text-slate-500 text-xs font-medium line-clamp-2 max-w-2xl">
              {course.description || "Master advanced concepts with our industry-vetted curriculum designed for elite professional growth."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <div
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tutor/profile/${course.tutor?._id}`);
              }}
              className="flex items-center gap-2 cursor-pointer group/tutor"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 group-hover/tutor:border-blue-500 transition-colors">
                <img src={course.tutor?.photo || "/placeholder-avatar.jpg"} className="w-full h-full object-cover" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest group-hover/tutor:text-blue-400 transition-colors">{course.tutor?.name || 'Lead Architect'}</span>
            </div>

            <div className="flex items-center gap-1.5 text-yellow-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-black">4.8</span>
              <span className="text-slate-600 text-[10px] font-bold">(1,242 ratings)</span>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 24h</span>
              <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> {course.modules?.length || 0} Modules</span>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
              <CheckCircle2 className="w-3 h-3" /> Fully Verified
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase tracking-widest">
              <Award className="w-3 h-3" /> Certificate Included
            </span>
          </div>
        </div>

        {/* Pricing & CTA Part */}
        <div className="lg:w-48 shrink-0 flex flex-col md:items-end justify-center gap-4 border-l border-white/5 lg:pl-10">
          <div className="flex flex-col md:items-end">
            <div className="text-3xl font-black text-white tracking-tighter italic">₹{course.price}</div>
            <div className="text-[10px] text-slate-600 font-bold line-through">₹{course.price * 2}</div>
          </div>

          {isEnrolled ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/user/courses/${course._id}/player`)}
              className="w-full py-4 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
            >
              RESUME COURSE
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPurchase(course)}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"
            >
              ENROLL NOW
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SidebarFilter = ({ title, options, selected, onSelect }) => (
  <div className="space-y-4 mb-10">
    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">{title}</h4>
    <div className="space-y-3">
      {options.map(opt => (
        <label key={opt} className="flex items-center gap-3 group cursor-pointer">
          <div
            onClick={() => onSelect(opt)}
            className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${selected === opt ? 'bg-blue-600 border-blue-600' : 'bg-white/5 border-white/10 group-hover:border-blue-500/50'}`}
          >
            {selected === opt && <CheckCircle2 className="w-3 h-3 text-white" />}
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${selected === opt ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
            {opt}
          </span>
        </label>
      ))}
    </div>
  </div>
);

const UserCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Marketplace");
  const [filters, setFilters] = useState({
    category: "All",
    level: "All",
    rating: "All"
  });
  const navigate = useNavigate();

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [courseRes, enrollmentRes] = await Promise.all([
        api.get("/courses"),
        api.get("/enrollments/my")
      ]);
      setCourses(courseRes.data);
      const enrolledIds = (enrollmentRes.data || [])
        .filter(e => e.course && e.course._id)
        .map(e => e.course._id);
      setEnrollments(enrolledIds);
    } catch (err) {
      console.error("Failed to fetch data:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = (course) => {
    setSelectedCourse(course);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      const { data: order } = await api.post("/payment/create-order", { courseId: selectedCourse._id });
      await api.post("/payment/verify", { orderId: order.id });
      setEnrollments([...enrollments, selectedCourse._id]);
      setShowCheckout(false);
      navigate(`/user/courses/${selectedCourse._id}/player`);
    } catch (err) {
      console.error("Payment Failed:", err.response?.data || err.message);
      alert("Atmospheric disturbance during transaction. Please try again.");
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === "All" || (course.category === filters.category);
    const matchesLevel = filters.level === "All" || (course.level === filters.level);
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col">
      <CheckoutModal
        isOpen={showCheckout}
        course={selectedCourse}
        onClose={() => setShowCheckout(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Hero / Header Section */}
      <section className="relative pt-32 pb-16 px-6 bg-[#0f172a]/20 border-b border-white/5 overflow-hidden">
        <div className="absolute top-0 right-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -translate-y-1/2"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div>
            <h1 className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter mb-4 leading-none">
              The <span className="text-blue-500">Academy</span>
            </h1>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px]">Strategic Learning & Tactical Engineering</p>
          </div>

          <div className="flex gap-4">
            <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black italic">12,402</div>
                <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Active nodes</div>
              </div>
            </div>
            <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black italic">{courses.length}</div>
                <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Curriculums</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Marketplace Area */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-12 gap-12">
        {/* Left Sidebar Filters */}
        <aside className="lg:w-64 shrink-0 space-y-12">
          <div className="relative group mb-12">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="SEARCH CATALOG..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-white/5 py-4 pl-12 pr-6 rounded-2xl outline-none focus:ring-1 focus:ring-blue-500/30 transition-all text-[10px] font-black uppercase tracking-widest placeholder:text-slate-700"
            />
          </div>

          <SidebarFilter
            title="Sectors"
            options={["All", "Full Stack", "AI/ML", "Cybersecurity", "Cloud Arch"]}
            selected={filters.category}
            onSelect={(v) => setFilters({ ...filters, category: v })}
          />

          <SidebarFilter
            title="Complexity"
            options={["All", "Beginner", "Intermediate", "Expert"]}
            selected={filters.level}
            onSelect={(v) => setFilters({ ...filters, level: v })}
          />

          <SidebarFilter
            title="Protocol Rating"
            options={["All", "4.5 & Up", "4.0 & Up", "3.0 & Up"]}
            selected={filters.rating}
            onSelect={(v) => setFilters({ ...filters, rating: v })}
          />

          <div className="p-6 bg-blue-600/5 rounded-[2rem] border border-blue-500/10">
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Info className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Tip</span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Complete your profile to receive tactical course recommendations based on your current XP trajectory.
            </p>
          </div>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black uppercase italic tracking-widest">{searchTerm ? 'Search Results' : 'Global Catalog'}</h2>
              <span className="px-3 py-1 bg-white/5 rounded-lg text-slate-600 text-[10px] font-black">
                {filteredCourses.length} LOADED
              </span>
            </div>

            <div className="flex bg-slate-900 border border-white/5 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("Marketplace")}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'Marketplace' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setActiveTab("Feed")}
                className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'Feed' ? 'bg-blue-600/10 text-blue-400' : 'text-slate-600 hover:text-slate-400'}`}
              >
                Detail
              </button>
            </div>
          </div>

          <div className="space-y-6 min-h-[600px]">
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} className="h-48 bg-white/[0.02] border border-white/5 rounded-[2rem] animate-pulse"></div>
              ))
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map(course => (
                <HorizontalCourseCard
                  key={course._id}
                  course={course}
                  isEnrolled={enrollments.includes(course._id)}
                  onPurchase={handlePurchaseClick}
                  navigate={navigate}
                />
              ))
            ) : (
              <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[4rem]">
                <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 border border-white/5">
                  <Layout className="w-8 h-8 text-slate-800" />
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-widest text-slate-600 mb-2">Sector Empty</h3>
                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">Adjust filters or search parameters</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({ category: "All", level: "All", rating: "All" });
                  }}
                  className="mt-8 px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  RESET SENSORS
                </button>
              </div>
            )}
          </div>

          {/* Pagination Simulation */}
          <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between">
            <div className="text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Viewing Page 01 of 01</div>
            <div className="flex gap-4">
              <button disabled className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-700 opacity-50">
                <ChevronRight className="w-5 h-5 rotate-180" />
              </button>
              <button disabled className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-700 opacity-50">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default UserCourses;
