import { motion } from "framer-motion";
import { MessageSquare, Image, Video, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const HeroSection = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (input.trim()) {
      // Navigate to agent page with the query
      navigate(`/dashboard/tools/agent?q=${encodeURIComponent(input.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 z-20 w-full">
      {/* Astronaut Image Background */}
      <div className="absolute inset-0 z-0 bg-background w-full">
        {/* Base image - Replace URL with your astronaut/flower image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=1920&q=80')`,
          }}
        />
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
        
        {/* Flowing highlight animations */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Additional flowing highlights */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(-45deg, transparent 30%, rgba(236, 72, 153, 0.2) 50%, transparent 70%)",
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["100% 100%", "0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Pink/purple flower highlights */}
        <motion.div
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(circle at 30% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 40%), radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 40%)",
          }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Star field effect */}
        <div className="absolute inset-0">
          {Array.from({ length: 50 }).map((_, i) => {
            const size = Math.random() * 2 + 1;
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 2;
            return (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${startX}%`,
                  top: `${startY}%`,
                  boxShadow: `0 0 ${size * 3}px rgba(255, 255, 255, 0.8)`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: duration,
                  repeat: Infinity,
                  delay: delay,
                  ease: "easeInOut",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 z-[1] opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 backdrop-blur-sm mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm text-muted-foreground">
              Powered by GPT-4, FLUX & Stable Diffusion
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
          >
            Chat Smarter. Create Faster.{" "}
            <span className="gradient-text">Powered by AI.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            All-in-one AI platform for chat, images, and videos — powered by the
            world's best models.
          </motion.p>

          {/* Ask Me Anything Textbox */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <div className="relative">
              <div className="flex items-center gap-3 bg-black text-white px-6 py-4 rounded-full shadow-lg hover:bg-black/90 transition-all duration-200 focus-within:ring-2 focus-within:ring-white/20">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                  placeholder="Ask Me Anything"
                  className="flex-1 bg-transparent text-white placeholder:text-white/60 focus:outline-none text-base md:text-lg font-medium"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                  className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Submit"
                >
                  <ArrowRight className="w-4 h-4 text-black" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* 3 CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Chat Agent Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, #A855F7, #3B82F6, #22D3EE, #34D399, #FACC15, #FB7185)",
                }}
              />
              <div
                className="rounded-xl p-[2px]"
                style={{
                  background: "linear-gradient(135deg, #A855F7, #3B82F6, #22D3EE, #34D399, #FACC15, #FB7185)",
                  backgroundSize: "200% 200%",
                }}
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-full w-full"
                >
                  <motion.div
                    className="relative flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #6366F1, #3B82F6, #06B6D4, #10B981, #84CC16, #F59E0B, #EF4444)",
                      backgroundSize: "200% 200%",
                      color: "#E5E7EB",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Link
                      to="/auth/sign-in"
                      className="relative flex items-center gap-2 w-full h-full"
                    >
                      <MessageSquare className="w-5 h-5 relative z-10" style={{ color: "#E5E7EB" }} />
                      <span className="relative z-10">Chat Agent</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Image Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, #A855F7, #3B82F6, #22D3EE, #34D399, #FACC15, #FB7185)",
                }}
              />
              <div
                className="rounded-xl p-[2px]"
                style={{
                  background: "linear-gradient(135deg, #A855F7, #3B82F6, #22D3EE, #34D399, #FACC15, #FB7185)",
                  backgroundSize: "200% 200%",
                }}
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                  className="h-full w-full"
                >
                  <motion.div
                    className="relative flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #6366F1, #3B82F6, #06B6D4, #10B981, #84CC16, #F59E0B, #EF4444)",
                      backgroundSize: "200% 200%",
                      color: "#E5E7EB",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  >
                    <Link
                      to="/auth/sign-in"
                      className="relative flex items-center gap-2 w-full h-full"
                    >
                      <Image className="w-5 h-5 relative z-10" style={{ color: "#E5E7EB" }} />
                      <span className="relative z-10">Image</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Video Button */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
            >
              <motion.div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                style={{
                  background: "linear-gradient(135deg, #A855F7, #3B82F6, #22D3EE, #34D399, #FACC15, #FB7185)",
                }}
              />
              <div
                className="rounded-xl p-[2px]"
                style={{
                  background: "linear-gradient(135deg, #A855F7, #3B82F6, #22D3EE, #34D399, #FACC15, #FB7185)",
                  backgroundSize: "200% 200%",
                }}
              >
                <motion.div
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.4,
                  }}
                  className="h-full w-full"
                >
                  <motion.div
                    className="relative flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg, #6366F1, #3B82F6, #06B6D4, #10B981, #84CC16, #F59E0B, #EF4444)",
                      backgroundSize: "200% 200%",
                      color: "#E5E7EB",
                    }}
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.4,
                    }}
                  >
                    <Link
                      to="/auth/sign-in"
                      className="relative flex items-center gap-2 w-full h-full"
                    >
                      <Video className="w-5 h-5 relative z-10" style={{ color: "#E5E7EB" }} />
                      <span className="relative z-10">Video</span>
                    </Link>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex items-center justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border/30"
          >
            {[
              { value: "5M+", label: "Generations" },
              { value: "50+", label: "AI Models" },
              { value: "200K+", label: "Creators" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
