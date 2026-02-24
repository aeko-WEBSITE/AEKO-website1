import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Phone, Pencil, Download, Paperclip, Send } from "lucide-react";

type MessageRole = "agent" | "user";

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: string;
  isTyping?: boolean;
}

const CONVERSATION_STEPS: Omit<ChatMessage, "id" | "timestamp">[] = [
  { role: "agent", text: "Hello, how can I assist you?" },
  { role: "user", text: "Can you raise a ticket for me?" },
  { role: "agent", text: "Searching knowledge base...", isTyping: true },
  { role: "agent", text: "Sure! Could you share a few details? What's the issue about?" },
  { role: "user", text: "Login issue" },
  { role: "agent", text: "Ticket created. Your ticket number is #AK-2847." },
];

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

const AkobotChatWidget = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (stepIndex >= CONVERSATION_STEPS.length) {
      if (isLooping) {
        const t = setTimeout(() => {
          setMessages([]);
          setStepIndex(0);
        }, 4000);
        return () => clearTimeout(t);
      }
      return;
    }

    const step = CONVERSATION_STEPS[stepIndex];
    const delay = step.isTyping ? 1800 : step.role === "agent" ? 2200 : 1500;

    const timer = setTimeout(() => {
      const newMsg: ChatMessage = {
        id: `msg-${stepIndex}-${Date.now()}`,
        role: step.role,
        text: step.text,
        timestamp: formatTime(),
        isTyping: step.isTyping,
      };
      setMessages((prev) => [...prev, newMsg]);
      setStepIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [stepIndex, isLooping]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="w-full max-w-[380px] rounded-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80">
        <button type="button" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-full flex-shrink-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 dark:text-white truncate">AKOBOT AI Support</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Always Available
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <Phone className="w-4 h-4" />
          </button>
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <Pencil className="w-4 h-4" />
          </button>
          <button type="button" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-[280px] max-h-[320px] overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "agent" && (
                <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-orange-400 flex items-center justify-center mt-0.5">
                  <span className="text-white font-bold text-xs">S</span>
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "agent"
                    ? "bg-gray-200/90 dark:bg-gray-700/90 text-gray-900 dark:text-gray-100 rounded-bl-md"
                    : "bg-violet-600 text-white rounded-br-md"
                }`}
              >
                {msg.isTyping ? (
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                ) : (
                  <p className="text-sm leading-snug">{msg.text}</p>
                )}
                <p className={`text-[10px] mt-1 ${msg.role === "agent" ? "text-gray-500 dark:text-gray-400" : "text-violet-200"}`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input area */}
      <div className="p-3 border-t border-gray-200/80 dark:border-gray-700/80 bg-white/80 dark:bg-gray-800/80">
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-100/80 dark:bg-gray-700/80 px-3 py-2">
          <input
            type="text"
            readOnly
            placeholder="Ask SIA about AKOBOT ..."
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none"
          />
          <button type="button" className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600">
            <Paperclip className="w-4 h-4" />
          </button>
          <button type="button" className="p-1.5 rounded-lg text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/30">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-500 dark:text-gray-400 mt-2">
          Sign up to get your business AI-enabled!{" "}
          <a href="/auth/sign-in" className="text-violet-600 dark:text-violet-400 font-medium hover:underline">Sign up</a>
        </p>
      </div>
    </motion.div>
  );
};

export default AkobotChatWidget;
