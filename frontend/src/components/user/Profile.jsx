import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera, Cpu, Database, Network, Atom, Globe,
    Terminal, Code, Layers, Save, Check, Upload, Trash2,
    ShieldAlert, Sparkles, User, Fingerprint
} from "lucide-react";
import api from "../../services/api";

const PREDEFINED_AVATARS = [
    { id: "cpu", icon: Cpu, color: "from-blue-600 to-cyan-500" },
    { id: "atom", icon: Atom, color: "from-purple-600 to-pink-500" },
    { id: "globe", icon: Globe, color: "from-emerald-600 to-teal-500" },
    { id: "code", icon: Code, color: "from-orange-600 to-yellow-500" },
    { id: "database", icon: Database, color: "from-red-600 to-pink-600" },
    { id: "network", icon: Network, color: "from-indigo-600 to-blue-500" },
    { id: "terminal", icon: Terminal, color: "from-slate-700 to-slate-900" },
    { id: "layers", icon: Layers, color: "from-blue-400 to-indigo-600" },
];

const Profile = () => {
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [customPhoto, setCustomPhoto] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const savedAvatar = localStorage.getItem("userAvatar");
        const savedPhoto = localStorage.getItem("userPhoto");
        if (savedPhoto) setCustomPhoto(savedPhoto);
        else if (savedAvatar) setSelectedAvatar(savedAvatar);
        else setSelectedAvatar("cpu");
    }, []);

    const handleAvatarSelect = (id) => {
        setSelectedAvatar(id);
        setCustomPhoto(null);
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCustomPhoto(reader.result);
                setSelectedAvatar(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            localStorage.setItem("userAvatar", selectedAvatar || "");
            localStorage.setItem("userPhoto", customPhoto || "");
            setIsSaving(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            // Reload page to update Navbar (in a real app, use Context or Redux)
            window.location.reload();
        }, 1500);
    };

    const activeAvatar = PREDEFINED_AVATARS.find(a => a.id === selectedAvatar);

    return (
        <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">

            <main className="pb-20 max-w-5xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    {/* Page Header */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-blue-400">
                            <Fingerprint className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Identity Protocol</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">
                            Profile <span className="text-slate-500">Core</span>
                        </h1>
                        <p className="text-slate-400 max-w-xl font-medium">
                            Configure your neural presence across the system. Personalize your identity with elite technical avatars or custom biometric photography.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        {/* Left: Identity Card */}
                        <div className="lg:col-span-1 space-y-6">
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="relative group p-8 rounded-[3rem] bg-slate-900/20 border border-slate-800/50 backdrop-blur-3xl overflow-hidden aspect-square flex flex-col items-center justify-center shadow-2xl"
                            >
                                <div className="absolute -inset-4 bg-blue-600/5 blur-[50px] group-hover:bg-blue-600/10 transition-colors"></div>

                                <div className="relative w-48 h-48 rounded-[2rem] overflow-hidden border border-slate-700/50 p-2 bg-slate-950/50 group">
                                    {customPhoto ? (
                                        <img src={customPhoto} alt="Profile" className="w-full h-full object-cover rounded-[1.5rem]" />
                                    ) : activeAvatar ? (
                                        <div className={`w-full h-full rounded-[1.5rem] bg-gradient-to-br ${activeAvatar.color} flex items-center justify-center shadow-inner`}>
                                            <activeAvatar.icon className="w-24 h-24 text-white drop-shadow-2xl" />
                                        </div>
                                    ) : (
                                        <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-[1.5rem]">
                                            <User className="w-20 h-20 text-slate-700" />
                                        </div>
                                    )}

                                    {/* Photo Overlay Trigger */}
                                    <button
                                        onClick={() => fileInputRef.current.click()}
                                        className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-300"
                                    >
                                        <Camera className="w-8 h-8 text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Upload New</span>
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handlePhotoUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>

                                <div className="mt-8 text-center space-y-2 relative z-10">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter">
                                        {localStorage.getItem("name") || "Elite Technician"}
                                    </h3>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Neural Link Active</span>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800 flex items-start gap-4">
                                <ShieldAlert className="w-5 h-5 text-slate-500 shrink-0" />
                                <p className="text-[10px] text-slate-500 leading-relaxed font-medium uppercase tracking-tight">
                                    Your profile data is encrypted via Neural-Gate. Custom images are processed through system security filters before deployment.
                                </p>
                            </div>
                        </div>

                        {/* Right: Selection Area */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Avatar Gallery */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4 text-blue-400" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">Technical Avatars</h2>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {PREDEFINED_AVATARS.map((avatar) => (
                                        <motion.button
                                            key={avatar.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => handleAvatarSelect(avatar.id)}
                                            className={`relative p-1 rounded-[2rem] transition-all duration-500 ${selectedAvatar === avatar.id
                                                ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                                                : "bg-slate-800/30 hover:bg-slate-800/50 grayscale-50 hover:grayscale-0 shadow-none hover:shadow-lg hover:shadow-white/5"
                                                }`}
                                        >
                                            <div className="bg-[#020617] rounded-[1.8rem] p-4 flex flex-col items-center gap-4 transition-all overflow-hidden border border-slate-800">
                                                <div className={`p-4 rounded-2xl bg-gradient-to-br ${avatar.color}`}>
                                                    <avatar.icon className="w-10 h-10 text-white" />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-white">
                                                    {avatar.id}
                                                </span>

                                                {selectedAvatar === avatar.id && (
                                                    <div className="absolute top-4 right-4">
                                                        <Check className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            </section>

                            {/* Photo Area */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <Camera className="w-4 h-4 text-blue-400" />
                                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-slate-300">Biometric Imaging</h2>
                                </div>

                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className={`border-2 border-dashed rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all duration-500 overflow-hidden relative group ${customPhoto ? "border-blue-500/50 bg-blue-500/5" : "border-slate-800 bg-slate-900/10 hover:border-slate-700 hover:bg-slate-900/20"
                                        }`}
                                >
                                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    {customPhoto ? (
                                        <>
                                            <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-2xl">
                                                <img src={customPhoto} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="text-center space-y-1 relative z-10">
                                                <p className="text-sm font-black uppercase italic tracking-tighter">Custom Biometric Loaded</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tap to replace image</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="p-5 rounded-full bg-slate-800/50 border border-slate-700 group-hover:border-blue-500/50 transition-colors shadow-inner">
                                                <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            <div className="text-center space-y-2 relative z-10">
                                                <p className="text-sm font-black uppercase italic tracking-tighter">Initialize Image Capture</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">DRAG ASSET HERE OR CLICK TO BROWSE</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {customPhoto && (
                                    <button
                                        onClick={() => setCustomPhoto(null)}
                                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500/70 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" /> Remove Custom Asset
                                    </button>
                                )}
                            </section>

                            {/* Action Bar */}
                            <div className="pt-10 flex justify-end gap-6">
                                <button
                                    onClick={() => window.history.back()}
                                    className="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                                >
                                    Abort Changes
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={isSaving}
                                    onClick={handleSaveProfile}
                                    className={`px-12 py-4 rounded-2xl flex items-center gap-3 font-black uppercase text-[10px] tracking-widest transition-all duration-500 shadow-2xl ${saveSuccess
                                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                        : "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-500"
                                        }`}
                                >
                                    {isSaving ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            Encrypting...
                                        </>
                                    ) : saveSuccess ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Protocol Updated
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            Save Identity Protocol
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>

            {/* Decorative Background Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:100px_100px] opacity-[0.03]"></div>
            </div>
        </div>
    );
};

export default Profile;
