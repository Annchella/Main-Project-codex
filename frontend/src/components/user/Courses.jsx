import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../common/Navbar";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Star, Clock, Users,
  ChevronRight, PlayCircle, Layers,
  Search, ShieldCheck, Layout
} from "lucide-react";
import CheckoutModal from "./CheckoutModal";

const UserCourses = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, enrollmentRes] = await Promise.all([
          api.get("/courses"),
          api.get("/enrollments/my")
        ]);
        setCourses(courseRes.data);
        setEnrollments(enrollmentRes.data.map(e => e.course._id));
      } catch (err) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const handlePurchaseClick = (course) => {
    setSelectedCourse(course);
    setShowCheckout(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      setPurchasing(selectedCourse._id);

      // 1. Create order internally
      const { data: order } = await api.post("/payment/create-order", { courseId: selectedCourse._id });

      // 2. Finalize payment internally
      await api.post("/payment/verify", { orderId: order.id });

      setEnrollments([...enrollments, selectedCourse._id]);
      setShowCheckout(false);
      navigate(`/user/courses/${selectedCourse._id}/player`);
    } catch (err) {
      alert("Encountered an atmospheric disruption. Protocol failed.");
    } finally {
      setPurchasing(null);
    }
  };

  const isEnrolled = (courseId) => enrollments.includes(courseId);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30">
      <Navbar />

      {/* Internal Payment Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        course={selectedCourse}
        onClose={() => setShowCheckout(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <main className="max-w-7xl mx-auto px-6 py-24">
        <header className="mb-24 relative">
          {/* Ambient Header Glow */}
          <div className="absolute -top-40 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="flex justify-between items-end gap-10 flex-wrap relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
                <BookOpen className="w-3.5 h-3.5" />
                Featured Intelligence
              </div>
              <h1 className="text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
                Master the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-500">
                  Curriculum
                </span>
              </h1>
              <p className="text-lg text-slate-500 max-w-xl font-medium leading-relaxed">
                Elite-level technical training designed for the top 0.1% of global engineering talent.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/40 p-3 rounded-[1.5rem] border border-slate-800 backdrop-blur-md">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                <input
                  placeholder="FILTER DATASETS..."
                  className="bg-slate-950/50 border border-slate-800 py-3 pl-12 pr-6 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-72 placeholder:text-slate-700"
                />
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-[500px] bg-slate-900/40 rounded-[2.5rem] animate-pulse border border-slate-800/50"></div>
            ))}
          </div>
        ) : courses.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.map((course) => (
              <div
                key={course._id}
                className="group relative bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] overflow-hidden hover:bg-slate-900/80 transition-all duration-700 hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex flex-col"
              >
                {/* Visual Identity */}
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent z-10 opacity-80"></div>
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 saturate-[0.8] group-hover:saturate-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-800">
                      <PlayCircle className="w-20 h-20 opacity-20" />
                    </div>
                  )}

                  {/* Status Badges */}
                  <div className="absolute top-6 left-6 z-20 flex gap-3">
                    <span className="px-3 py-1 rounded-full bg-blue-500/10 backdrop-blur-md border border-blue-400/20 text-blue-400 text-[9px] font-black uppercase tracking-widest shadow-2xl">
                      Level {Math.floor(Math.random() * 5) + 1}
                    </span>
                    {course.price > 4000 && (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/10 backdrop-blur-md border border-yellow-400/20 text-yellow-500 text-[9px] font-black uppercase tracking-widest shadow-2xl">
                        Premium Track
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-10 relative flex-1 flex flex-col">
                  {/* Header */}
                  <div className="mb-6 flex-1">
                    <h3 className="text-2xl font-black mb-3 group-hover:text-blue-400 transition-colors uppercase italic tracking-tighter leading-tight">{course.title}</h3>
                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                      {course.description}
                    </p>
                  </div>

                  {/* Analytics Stats */}
                  <div className="flex items-center gap-6 text-[9px] font-black text-slate-600 uppercase tracking-widest mb-10 pb-6 border-b border-slate-800/50">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current opacity-50" />
                      <span>{(4.5 + Math.random() * 0.5).toFixed(1)} CRITICAL SCORE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-500 opacity-50" />
                      <span>{course.modules?.length || 0} UNITS</span>
                    </div>
                  </div>

                  {/* Instructor Bio */}
                  <div className="flex items-center gap-4 p-4 bg-slate-950/50 rounded-[1.5rem] border border-slate-900 mb-10 group/tutor hover:border-slate-800 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-black shadow-lg shadow-blue-900/20">
                      {course.tutor?.name?.[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-0.5">Assigned Expert</div>
                      <div className="text-sm font-bold text-slate-200">{course.tutor?.name}</div>
                    </div>
                  </div>

                  {/* Purchase Action */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-tighter mb-0.5">Intelligence Value</span>
                      <span className="text-3xl font-black text-white italic tracking-tighter group-hover:scale-105 transition-transform origin-left">₹{course.price}</span>
                    </div>

                    {isEnrolled(course._id) ? (
                      <button
                        onClick={() => navigate(`/user/courses/${course._id}/player`)}
                        className="group/btn relative px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/20 transition-all active:scale-95 flex items-center gap-2"
                      >
                        OPEN DATASET <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePurchaseClick(course)}
                        disabled={purchasing === course._id}
                        className="group/btn relative px-8 py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2"
                      >
                        {purchasing === course._id ? "SYNCING..." : "ACQUIRE ACCESS"}
                        {purchasing !== course._id && <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-900/20 rounded-[4rem] border border-dashed border-slate-800/50">
            <Layout className="w-24 h-24 text-slate-800 mx-auto mb-8 opacity-20" />
            <h3 className="text-2xl font-black text-slate-600 uppercase italic tracking-widest">No Intelligence Datasets Available</h3>
            <p className="text-slate-700 mt-4 font-bold">Awaiting new mission objectives from Command.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserCourses;
