import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Copy,
  Loader2,
  ChevronDown,
  Sparkles,
  RefreshCw,
  X,
  Check,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ollamaAPI } from "@/lib/api";
import { useTheme } from "@/hooks/use-theme";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  model?: string;
}

interface Model {
  id: string;
  name: string;
  [key: string]: any;
}

const OllamaChatPage = () => {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [models, setModels] = useState<Model[]>([]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";

  // Load models on mount
  useEffect(() => {
    loadModels();
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [input]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const loadModels = async () => {
    try {
      setIsLoadingModels(true);
      const data = await ollamaAPI.getModelList();
      const modelsList = Array.isArray(data) ? data : (data.models || data.data || []);
      
      if (Array.isArray(modelsList) && modelsList.length > 0) {
        const transformedModels = modelsList.map((model: any, index: number) => ({
          id: model.id || model.name || model.model || `model-${index}`,
          name: model.name || model.model || model.id || `Model ${index + 1}`,
          ...model,
        }));
        setModels(transformedModels);
        
        if (!selectedModel && transformedModels.length > 0) {
          setSelectedModel(transformedModels[0].id);
        }
      } else {
        const fallbackModels = [
          { id: "gpt-oss:120b", name: "GPT-OSS 120B" },
          { id: "llama2", name: "Llama 2" },
          { id: "mistral", name: "Mistral" },
        ];
        setModels(fallbackModels);
        if (!selectedModel) {
          setSelectedModel(fallbackModels[0].id);
        }
      }
    } catch (error: any) {
      console.error("Error loading models:", error);
      toast.error(error.message || "Failed to load models");
      const fallbackModels = [
        { id: "gpt-oss:120b", name: "GPT-OSS 120B" },
        { id: "llama2", name: "Llama 2" },
        { id: "mistral", name: "Mistral" },
      ];
      setModels(fallbackModels);
      if (!selectedModel) {
        setSelectedModel(fallbackModels[0].id);
      }
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !selectedModel) {
      if (!selectedModel) {
        toast.error("Please select a model first");
      }
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    const currentInput = input.trim();
    const currentModel = selectedModel;
    setInput("");

    try {
      const response = await ollamaAPI.chatCompletion({
        prompt: currentInput,
        model: currentModel,
      });

      let assistantContent = "";
      if (typeof response === "string") {
        assistantContent = response;
      } else if (response.content) {
        assistantContent = response.content;
      } else if (response.message) {
        assistantContent = response.message;
      } else if (response.text) {
        assistantContent = response.text;
      } else if (response.response) {
        assistantContent = response.response;
      } else {
        assistantContent = JSON.stringify(response);
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: assistantContent || "I'm sorry, I couldn't generate a response.",
        timestamp: new Date(),
        model: currentModel,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Error: ${error.message || "Failed to get response. Please try again."}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error(error.message || "Failed to get response");
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

  const handleCopy = (content: string, messageId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(messageId);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    if (messages.length === 0) return;
    if (confirm("Are you sure you want to clear all messages?")) {
      setMessages([]);
      toast.success("Chat cleared");
    }
  };

  const selectedModelName = models.find((m) => m.id === selectedModel)?.name || selectedModel;

  return (
    <main className={`min-h-screen w-full ${isDark ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]'} transition-colors duration-300`}>
      <Navbar />

      <div className="flex flex-col h-[calc(100vh-64px)] pt-16">
        {/* Header */}
        <div className={`border-b ${isDark ? 'border-white/5 bg-[#0a0a0a]' : 'border-gray-200 bg-white'} transition-colors`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center`}>
                  <Bot className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                </div>
                <div>
                  <h1 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Ollama Chat
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                    {selectedModelName || "Select a model"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Model Selector */}
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                    className={`${isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-200 text-gray-900 hover:bg-gray-50'} h-9 px-3`}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span className="text-sm">{selectedModelName || "Select Model"}</span>
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  <AnimatePresence>
                    {isModelDropdownOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsModelDropdownOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`absolute right-0 top-full mt-2 w-64 ${isDark ? 'bg-[#151515] border-white/10' : 'bg-white border-gray-200'} border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto`}
                        >
                          {isLoadingModels ? (
                            <div className="p-4 text-center">
                              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-gray-400" />
                              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Loading models...</p>
                            </div>
                          ) : models.length === 0 ? (
                            <div className="p-4 text-center">
                              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>No models available</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={loadModels}
                                className="mt-2"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Retry
                              </Button>
                            </div>
                          ) : (
                            <>
                              {models.map((model) => (
                                <button
                                  key={model.id}
                                  onClick={() => {
                                    setSelectedModel(model.id);
                                    setIsModelDropdownOpen(false);
                                  }}
                                  className={`w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors border-b ${isDark ? 'border-white/5' : 'border-gray-100'} last:border-0 ${
                                    selectedModel === model.id ? (isDark ? 'bg-white/5' : 'bg-gray-50') : ''
                                  }`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                      {model.name}
                                    </span>
                                    {selectedModel === model.id && (
                                      <Check className="w-4 h-4 text-blue-500" />
                                    )}
                                  </div>
                                </button>
                              ))}
                            </>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

                {messages.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className={`${isDark ? 'text-white/60 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'} h-9 px-3`}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px]"
              >
                <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center mb-4`}>
                  <Bot className={`w-8 h-8 ${isDark ? 'text-white/40' : 'text-gray-400'}`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Start a conversation
                </h3>
                <p className={`text-sm max-w-md text-center ${isDark ? 'text-white/60' : 'text-gray-500'}`}>
                  Select a model and start chatting. Ask questions, get help with coding, or have a conversation.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center shrink-0 mt-1`}>
                          <Bot className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-600'}`} />
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1 max-w-[75%] sm:max-w-[70%]">
                        <div
                          className={`group relative rounded-2xl px-4 py-3 ${
                            message.role === "user"
                              ? isDark
                                ? "bg-blue-500 text-white"
                                : "bg-blue-500 text-white"
                              : isDark
                              ? "bg-white/5 border border-white/10 text-white"
                              : "bg-white border border-gray-200 text-gray-900 shadow-sm"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <p className={`text-[15px] leading-relaxed whitespace-pre-wrap break-words ${
                              message.role === "user" ? "text-white" : isDark ? "text-white" : "text-gray-900"
                            }`}>
                              {message.content}
                            </p>
                            <button
                              onClick={() => handleCopy(message.content, message.id)}
                              className={`opacity-0 group-hover:opacity-100 transition-opacity shrink-0 p-1.5 rounded-lg hover:bg-white/10 ${
                                message.role === "user" ? "text-white/80" : isDark ? "text-white/60" : "text-gray-400"
                              }`}
                            >
                              {copiedId === message.id ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <span className={`text-xs px-1 ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {message.role === "user" && (
                        <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center shrink-0 mt-1`}>
                          <User className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-600'}`} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 justify-start"
                  >
                    <div className={`w-8 h-8 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'} flex items-center justify-center shrink-0 mt-1`}>
                      <Bot className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-gray-600'}`} />
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Loader2 className={`w-4 h-4 animate-spin ${isDark ? 'text-white/60' : 'text-gray-400'}`} />
                        <span className={`text-sm ${isDark ? 'text-white/60' : 'text-gray-500'}`}>Thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t ${isDark ? 'border-white/5 bg-[#0a0a0a]' : 'border-gray-200 bg-white'} transition-colors`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className={`relative rounded-2xl border transition-all ${
              isDark 
                ? 'bg-white/5 border-white/10 focus-within:border-white/20' 
                : 'bg-white border-gray-200 focus-within:border-gray-300 shadow-sm'
            }`}>
              <div className="flex items-end gap-3 p-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={selectedModel ? "Type your message..." : "Select a model to start chatting..."}
                  className={`flex-1 bg-transparent resize-none outline-none text-[15px] leading-relaxed ${
                    isDark 
                      ? 'text-white placeholder:text-white/40' 
                      : 'text-gray-900 placeholder:text-gray-400'
                  } min-h-[24px] max-h-[200px]`}
                  rows={1}
                  disabled={isLoading || !selectedModel}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || !selectedModel}
                  className={`shrink-0 w-9 h-9 p-0 rounded-lg ${
                    input.trim() && !isLoading && selectedModel
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : isDark
                      ? 'bg-white/5 text-white/30 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  } transition-all`}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className={`px-4 pb-2 text-xs ${isDark ? 'text-white/40' : 'text-gray-400'}`}>
                Press Enter to send, Shift+Enter for new line
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default OllamaChatPage;
