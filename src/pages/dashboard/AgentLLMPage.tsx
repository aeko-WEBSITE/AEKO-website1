import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Send,
  Mountain,
  Image as ImageIcon,
  Video,
  LayoutGrid,
  Infinity as InfinityIcon,
  Maximize2,
  Square,
  PenTool,
} from "lucide-react";
import { llmAPI } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  responseTime?: string;
}

const tools = [
  { id: "image", label: "Image", icon: ImageIcon, color: "from-purple-500 to-purple-600" },
  { id: "video", label: "Video", icon: Video, color: "from-blue-500 to-blue-600" },
  { id: "blueprints", label: "Blueprints", icon: LayoutGrid, color: "from-green-500 to-green-600", isNew: true },
  { id: "flow-state", label: "Flow State", icon: InfinityIcon, color: "from-orange-500 to-orange-600" },
  { id: "upscaler", label: "Upscaler", icon: Maximize2, color: "from-pink-500 to-pink-600" },
  { id: "canvas", label: "Canvas", icon: Square, color: "from-purple-500 to-purple-600" },
  { id: "draw", label: "Draw", icon: PenTool, color: "from-orange-500 to-orange-600" },
];

const AgentLLMPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [iconClickAnimation, setIconClickAnimation] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  // Handle query parameter from home page
  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setInput(query);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    const currentInput = input.trim();
    setInput("");

    try {
      const startTime = Date.now();
      const response = await llmAPI.chat(currentInput);
      const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.message || response.response || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
        responseTime: `${responseTime}s`,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error("LLM API error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "Failed to get response. Please try again."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(error.message || "Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleToolClick = (toolId: string) => {
    // Navigate to appropriate tool page
    if (toolId === "image") {
      navigate("/dashboard/tools/image");
    } else if (toolId === "video") {
      navigate("/dashboard/tools/video");
    } else {
      toast.info(`${tools.find(t => t.id === toolId)?.label} coming soon!`);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Ocean Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80')`,
          opacity: 0.5,
        }}
      />
      
      {/* Sky Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-800/40 to-slate-900/60" />
      
      {/* Animated Gradient Orbs - Background Highlights */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.25) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 20%, rgba(34, 211, 238, 0.4) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.25) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.3) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.25) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Animated Floating Particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/20 blur-xl"
          style={{
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
      
      {/* Animated Light Beams */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Animated Highlight Rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border-2 border-white/20"
          style={{
            width: `${300 + i * 200}px`,
            height: `${300 + i * 200}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.3, 0.1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center flex-1 min-h-0" style={{ paddingTop: '10vh', paddingBottom: '10vh' }}>
        <div className="w-full max-w-4xl mx-auto px-4 space-y-8 relative z-20">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center"
          >
            Let's Create
          </motion.h1>

          {/* Input Field */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-full"
          >
            {/* Revolving White Highlight Animation - Main Light */}
            <motion.div
              className="absolute -inset-0.5 rounded-2xl pointer-events-none overflow-hidden"
              style={{
                borderRadius: '16px',
              }}
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 0deg, transparent 250deg, rgba(255, 255, 255, 0) 260deg, rgba(255, 255, 255, 1) 270deg, rgba(255, 255, 255, 0.8) 280deg, transparent 290deg, transparent 360deg)',
                }}
              />
            </motion.div>
            
            {/* Revolving White Highlight Animation - Secondary Light */}
            <motion.div
              className="absolute -inset-0.5 rounded-2xl pointer-events-none overflow-hidden"
              style={{
                borderRadius: '16px',
              }}
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: 'conic-gradient(from 180deg, transparent 0deg, transparent 250deg, rgba(255, 255, 255, 0) 260deg, rgba(255, 255, 255, 0.7) 270deg, rgba(255, 255, 255, 0.5) 280deg, transparent 290deg, transparent 360deg)',
                }}
              />
            </motion.div>
            
            {/* Animated Bold White Border with Black Animation */}
            <motion.div
              className="absolute -inset-1 rounded-2xl pointer-events-none overflow-hidden"
              style={{
                borderRadius: '16px',
                padding: '4px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7), rgba(255,255,255,0.9), rgba(255,255,255,0.5), rgba(255,255,255,0.9))',
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
            
            {/* Black Animation Layer */}
            <motion.div
              className="absolute -inset-0.5 rounded-2xl pointer-events-none overflow-hidden"
              style={{
                borderRadius: '15px',
                padding: '2px',
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
                duration: 4,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            
            <div className="relative flex items-center bg-black/60 backdrop-blur-xl rounded-2xl border-4 border-white shadow-xl" style={{ borderRadius: '14px' }}>
              {/* Mountain Icon - Left with Click Animation */}
              <motion.div 
                className="absolute left-4 z-10 cursor-pointer"
                onClick={() => {
                  setIconClickAnimation(true);
                  setTimeout(() => setIconClickAnimation(false), 600);
                  toast.info("Upload feature coming soon!");
                }}
              >
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.85, rotate: -5 }}
                  animate={iconClickAnimation ? {
                    scale: [1, 1.2, 1],
                    rotate: [0, 360, 0],
                  } : {}}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                >
                  {/* Rich White Glow Animation on Click */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-white blur-xl"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={iconClickAnimation ? {
                      opacity: [0, 1, 0.8, 0],
                      scale: [1, 2, 2.5, 1],
                    } : { opacity: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: "easeOut",
                    }}
                  />
                  {/* Secondary Glow Ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={iconClickAnimation ? {
                      opacity: [0, 0.8, 0],
                      scale: [1, 1.8, 2],
                    } : { opacity: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                  />
                  <Mountain className="relative w-6 h-6 text-white drop-shadow-2xl" style={{ 
                    filter: 'drop-shadow(0 0 6px rgba(255,255,255,1)) drop-shadow(0 0 12px rgba(255,255,255,0.6))',
                    textShadow: '0 0 10px rgba(255,255,255,0.8)'
                  }} />
                </motion.div>
              </motion.div>

              {/* Textarea */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a prompt..."
                rows={1}
                className="w-full pl-12 pr-16 py-4 bg-transparent text-white font-bold placeholder:text-white/60 focus:outline-none resize-none overflow-hidden"
                style={{
                  minHeight: "56px",
                  maxHeight: "120px",
                  fontSize: "16px",
                }}
              />

              {/* Send Button - Right */}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-3 w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg"
                title="Send"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>

          {/* Tool Icons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            {tools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToolClick(tool.id)}
                  className="relative group"
                >
                  <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-all`}>
                    <Icon className="w-8 h-8 text-white" />
                    {tool.isNew && (
                      <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-pink-500 text-white text-xs font-bold rounded-full">
                        NEW
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <span className="text-sm font-medium text-white">{tool.label}</span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Messages Area - Show when there are messages */}
          {messages.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-4 max-h-96 overflow-y-auto"
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-3xl rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-white/10 backdrop-blur-md text-white border border-white/20"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentLLMPage;
