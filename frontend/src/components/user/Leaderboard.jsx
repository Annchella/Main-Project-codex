import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Trophy, Award, Star, TrendingUp, Users, ChevronRight, Medal } from "lucide-react";

const Leaderboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await api.get("/user/leaderboard");
                setUsers(res.data);
            } catch (err) {
                console.error("Failed to fetch leaderboard");
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankStyle = (index) => {
        switch (index) {
            case 0: return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-400", icon: <Medal className="w-6 h-6 text-yellow-500" /> };
            case 1: return { bg: "bg-slate-300/10", border: "border-slate-300/20", text: "text-slate-300", icon: <Medal className="w-6 h-6 text-slate-300" /> };
            case 2: return { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", icon: <Medal className="w-6 h-6 text-orange-500" /> };
            default: return { bg: "bg-slate-800/20", border: "border-slate-700/50", text: "text-slate-500", icon: <span className="font-bold text-lg">{index + 1}</span> };
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">

            <main className="max-w-5xl mx-auto px-6 pb-20">
                <header className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
                        <Trophy className="w-4 h-4" />
                        Hall of Fame
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
                        Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Leaderboard</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
                        The top 10 developers pushing the boundaries of knowledge and skill.
                    </p>
                </header>

                <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl overflow-hidden backdrop-blur-sm shadow-2xl">
                    <div className="grid grid-cols-12 gap-4 px-8 py-4 bg-slate-800/50 border-b border-slate-700/50 text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                        <div className="col-span-2">Rank</div>
                        <div className="col-span-5">Developer</div>
                        <div className="col-span-2 text-center">Level</div>
                        <div className="col-span-3 text-right">Experience</div>
                    </div>

                    <div className="divide-y divide-slate-800/50">
                        {loading ? (
                            [1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="px-8 py-6 flex items-center gap-4 animate-pulse">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                                        <div className="h-3 bg-slate-800 rounded w-1/6"></div>
                                    </div>
                                </div>
                            ))
                        ) : users.length > 0 ? (
                            users.map((user, index) => {
                                const style = getRankStyle(index);
                                return (
                                    <div key={user._id} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-slate-800/30 transition-colors group">
                                        <div className="col-span-2 flex items-center justify-center w-10 h-10 rounded-full border border-transparent transition-all group-hover:scale-110">
                                            {style.icon}
                                        </div>
                                        <div className="col-span-5">
                                            <div className="font-bold text-lg group-hover:text-blue-400 transition-colors">{user.name}</div>
                                            <div className="flex gap-2 mt-1">
                                                {user.badges.map((badge, b) => (
                                                    <span key={b} className="px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 font-bold uppercase tracking-wider">{badge}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-center">
                                            <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 font-bold text-slate-300">
                                                {user.level}
                                            </span>
                                        </div>
                                        <div className="col-span-3 text-right">
                                            <div className="flex items-center justify-end gap-2 font-bold text-xl text-white">
                                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                {user.xp.toLocaleString()} <span className="text-slate-600 text-xs font-medium tracking-normal">XP</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-20 text-center">
                                <Users className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">No contenders yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Growth Rate</div>
                            <div className="text-xl font-bold">+24% This Week</div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Active Players</div>
                            <div className="text-xl font-bold">1,248 Users</div>
                        </div>
                    </div>
                    <div className="p-6 bg-slate-800/20 border border-slate-700/30 rounded-2xl flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                            <Award className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total XP Issued</div>
                            <div className="text-xl font-bold">2.4M XP</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Leaderboard;
