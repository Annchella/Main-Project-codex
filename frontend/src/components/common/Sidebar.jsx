import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    ChevronLeft, ChevronRight, LayoutDashboard, BookOpen,
    MessageSquare, Zap, Trophy, Video, Award, Terminal,
    Settings, Users, Globe, Layers, BarChart3, ShieldCheck,
    Menu, LifeBuoy, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SidebarLink = ({ to, icon: Icon, name, collapsed, active, themeClasses, hasBadge }) => (
    <Link
        to={to}
        className={`group relative flex items-center gap-4 px-4 py-3.5 mx-2 my-1 rounded-2xl transition-all duration-300 ${active
            ? `${themeClasses.bg} text-white shadow-lg`
            : "text-slate-400 hover:bg-white/5 hover:text-white"
            }`}
    >
        <div className="relative">
            <Icon className={`w-5 h-5 min-w-[20px] transition-transform duration-300 ${!active && "group-hover:scale-110"}`} />
            {hasBadge && (
                <div className="absolute -top-1 -right-1 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-25"></div>
                    <div className="relative w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#020617] shadow-[0_0_15px_rgba(239,68,68,0.8)]"></div>
                </div>
            )}
        </div>

        <AnimatePresence>
            {!collapsed && (
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="text-[12px] font-black uppercase tracking-[0.2em] whitespace-nowrap"
                >
                    {name}
                </motion.span>
            )}
        </AnimatePresence>

        {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[12px] font-black uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                {name}
            </div>
        )}

        {active && (
            <motion.div
                layoutId="sidebarActive"
                className="absolute inset-0 bg-white/10 rounded-2xl pointer-events-none"
            />
        )}
    </Link>
);

const Sidebar = ({ collapsed, setCollapsed }) => {
    const [role, setRole] = useState(localStorage.getItem("role") || "user");
    const [hasUnreadDoubts, setHasUnreadDoubts] = useState(false);
    const location = useLocation();

    // Sync role from localStorage (e.g. after login)
    useEffect(() => {
        const savedRole = localStorage.getItem("role");
        if (savedRole && savedRole !== role) {
            setRole(savedRole);
        }
    }, [location.pathname]);

    useEffect(() => {
        const handleNewMessage = (e) => {
            if (location.pathname !== "/tutor/doubts") {
                setHasUnreadDoubts(true);
            }
        };

        window.addEventListener("new-chat-message", handleNewMessage);
        return () => window.removeEventListener("new-chat-message", handleNewMessage);
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname === "/tutor/doubts") {
            setHasUnreadDoubts(false);
        }
    }, [location.pathname]);

    const navConfigs = {
        user: {
            links: [
                { name: "Dashboard", path: "/user", icon: LayoutDashboard },
                { name: "Courses", path: "/user/courses", icon: BookOpen },
                { name: "Code Room", path: "/code-room", icon: Terminal },
                { name: "Challenges", path: "/user/challenges", icon: Zap },
                { name: "Leaderboard", path: "/user/leaderboard", icon: Trophy },
                { name: "Mock Interview", path: "/user/mock-interview", icon: MessageSquare },
                { name: "Live Ops", path: "/user/live-classes", icon: Video },
                { name: "Resume", path: "/resume-builder", icon: Award },
                { name: "Support", path: "/support", icon: LifeBuoy },
            ],
            themeColor: "blue",
        },
        tutor: {
            links: [
                { name: "Terminal", path: "/tutor", icon: Terminal },
                { name: "My Courses", path: "/tutor/manage-courses", icon: Layers },
                { name: "Doubts", path: "/tutor/doubts", icon: MessageSquare },
                { name: "Students", path: "/tutor/enrollments", icon: Users },
                { name: "Earnings", path: "/tutor/purchases", icon: BarChart3 },
                { name: "Resume", path: "/resume-builder", icon: Award },
                { name: "Support", path: "/support", icon: LifeBuoy },
            ],
            themeColor: "cyan",
        },
        admin: {
            links: [
                { name: "Console", path: "/admin", icon: Terminal },
                { name: "Approvals", path: "/admin/approvals", icon: CheckCircle },
                { name: "Support", path: "/admin/support", icon: LifeBuoy },
                { name: "Tutors", path: "/admin/tutor-approvals", icon: Users },
                { name: "Courses", path: "/admin/course-management", icon: Layers },
                { name: "Users", path: "/admin/manage-users", icon: Users },
                { name: "Purchases", path: "/admin/purchases", icon: BarChart3 },
            ],
            themeColor: "emerald",
        }
    };

    const config = navConfigs[role] || navConfigs.user;

    const themeClasses = {
        blue: { bg: "bg-blue-600", text: "text-blue-500", border: "border-blue-500/20" },
        cyan: { bg: "bg-cyan-600", text: "text-cyan-500", border: "border-cyan-500/20" },
        emerald: { bg: "bg-emerald-600", text: "text-emerald-500", border: "border-emerald-500/20" }
    }[config.themeColor];

    const isActive = (path) => location.pathname === path;

    const isMobile = window.innerWidth < 768;

    return (
        <motion.aside
            initial={false}
            animate={{
                x: isMobile && collapsed ? -300 : 0,
                width: isMobile ? 280 : (collapsed ? 80 : 256)
            }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-screen z-[90] flex flex-col bg-[#020617]/95 md:bg-[#020617]/80 backdrop-blur-3xl border-r border-white/5 shadow-2xl md:shadow-none"
        >
            {/* Spacer for Top Navbar */}
            <div className="h-24 flex items-center justify-center border-b border-white/5">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors ${collapsed ? "" : "ml-auto mr-6"}`}
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>

            <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
                <div className="px-4 mb-4">
                    <AnimatePresence>
                        {!collapsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] px-4"
                            >
                                Main Navigation
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {config.links.map((link) => (
                    <SidebarLink
                        key={link.path}
                        to={link.path}
                        icon={link.icon}
                        name={link.name}
                        collapsed={collapsed}
                        active={isActive(link.path)}
                        themeClasses={themeClasses}
                        hasBadge={link.name === "Doubts" && hasUnreadDoubts}
                    />
                ))}
            </div>

            <div className="p-4 border-t border-white/5">
                <SidebarLink
                    to="/settings"
                    icon={Settings}
                    name="Settings"
                    collapsed={collapsed}
                    active={isActive("/settings")}
                    themeClasses={themeClasses}
                />
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}} />
        </motion.aside>
    );
};

export default Sidebar;
