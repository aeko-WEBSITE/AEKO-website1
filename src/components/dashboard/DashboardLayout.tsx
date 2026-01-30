import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Compass,
  User,
  Wrench,
  HelpCircle,
  Menu,
  X,
  LogOut,
  CreditCard,
  ChevronDown,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Sun,
  Moon,
  Store,
  Briefcase,
} from "lucide-react";
import logoDark from "@/assets/ChatGPT Image Dec 25, 2025, 03_45_44 PM.png";
// import logoLight from "@/assets/ak-logo.png"; // Uncomment when you add the AK logo file
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { authAPI } from "@/lib/api";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";

const navItems = [
  { path: "/dashboard", icon: Home, label: "Dashboard" },
  { path: "/dashboard/feed", icon: Compass, label: "Feed" },
  { path: "/dashboard/support", icon: HelpCircle, label: "Support" },
];

const toolsSubItems = [
  { path: "/dashboard/tools-old/agent", icon: MessageSquare, label: "Agent LLM" },
  { path: "/dashboard/tools-old/image", icon: ImageIcon, label: "Image" },
  { path: "/dashboard/tools-old/video", icon: Video, label: "Video" },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isToolsActive = location.pathname.startsWith("/dashboard/tools-old");
  // Auto-open dropdown if on tools page
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(isToolsActive);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update dropdown state when location changes
  useEffect(() => {
    if (isToolsActive) {
      setToolsDropdownOpen(true);
    }
  }, [isToolsActive]);

  const handleLogout = () => {
    // Clear auth state (localStorage) and redirect to landing page
    authAPI.logout();
    toast.success("You have been logged out");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex w-full overflow-x-hidden mx-[1px]">
      {/* Sidebar - Icon Only with Tooltips */}
      <TooltipProvider>
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-16 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Bold Black Animated Border */}
          <motion.div
            className="absolute inset-0 rounded-r-2xl pointer-events-none"
            style={{
              padding: '4px',
              background: 'linear-gradient(135deg, #000000, #1a1a1a, #000000, #0a0a0a, #000000)',
              backgroundSize: '300% 300%',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* Purple Rainbow Gradient Border - Inner Layer */}
          <motion.div
            className="absolute inset-0 rounded-r-2xl pointer-events-none"
            style={{
              padding: '1.5px',
              background: 'linear-gradient(135deg, #7C3AED, #3B82F6, #22D3EE, #22C55E, #FACC15, #EC4899)',
              backgroundSize: '200% 200%',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          {/* White Animation Highlight Border */}
          <motion.div
            className="absolute inset-0 rounded-r-2xl pointer-events-none"
            style={{
              padding: '2px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5), rgba(255,255,255,0.9), rgba(255,255,255,0.3), rgba(255,255,255,0.9))',
              backgroundSize: '200% 200%',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          
          <div className="flex flex-col h-full bg-gradient-to-b from-purple-900/90 via-purple-800/80 to-purple-900/90 border-r border-border rounded-r-2xl relative z-10 backdrop-blur-sm">
            {/* Rainbow Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 via-blue-500/20 via-green-500/20 via-yellow-500/20 to-purple-600/30 rounded-r-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center py-5 border-b border-border relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/" className="flex items-center justify-center">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      {/* Animated Border */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          padding: '3px',
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.5), rgba(255,255,255,0.9))',
                          backgroundSize: '200% 200%',
                          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                          WebkitMaskComposite: 'xor',
                          maskComposite: 'exclude',
                        }}
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      {/* Logo Container - Simple as before */}
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
                        <img 
                          src={logoDark} 
                          alt="AEKO" 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    </div>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>AEKO.AI</p>
                </TooltipContent>
              </Tooltip>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation - Icon Only with Tooltips */}
            <nav className="flex-1 px-2 py-6 space-y-1 overflow-y-auto">
              {/* 1. Dashboard */}
              {navItems.filter(item => item.path === "/dashboard").map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                          isActive
                            ? "gradient-active-nav text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.85, rotate: -5 }}
                          className="relative"
                          animate={isActive ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0],
                          } : {}}
                          transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                          }}
                        >
                          <Icon className={`w-5 h-5 stroke-2 transition-all ${isActive ? 'text-white font-bold drop-shadow-2xl' : 'text-white font-bold hover:text-white'}`} style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/40 via-pink-400/40 to-blue-400/40 blur-md"
                              animate={{
                                opacity: [0.4, 0.8, 0.4],
                                scale: [1, 1.3, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          )}
                          {/* Bright Click Animation Effect */}
                          <motion.div
                            className="absolute inset-0 rounded-full bg-white blur-xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileTap={{ 
                              scale: [0, 2, 2.5, 0],
                              opacity: [0, 1, 0.8, 0]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          {/* Secondary Bright Ring on Click */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white"
                            initial={{ scale: 1, opacity: 0 }}
                            whileTap={{ 
                              scale: [1, 2, 2.5],
                              opacity: [0, 0.9, 0]
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </motion.div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              {/* 2. Feed */}
              {navItems.filter(item => item.path === "/dashboard/feed").map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                          isActive
                            ? "gradient-active-nav text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.85, rotate: -5 }}
                          className="relative"
                          animate={isActive ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0],
                          } : {}}
                          transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                          }}
                        >
                          <Icon className={`w-5 h-5 stroke-2 transition-all ${isActive ? 'text-white font-bold drop-shadow-2xl' : 'text-white font-bold hover:text-white'}`} style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/40 via-pink-400/40 to-blue-400/40 blur-md"
                              animate={{
                                opacity: [0.4, 0.8, 0.4],
                                scale: [1, 1.3, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          )}
                          {/* Bright Click Animation Effect */}
                          <motion.div
                            className="absolute inset-0 rounded-full bg-white blur-xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileTap={{ 
                              scale: [0, 2, 2.5, 0],
                              opacity: [0, 1, 0.8, 0]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          {/* Secondary Bright Ring on Click */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white"
                            initial={{ scale: 1, opacity: 0 }}
                            whileTap={{ 
                              scale: [1, 2, 2.5],
                              opacity: [0, 0.9, 0]
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </motion.div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}

              {/* 3. AI Tools with Dropdown */}
              <div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.85, rotate: -5 }}
                      className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        isToolsActive
                          ? "bg-pink-500/20 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                      }`}
                    >
                      <Wrench className="w-5 h-5 stroke-2 text-white font-bold" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                      {/* Bright Click Animation Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: [0, 2, 2.5, 0],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Secondary Bright Ring on Click */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white"
                        initial={{ scale: 1, opacity: 0 }}
                        whileTap={{ 
                          scale: [1, 2, 2.5],
                          opacity: [0, 0.9, 0]
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>AI Tools</p>
                  </TooltipContent>
                </Tooltip>
                <AnimatePresence>
                  {toolsDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-1"
                    >
                      <div className="pl-0 mt-1 space-y-1">
                        {toolsSubItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.path;
                          return (
                            <Tooltip key={item.path}>
                              <TooltipTrigger asChild>
                                <Link
                                  to={item.path}
                                  onClick={() => {
                                    setSidebarOpen(false);
                                  }}
                                  className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                                    isActive
                                      ? "gradient-active-nav text-foreground"
                                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                                  }`}
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    whileTap={{ scale: 0.85, rotate: -5 }}
                                    className="relative"
                                  >
                                    <Icon className={`w-4 h-4 stroke-2 text-white font-bold ${isActive ? 'drop-shadow-2xl' : ''}`} style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                                    {/* Bright Click Animation Effect */}
                                    <motion.div
                                      className="absolute inset-0 rounded-full bg-white blur-xl"
                                      initial={{ scale: 0, opacity: 0 }}
                                      whileTap={{ 
                                        scale: [0, 2, 2.5, 0],
                                        opacity: [0, 1, 0.8, 0]
                                      }}
                                      transition={{ duration: 0.6, ease: "easeOut" }}
                                    />
                                    {/* Secondary Bright Ring on Click */}
                                    <motion.div
                                      className="absolute inset-0 rounded-full border-2 border-white"
                                      initial={{ scale: 1, opacity: 0 }}
                                      whileTap={{ 
                                        scale: [1, 2, 2.5],
                                        opacity: [0, 0.9, 0]
                                      }}
                                      transition={{ duration: 0.5, ease: "easeOut" }}
                                    />
                                  </motion.div>
                                </Link>
                              </TooltipTrigger>
                              <TooltipContent side="right">
                                <p>{item.label}</p>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 4. Agent Store */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.85, rotate: -5 }}
                    className="relative"
                  >
                    <Link
                      to="/dashboard/agent-store"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        location.pathname === "/dashboard/agent-store"
                          ? "bg-pink-500/20 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                      }`}
                    >
                      <Store className="w-5 h-5 stroke-2 text-white font-bold" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                      {/* Bright Click Animation Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: [0, 2, 2.5, 0],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Secondary Bright Ring on Click */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white"
                        initial={{ scale: 1, opacity: 0 }}
                        whileTap={{ 
                          scale: [1, 2, 2.5],
                          opacity: [0, 0.9, 0]
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Agent Store</p>
                </TooltipContent>
              </Tooltip>

              {/* 5. ToolCase */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.85, rotate: -5 }}
                    className="relative"
                  >
                    <Link
                      to="/dashboard/tools"
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        location.pathname === "/dashboard/tools"
                          ? "gradient-active-nav text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                      }`}
                    >
                      <Briefcase className="w-5 h-5 stroke-2 text-white font-bold" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                      {location.pathname === "/dashboard/tools" && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/40 via-pink-400/40 to-blue-400/40 blur-md"
                          animate={{
                            opacity: [0.4, 0.8, 0.4],
                            scale: [1, 1.3, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                      {/* Bright Click Animation Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: [0, 2, 2.5, 0],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Secondary Bright Ring on Click */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white"
                        initial={{ scale: 1, opacity: 0 }}
                        whileTap={{ 
                          scale: [1, 2, 2.5],
                          opacity: [0, 0.9, 0]
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>ToolCase</p>
                </TooltipContent>
              </Tooltip>

              {/* 6. Support */}
              {navItems.filter(item => item.path === "/dashboard/support").map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                          isActive
                            ? "gradient-active-nav text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}
                      >
                        <motion.div
                          whileHover={{ scale: 1.15, rotate: 5 }}
                          whileTap={{ scale: 0.85, rotate: -5 }}
                          className="relative"
                          animate={isActive ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 5, -5, 0],
                          } : {}}
                          transition={{
                            duration: 0.3,
                            ease: 'easeInOut',
                          }}
                        >
                          <Icon className={`w-5 h-5 stroke-2 transition-all ${isActive ? 'text-white font-bold drop-shadow-2xl' : 'text-white font-bold hover:text-white'}`} style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400/40 via-pink-400/40 to-blue-400/40 blur-md"
                              animate={{
                                opacity: [0.4, 0.8, 0.4],
                                scale: [1, 1.3, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          )}
                          {/* Bright Click Animation Effect */}
                          <motion.div
                            className="absolute inset-0 rounded-full bg-white blur-xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileTap={{ 
                              scale: [0, 2, 2.5, 0],
                              opacity: [0, 1, 0.8, 0]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          {/* Secondary Bright Ring on Click */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white"
                            initial={{ scale: 1, opacity: 0 }}
                            whileTap={{ 
                              scale: [1, 2, 2.5],
                              opacity: [0, 0.9, 0]
                            }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </motion.div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="px-2 pb-2 space-y-1 border-t border-border/50 pt-2 mt-auto">
              {/* Theme Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.85, rotate: -5 }}
                    className="relative flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {theme === "dark" ? (
                      <Sun className="w-5 h-5 stroke-2 text-white font-bold" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                    ) : (
                      <Moon className="w-5 h-5 stroke-2 text-white font-bold" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                    )}
                    {/* Bright Click Animation Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white blur-xl"
                      initial={{ scale: 0, opacity: 0 }}
                      whileTap={{ 
                        scale: [0, 2, 2.5, 0],
                        opacity: [0, 1, 0.8, 0]
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                    {/* Secondary Bright Ring on Click */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-white"
                      initial={{ scale: 1, opacity: 0 }}
                      whileTap={{ 
                        scale: [1, 2, 2.5],
                        opacity: [0, 0.9, 0]
                      }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{theme === "dark" ? "Light Mode" : "Dark Mode"}</p>
                </TooltipContent>
              </Tooltip>

            

              {/* Account Icon */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.85, rotate: -5 }}
                    className="relative"
                  >
                    <Link
                      to="/dashboard/account"
                      className="flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-medium text-sm">
                        A
                      </div>
                      {/* Bright Click Animation Effect */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-white blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: [0, 2, 2.5, 0],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Secondary Bright Ring on Click */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-white"
                        initial={{ scale: 1, opacity: 0 }}
                        whileTap={{ 
                          scale: [1, 2, 2.5],
                          opacity: [0, 0.9, 0]
                        }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </Link>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Account</p>
                </TooltipContent>
              </Tooltip>

              {/* Logout */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    type="button"
                    onClick={handleLogout}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.85, rotate: -5 }}
                    className="relative flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-all"
                  >
                    <LogOut className="w-5 h-5 stroke-2 text-white font-bold" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-white/30"
                      initial={{ scale: 0, opacity: 0 }}
                      whileTap={{ scale: 1.5, opacity: [0.5, 0] }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Logout</p>
                </TooltipContent>
              </Tooltip>
            </div>
            </div>
          </div>
        </aside>
      </TooltipProvider>

      {/* Main Content */}
      <div className="flex-1 lg:ml-16 overflow-x-hidden">
        {/* Mobile Menu Button - Floating */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-card border border-border shadow-lg text-foreground hover:bg-secondary/50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page Content */}
        <main className="p-1 lg:p-2">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;
