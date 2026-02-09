import React from "react";
import { Github, Twitter, Linkedin, Mail, Globe, Heart } from "lucide-react";
import { motion } from "framer-motion";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-[#020617] border-t border-white/5 pt-20 pb-10 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic">
                                Ann<span className="text-blue-500">chella</span>
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Elevating code intelligence through immersive learning and industry-grade engineering protocols.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<Github className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Twitter className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Linkedin className="w-5 h-5" />} href="#" />
                            <SocialIcon icon={<Mail className="w-5 h-5" />} href="#" />
                        </div>
                    </div>

                    {/* Platforms */}
                    <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">Platforms</h4>
                        <ul className="space-y-4">
                            <FooterLink label="Academy" href="/user/courses" />
                            <FooterLink label="Code Room" href="/code-room" />
                            <FooterLink label="Challenges" href="/user/challenges" />
                            <FooterLink label="Live Ops" href="/user/live-classes" />
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">Resources</h4>
                        <ul className="space-y-4">
                            <FooterLink label="Documentation" href="#" />
                            <FooterLink label="Community" href="#" />
                            <FooterLink label="Support" href="#" />
                            <FooterLink label="Sitemap" href="#" />
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">Engineering</h4>
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Status</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter leading-relaxed">
                                Version 4.0.0_Elite_Motion<br />
                                Nodes: Global Distribution<br />
                                Uptime: 99.99%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        © {currentYear} Annchella Industrial. All Protocol Reserved.
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Made with <Heart className="w-3 h-3 text-red-500 fill-current" /> by the Core Team
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ label, href }) => (
    <li>
        <a
            href={href}
            className="text-slate-400 hover:text-blue-400 transition-colors text-[11px] font-bold uppercase tracking-wider"
        >
            {label}
        </a>
    </li>
);

const SocialIcon = ({ icon, href }) => (
    <motion.a
        whileHover={{ y: -3, scale: 1.1 }}
        href={href}
        className="w-10 h-10 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all duration-300"
    >
        {icon}
    </motion.a>
);

export default Footer;
