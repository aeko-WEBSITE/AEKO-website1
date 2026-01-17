import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, MessageSquare, Image, Video, Sparkles, Bot, Plug, Film, Mic, Zap, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoDark from "@/assets/ChatGPT Image Dec 25, 2025, 03_45_44 PM.png";
// import logoLight from "@/assets/ak-logo.png"; // Uncomment when you add the AK logo file
import { useTheme } from "@/hooks/use-theme";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { scrollY } = useScroll();

  // Track scroll position for Dynamic Island morphing
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const modelsMenuItems = [
    { 
      name: "LLM Agent", 
      icon: MessageSquare, 
      path: "/dashboard/tools/agent",
      description: "Chat with AI agents"
    },
    { 
      name: "Image Generation", 
      icon: Image, 
      path: "/dashboard/tools/image",
      description: "Create stunning images"
    },
    { 
      name: "Video Generation", 
      icon: Video, 
      path: "/dashboard/tools/video",
      description: "Generate videos with AI"
    },
    { 
      name: "Custom Agent", 
      icon: Sparkles, 
      path: "/dashboard/agent-store",
      description: "Build your own agent"
    },
  ];

  const featuresMenuItems = [
    {
      name: "Custom AI Agent",
      icon: Bot,
      path: "/dashboard/agent-store",
      description: "Build and customize AI agents",
    },
    {
      name: "Tool Integration",
      icon: Plug,
      path: "/dashboard/tools",
      description: "Integrate with your favorite tools",
    },
    {
      name: "Image and Video Generation",
      icon: Film,
      path: "/dashboard/tools/image",
      description: "Create images and videos with AI",
    },
    {
      name: "Voice AI Agent",
      icon: Mic,
      path: "/dashboard/tools/agent",
      description: "Interact with voice-enabled AI",
    },
    {
      name: "Advanced AI Tools",
      icon: Zap,
      path: "/dashboard/tools",
      description: "Powerful AI tools and utilities",
    },
  ];

  const navLinks = [
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#developers" },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center pt-2 md:pt-3"
    >
      {/* Dynamic Island Container */}
      <motion.div
        className="relative"
        animate={{
          width: isExpanded || isOpen ? "100%" : "auto",
        }}
        transition={{
          duration: 0.4,
          ease: [0.4, 0, 0.2, 1],
        }}
        style={{
          maxWidth: isExpanded || isOpen ? "100%" : "fit-content",
        }}
      >
        {/* Dynamic Island Capsule */}
        <motion.div
          className="relative mx-auto"
          animate={{
            borderRadius: isScrolled || isOpen ? "20px" : "9999px",
            padding: isScrolled || isOpen ? "0px" : "0px",
            width: isExpanded || isOpen ? "100%" : "auto",
          }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          {/* Glass Background with Blur - Purple Gradient */}
          <motion.div
            className="relative overflow-hidden bg-gradient-to-b from-purple-900/90 via-purple-800/80 to-purple-900/90 border-2 border-white"
            animate={{
              backdropFilter: "blur(20px) saturate(180%)",
              borderRadius: isScrolled || isOpen ? "20px" : "9999px",
              boxShadow: isScrolled || isOpen
                ? "0 8px 32px rgba(124, 58, 237, 0.3)"
                : "0 8px 32px rgba(124, 58, 237, 0.2)",
            }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {/* Rainbow Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 via-blue-500/20 via-green-500/20 via-yellow-500/20 to-purple-600/30 rounded-r-2xl pointer-events-none" 
              style={{ borderRadius: isScrolled || isOpen ? "20px" : "9999px" }}
            />
            {/* Animated Gradient Border */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(59, 130, 246, 0.5), rgba(34, 211, 238, 0.5), rgba(236, 72, 153, 0.5))",
                backgroundSize: "200% 200%",
                borderRadius: "inherit",
                padding: "1px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                borderRadius: isScrolled || isOpen ? "20px" : "9999px",
              }}
              transition={{
                backgroundPosition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                },
                borderRadius: {
                  duration: 0.4,
                  ease: [0.4, 0, 0.2, 1],
                },
              }}
            />

            {/* Content Container */}
            <div className="relative px-4 md:px-6 py-1.5 md:py-2 z-10">
              <div className="flex items-center justify-between gap-4 md:gap-8">
                {/* Left Side - Logo */}
                <motion.a
                  href="#"
                  className="flex items-center gap-2 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative w-7 h-7 md:w-8 md:h-8 flex items-center justify-center">
                    {/* Animated Border */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        padding: '2px',
                        background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(59, 130, 246, 0.8), rgba(34, 211, 238, 0.8), rgba(236, 72, 153, 0.8))',
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
                    {/* Logo Container */}
                    <div className="relative w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
                      <img 
                        src={logoDark} 
                        alt="AEKO" 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-sm md:text-base font-bold text-white">AEKO.</span>
                    <motion.span
                      className="text-sm md:text-base font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #7C3AED, #3B82F6, #22D3EE, #22C55E, #FACC15, #EC4899, #7C3AED)',
                        backgroundSize: '200% 200%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      AI
                    </motion.span>
                  </div>
                </motion.a>

                {/* Right Side - All Nav Links + CTA */}
                <div className="hidden md:flex items-center gap-4 lg:gap-6">
                  {/* Models Dropdown */}
                  <DropdownMenu onOpenChange={(open) => setIsExpanded(open)}>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        className="text-xs sm:text-sm text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg hover:bg-white/5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Models
                        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 backdrop-blur-xl bg-card dark:bg-black/80 border-border dark:border-white/10">
                      {modelsMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="cursor-pointer hover:bg-accent dark:hover:bg-white/10"
                          >
                            <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground dark:text-white">{item.name}</span>
                              <span className="text-xs text-muted-foreground dark:text-white/60">{item.description}</span>
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Features Dropdown */}
                  <DropdownMenu onOpenChange={(open) => setIsExpanded(open)}>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        className="text-xs sm:text-sm text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-1.5 px-2 sm:px-3 py-1 rounded-lg hover:bg-white/5"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Features
                        <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 backdrop-blur-xl bg-card dark:bg-black/80 border-border dark:border-white/10">
                      {featuresMenuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <DropdownMenuItem
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="cursor-pointer hover:bg-accent dark:hover:bg-white/10"
                          >
                            <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                            <div className="flex flex-col">
                              <span className="font-medium text-foreground dark:text-white">{item.name}</span>
                              <span className="text-xs text-muted-foreground dark:text-white/60">{item.description}</span>
                            </div>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {navLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      className="text-xs sm:text-sm text-white/90 hover:text-white transition-colors duration-200 px-2 sm:px-3 py-1 rounded-lg hover:bg-white/5"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate("/auth/sign-in")}
                      className="text-foreground/90 dark:text-white/90 hover:text-foreground dark:hover:text-white hover:bg-accent dark:hover:bg-white/10"
                    >
                      Sign In
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => navigate("/auth/sign-in")}
                      className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg"
                    >
                      Start Creating
                    </Button>
                  </motion.div>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 text-foreground dark:text-white rounded-lg hover:bg-accent dark:hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Mobile Menu - Expanded from Dynamic Island */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-20 md:top-24 left-4 right-4 md:hidden z-40"
          >
            <motion.div
              className="backdrop-blur-2xl bg-gradient-to-b from-purple-900/90 via-purple-800/80 to-purple-900/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative"
              initial={{ borderRadius: "9999px" }}
              animate={{ borderRadius: "20px" }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Rainbow Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 via-blue-500/20 via-green-500/20 via-yellow-500/20 to-purple-600/30 rounded-2xl pointer-events-none" />
              <div className="relative z-10 px-6 py-6 space-y-4 max-h-[80vh] overflow-y-auto">
                {/* Mobile Models Menu */}
                <div>
                  <div className="text-sm font-semibold text-foreground dark:text-white mb-3 px-2">Models</div>
                  <div className="space-y-1">
                    {modelsMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.a
                          key={item.path}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            navigate(item.path);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 dark:text-white/80 hover:text-foreground dark:hover:text-white hover:bg-accent dark:hover:bg-white/10 transition-colors"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-4 h-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs text-muted-foreground dark:text-white/50">{item.description}</span>
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Features Menu */}
                <div>
                  <div className="text-sm font-semibold text-foreground dark:text-white mb-3 px-2">Features</div>
                  <div className="space-y-1">
                    {featuresMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.a
                          key={item.path}
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOpen(false);
                            navigate(item.path);
                          }}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-foreground/80 dark:text-white/80 hover:text-foreground dark:hover:text-white hover:bg-accent dark:hover:bg-white/10 transition-colors"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Icon className="w-4 h-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-xs text-muted-foreground dark:text-white/50">{item.description}</span>
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                </div>

                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2.5 rounded-lg text-sm text-foreground/80 dark:text-white/80 hover:text-foreground dark:hover:text-white hover:bg-accent dark:hover:bg-white/10 transition-colors"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.name}
                  </motion.a>
                ))}
                
                <div className="pt-4 border-t border-white/10 space-y-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-foreground dark:text-white hover:bg-accent dark:hover:bg-white/10"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/auth/sign-in");
                      }}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="default"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
                      onClick={() => {
                        setIsOpen(false);
                        navigate("/auth/sign-in");
                      }}
                    >
                      Start Creating
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
