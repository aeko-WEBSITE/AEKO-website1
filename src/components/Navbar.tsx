import { motion } from "framer-motion";
import { Menu, X, MessageSquare, Image, Video, Sparkles, Bot, Plug, Film, Mic, Zap, ChevronDown } from "lucide-react";
import { useState } from "react";
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
  const navigate = useNavigate();
  const { theme } = useTheme();

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
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'transparent' }}
    >
      <div className="container mx-auto px-4 lg:px-6" style={{ maxWidth: '1100px' }}>
        <div className="flex items-center justify-between h-14">
          {/* Left Side - Logo */}
          <div className="flex items-center">
            <a href="#" className="flex items-center gap-2">
              <div className="relative w-10 h-10 flex items-center justify-center">
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
                <div className="relative w-8 h-8 rounded-full overflow-hidden bg-transparent flex items-center justify-center">
                  <img 
                    src={logoDark} 
                    alt="AEKO" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-lg font-bold text-white">AEKO.</span>
                <motion.span
                  className="text-lg font-bold"
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
            </a>
          </div>

          {/* Right Side - All Nav Links + CTA */}
          <div className="hidden md:flex items-center gap-6">
            {/* Models Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-1">
                  Models
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {modelsMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="cursor-pointer"
                    >
                      <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-sm text-white/90 hover:text-white transition-colors duration-200 flex items-center gap-1">
                  Features
                  <ChevronDown className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                {featuresMenuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <DropdownMenuItem
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className="cursor-pointer"
                    >
                      <Icon className="w-4 h-4 mr-2" aria-hidden="true" />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.description}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-white/90 hover:text-white transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth/sign-in")}
              className="text-white/90 hover:text-white hover:bg-white/10"
            >
              Sign In
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/auth/sign-in")}
              className="bg-white text-black hover:bg-white/90"
            >
              Start Creating
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background/95 backdrop-blur-xl"
        >
          <div className="container mx-auto px-4 py-4 space-y-4">
            {/* Mobile Models Menu */}
            <div>
              <button className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors font-medium mb-2">
                Models
              </button>
              <div className="pl-4 space-y-2">
                {modelsMenuItems.map((item) => (
                  <a
                    key={item.path}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      navigate(item.path);
                    }}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Features Menu */}
            <div>
              <button className="block w-full text-left text-muted-foreground hover:text-foreground transition-colors font-medium mb-2">
                Features
              </button>
              <div className="pl-4 space-y-2">
                {featuresMenuItems.map((item) => (
                  <a
                    key={item.path}
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(false);
                      navigate(item.path);
                    }}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/auth/sign-in");
                }}
              >
                Sign In
              </Button>
              <Button
                variant="default"
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  navigate("/auth/sign-in");
                }}
              >
                Start Creating
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
