import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  Mic,
  Plus,
  Sparkles,
  X,
  FileText,
  Code,
  Crown,
  Upload,
  Bot,
  ChevronDown,
  Wand2,
} from "lucide-react";
import { moduleAPI } from "@/lib/api";
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

const contentTypes = [
  { id: "design", label: "Design", icon: Sparkles, isSelected: true },
  { id: "image", label: "Image", icon: ImageIcon, isSelected: false },
  { id: "doc", label: "Doc", icon: FileText, isSelected: false },
  { id: "code", label: "</> Code", icon: Code, isSelected: false },
  { id: "video", label: "Video clip", icon: Video, isSelected: false, isPremium: true },
];

const AgentLLMPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [iconClickAnimation, setIconClickAnimation] = useState(false);
  const [selectedContentType, setSelectedContentType] = useState("design");
  const [selectedAITool, setSelectedAITool] = useState<string>("image");
  const [showCustomAgentMenu, setShowCustomAgentMenu] = useState(false);
  const [showAgentList, setShowAgentList] = useState(false);
  const [showAgentMode, setShowAgentMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentPrompt, setAgentPrompt] = useState("");
  const [agentType, setAgentType] = useState("prompt-bot");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();

  const agentTypes = [
    { id: "prompt-bot", label: "Prompt bot" },
    { id: "image-generation", label: "Image generation bot" },
    { id: "video-generation", label: "Video generation bot" },
    { id: "role-play", label: "Role play bot" },
    { id: "canvas-app", label: "Canvas app" },
    { id: "script-bot", label: "Script bot" },
    { id: "server-bot", label: "Server bot" },
  ];

  // Available agents from agent store
  const availableAgents = [
    { id: "1", name: "Cnergee", description: "Integrated network security products—SD-WAN, NGFW, Managed WiFi" },
    { id: "2", name: "Instagram", description: "Social media assistant for Instagram management" },
    { id: "3", name: "Yamaha Motor India", description: "Motorcycle and scooter information assistant" },
    { id: "4", name: "Hi Focus", description: "CCTV solutions and security camera information" },
    { id: "5", name: "Aavas Financiers", description: "Housing loan finance company assistant" },
    { id: "6", name: "Cloud Support", description: "Help users raise support requests on Scogo Cloud Platform" },
    { id: "7", name: "Globalnet", description: "ICT Solutions and infrastructure information" },
    { id: "8", name: "IIT Roorkee", description: "Technical research university information assistant" },
  ];

  const aiTools = [
    { id: "image", label: "Image", icon: ImageIcon },
    { id: "video", label: "Video", icon: Video },
  ];

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
      const response = await moduleAPI.chatCompletions({
        prompt: currentInput,
        model: "ModelsLab/Llama-3.1-8b-Uncensored-Dare",
        stream: false,
      });
      const responseTime = ((Date.now() - startTime) / 1000).toFixed(1);

      // Extract response content from API response
      let content = "I'm sorry, I couldn't generate a response.";
      if (response.choices && Array.isArray(response.choices) && response.choices[0]) {
        content = response.choices[0].message?.content || 
                  response.choices[0].text || 
                  response.choices[0].content || 
                  content;
      } else if (response.message) {
        content = response.message;
      } else if (response.response) {
        content = response.response;
      } else if (typeof response === 'string') {
        content = response;
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: content,
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
      {/* Tropical Coastal Landscape Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
          opacity: 1,
        }}
      />
      
      {/* Sky Gradient Overlay - Light overlay to maintain text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/20 via-slate-800/10 to-slate-900/30" />
      
      {/* Animated Gradient Orbs - Background Highlights - Reduced opacity */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 20%, rgba(34, 211, 238, 0.15) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.1) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Animated Floating Particles - Reduced opacity */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/10 blur-xl"
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
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 5 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3,
          }}
        />
      ))}
      
      {/* Animated Light Beams - Reduced opacity */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
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
      
      {/* Animated Highlight Rings - Reduced opacity */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border-2 border-white/10"
          style={{
            width: `${300 + i * 200}px`,
            height: `${300 + i * 200}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.05, 0.15, 0.05],
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
        <div className="w-full max-w-6xl mx-auto px-4 space-y-8 relative z-20">
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center"
          >
            Let's Create
          </motion.h1>

          {/* Input Field - Dark Modern Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-full"
          >
            {/* Main Input Container - Dark Theme */}
            <div className="relative">
              {/* Inner Container - Transparent with Blur */}
              <div className="relative bg-gray-900/30 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-gray-700/30">
                {/* Input Area */}
                <div className="relative">
                  {/* Textarea - Transparent with Blur */}
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a prompt..."
                    rows={3}
                    className="w-full bg-gray-800/20 backdrop-blur-md text-white placeholder:text-gray-400 focus:outline-none resize-none overflow-hidden text-base leading-relaxed pt-2 pl-4 pr-14 py-3 rounded-xl border border-gray-700/30 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20"
                style={{
                      minHeight: "90px",
                      maxHeight: "200px",
                }}
              />

                  {/* Send Button Inside Textbox - Right Side */}
                  <div className="absolute right-4 top-2">
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all ${
                        input.trim() && !isLoading
                          ? 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:scale-110'
                          : 'bg-gray-800/30 cursor-not-allowed'
                      }`}
                title="Send"
              >
                      <Send className={`w-4 h-4 ${input.trim() && !isLoading ? 'text-white' : 'text-gray-600'}`} />
              </button>
            </div>
                </div>

                {/* Bottom Controls Row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800/50">
                  {/* Bottom Left Controls */}
                  <div className="flex items-center gap-2">
                  {/* Upload Icon */}
                  <button
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-900/40 hover:bg-blue-900/60 transition-all text-white border border-blue-700/30 hover:scale-110"
                    onClick={() => toast.info("Upload file coming soon!")}
                  >
                    <Upload className="w-4 h-4" />
                  </button>

                  {/* Plus Icon - Custom Agent Creator */}
                  <div className="relative">
                    <button
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-blue-900/40 hover:bg-blue-900/60 transition-all text-white border border-blue-700/30 hover:scale-110"
                      onClick={() => setShowCustomAgentMenu(!showCustomAgentMenu)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Custom Agent Creation Menu */}
                    <AnimatePresence>
                      {showCustomAgentMenu && (
          <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute bottom-full left-0 mb-2 w-80 bg-gray-900 rounded-xl shadow-2xl border border-gray-800/50 overflow-hidden z-50"
                        >
                          <div className="p-4 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-semibold text-white">Create Custom Agent</h3>
                              <button
                                onClick={() => setShowCustomAgentMenu(false)}
                                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-800 text-gray-400 hover:text-gray-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Prompt/URL Textbox */}
                            <div>
                              <textarea
                                value={agentPrompt}
                                onChange={(e) => setAgentPrompt(e.target.value)}
                                placeholder="Write prompt or paste URL"
                                rows={3}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm text-white placeholder:text-gray-500 resize-none"
                              />
                            </div>

                            {/* Agent Type Dropdown */}
                            <div>
                              <label className="block text-xs font-medium text-gray-400 mb-2">Type of Agent Flow</label>
                              <select
                                value={agentType}
                                onChange={(e) => setAgentType(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 text-sm text-white"
                              >
                                {agentTypes.map((type) => (
                                  <option key={type.id} value={type.id} className="bg-gray-800">
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => {
                                  setShowCustomAgentMenu(false);
                                  setAgentPrompt("");
                                }}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  if (agentPrompt.trim()) {
                                    toast.success("Custom agent created!");
                                    setShowCustomAgentMenu(false);
                                    setAgentPrompt("");
                                  } else {
                                    toast.error("Please enter a prompt or URL");
                                  }
                                }}
                                className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white text-sm font-medium shadow-md transition-all"
                              >
                                Create
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* AI Tools Selection - Image/Video Buttons (Merged) */}
                  <div className="flex items-center">
                    {aiTools.map((tool, index) => {
              const Icon = tool.icon;
                      const isSelected = selectedAITool === tool.id;
                      const isFirst = index === 0;
                      const isLast = index === aiTools.length - 1;
                      
              return (
                        <>
                          <button
                  key={tool.id}
                            onClick={() => {
                              setSelectedAITool(tool.id);
                              if (tool.id === "image") {
                                navigate("/dashboard/tools/image");
                              } else if (tool.id === "video") {
                                navigate("/dashboard/tools/video");
                              }
                            }}
                            className={`flex items-center gap-2 px-4 h-9 transition-all ${
                              isFirst ? 'rounded-l-xl' : 'rounded-none'
                            } ${isLast ? 'rounded-r-xl' : ''} ${
                              tool.id === "image"
                                ? 'bg-gray-800 text-white border border-gray-700/50'
                                : isSelected
                                ? 'bg-black text-white border border-gray-700/50'
                                : 'bg-black border border-gray-700/50 text-white'
                            } ${!isFirst ? 'border-l-0' : ''}`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                            <span className="text-sm font-medium">{tool.label}</span>
                          </button>
                          {!isLast && (
                            <span className="text-white/60 text-sm font-medium px-1">/</span>
                          )}
                        </>
                      );
                    })}
                  </div>

                  {/* Agent Mode Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowAgentMode(!showAgentMode)}
                      className="flex items-center gap-2 px-3 h-9 rounded-xl bg-black hover:bg-black/80 transition-all text-white border border-gray-700/50"
                    >
                      <Bot className="w-4 h-4 text-white" />
                      <span className="text-sm font-medium">
                        {selectedAgent ? availableAgents.find(a => a.id === selectedAgent)?.name : "Agent Mode"}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-white transition-transform ${showAgentMode ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Agent Mode Dropdown Menu */}
                    <AnimatePresence>
                      {showAgentMode && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute bottom-full left-0 mb-2 w-72 bg-gray-900 rounded-xl shadow-2xl border border-gray-800/50 overflow-hidden z-50 max-h-96 overflow-y-auto"
                        >
                          <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-800">
                              Select Custom Agent
                            </div>
                            {availableAgents.map((agent) => (
                              <button
                                key={agent.id}
                                onClick={() => {
                                  setSelectedAgent(agent.id);
                                  setShowAgentMode(false);
                                  toast.success(`Agent "${agent.name}" selected!`);
                                  // You can add logic here to integrate the selected agent
                                }}
                                className={`w-full flex items-start gap-3 px-3 py-2.5 hover:bg-gray-800 transition-colors text-left rounded-lg ${
                                  selectedAgent === agent.id ? 'bg-purple-500/20 border border-purple-500/30' : ''
                                }`}
                              >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <Bot className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-200">{agent.name}</div>
                                  <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{agent.description}</div>
                                </div>
                                {selectedAgent === agent.id && (
                                  <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                      </div>
                    )}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  </div>

                  {/* Bottom Right - Prompt Improvement Icon */}
                  <button
                    onClick={async () => {
                      if (!input.trim()) {
                        toast.error("Please enter a prompt first");
                        return;
                      }
                      toast.info("Improving your prompt...");
                      // Simulate AI improving the prompt
                      setTimeout(() => {
                        const improvedPrompt = `Enhanced: ${input}`;
                        setInput(improvedPrompt);
                        toast.success("Prompt improved!");
                      }, 1500);
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white shadow-lg hover:scale-110 transition-all"
                    title="Improve prompt with AI"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>
                </div>
                  </div>
                  </div>

            {/* Content Type Selection Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-2 mt-4"
            >
              {contentTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedContentType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedContentType(type.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                        : 'bg-white/90 hover:bg-white text-gray-700 border border-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{type.label}</span>
                    {type.isPremium && (
                      <Crown className="w-3 h-3 text-yellow-400" />
                    )}
                  </button>
              );
            })}
          </motion.div>
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
