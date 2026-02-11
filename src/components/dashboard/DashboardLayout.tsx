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
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import UserAvatar from "@/components/UserAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

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
  const { user, logout } = useAuth();

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

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("You have been logged out");
    } catch (error: any) {
      toast.error(error.message || "Error during logout");
    }
  };

  return (
    <div className="min-h-screen bg-background flex w-full overflow-x-hidden mx-[1px]">
      {/* Sidebar - Icon Only with Tooltips */}
      <TooltipProvider>
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-14 sm:w-16 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Subtle Animated Border - Theme Aware */}
          <motion.div
            className="absolute inset-0 rounded-r-2xl pointer-events-none dark:opacity-40 opacity-20"
            style={{
              padding: '1px',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(14, 165, 233, 0.3), rgba(34, 197, 94, 0.3), rgba(236, 72, 153, 0.3))',
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
          
          <div className="flex flex-col h-full rounded-r-2xl relative z-10 overflow-hidden sidebar-header-match border-r border-border/50 dark:border-border dark:bg-purple-950/50 bg-purple-50/80 backdrop-blur-xl">
            {/* Same gradient overlay as home page header */}
            <div className="absolute inset-0 dark:bg-gradient-to-br dark:from-primary/5 dark:via-transparent dark:to-transparent bg-gradient-to-br from-indigo-50/30 via-blue-50/20 to-purple-50/30 pointer-events-none rounded-r-2xl" />
            <div className="relative z-10 flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center py-3 sm:py-4 md:py-5 border-b border-purple-900/50 relative">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Logo size="md" href="/" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>AEKO.AI</p>
                </TooltipContent>
              </Tooltip>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden absolute top-2 right-2 text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Navigation - Icon Only with Tooltips */}
            <nav className="flex-1 px-1.5 sm:px-2 py-4 sm:py-6 space-y-1 overflow-y-auto">
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
                        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all ${
                          isActive
                            ? "gradient-active-nav text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
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
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 stroke-2 transition-all ${isActive ? 'text-primary dark:text-primary font-semibold' : 'text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground'}`} />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-md"
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          )}
                          {/* Click Animation Effect - Theme Aware */}
                          <motion.div
                            className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileTap={{ 
                              scale: [0, 2, 2.5, 0],
                              opacity: [0, 1, 0.8, 0]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          {/* Secondary Ring on Click */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary/50"
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
                        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all ${
                          isActive
                            ? "gradient-active-nav text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
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
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 stroke-2 transition-all ${isActive ? 'text-primary dark:text-primary font-semibold' : 'text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground'}`} />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-md"
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          )}
                          {/* Click Animation Effect - Theme Aware */}
                          <motion.div
                            className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileTap={{ 
                              scale: [0, 2, 2.5, 0],
                              opacity: [0, 1, 0.8, 0]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          {/* Secondary Ring on Click */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary/50"
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
                      className={`relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all ${
                        isToolsActive
                          ? "gradient-active-nav text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
                      }`}
                    >
                      <Wrench className="w-4 h-4 sm:w-5 sm:h-5 stroke-2 text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground" />
                      {/* Click Animation Effect - Theme Aware */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: [0, 2, 2.5, 0],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Secondary Ring on Click */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/50"
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
                                  className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full transition-all ${
                                    isActive
                                      ? "gradient-active-nav text-foreground"
                                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
                                  }`}
                                >
                                  <motion.div
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    whileTap={{ scale: 0.85, rotate: -5 }}
                                    className="relative"
                                  >
                                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-2 text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground ${isActive ? 'text-primary dark:text-primary font-semibold' : ''}`} />
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
                      className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all ${
                        location.pathname === "/dashboard/agent-store"
                          ? "gradient-active-nav text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
                      }`}
                    >
                      <Store className="w-4 h-4 sm:w-5 sm:h-5 stroke-2 text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground" />
                      {/* Click Animation Effect - Theme Aware */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: [0, 2, 2.5, 0],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Secondary Ring on Click */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/50"
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
                      className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all ${
                        location.pathname === "/dashboard/tools"
                          ? "gradient-active-nav text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
                      }`}
                    >
                      <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 stroke-2 text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground" />
                      {location.pathname === "/dashboard/tools" && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-md"
                          animate={{
                            opacity: [0.3, 0.6, 0.3],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                      {/* Click Animation Effect - Theme Aware */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: [0, 2, 2.5, 0],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Secondary Ring on Click */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/50"
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
                        className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full transition-all ${
                          isActive
                            ? "gradient-active-nav text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50"
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
                          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 stroke-2 transition-all ${isActive ? 'text-primary dark:text-primary font-semibold' : 'text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground'}`} />
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-md"
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut',
                              }}
                            />
                          )}
                          {/* Click Animation Effect - Theme Aware */}
                          <motion.div
                            className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-xl"
                            initial={{ scale: 0, opacity: 0 }}
                            whileTap={{ 
                              scale: [0, 2, 2.5, 0],
                              opacity: [0, 1, 0.8, 0]
                            }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                          {/* Secondary Ring on Click */}
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-primary/50"
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
            <div className="px-1.5 sm:px-2 pb-2 sm:pb-3 space-y-1 border-t border-purple-900/50 pt-2 sm:pt-3 mt-auto">
              {/* Theme Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={toggleTheme}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.85, rotate: -5 }}
                    className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50 transition-all"
                    title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                  >
                    {theme === "dark" ? (
                      <Sun className="w-4 h-4 sm:w-5 sm:h-5 stroke-2 text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground" />
                    ) : (
                      <Moon className="w-4 h-4 sm:w-5 sm:h-5 stroke-2 text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground" />
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
                      className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50 transition-all"
                    >
                      <UserAvatar user={user} size="md" />
                      {/* Click Animation Effect - Theme Aware */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30 blur-xl"
                        initial={{ scale: 0, opacity: 0 }}
                        whileTap={{ 
                          scale: [0, 2, 2.5, 0],
                          opacity: [0, 1, 0.8, 0]
                        }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                      />
                      {/* Secondary Ring on Click */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary/50"
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
                    className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:hover:bg-accent/50 transition-all"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5 stroke-2 text-foreground/70 dark:text-foreground/70 font-medium hover:text-foreground dark:hover:text-foreground" />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-primary/20 dark:bg-primary/30"
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
      <div className="flex-1 lg:ml-14 xl:ml-16 overflow-x-hidden">
        {/* Mobile Menu Button - Floating */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden fixed top-3 left-3 sm:top-4 sm:left-4 z-50 p-2.5 sm:p-3 rounded-xl bg-card border border-border shadow-lg text-foreground hover:bg-accent/50 dark:hover:bg-accent/50 transition-colors"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
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
