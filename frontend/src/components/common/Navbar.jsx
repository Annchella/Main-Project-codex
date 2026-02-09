import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, X, Code2, User, LogIn, ChevronRight, LogOut, Settings, Award, BookOpen, Cpu, Atom, Globe, Code, Database, Network, Terminal, Layers, BarChart3, ShieldCheck } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";

const Avatar = ({ user, size = "md", className = "", role = "user" }) => {
  const iconMap = {
    cpu: Cpu, atom: Atom, globe: Globe, code: Code,
    database: Database, network: Network, terminal: Terminal, layers: Layers
  };

  const roleGradients = {
    user: "from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]",
    tutor: "from-cyan-600 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.3)]",
    admin: "from-emerald-600 to-teal-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
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
    <div className={`${sizes[size]} bg-gradient-to-br ${roleGradients[role] || roleGradients.user} flex items-center justify-center text-white font-black border border-white/10 ${className}`}>
      <Icon className={size === "lg" ? "w-6 h-6" : "w-4 h-4"} />
    </div>
  );
};


const MenuLink = ({ to, icon: Icon, name, theme, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all group"
  >
    <Icon className={`w-4 h-4 ${theme.hover} transition-colors`} />
    <span className="text-[11px] font-black uppercase tracking-widest">{name}</span>
  </Link>
);

const Navbar = ({ onToggleSidebar, isSidebarCollapsed }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "user");
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

    const savedToken = localStorage.getItem("token");
    if (savedToken) {
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

  // Role-Based Navigation Configuration
  const navConfigs = {
    user: {
      links: [
        { name: "Dashboard", path: "/user" },
        { name: "Courses", path: "/user/courses" },
        { name: "Blogs", path: "/blogs" },
        { name: "Resume", path: "/resume-builder" },
      ],
      themeColor: "blue",
      accentHex: "#3b82f6",
      label: "Neural_Core v4"
    },
    tutor: {
      links: [
        { name: "Terminal", path: "/tutor" },
        { name: "Portfolio", path: "/tutor/portfolio" },
        { name: "My Courses", path: "/tutor/manage-courses" },
        { name: "Students", path: "/tutor/enrollments" },
      ],
      themeColor: "cyan",
      accentHex: "#06b6d4",
      label: "Tutor_Engine x1"
    },
    admin: {
      links: [
        { name: "Command", path: "/admin" },
        { name: "Course Approvals", path: "/admin/approvals" },
        { name: "Tutor Approvals", path: "/admin/tutor-approvals" },
      ],
      themeColor: "emerald",
      accentHex: "#10b981",
      label: "System_Root v9"
    }
  };

  const config = navConfigs[role] || navConfigs.user;

  const themeClasses = {
    blue: {
      bg: "bg-blue-600",
      text: "text-blue-500",
      shadow: "shadow-blue-500/40",
      glow: "bg-blue-500/20",
      border: "focus:ring-blue-500/50 focus:border-blue-500/50 hover:border-blue-500/50",
      active: "text-blue-400",
      hover: "group-hover:text-blue-400",
      indicator: "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
    },
    cyan: {
      bg: "bg-cyan-600",
      text: "text-cyan-500",
      shadow: "shadow-cyan-500/40",
      glow: "bg-cyan-500/20",
      border: "focus:ring-cyan-500/50 focus:border-cyan-500/50 hover:border-cyan-500/50",
      active: "text-cyan-400",
      hover: "group-hover:text-cyan-400",
      indicator: "bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]"
    },
    emerald: {
      bg: "bg-emerald-600",
      text: "text-emerald-500",
      shadow: "shadow-emerald-500/40",
      glow: "bg-emerald-500/20",
      border: "focus:ring-emerald-500/50 focus:border-emerald-500/50 hover:border-emerald-500/50",
      active: "text-emerald-400",
      hover: "group-hover:text-emerald-400",
      indicator: "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
    }
  }[config.themeColor];

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
        <div className="flex items-center justify-between gap-8 h-14">
          {/* Futuristic LOGO + TOGGLE */}
          <div className="flex items-center gap-6">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onToggleSidebar}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </motion.button>

            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all"
              >
                <img src="/integrax-logo.jpg" alt="IntegraX" className="w-full h-full object-cover" />
              </motion.div>
              <div className="flex flex-col leading-none">
                <span className="text-2xl font-black tracking-tighter text-white uppercase italic">
                  Integra<span className={`${themeClasses.text}`}>X</span>
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-0.5">{config.label}</span>
              </div>
            </Link>
          </div>

          {/* Advanced Search Bar */}
          <motion.div
            animate={{ width: searchFocused ? "100%" : "auto" }}
            className="hidden md:flex items-center flex-1 max-w-md relative group"
          >
            <div className={`absolute inset-0 ${themeClasses.glow} blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 rounded-2xl`}></div>
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 transition-colors duration-300 ${searchFocused ? themeClasses.text : "text-slate-500"}`} />
              </div>
              <input
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                type="text"
                className={`block w-full pl-11 pr-4 py-3 bg-slate-900/40 border border-slate-800/50 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 backdrop-blur-xl transition-all duration-500 text-sm font-medium ${themeClasses.border}`}
                placeholder="Query neural network..."
              />
            </div>
          </motion.div>

          {/* Role-Specific DESKTOP NAVIGATION */}
          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8">
              {config.links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative group py-2"
                >
                  <span className={`text-[12px] font-black uppercase tracking-[0.15em] transition-colors duration-300 ${isActive(link.path) ? themeClasses.active : "text-slate-400 group-hover:text-white"
                    }`}>
                    {link.name}
                  </span>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navTab"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${themeClasses.indicator}`}
                    />
                  )}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/10 group-hover:w-full transition-all duration-300 rounded-full"
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
                    className={`flex items-center gap-3 p-1 pr-3 rounded-2xl bg-slate-900/50 border border-slate-800 transition-all ${themeClasses.border}`}
                  >
                    <div className="relative">
                      <Avatar user={user} size="md" role={role} />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#020617] shadow-lg ${role === 'admin' ? 'bg-emerald-500' : role === 'tutor' ? 'bg-cyan-500' : 'bg-blue-500'}`}></div>
                    </div>
                    <div className="flex flex-col items-start leading-none gap-0.5">
                      <span className="text-xs font-black text-white uppercase tracking-tighter">{user.name}</span>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${themeClasses.text}`}>{role.toUpperCase()} CORE</span>
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
                        <div className="p-6 bg-gradient-to-b from-white/5 to-transparent border-b border-slate-800/50">
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar user={user} size="lg" role={role} />
                            <div>
                              <p className="text-sm font-black text-white uppercase tracking-tight">{user.name}</p>
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${themeClasses.text}`}>{role} Authority</p>
                            </div>
                          </div>

                          {role === 'user' && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Neural Sync Progress</span>
                                <span className={themeClasses.active}>{user.xp}%</span>
                              </div>
                              <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${user.xp}%` }}
                                  className={themeClasses.bg}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="p-2">
                          {role === 'user' ? (
                            <>
                              <MenuLink to="/user/profile" icon={User} name="My Profile" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                              <MenuLink to="/user/courses" icon={BookOpen} name="Learning Paths" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                              <MenuLink to="/user/leaderboard" icon={Award} name="Achievements" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                            </>
                          ) : role === 'tutor' ? (
                            <>
                              <MenuLink to="/tutor" icon={User} name="Tutor Profile" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                              <MenuLink to="/tutor/portfolio" icon={Award} name="My Portfolio" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                              <MenuLink to="/tutor/manage-courses" icon={Layers} name="My Courses" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                              <MenuLink to="/tutor/purchases" icon={BarChart3} name="Performance" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                            </>
                          ) : (
                            <>
                              <MenuLink to="/admin" icon={ShieldCheck} name="Admin Panel" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                              <MenuLink to="/admin/approvals" icon={Layers} name="Course Approvals" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                              <MenuLink to="/admin/tutor-approvals" icon={User} name="Tutor Approvals" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                            </>
                          )}
                          <MenuLink to="/settings" icon={Settings} name="Environment Settings" theme={themeClasses} onClick={() => setIsUserMenuOpen(false)} />
                        </div>

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
                    <div className={`absolute inset-0 ${themeClasses.bg} group-hover:opacity-80 transition-all`}></div>
                    <div className="relative px-6 py-2.5 bg-slate-950 rounded-[11px] group-hover:bg-transparent transition-all duration-300">
                      <span className="text-xs font-black text-white uppercase tracking-widest">Signalize</span>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="lg:hidden flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-300"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </div>

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
                {config.links.map((link, i) => (
                  <motion.div key={link.path} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center justify-between group ${isActive(link.path) ? themeClasses.active : "text-slate-300"}`}
                    >
                      <span className="text-2xl font-black uppercase italic tracking-tighter">{link.name}</span>
                      <ChevronRight className={`w-5 h-5 ${isActive(link.path) ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-all`} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
