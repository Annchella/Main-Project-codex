import React, { useState, useEffect } from "react";
import {
    X, Lock, CreditCard, ChevronRight,
    ShieldCheck, ArrowRight, Loader2, CheckCircle2
} from "lucide-react";

const CheckoutModal = ({ course, isOpen, onClose, onPaymentSuccess }) => {
    const [step, setStep] = useState(1); // 1: Card Entry, 2: Processing, 3: Success
    const [cardData, setCardData] = useState({
        number: "",
        expiry: "",
        cvv: "",
        name: ""
    });

    useEffect(() => {
        if (step === 2) {
            const timer = setTimeout(() => {
                setStep(3);
                setTimeout(() => {
                    onPaymentSuccess();
                }, 2000);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [step]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-xl bg-black/60">
            <div className="relative w-full max-w-[480px] bg-[#0f172a] border border-slate-800 rounded-[2.5rem] shadow-[0_0_100px_rgba(37,99,235,0.2)] overflow-hidden">

                {/* Header */}
                <div className="p-8 pb-4 flex justify-between items-start">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[9px] font-black uppercase tracking-widest">
                        <Lock className="w-3 h-3" /> Secure Node
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {step === 1 && (
                    <div className="p-8 pt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Checkout</h2>
                        <p className="text-slate-500 text-sm font-medium mb-8">Initiating acquisition for: <span className="text-blue-400 font-bold uppercase">{course?.title}</span></p>

                        {/* Virtual Card Preview */}
                        <div className="relative h-56 w-full rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 p-8 mb-8 overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="w-12 h-10 bg-yellow-400/80 rounded-lg blur-[0.5px]"></div>
                                    <div className="text-white/40 font-black italic text-xl">VISA</div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-xl font-mono tracking-[0.2em] text-white">
                                        {cardData.number || "•••• •••• •••• ••••"}
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-[8px] uppercase font-black text-white/50 tracking-widest">Card Holder</div>
                                            <div className="text-xs font-bold uppercase text-white">{cardData.name || "ANTIGRAVITY OPERATIVE"}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[8px] uppercase font-black text-white/50 tracking-widest">Expires</div>
                                            <div className="text-xs font-bold text-white">{cardData.expiry || "MM/YY"}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="space-y-4 mb-8">
                            <input
                                placeholder="CARD NUMBER"
                                className="w-full bg-slate-950 border border-slate-800 py-4 px-6 rounded-xl text-xs font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/\d{4}(?=.)/g, '$& ') })}
                                maxLength={19}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    placeholder="MM/YY"
                                    className="bg-slate-950 border border-slate-800 py-4 px-6 rounded-xl text-xs font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                    maxLength={5}
                                />
                                <input
                                    placeholder="CVV"
                                    type="password"
                                    className="bg-slate-950 border border-slate-800 py-4 px-6 rounded-xl text-xs font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                    maxLength={3}
                                />
                            </div>
                            <input
                                placeholder="OPERATIVE NAME"
                                className="w-full bg-slate-950 border border-slate-800 py-4 px-6 rounded-xl text-xs font-black tracking-widest outline-none focus:ring-2 focus:ring-blue-500 transition-all uppercase"
                                onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                            />
                        </div>

                        <button
                            onClick={() => setStep(2)}
                            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl text-sm uppercase tracking-widest shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            Authorize Payment <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="p-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
                        <div className="relative mb-8">
                            <Loader2 className="w-20 h-20 text-blue-500 animate-spin" />
                            <ShieldCheck className="w-8 h-8 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-2">Processing Transaction</h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">Establishing encrypted link with the central bank...</p>
                    </div>
                )}

                {step === 3 && (
                    <div className="p-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-700">
                        <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Auth Success</h3>
                        <p className="text-slate-500 text-sm font-medium mb-4">Credentials accepted. Enrollment protocol initiated.</p>
                        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 w-full animate-progress-fast"></div>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-500 uppercase text-[9px] font-black tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> End-to-End Encrypted
                    </div>
                    <div className="text-xl font-black text-white italic tracking-tighter">₹{course?.price}</div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;
