import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Code2, User, LogIn, ChevronRight, LogOut, Settings, Award, BookOpen, Cpu, Atom, Globe, Code, Database, Network, Terminal, Layers } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

const Avatar = ({ user, size = "md", className = "" }) => {
  const iconMap = {
    cpu: Cpu, atom: Atom, globe: Globe, code: Code,
    database: Database, network: Network, terminal: Terminal, layers: Layers
  };

  const sizes = {
    sm: "w-8 h-8 rounded-lg text-[8px]",
    md: "w-10 h-10 rounded-xl text-[10px]",
    lg: "w-12 h-12 rounded-2xl text-xl"
  };

  const Icon = iconMap[user?.avatar] || User;

  if (user?.photo) {
    return (
      <div className={`${sizes[size]} overflow-hidden border border-white/10 shadow-2xl ${className}`}>
        <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-white/10 ${className}`}>
      <Icon className={size === "lg" ? "w-6 h-6" : "w-4 h-4"} />
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    const savedUser = localStorage.getItem("token"); // Simple check for login
    if (savedUser) {
      const fetchUserData = async () => {
        try {
          const stats = await api.get("/user/stats");
          setUser({
            name: localStorage.getItem("name") || "Elite User",
            level: stats.data.level || 1,
            xp: stats.data.xp || 0,
            avatar: localStorage.getItem("userAvatar") || "cpu",
            photo: localStorage.getItem("userPhoto") || null
          });
        } catch (err) {
          setUser({
            name: localStorage.getItem("name") || "Elite User",
            level: 1,
            xp: 0,
            avatar: localStorage.getItem("userAvatar") || "cpu",
            photo: localStorage.getItem("userPhoto") || null
          });
        }
      };
      fetchUserData();
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsUserMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: "Dashboard", path: "/user" },
    { name: "Courses", path: "/user/courses" },
    { name: "Blogs", path: "/blogs" },
    { name: "Resume Builder", path: "/resume-builder" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 z-[100] w-full transition-all duration-500 ${scrolled
        ? "py-3 bg-[#020617]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
        : "py-6 bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-12">
          {/* Futuristic LOGO */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="p-2.5 bg-blue-600 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:shadow-blue-500/60 transition-all"
            >
              <Code2 className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                Learn<span className="text-blue-500">Flek</span>
              </span>
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-0.5">Neural_Core v4</span>
            </div>
          </Link>

          {/* Advanced Search Bar */}
          <motion.div
            animate={{ width: searchFocused ? "100%" : "auto" }}
            className="hidden md:flex items-center flex-1 max-w-md relative group"
          >
            <div className={`absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 transition-colors duration-300 ${searchFocused ? "text-blue-400" : "text-slate-500"}`} />
              </div>
              <input
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                type="text"
                className="block w-full pl-11 pr-4 py-3 bg-slate-900/40 border border-slate-800/50 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-xl transition-all duration-500 text-sm font-medium"
                placeholder="Query neural network..."
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 border border-slate-800 rounded text-[10px] font-black text-slate-600 font-mono">
                  CTRL K
                </kbd>
              </div>
            </div>
          </motion.div>

          {/* Premium DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group py-2"
                >
                  <span className={`text-xs font-black uppercase tracking-[0.15em] transition-colors duration-300 ${isActive(link.path) ? "text-blue-400" : "text-slate-400 group-hover:text-white"
                    }`}>
                    {link.name}
                  </span>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-full"
                    />
                  )}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-500/30 group-hover:w-full transition-all duration-300 rounded-full"
                  />
                </Link>
              ))}
            </div>

            <div className="h-6 w-px bg-slate-800 mx-2"></div>

            <div className="flex items-center gap-6">
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 p-1 pr-3 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all"
                  >
                    <div className="relative">
                      <Avatar user={user} size="md" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#020617] shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    </div>
                    <div className="flex flex-col items-start leading-none">
                      <span className="text-[10px] font-black text-white uppercase tracking-tighter">{user.name}</span>
                      <span className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">LVL {user.level}</span>
                    </div>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-4 w-72 bg-[#020617]/95 border border-slate-800 rounded-3xl backdrop-blur-3xl shadow-2xl overflow-hidden z-[110]"
                      >
                        {/* Dropdown Header */}
                        <div className="p-6 bg-gradient-to-b from-blue-600/10 to-transparent border-b border-slate-800/50">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar user={user} size="lg" />
                            <div>
                              <p className="text-sm font-black text-white uppercase tracking-tight">{user.name}</p>
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Master Technician</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                              <span>Neural Sync Progress</span>
                              <span className="text-blue-400">{user.xp}%</span>
                            </div>
                            <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${user.xp}%` }}
                                className="h-full bg-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          {[
                            { name: "My Profile", icon: User, path: "/user/profile" },
                            { name: "Learning Paths", icon: BookOpen, path: "/user/courses" },
                            { name: "Achievements", icon: Award, path: "/user/leaderboard" },
                            { name: "Environment Settings", icon: Settings, path: "/user/settings" },
                          ].map((item, i) => (
                            <Link
                              key={item.name}
                              to={item.path}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group"
                            >
                              <item.icon className="w-4 h-4 group-hover:text-blue-400 transition-colors" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{item.name}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Footer / Logout */}
                        <div className="p-2 border-t border-slate-800/50">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all group"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-left">Disconnect Session</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors group"
                  >
                    <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Access
                  </Link>
                  <Link
                    to="/register"
                    className="relative group p-[1px] rounded-xl overflow-hidden active:scale-95 transition-transform"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:from-blue-500 group-hover:to-indigo-500 transition-all"></div>
                    <div className="relative px-6 py-2.5 bg-slate-950 rounded-[11px] group-hover:bg-transparent transition-all duration-300">
                      <span className="text-xs font-black text-white uppercase tracking-widest">Signalize</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* MOBILE MENU INTERFACE */}
          <div className="lg:hidden flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Futuristic MOBILE OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#020617] border-t border-white/5 overflow-hidden backdrop-blur-3xl"
          >
            <div className="px-6 py-10 space-y-8">
              <div className="flex flex-col gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between group ${isActive(link.path) ? "text-blue-400" : "text-slate-300"
                        }`}
                    >
                      <span className="text-2xl font-black uppercase italic tracking-tighter">
                        {link.name}
                      </span>
                      <ChevronRight className={`w-5 h-5 opacity-0 group-hover:opacity-100 transition-all ${isActive(link.path) ? "opacity-100 text-blue-400" : "text-slate-500"
                        }`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="h-px bg-slate-900"></div>

              {user ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                    <Avatar user={user} size="lg" />
                    <div>
                      <p className="text-white font-black uppercase tracking-tighter">{user.name}</p>
                      <p className="text-[8px] font-bold text-blue-400 uppercase tracking-[0.2em] mt-1">Level {user.level} Technician</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect Session
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl border border-slate-800 text-white font-black uppercase text-[10px] tracking-widest transition-all hover:bg-slate-900"
                  >
                    Access
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center p-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-blue-500/20"
                  >
                    Signalize
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
