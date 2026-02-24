import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type MessageRole = "agent" | "user";

export interface ConversationStep {
  role: MessageRole;
  text: string;
  isTyping?: boolean;
}

export interface SignInDemoChatConfig {
  id: string;
  title: string;
  subtitle?: string;
  avatarLetter: string;
  placeholder?: string;
  steps: ConversationStep[];
  /** Gradient for avatar: default violet/fuchsia/orange */
  avatarGradient?: string;
}

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: string;
  isTyping?: boolean;
}

const formatTime = () => {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
};

interface SignInDemoChatWidgetProps {
  config: SignInDemoChatConfig;
  loopDelayMs?: number;
  /** Slightly smaller variant for dense grid */
  compact?: boolean;
}

const SignInDemoChatWidget = ({ config, loopDelayMs = 4000, compact = true }: SignInDemoChatWidgetProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { steps, title, subtitle = "Always Available", avatarLetter, avatarGradient } = config;

  useEffect(() => {
    if (stepIndex >= steps.length) {
      const t = setTimeout(() => {
        setMessages([]);
        setStepIndex(0);
      }, loopDelayMs);
      return () => clearTimeout(t);
    }

    const step = steps[stepIndex];
    const delay = step.isTyping ? 1400 : step.role === "agent" ? 1800 : 1200;

    const timer = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${config.id}-${stepIndex}-${Date.now()}`,
          role: step.role,
          text: step.text,
          timestamp: formatTime(),
          isTyping: step.isTyping,
        },
      ]);
      setStepIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [stepIndex, config.id, steps, loopDelayMs]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const gradient = avatarGradient || "from-violet-500 via-fuchsia-500 to-orange-400";

  const inputPlaceholder = config.placeholder ?? `Ask ${title}...`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 backdrop-blur shadow-xl flex flex-col h-full max-h-full min-h-0 w-full max-w-full border-2 border-violet-300/90 dark:border-violet-400/70"
    >
      {/* Header - fixed height */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/90 flex-shrink-0">
        <div
          className={`rounded-full flex-shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center ${
            compact ? "w-8 h-8" : "w-9 h-9"
          }`}
        >
          <span className="text-white font-bold text-xs">{avatarLetter}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-gray-900 dark:text-white truncate ${compact ? "text-sm" : "text-base"}`}>
            {title}
          </p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            {subtitle}
          </p>
        </div>
      </div>

      {/* Conversation area - fills remaining space, scrollable */}
      <div
        ref={scrollRef}
        className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 space-y-3 bg-gray-50/80 dark:bg-gray-900/80 flex flex-col justify-end"
      >
        <AnimatePresence mode="popLayout">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2 flex-shrink-0 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "agent" && (
                <div
                  className={`rounded-full flex-shrink-0 bg-gradient-to-br ${gradient} flex items-center justify-center ${
                    compact ? "w-6 h-6 mt-0.5" : "w-7 h-7 mt-0.5"
                  }`}
                >
                  <span className="text-white font-bold text-[10px]">{avatarLetter}</span>
                </div>
              )}
              <div
                className={`max-w-[88%] rounded-xl px-3 py-2 ${
                  msg.role === "agent"
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm"
                    : "bg-violet-600 text-white rounded-br-sm"
                } ${compact ? "text-xs" : "text-sm"}`}
              >
                {msg.isTyping ? (
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "120ms" }} />
                    <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400 animate-bounce" style={{ animationDelay: "240ms" }} />
                  </span>
                ) : (
                  <p className="leading-snug">{msg.text}</p>
                )}
                <p className={`text-[10px] mt-1 ${msg.role === "agent" ? "text-gray-500 dark:text-gray-400" : "text-violet-200"}`}>
                  {msg.timestamp}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Text input area - always visible, clear bar like reference */}
      <div className="flex-shrink-0 px-3 py-2 border-t-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90">
        <div className="flex items-center gap-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700/80 px-3 py-2">
          <input
            type="text"
            readOnly
            placeholder={inputPlaceholder}
            className="flex-1 min-w-0 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 outline-none"
          />
          <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">↵</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SignInDemoChatWidget;
