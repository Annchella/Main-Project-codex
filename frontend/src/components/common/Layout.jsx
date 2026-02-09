import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { motion } from "framer-motion";

const Layout = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#020617] text-white overflow-x-hidden">
            <Navbar onToggleSidebar={() => setCollapsed(!collapsed)} isSidebarCollapsed={collapsed} />
            <div className="flex pt-24">
                <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <motion.main
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`flex-1 transition-all duration-300 ${collapsed ? "md:ml-20" : "md:ml-64"}`}
                >
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        {children}
                    </div>
                </motion.main>
            </div>
        </div>
    );
};

export default Layout;
