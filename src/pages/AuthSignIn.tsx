import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Apple, Chrome, Bot, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logoDark from "@/assets/ChatGPT Image Dec 25, 2025, 03_45_44 PM.png";

interface ChatMessage {
  id: number;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
}

// Demo chat messages
const demoMessages: ChatMessage[] = [
  {
    id: 1,
    role: "user",
    content: "Build an AI marketing agent that can search",
    timestamp: new Date(),
  },
  {
    id: 2,
    role: "agent",
    content: "I'll help you create a marketing agent with search capabilities. What specific features would you like it to have?",
    timestamp: new Date(),
  },
  {
    id: 3,
    role: "user",
    content: "It should be able to research competitors and analyze trends",
    timestamp: new Date(),
  },
  {
    id: 4,
    role: "agent",
    content: "Perfect! I'll configure it with web search, competitor analysis, and trend monitoring capabilities.",
    timestamp: new Date(),
  },
];

const AuthSignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([demoMessages[0]]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  // Auto-advance chat messages
  useEffect(() => {
    if (currentMessageIndex < demoMessages.length - 1) {
      const timer = setTimeout(() => {
        setChatMessages(demoMessages.slice(0, currentMessageIndex + 2));
        setCurrentMessageIndex(currentMessageIndex + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      // Reset after showing all messages
      const resetTimer = setTimeout(() => {
        setChatMessages([demoMessages[0]]);
        setCurrentMessageIndex(0);
      }, 5000);
      return () => clearTimeout(resetTimer);
    }
  }, [currentMessageIndex]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, navigate directly to Agent LLM page
    navigate("/dashboard/tools/agent");
  };

  const handleGoogleSignIn = () => {
    navigate("/dashboard/tools/agent");
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Login/Signup UI */}
      <div className="w-full lg:w-[480px] bg-card flex flex-col p-8 lg:p-8 relative z-10 overflow-hidden">
        {/* Animated Background Glow Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-12 relative z-10"
        >
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
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-bold text-white">AEKO.</span>
            <motion.span
              className="text-2xl font-bold"
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
        </motion.div>

        {/* Sign up or Login with */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-white text-2xl font-semibold mb-1">
            {isSignUp ? "Create your account" : "Sign up or Login with"}
          </h2>
          <p className="text-gray-400 text-sm">
            {isSignUp ? "Join AEKO Creative Suite today" : "Get started with AI-powered creativity"}
          </p>
        </motion.div>

        {/* Login Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3 flex-1"
        >
          {/* Google */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-[#1F2937] hover:bg-[#374151] border border-white/10 text-white justify-start gap-3 rounded-xl transition-all duration-300"
              onClick={handleGoogleSignIn}
            >
              <div className="relative z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span className="font-semibold text-base relative z-10">Google</span>
            </Button>
          </motion.div>

          {/* GitHub */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-[#0D1117] hover:bg-[#161B22] border border-white/10 text-white justify-start gap-3 rounded-xl transition-all duration-300"
              onClick={() => navigate("/dashboard/tools/agent")}
            >
              <div className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="font-semibold text-base relative z-10">GitHub</span>
            </Button>
          </motion.div>

          {/* Apple */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-[#000000] hover:bg-[#1C1C1C] text-white justify-start gap-3 rounded-xl transition-all duration-300 border-0"
              onClick={() => navigate("/dashboard/tools/agent")}
            >
              <div className="relative z-10 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                <Apple className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-base relative z-10">Apple</span>
            </Button>
          </motion.div>

          {/* Microsoft */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-[#2F2F2F] hover:bg-[#3A3A3A] border border-white/10 text-white justify-start gap-3 rounded-xl transition-all duration-300"
              onClick={() => navigate("/dashboard/tools/agent")}
            >
              <div className="relative z-10 w-7 h-7 rounded-lg bg-white flex items-center justify-center">
                <div className="w-4 h-4 bg-[#2F2F2F] rounded-sm grid grid-cols-2 gap-0.5">
                  <div className="bg-[#F25022]"></div>
                  <div className="bg-[#7FBA00]"></div>
                  <div className="bg-[#00A4EF]"></div>
                  <div className="bg-[#FFB900]"></div>
                </div>
              </div>
              <span className="font-semibold text-base relative z-10">Microsoft</span>
            </Button>
          </motion.div>

          {/* Continue with Email - Main CTA */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-white justify-start gap-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 border-0"
              onClick={() => setShowEmailForm(!showEmailForm)}
            >
              <div className="relative z-10 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-base relative z-10">Continue with Email</span>
            </Button>
          </motion.div>

          {/* Email/Password Form - Show when Continue with Email is clicked */}
          {showEmailForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="mt-4 space-y-4 p-6 bg-card/90 rounded-xl border-2 border-border shadow-xl backdrop-blur-sm"
            >
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-card/80 border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-card/80 border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 h-11 border-2 text-foreground font-semibold rounded-lg transition-all duration-300 ${
                    !isSignUp 
                      ? "bg-primary/30 border-primary shadow-lg shadow-primary/20" 
                      : "bg-card/60 border-border hover:border-primary/40"
                  }`}
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 h-11 border-2 text-foreground font-semibold rounded-lg transition-all duration-300 ${
                    isSignUp 
                      ? "bg-primary/30 border-primary shadow-lg shadow-primary/20" 
                      : "bg-card/60 border-border hover:border-primary/40"
                  }`}
                >
                  Sign Up
                </Button>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "linear",
                    }}
                  />
                  <span className="relative z-10">{isSignUp ? "Create Account" : "Sign In"}</span>
                </Button>
              </motion.div>
            </motion.form>
          )}

          {/* Need help link */}
          <div className="pt-4">
            <Link to="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 inline-flex items-center gap-1 group">
              Need help?
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-primary"
              >
                →
              </motion.span>
            </Link>
          </div>
        </motion.div>

        {/* Mobile App Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-auto pt-8"
        >
          <p className="text-foreground text-sm mb-4 font-medium">Available now on iOS and Android</p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                onClick={() => toast.info("App Store link coming soon")}
              >
                <Apple className="w-5 h-5 mr-2" />
                <span className="text-xs font-semibold">App Store</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                onClick={() => toast.info("Google Play link coming soon")}
              >
                <Chrome className="w-5 h-5 mr-2" />
                <span className="text-xs font-semibold">Google Play</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>

     {/* Right Panel - Sky Video Background with Chat */}
<div className="hidden lg:flex flex-1 items-center justify-center bg-background p-6 pt-2 relative overflow-hidden">
  
  {/* Adjusted background glow - moved higher (top-1/3) to follow the video */}
  <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

  <motion.div 
    className="relative w-full max-w-5xl -mt-20" // Negative margin pulls the video up
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      y: [0, 0, 0] 
    }}
    transition={{ 
      duration: 1,
      y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
  >
    {/* Outer Container - Reduced padding from p-1.5 to p-1 */}
    <div className="relative rounded-[32px] p-1 overflow-hidden shadow-2xl bg-white/5 backdrop-blur-sm">
      
      {/* Primary Cinematic Border */}
      <motion.div
        className="absolute inset-0 rounded-[32px] pointer-events-none"
        style={{
          padding: '2px',
          background: 'linear-gradient(135deg, #7C3AED, #3B82F6, #22D3EE, #EC4899, #7C3AED)',
          backgroundSize: '200% 200%',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Video Container - Switched to aspect-[16/9] for a tighter vertical fit */}
      <div 
        className="relative rounded-[28px] overflow-hidden shadow-2xl bg-black aspect-[16/9] sm:aspect-[1.6/1]" 
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-90"
        >
          <source src="/feeds/video19.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] border border-white/10 rounded-[28px]" />
      </div>
    </div>
  </motion.div>
</div>
    </div>
  );
};

export default AuthSignIn;
