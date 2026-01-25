import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageSquare, 
  Image, 
  Video, 
  Wand2, 
  ArrowLeftRight,
  Maximize2,
  Send,
  Paperclip,
  ChevronDown,
  Sparkles,
  Settings2,
  Zap,
  Loader2,
  User,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { moduleAPI } from "@/lib/api";

const tools = [
  { id: "chat", label: "Chat Agent", icon: MessageSquare, color: "from-blue-500 to-cyan-500" },
  { id: "text-to-image", label: "Text to Image", icon: Image, color: "from-primary to-primary/80" },
  { id: "image-to-image", label: "Image to Image", icon: ArrowLeftRight, color: "from-green-500 to-emerald-500" },
  { id: "text-to-video", label: "Text to Video", icon: Video, color: "from-orange-500 to-red-500" },
  { id: "video-to-video", label: "Video to Video", icon: Wand2, color: "from-yellow-500 to-orange-500" },
  { id: "upscale", label: "Upscale", icon: Maximize2, color: "from-pink-500 to-rose-500" },
];

const chatModels = [
  { id: "gpt-4", name: "GPT-4 Turbo", icon: "🧠" },
  { id: "gpt-3.5", name: "GPT-3.5", icon: "⚡" },
  { id: "claude", name: "Claude 3", icon: "🎭" },
];

const imageModels = [
  { id: "flux", name: "FLUX Pro", icon: "✨" },
  { id: "sdxl", name: "Stable Diffusion XL", icon: "🎨" },
  { id: "dalle", name: "DALL-E 3", icon: "🖼️" },
];

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ToolsPage = () => {
  const [activeTool, setActiveTool] = useState("chat");
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(chatModels[0]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1000);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentModels = activeTool === "chat" ? chatModels : imageModels;

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!prompt.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: prompt.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setIsLoading(true);

    try {
      const response = await moduleAPI.chatCompletions({
        prompt: prompt.trim(),
        model: "ModelsLab/Llama-3.1-8b-Uncensored-Dare",
        stream: false,
      });

      // Extract the assistant's message from the API response
      let assistantContent = "";
      
      // Try different possible response structures
      if (response.choices && Array.isArray(response.choices) && response.choices[0]) {
        // OpenAI-style format
        assistantContent = response.choices[0].message?.content || 
                          response.choices[0].text || 
                          response.choices[0].content || "";
      } else if (response.message) {
        // Direct message field
        assistantContent = typeof response.message === 'string' 
          ? response.message 
          : response.message.content || "";
      } else if (response.content) {
        // Direct content field
        assistantContent = response.content;
      } else if (response.text) {
        // Text field
        assistantContent = response.text;
      } else if (response.response) {
        // Response field
        assistantContent = response.response;
      } else if (typeof response === "string") {
        // String response
        assistantContent = response;
      } else {
        // Fallback: stringify the whole response for debugging
        assistantContent = `Response received. Check console for details.\n\n${JSON.stringify(response, null, 2)}`;
        console.log("Full API response:", response);
      }
      
      // If still empty, show error
      if (!assistantContent.trim()) {
        throw new Error("Received empty response from AI");
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent,
        timestamp: new Date(),
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
      toast.success("Response received!");
      } else {
        throw new Error(response.message || "Failed to get response");
      }
    } catch (error: any) {
      console.error("LLM API error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "Failed to get response. Please try again."}`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
      toast.error(error.message || "Failed to get AI response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">
          AI Tools
        </h1>
        <p className="text-muted-foreground">
          Create with the world's most powerful AI models
        </p>
      </motion.div>

      {/* Tool Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                setSelectedModel(tool.id === "chat" ? chatModels[0] : imageModels[0]);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                activeTool === tool.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/30 text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{tool.label}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Main Tool Interface */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        {/* Left: Input Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-card rounded-2xl p-6">
            {/* Model Selector */}
            <div className="flex items-center justify-between mb-4">
              <div className="relative">
                <button
                  onClick={() => setIsModelOpen(!isModelOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <span>{selectedModel.icon}</span>
                  <span className="text-sm font-medium text-foreground">
                    {selectedModel.name}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isModelOpen ? 'rotate-180' : ''}`} />
                </button>

                {isModelOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-0 mt-2 w-48 rounded-lg bg-card border border-border shadow-xl z-20"
                  >
                    {currentModels.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setIsModelOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-secondary/50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span>{model.icon}</span>
                        <span className="text-sm text-foreground">{model.name}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  showAdvanced ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary/50"
                }`}
              >
                <Settings2 className="w-4 h-4" />
                <span className="text-sm">Advanced</span>
              </button>
            </div>

            {/* Prompt Input */}
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
              placeholder={
                activeTool === "chat"
                  ? "Ask me anything... (Press Enter to send)"
                  : "Describe what you want to create..."
              }
              className="w-full h-40 bg-transparent text-foreground placeholder:text-muted-foreground resize-none focus:outline-none text-lg disabled:opacity-50"
            />

            {/* Advanced Settings */}
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="pt-4 border-t border-border/50 mt-4"
              >
                {activeTool === "chat" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Temperature</label>
                      <input
                        type="number"
                        min="0"
                        max="2"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Max Tokens</label>
                      <input
                        type="number"
                        min="100"
                        max="4000"
                        step="100"
                        value={maxTokens}
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Steps</label>
                      <input
                        type="number"
                        defaultValue={30}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Guidance</label>
                      <input
                        type="number"
                        step="0.5"
                        defaultValue={7.5}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Seed</label>
                      <input
                        type="number"
                        defaultValue={-1}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-4">
              <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
                <Paperclip className="w-4 h-4" />
                <span className="text-sm">Attach</span>
              </button>

              <Button 
                variant="hero" 
                size="lg" 
                className="gap-2"
                onClick={activeTool === "chat" ? handleSendMessage : undefined}
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    {activeTool === "chat" ? "Send" : "Generate"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Output Preview / Chat Messages */}
        <div className="glass-card rounded-2xl p-6 flex flex-col min-h-[400px] max-h-[600px]">
          {activeTool === "chat" ? (
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Chat
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Start a Conversation
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Ask me anything and I'll help you with creative ideas, technical questions, or content generation.
                    </p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary/50 text-foreground"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-1 ${
                          message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.role === "user" && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-secondary/50 rounded-2xl px-4 py-3">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ready to Create
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Enter a prompt and click Generate to see your AI creation appear here
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Prompt Library */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-2xl p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Prompt Ideas
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Cyberpunk cityscape at night",
            "Portrait in studio lighting",
            "Abstract digital art",
            "Fantasy landscape",
            "Product mockup render",
            "Anime character design",
          ].map((idea) => (
            <button
              key={idea}
              onClick={() => setPrompt(idea)}
              className="px-4 py-2 rounded-full bg-secondary/30 hover:bg-secondary/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              {idea}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ToolsPage;
