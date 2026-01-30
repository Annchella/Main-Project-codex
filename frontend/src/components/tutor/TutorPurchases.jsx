import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    Users, TrendingUp, DollarSign, BookOpen,
    Calendar, Search, Filter, ArrowUpRight,
    ShieldCheck, LayoutDashboard
} from "lucide-react";

const TutorPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalRevenue: 0, studentCount: 0 });

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const { data } = await api.get("/payment/tutor/my");
                setPurchases(data);

                const totalRev = data.reduce((acc, curr) => acc + curr.amount, 0);
                const uniqueStudents = new Set(data.map(p => p.user?._id)).size;
                setStats({ totalRevenue: totalRev, studentCount: uniqueStudents });
            } catch (err) {
                console.error("Failed to fetch tutor purchases", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                <TrendingUp className="w-3.5 h-3.5" />
                                Revenue Analytics
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
                                Content <span className="text-emerald-500">Performance</span>
                            </h1>
                            <p className="text-slate-500 mt-2 font-medium">Tracking acquisition metrics for your intelligence modules.</p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl min-w-[200px] backdrop-blur-xl">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Revenue</div>
                                <div className="text-3xl font-black text-white italic tracking-tighter">₹{stats.totalRevenue}</div>
                            </div>
                            <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl min-w-[200px] backdrop-blur-xl">
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Active Students</div>
                                <div className="text-3xl font-black text-white italic tracking-tighter">{stats.studentCount}</div>
                            </div>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-64 bg-slate-900/50 rounded-[2.5rem] animate-pulse border border-slate-800/50"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {purchases.map((purchase) => (
                            <div key={purchase._id} className="group relative bg-slate-900/40 border border-slate-800/50 rounded-[2.5rem] p-8 hover:bg-slate-900/80 transition-all duration-500 hover:-translate-y-2">
                                <div className="absolute top-8 right-8 w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-lg font-black shadow-lg shadow-blue-900/20">
                                        {purchase.user?.name?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-tight italic">{purchase.user?.name}</h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{purchase.user?.email}</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <BookOpen className="w-3 h-3" /> Purchased Intelligence
                                        </div>
                                        <p className="text-sm font-bold text-slate-300 uppercase leading-snug">{purchase.course?.title}</p>
                                    </div>

                                    <div className="flex justify-between items-end pt-6 border-t border-slate-800/50">
                                        <div>
                                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Acquisition Value</div>
                                            <div className="text-xl font-black text-white italic tracking-tighter">₹{purchase.amount}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Timestamp</div>
                                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                {new Date(purchase.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {purchases.length === 0 && (
                            <div className="col-span-full py-32 text-center bg-slate-950/30 rounded-[4rem] border border-dashed border-slate-800/50">
                                <LayoutDashboard className="w-20 h-20 text-slate-800 mx-auto mb-6 opacity-20" />
                                <h3 className="text-xl font-black text-slate-600 uppercase italic tracking-widest">No Acquisitions Recorded</h3>
                                <p className="text-slate-700 mt-2 font-bold uppercase text-[10px]">Your intelligence modules are awaiting the first high-value subscribers.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TutorPurchases;
