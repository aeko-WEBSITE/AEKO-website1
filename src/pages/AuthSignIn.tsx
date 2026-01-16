import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Apple, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import logoDark from "@/assets/ChatGPT Image Dec 25, 2025, 03_45_44 PM.png";

const AuthSignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, navigate directly to Agent LLM page
    navigate("/dashboard/tools/agent");
  };

  const handleGoogleSignIn = () => {
    navigate("/dashboard/tools/agent");
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a1a]">
      {/* Left Panel - Login/Signup UI */}
      <div className="w-full lg:w-[480px] bg-gradient-to-br from-[#12162A] via-[#1a1f3a] to-[#12162A] flex flex-col p-8 lg:p-12 relative z-10 overflow-hidden">
        {/* Animated Background Glow Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
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
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
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
          {/* Canva */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-teal-500/20 border-2 border-teal-500/50 hover:border-teal-400 hover:from-teal-500/30 hover:via-cyan-500/30 hover:to-teal-500/30 text-white justify-start gap-3 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 transition-all duration-300 relative overflow-hidden group"
              onClick={() => navigate("/dashboard/tools/agent")}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-teal-500/0 via-cyan-500/20 to-teal-500/0"
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
              <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/50">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-base relative z-10">Canva</span>
            </Button>
          </motion.div>

          {/* Apple */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-gradient-to-r from-gray-800/40 via-gray-900/40 to-gray-800/40 border-2 border-gray-600/50 hover:border-gray-500 hover:from-gray-700/50 hover:via-gray-800/50 hover:to-gray-700/50 text-white justify-start gap-3 rounded-xl shadow-lg shadow-gray-900/30 hover:shadow-gray-800/50 transition-all duration-300 relative overflow-hidden group"
              onClick={() => navigate("/dashboard/tools/agent")}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "linear",
                }}
              />
              <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-br from-gray-100 to-white flex items-center justify-center shadow-lg">
                <Apple className="w-5 h-5 text-gray-900" />
              </div>
              <span className="font-semibold text-base relative z-10">Apple</span>
            </Button>
          </motion.div>

          {/* Google */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-gradient-to-r from-blue-500/20 via-red-500/20 via-yellow-500/20 via-green-500/20 to-blue-500/20 border-2 border-blue-400/50 hover:border-blue-300 hover:from-blue-500/30 hover:via-red-500/30 hover:via-yellow-500/30 hover:via-green-500/30 hover:to-blue-500/30 text-white justify-start gap-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 relative overflow-hidden group"
              onClick={handleGoogleSignIn}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-red-500/10 via-yellow-500/10 via-green-500/10 to-blue-500/0"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "linear",
                }}
              />
              <div className="relative z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg">
                <span className="text-[12px] font-bold bg-gradient-to-r from-blue-500 via-red-500 via-yellow-500 via-green-500 to-blue-500 bg-clip-text text-transparent">G</span>
              </div>
              <span className="font-semibold text-base relative z-10">Google</span>
            </Button>
          </motion.div>

          {/* Microsoft */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-gradient-to-r from-blue-500/20 via-blue-600/20 to-blue-500/20 border-2 border-blue-500/50 hover:border-blue-400 hover:from-blue-500/30 hover:via-blue-600/30 hover:to-blue-500/30 text-white justify-start gap-3 rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 relative overflow-hidden group"
              onClick={() => navigate("/dashboard/tools/agent")}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-400/20 to-blue-500/0"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 1.2,
                  ease: "linear",
                }}
              />
              <div className="relative z-10 w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <span className="font-semibold text-base relative z-10">Microsoft</span>
            </Button>
          </motion.div>

          {/* Continue with Email */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              className="w-full h-14 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 border-2 border-purple-500/50 hover:border-purple-400 hover:from-purple-500/30 hover:via-pink-500/30 hover:to-purple-500/30 text-white justify-start gap-3 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all duration-300 relative overflow-hidden group"
              onClick={() => setShowEmailForm(!showEmailForm)}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/20 to-purple-500/0"
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
              <div className="relative z-10 w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
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
              className="mt-4 space-y-4 p-6 bg-gradient-to-br from-[#1a1f3a]/90 via-[#252a4a]/90 to-[#1a1f3a]/90 rounded-xl border-2 border-purple-500/30 shadow-xl shadow-purple-500/10 backdrop-blur-sm"
            >
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 bg-[#0f1320]/80 border-2 border-purple-500/30 focus:border-purple-500/60 text-white placeholder:text-gray-400 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 bg-[#0f1320]/80 border-2 border-purple-500/30 focus:border-purple-500/60 text-white placeholder:text-gray-400 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-purple-500/20"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSignUp(false)}
                  className={`flex-1 h-11 border-2 text-white font-semibold rounded-lg transition-all duration-300 ${
                    !isSignUp 
                      ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/60 shadow-lg shadow-purple-500/20" 
                      : "bg-[#0f1320]/60 border-purple-500/20 hover:border-purple-500/40"
                  }`}
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSignUp(true)}
                  className={`flex-1 h-11 border-2 text-white font-semibold rounded-lg transition-all duration-300 ${
                    isSignUp 
                      ? "bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-purple-500/60 shadow-lg shadow-purple-500/20" 
                      : "bg-[#0f1320]/60 border-purple-500/20 hover:border-purple-500/40"
                  }`}
                >
                  Sign Up
                </Button>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 hover:from-purple-600 hover:via-pink-600 hover:to-purple-600 text-white font-bold text-base rounded-lg shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 relative overflow-hidden group"
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
            <Link to="#" className="text-sm font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all duration-300 inline-flex items-center gap-1 group">
              Need help?
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-purple-400"
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
          <p className="text-white text-sm mb-4 font-medium">Available now on iOS and Android</p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-2 border-gray-600/50 hover:border-gray-500 hover:from-gray-700/50 hover:to-gray-800/50 text-white rounded-xl shadow-lg shadow-gray-900/30 hover:shadow-gray-800/50 transition-all duration-300"
                onClick={() => toast.info("App Store link coming soon")}
              >
                <Apple className="w-5 h-5 mr-2" />
                <span className="text-xs font-semibold">App Store</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 hover:border-green-400 hover:from-green-500/30 hover:to-emerald-500/30 text-white rounded-xl shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300"
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

      {/* Right Panel - Background Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Futuristic Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=80')`,
          }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12162A]/80 via-[#12162A]/60 to-transparent" />
        {/* Animated Glow Effects */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.25) 0%, transparent 50%)",
              "radial-gradient(circle at 60% 20%, rgba(34, 211, 238, 0.3) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.25) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.25) 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
};

export default AuthSignIn;
