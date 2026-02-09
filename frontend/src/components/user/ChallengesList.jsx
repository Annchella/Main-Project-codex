import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { Award, Zap, ChevronRight, Search, Activity, Lock } from "lucide-react";

const ChallengesList = () => {
    const [challenges, setChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const res = await api.get("/challenges");
                setChallenges(res.data);
            } catch (error) {
                console.error("Error fetching challenges:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    const getDifficultyColor = (diff) => {
        switch (diff) {
            case "Easy": return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
            case "Medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
            case "Hard": return "text-red-400 bg-red-400/10 border-red-400/20";
            default: return "text-slate-400 bg-slate-400/10 border-slate-400/20";
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">

            <main className="max-w-7xl mx-auto px-6 pb-16">

                <header className="mb-12">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                                Coding Challenges
                            </h1>
                            <p className="text-lg text-slate-400 max-w-2xl">
                                Sharpen your skills with bite-sized problems. Solve them to earn rank and master new algorithms.
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-slate-500">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">24</div>
                                <div className="text-xs uppercase tracking-widest font-bold">Solved</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">1,200</div>
                                <div className="text-xs uppercase tracking-widest font-bold">Points</div>
                            </div>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-48 bg-slate-800/50 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : challenges.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {challenges.map((challenge) => (
                            <div
                                key={challenge._id}
                                onClick={() => navigate(`/user/challenges/${challenge._id}`)}
                                className="group relative bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:bg-slate-800/80 hover:border-blue-500/30 cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(challenge.difficulty)}`}>
                                        {challenge.difficulty}
                                    </span>
                                    <div className="p-2 rounded-lg bg-slate-900/50 group-hover:text-blue-400 transition-colors">
                                        <Activity className="w-4 h-4" />
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{challenge.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-2 mb-6">
                                    {challenge.description}
                                </p>

                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <Zap className="w-4 h-4 text-yellow-500" />
                                        <span>+50 XP</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
                        <Award className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-300">No challenges available yet</h3>
                        <p className="text-slate-500 mt-2">Check back soon for new coding puzzles!</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ChallengesList;
