import React from "react";
import Navbar from "../common/Navbar";
import { useNavigate } from "react-router-dom";
import {
    ShieldCheck, Users, BarChart3,
    Layers, Settings, Bell,
    ChevronRight, ArrowUpRight, PlusCircle
} from "lucide-react";

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-6 py-20">
                <header className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
                        <ShieldCheck className="w-4 h-4" />
                        System Administrator
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                        Platform <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-500">Command Center</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
                        Monitor system health, manage educational content approvals, and oversee the global developer community.
                    </p>
                </header>

                {/* Stats Grid */}
                <div className="grid md:grid-cols-4 gap-6 mb-16">
                    <StatCard icon={<Users className="text-blue-400" />} label="Total Users" value="12,482" drift="+12%" />
                    <StatCard icon={<Layers className="text-purple-400" />} label="Courses Live" value="156" drift="+4%" />
                    <StatCard icon={<ShieldCheck className="text-emerald-400" />} label="Pending Reviews" value="8" drift="Action Needed" highlight />
                    <StatCard
                        icon={<BarChart3 className="text-pink-400" />}
                        label="Revenue"
                        value="₹2.4M"
                        drift="+18%"
                        onClick={() => navigate("/admin/purchases")}
                    />
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Primary Action Card */}
                    <div
                        onClick={() => navigate("/admin/approvals")}
                        className="lg:col-span-2 group relative p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 hover:border-slate-500/50 transition-all cursor-pointer overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShieldCheck className="w-48 h-48 -rotate-12" />
                        </div>

                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20">
                                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Content Approval Workflow</h2>
                            <p className="text-slate-400 max-w-md mb-8 leading-relaxed">
                                Review newly submitted courses from tutors. Verify curriculum quality, video content, and project scope before authorizing public access.
                            </p>
                            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm tracking-widest uppercase">
                                Launch Approval Dashboard <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </div>

                    {/* Secondary Actions */}
                    <div className="space-y-6">
                        <AdminActionItem
                            icon={<BarChart3 className="w-5 h-5" />}
                            title="Revenue Ledger"
                            desc="View all purchase transactions."
                            onClick={() => navigate("/admin/purchases")}
                        />
                        <AdminActionItem
                            icon={<PlusCircle className="w-5 h-5" />}
                            title="Direct Course Creation"
                            desc="Bypass tutor flow to add courses."
                            onClick={() => navigate("/tutor/create-course")}
                        />
                        <AdminActionItem
                            icon={<Users className="w-5 h-5" />}
                            title="User Management"
                            desc="Manage roles and permissions."
                        />
                        <AdminActionItem
                            icon={<BarChart3 className="w-5 h-5" />}
                            title="Platform Analytics"
                            desc="Track engagement metrics."
                        />
                        <AdminActionItem
                            icon={<Settings className="w-5 h-5" />}
                            title="System Settings"
                            desc="Configure global parameters."
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

const StatCard = ({ icon, label, value, drift, highlight, onClick }) => (
    <div
        onClick={onClick}
        className={`p-8 rounded-3xl border border-slate-800/50 bg-slate-800/20 backdrop-blur-sm ${highlight ? 'ring-1 ring-emerald-500/20' : ''} ${onClick ? 'cursor-pointer hover:bg-slate-800/40 transition-all' : ''}`}
    >
        <div className="flex justify-between items-start mb-6">
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800">
                {icon}
            </div>
            <div className={`text-[10px] font-black uppercase tracking-widest ${drift.includes('+') ? 'text-emerald-400' : 'text-orange-400'}`}>
                {drift}
            </div>
        </div>
        <div className="text-3xl font-black mb-1">{value}</div>
        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</div>
    </div>
);

const AdminActionItem = ({ icon, title, desc, onClick }) => (
    <div
        onClick={onClick}
        className="group p-6 rounded-3xl bg-slate-800/30 border border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between"
    >
        <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors">
                {icon}
            </div>
            <div>
                <h3 className="font-bold text-slate-200">{title}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{desc}</p>
            </div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
    </div>
);

export default AdminDashboard;
