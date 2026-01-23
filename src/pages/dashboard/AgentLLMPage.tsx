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
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Clock,
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
  const [selectedContentType, setSelectedContentType] = useState("design");
  const [selectedAITool, setSelectedAITool] = useState<string>("image");
  const [showCustomAgentMenu, setShowCustomAgentMenu] = useState(false);
  const [showAgentMode, setShowAgentMode] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [agentPrompt, setAgentPrompt] = useState("");
  const [agentType, setAgentType] = useState("prompt-bot");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) {
      setInput(query);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

      let content = "I'm sorry, I couldn't generate a response.";
      
      if (typeof response === 'string') {
        content = response;
      } else if (response.choices && Array.isArray(response.choices) && response.choices[0]) {
        content = response.choices[0].message?.content || 
                  response.choices[0].text || 
                  response.choices[0].content || 
                  content;
      } else if (response.message) {
        content = typeof response.message === 'string' ? response.message : response.message.content || content;
      } else if (response.response) {
        content = response.response;
      } else if (response.content) {
        content = response.content;
      } else if (response.text) {
        content = response.text;
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

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const handleToolClick = (toolId: string) => {
    if (toolId === "image") {
      navigate("/dashboard/tools/image");
    } else if (toolId === "video") {
      navigate("/dashboard/tools/video");
    } else {
      toast.info(`${tools.find(t => t.id === toolId)?.label} coming soon!`);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if there are messages to determine layout
  const hasMessages = messages.length > 0;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950">
      {/* Background with all your effects */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80')`,
          opacity: 0.2,
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-800/20 to-slate-900/50" />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.08) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 60% 20%, rgba(34, 211, 238, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 30%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(34, 211, 238, 0.08) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Animated Floating Particles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/5 blur-xl"
          style={{
            width: `${80 + i * 40}px`,
            height: `${80 + i * 40}px`,
            left: `${15 + i * 20}%`,
            top: `${15 + i * 15}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 6 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.4,
          }}
        />
      ))}
      
      {/* Main Content */}
      <div className="relative z-20 flex flex-col h-full">
        {/* Header - Shows only when there are messages */}
        {hasMessages && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-4 border-b border-white/10 bg-gradient-to-r from-slate-900/60 to-gray-900/60 backdrop-blur-md"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">AI Assistant</h1>
                  <p className="text-xs text-gray-400">Powered by advanced AI models</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition-colors border border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    {selectedAgent ? availableAgents.find(a => a.id === selectedAgent)?.name : "Agent Mode"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Messages Area */}
        <div 
          className={`flex-1 overflow-y-auto ${hasMessages ? 'px-4 py-6' : ''}`}
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Initial Welcome Message when no messages */}
            {!hasMessages && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex mt-8 flex-col items-center justify-center px-4"
              >
                {/* Welcome Section */}
                <div className="text-center space-y-6 mb-12">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center"
                  >
                    Let's Create
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg text-gray-300 max-w-2xl mx-auto"
                  >
                    Start a conversation with your AI assistant. Describe what you want to create, ask questions, or explore creative possibilities.
                  </motion.p>

                  {/* Content Type Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-2"
                  >
                    {contentTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = selectedContentType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedContentType(type.id)}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all ${
                            isSelected
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : 'bg-white/10 backdrop-blur-md hover:bg-white/20 text-gray-200 border border-white/20'
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
                </div>
              </motion.div>
            )}

            {/* Messages List */}
            {hasMessages && (
              <div className="space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                  >
                    {/* Assistant Avatar */}
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`flex flex-col max-w-[80%] ${message.role === "user" ? "items-end" : ""}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400">
                          {message.role === "assistant" ? "AI Assistant" : "You"}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(message.timestamp)}
                        </span>
                        {message.responseTime && message.role === "assistant" && (
                          <span className="text-xs text-gray-500">
                            • {message.responseTime}
                          </span>
                        )}
                      </div>
                      
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                            : "bg-white/10 backdrop-blur-md text-gray-100 border border-white/20 shadow-lg"
                        }`}
                      >
                        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                          {message.content}
                        </pre>
                      </div>

                      {/* Message Actions */}
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1 mt-2">
                          <button
                            onClick={() => handleCopyMessage(message.content)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-300 transition-colors"
                            title="Copy"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toast.success("Feedback submitted!")}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-300 transition-colors"
                            title="Good response"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => toast.info("Thanks for your feedback!")}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-gray-300 transition-colors"
                            title="Bad response"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-300" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-gray-400">AI Assistant</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/20 shadow-lg">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                          </div>
                          <span className="text-sm text-gray-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Container - Position changes based on messages */}
        <div className={`relative z-30 border-t border-white/10 ${hasMessages ? 'bg-gradient-to-r from-slate-900/60 to-gray-900/60 backdrop-blur-md' : 'bg-transparent'} px-4 py-3`}>
  <div className={`max-w-4xl mx-auto ${hasMessages ? '' : 'max-w-2xl'}`}>
    {/* Input Area */}
    <div className="relative">
      <div className={`relative ${hasMessages ? 'bg-white/5 backdrop-blur-md' : 'bg-gray-900/40 backdrop-blur-xl'} rounded-xl border border-white/20 shadow-xl transition-all duration-300`}>
        {/* Textarea */}
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={hasMessages ? "Message AI Assistant..." : "Describe what you want to create..."}
          rows={1}
          className="w-full bg-transparent text-white placeholder:text-gray-400 focus:outline-none resize-none overflow-hidden text-base leading-relaxed pt-3 pl-4 pr-12 py-2.5 rounded-xl"
          style={{
            minHeight: "44px",
            maxHeight: "120px",
          }}
        />

        {/* Send Button */}
        <div className="absolute right-2 top-2">
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md hover:scale-105'
                : 'bg-white/10 text-gray-500 cursor-not-allowed'
            }`}
            title="Send"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-white/10">
          {/* Left Controls */}
          <div className="flex items-center gap-1.5">
            {/* Upload */}
            <button
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              onClick={() => toast.info("Upload file coming soon!")}
              title="Upload file"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>

            {/* Mic */}
            <button
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              onClick={() => toast.info("Voice input coming soon!")}
              title="Voice input"
            >
              <Mic className="w-3.5 h-3.5" />
            </button>

            {/* Custom Agent */}
            <div className="relative">
              <button
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
                onClick={() => setShowCustomAgentMenu(!showCustomAgentMenu)}
                title="Create custom agent"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>

              {/* Custom Agent Menu - Keep existing */}
            </div>

            {/* AI Tools */}
            <div className="flex items-center bg-white/5 rounded-md border border-white/20">
              {aiTools.map((tool, index) => {
                const Icon = tool.icon;
                const isSelected = selectedAITool === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSelectedAITool(tool.id);
                      handleToolClick(tool.id);
                    }}
                    className={`px-2 py-1 text-sm transition-all ${
                      isSelected
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-white/5'
                    } ${index === 0 ? 'rounded-l-md' : ''} ${
                      index === aiTools.length - 1 ? 'rounded-r-md' : ''
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
            </div>

            {/* Agent Mode */}
            <div className="relative">
              <button
                onClick={() => setShowAgentMode(!showAgentMode)}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-all text-gray-300 hover:text-white text-xs border border-white/20"
              >
                <Bot className="w-3 h-3" />
                <span className="hidden sm:inline">
                  {selectedAgent ? availableAgents.find(a => a.id === selectedAgent)?.name : "Agents"}
                </span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform ${showAgentMode ? 'rotate-180' : ''}`} />
              </button>

              {/* Agent Mode Menu - Keep existing */}
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5">
            {/* Prompt Improver */}
            <button
              onClick={async () => {
                if (!input.trim()) {
                  toast.error("Please enter a prompt first");
                  return;
                }
                toast.info("Improving your prompt...");
                setTimeout(() => {
                  const improvedPrompt = `Enhanced: ${input}`;
                  setInput(improvedPrompt);
                  toast.success("Prompt improved!");
                }, 1500);
              }}
              className="w-7 h-7 flex items-center justify-center rounded-md  text-white shadow-sm hover:scale-105 transition-all"
              title="Improve prompt with AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Helper Text - Shows only when there are messages */}
      {hasMessages && (
        <p className="text-xs text-gray-500 mt-1 text-center">
          Enter to send • Shift+Enter for new line
        </p>
      )}
    </div>
  </div>
</div>
</div></div>
  );
};

export default AgentLLMPage;