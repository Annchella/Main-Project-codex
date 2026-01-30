import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
    CreditCard, Search, Calendar, User,
    BookOpen, CheckCircle, AlertCircle, Clock,
    Filter, Download, ChevronRight
} from "lucide-react";

const AdminPurchases = () => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const { data } = await api.get("/payment/admin/all");
                setPurchases(data);
            } catch (err) {
                console.error("Failed to fetch purchases", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPurchases();
    }, []);

    const filteredPurchases = purchases.filter(p =>
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case "completed": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case "pending": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
            case "failed": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
            default: return "text-slate-400 bg-slate-500/10 border-slate-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12">
                    <div className="flex justify-between items-end">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
                                <CreditCard className="w-3.5 h-3.5" />
                                Transaction Ledger
                            </div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic italic">
                                Revenue & <span className="text-blue-500">Purchases</span>
                            </h1>
                        </div>

                        <div className="flex gap-4">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="SEARCH TRANSACTIONS..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-slate-900 border border-slate-800 py-3 pl-12 pr-6 rounded-xl text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 transition-all w-80"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-20 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800/50"></div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-slate-950/50 border border-slate-800 rounded-[2rem] overflow-hidden backdrop-blur-xl">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-800/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Subscriber</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Intelligence Unit</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction ID</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {filteredPurchases.map((purchase) => (
                                    <tr key={purchase._id} className="hover:bg-blue-500/5 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-xs font-black text-blue-400">
                                                    {purchase.user?.name?.[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-white uppercase tracking-tight">{purchase.user?.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium">{purchase.user?.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-bold text-slate-300 uppercase tracking-tight">{purchase.course?.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <code className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                                                {purchase.orderId}
                                            </code>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-sm font-black text-white italic">₹{purchase.amount}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusColor(purchase.status)}`}>
                                                {purchase.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {new Date(purchase.createdAt).toLocaleDateString()} <br />
                                            <span className="opacity-50">{new Date(purchase.createdAt).toLocaleTimeString()}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredPurchases.length === 0 && (
                            <div className="py-20 text-center">
                                <AlertCircle className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-20" />
                                <p className="text-slate-600 font-black uppercase tracking-widest italic">No matching transactions found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPurchases;
