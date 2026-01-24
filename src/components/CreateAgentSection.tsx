import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Upload, 
  Search, 
  ChevronDown, 
  Bot, 
  FileText, 
  Rocket,
  Globe,
  Sparkles,
  MessageSquare,
  ShoppingCart,
  Headphones,
  Briefcase,
  Zap,
  CheckCircle2,
  Ticket,
  Clock,
  FileCheck,
  ArrowRight,
  ArrowDown,
  ArrowDownRight,
  CheckCircle,
  User,
  Hand,
  Brain,
  Play,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CreateAgentSection = () => {
  const [agentDescription, setAgentDescription] = useState("");
  const [agentName, setAgentName] = useState("");
  const [selectedModel, setSelectedModel] = useState("GPT-4 Turbo");
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [isModeOpen, setIsModeOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState("AI Agent");

  const models = [
    "GPT-4 Turbo",
    "GPT-4",
    "GPT-3.5 Turbo",
    "Claude 3 Opus",
    "Claude 3 Sonnet",
    "Gemini Pro",
  ];

  const modes = [
    "AI Agent",
    "Image to Agent",
    "Text to Agent",
  ];

  const useCases = [
    {
      title: "Customer Support Agent",
      description: "Handle customer inquiries, resolve issues, and manage orders automatically",
      example: "Customer: 'Is the navy blue sweater available in Size L?'\nAgent: 'Yes it is, would you like it customized?'",
      icon: Headphones,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "E-commerce Assistant",
      description: "Help customers find products, check availability, and process custom orders",
      example: "Customer: 'I'd like my initials K.T. on the sweater'\nAgent: 'Your custom order is placed.'",
      icon: ShoppingCart,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Travel Booking Agent",
      description: "Reschedule flights, adjust hotel bookings, and manage travel preferences",
      example: "Customer: 'Reschedule to 13:45 flight on Oct 30'\nAgent: 'Done. Your hotel checkout is adjusted, too.'",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Business Intelligence",
      description: "Analyze customer sentiment, track issues, and provide insights in real-time",
      example: "AI Intelligence Dashboard\nSentiment: Negative (43) → Neutral (18)\nIssue resolved automatically",
      icon: Zap,
      color: "from-orange-500 to-red-500",
    },
  ];

  // Generate stars for background
  const stars = Array.from({ length: 80 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }));

  return (
    <TooltipProvider>
    <section className="py-24 lg:py-32 relative overflow-hidden w-full bg-background dark:bg-gradient-to-br dark:from-[#0a0a1a] dark:via-[#1a0b2e] dark:to-[#0f0517]">
      {/* Theme-Aware Base Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-purple-50/30 to-blue-50/30 dark:from-[#0a0a1a] dark:via-[#1a0b2e] dark:to-[#0f0517] w-full" />
      
      {/* Animated Mesh Gradient Overlay - Theme Aware */}
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-60"
        style={{
          background: `
            radial-gradient(at 20% 30%, rgba(168, 85, 247, 0.2) 0px, transparent 50%),
            radial-gradient(at 80% 70%, rgba(34, 211, 238, 0.15) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(236, 72, 153, 0.15) 0px, transparent 50%),
            radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.1) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.1) 0px, transparent 50%)
          `,
        }}
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Large Floating Gradient Orbs - Theme Aware */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15 dark:opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 60, 0],
          y: [0, 40, 0],
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.25, 0.1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-12 dark:opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -60, 0],
          y: [0, -40, 0],
          scale: [1, 1.4, 1],
          opacity: [0.08, 0.2, 0.08],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-10 dark:opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
          scale: [1, 1.2, 1.3, 1],
          opacity: [0.05, 0.15, 0.1, 0.05],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Star Field - Theme Aware */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-foreground/20 dark:bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.1, 0.4, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Animated Grid Overlay - Theme Aware */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}>
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ["0 0", "60px 60px"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </div>
      
      {/* Flowing Light Beams - Theme Aware */}
      <motion.div
        className="absolute inset-0 opacity-10 dark:opacity-20"
        style={{
          background: "linear-gradient(45deg, transparent 30%, rgba(168, 85, 247, 0.15) 50%, transparent 70%)",
          backgroundSize: "300% 300%",
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-8 dark:opacity-15"
        style={{
          background: "linear-gradient(-45deg, transparent 30%, rgba(34, 211, 238, 0.15) 50%, transparent 70%)",
          backgroundSize: "300% 300%",
        }}
        animate={{
          backgroundPosition: ["100% 100%", "0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Animated Highlight Rings - Theme Aware */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute rounded-full border border-foreground/5 dark:border-white/10"
          style={{
            width: `${400 + i * 300}px`,
            height: `${400 + i * 300}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.05, 0.15, 0.05],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
        />
      ))}
      
      {/* Floating Particles - Theme Aware */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-foreground/5 dark:bg-white/10 blur-sm"
          style={{
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.5, 1],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 10 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Gradient Overlay for Depth - Theme Aware */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60 dark:from-black/40 dark:via-transparent dark:to-black/50" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 relative z-10"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Create Custom AI Agents with{" "}
            <span className="gradient-text">Multi-Flow Intelligence</span>{" "}
            for Any Use Case
          </h2>
        </motion.div>

        {/* Main Card - Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto relative z-10"
        >
          <div className="relative group">
            {/* Colorful Outer Glow */}
            <motion.div
              className="absolute -inset-2 rounded-3xl blur-3xl"
              animate={{
                background: [
                  'radial-gradient(circle, rgba(168, 85, 247, 0.4), rgba(34, 211, 238, 0.3), transparent)',
                  'radial-gradient(circle, rgba(34, 211, 238, 0.4), rgba(236, 72, 153, 0.3), transparent)',
                  'radial-gradient(circle, rgba(236, 72, 153, 0.4), rgba(168, 85, 247, 0.3), transparent)',
                  'radial-gradient(circle, rgba(168, 85, 247, 0.4), rgba(34, 211, 238, 0.3), transparent)',
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            
            {/* Main card container - Clean Design with Rich Animated Border */}
            <div className="relative rounded-3xl p-6 lg:p-8 overflow-hidden shadow-lg shadow-primary/5" style={{ borderRadius: '24px' }}>
              {/* Rich Animated Gradient Border */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  padding: '2px',
                  background: 'linear-gradient(135deg, #7C3AED, #3B82F6, #22D3EE, #22C55E, #FACC15, #EC4899, #7C3AED)',
                  backgroundSize: '300% 300%',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
              
              {/* Inner Background - Theme Aware */}
              <div className="absolute inset-[2px] rounded-3xl bg-card/80 dark:bg-card/30 backdrop-blur-xl border border-border/50" style={{ borderRadius: '22px' }} />
              
              <div className="relative z-10">
            {/* Top Section - Textarea */}
            <div className="mb-6">
              <textarea
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Describe agent or use URL"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all resize-none relative z-10"
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/50">
              {/* Mode Selector */}
              <DropdownMenu open={isModeOpen} onOpenChange={setIsModeOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 border border-border/50 text-foreground text-sm transition-colors">
                    <Bot className="w-4 h-4" />
                    <span>{selectedMode}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {modes.map((mode) => (
                    <DropdownMenuItem
                      key={mode}
                      onClick={() => {
                        setSelectedMode(mode);
                        setIsModeOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {mode}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Model Selector */}
              <DropdownMenu open={isModelOpen} onOpenChange={setIsModelOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 border border-border/50 text-foreground text-sm transition-colors">
                    <Sparkles className="w-4 h-4" />
                    <span>{selectedModel}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {models.map((model) => (
                    <DropdownMenuItem
                      key={model}
                      onClick={() => {
                        setSelectedModel(model);
                        setIsModelOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      {model}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Divider */}
              <div className="h-6 w-px bg-border/50" />

              {/* Web Search Toggle - Icon Only */}
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                  webSearchEnabled
                    ? "bg-primary/10 border-primary/50 text-primary"
                    : "bg-secondary/50 border-border/50 text-foreground hover:bg-secondary/70"
                }`}
                title="Web Search"
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Upload File */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 border border-border/50 text-foreground text-sm transition-colors">
                <FileText className="w-4 h-4" />
                <span>Upload File</span>
              </button>

              {/* Agent Name Input */}
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Agent Name"
                className="px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm min-w-[120px]"
              />
              
              {/* Deploy Button - Right Side */}
              <Button
                variant="hero"
                size="lg"
                className="ml-auto gap-2 px-6"
                disabled={!agentDescription.trim() || !agentName.trim()}
              >
                <Rocket className="w-4 h-4" />
                Deploy
              </Button>
            </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Description Text Below Agent Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-lg text-white max-w-2xl mx-auto font-medium">
            All-in-one AI platform for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
              chat
            </span>
            ,{' '}
            <span className="bg-gradient-to-r from-green-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent font-bold">
              images
            </span>
            , and{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent font-bold">
              videos
            </span>
            {' '}— powered by the world's best models.
          </p>
        </motion.div>

        {/* Automate 80%+ Section - New Design */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 max-w-7xl mx-auto"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              <h3 className="text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">
                Automate 80%+ of interactions with AI agents
              </h3>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                AEKO AI agents resolve complex issues on any channel. Powered by agentic AI, they reason, adapt, and act independently – delighting customers and employees while reducing costs at scale. Launch in just minutes, with no technical expertise needed.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="default"
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg"
                >
                  Contact Sales
                </Button>
                
              </div>
            </div>

            {/* Right Side - Mobile Interface Demo */}
            <div className="relative">
  {/* Large Light Green Background Container with Rich Animated Border */}
  <div className="relative rounded-3xl p-4 sm:p-2 overflow-hidden shadow-2xl" style={{ borderRadius: '24px' }}>
    
    {/* Rich Animated Gradient Border (Outer) */}
    <motion.div
      className="absolute inset-0 rounded-3xl pointer-events-none"
      style={{
        padding: '2px',
        background: 'linear-gradient(135deg, #22C55E, #10B981, #34D399, #6EE7B7, #22C55E)',
        backgroundSize: '200% 200%',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
      }}
      animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    />

    {/* Inner Mint Background Fill */}
    <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100" style={{ borderRadius: '22px' }} />

    {/* Video Container with Inner Animated Border */}
    <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[21/9] sm:aspect-[1.5/1] flex flex-col bg-gray-900" style={{ borderRadius: '16px' }}>
      
      {/* THE VIDEO: Set to 100% clarity and covers the entire area */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
      >
        <source src="../../public/feeds/AEKO_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Inner Animated Border (Slate/Grey) for the "Phone" look */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none z-10"
        style={{
          padding: '2px',
          background: 'linear-gradient(135deg, #4B5563, #6B7280, #9CA3AF, #6B7280, #4B5563)',
          backgroundSize: '200% 200%',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Optional: A very subtle vignette to keep the edges clean */}
      <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]" />
    </div>
  </div>
</div>
          </div>
        </motion.div>

        {/* Use Cases Examples - Modern Accordion Design */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 max-w-5xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.h3 
              className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-foreground mb-2"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Launch AI Agents in Minutes
            </motion.h3>
            <motion.p 
              className="text-base md:text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              See how custom agents work in real-world scenarios
            </motion.p>
          </div>

          {/* Modern Accordion Container */}
          <div className="relative">
            {/* Outer Glow */}
            <motion.div
              className="absolute -inset-1 rounded-2xl blur-xl opacity-30"
              style={{
                background: "linear-gradient(135deg, rgba(124, 58, 237, 0.3), rgba(59, 130, 246, 0.3), rgba(236, 72, 153, 0.3))",
              }}
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            
            <div className="relative rounded-2xl bg-card/60 dark:bg-card/40 backdrop-blur-xl border border-border/50 dark:border-white/10 p-1 shadow-xl">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {useCases.map((useCase, index) => {
                  const Icon = useCase.icon;
                  return (
                    <AccordionItem
                      key={useCase.title}
                      value={`item-${index}`}
                      className="border-none"
                    >
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      >
                        {/* Accordion Trigger with Rich Design */}
                        <AccordionTrigger className="relative group hover:no-underline px-6 py-5 rounded-xl bg-gradient-to-r from-card/80 to-card/60 dark:from-white/5 dark:to-white/[0.02] border border-border/30 dark:border-white/10 hover:border-primary/50 dark:hover:border-white/30 transition-all duration-300">
                          <div className="flex items-center gap-4 w-full">
                            {/* Icon with Gradient Background */}
                            <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${useCase.color} flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <Icon className="w-6 h-6 text-white" />
                              <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 text-left">
                              <h4 className="text-lg font-bold text-foreground dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-purple-300 transition-colors">
                                {useCase.title}
                              </h4>
                              <p className="text-sm text-muted-foreground dark:text-white/70 line-clamp-1">
                                {useCase.description}
                              </p>
                            </div>
                            
                            {/* Expand Indicator */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-primary hidden sm:inline">Learn more</span>
                            </div>
                          </div>
                        </AccordionTrigger>
                        
                        {/* Accordion Content */}
                        <AccordionContent className="px-6 pb-5 pt-2">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="relative"
                          >
                            {/* Example Conversation Card */}
                            <div className="mt-4 p-5 rounded-xl bg-muted/30 dark:bg-white/5 border border-border/30 dark:border-white/10 backdrop-blur-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageSquare className="w-4 h-4 text-primary" />
                                <span className="text-xs font-semibold text-foreground dark:text-white uppercase tracking-wider">
                                  Example Conversation
                                </span>
                              </div>
                              <div className="space-y-3">
                                {useCase.example.split('\n').map((line, lineIndex) => {
                                  const isCustomer = line.startsWith('Customer:') || line.startsWith('AI Intelligence Dashboard');
                                  return (
                                    <motion.div
                                      key={lineIndex}
                                      initial={{ opacity: 0, x: isCustomer ? 10 : -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: lineIndex * 0.1 }}
                                      className={`flex gap-3 ${isCustomer ? 'justify-end' : 'justify-start'}`}
                                    >
                                      {!isCustomer && (
                                        <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${useCase.color} flex items-center justify-center flex-shrink-0`}>
                                          <Bot className="w-3 h-3 text-white" />
                                        </div>
                                      )}
                                      <div className={`max-w-[85%] rounded-lg px-4 py-2.5 text-sm ${
                                        isCustomer
                                          ? 'bg-primary/10 dark:bg-primary/20 text-foreground dark:text-white border border-primary/20'
                                          : `bg-gradient-to-br ${useCase.color}/20 dark:${useCase.color}/30 text-foreground dark:text-white border border-border/30`
                                      }`}>
                                        <span className="font-semibold text-primary dark:text-purple-300">
                                          {isCustomer ? (line.includes('Customer:') ? 'Customer: ' : '') : 'Agent: '}
                                        </span>
                                        <span>{line.replace(/^(Customer:|Agent:)\s*/, '')}</span>
                                      </div>
                                      {isCustomer && (
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                          <User className="w-3 h-3 text-white" />
                                        </div>
                                      )}
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </div>
                          </motion.div>
                        </AccordionContent>
                      </motion.div>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>

                {/* What Your Custom Agent Can Do - Modern Interactive Design */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="mt-12"
                >
                  {/* Rich Container with Theme-Aware Border */}
                  <div className="relative rounded-3xl p-8 lg:p-10 shadow-2xl overflow-hidden border-2 border-border dark:border-white" style={{ borderRadius: '24px' }}>
                    {/* Animated Gradient Border */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl pointer-events-none"
                      style={{
                        padding: '2px',
                        background: 'linear-gradient(135deg, #7C3AED, #3B82F6, #22D3EE, #10B981, #F59E0B, #EC4899, #7C3AED)',
                        backgroundSize: '300% 300%',
                        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                        WebkitMaskComposite: 'xor',
                        maskComposite: 'exclude',
                      }}
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    
                    {/* Inner Background - Theme Aware */}
                    <div className="absolute inset-[2px] rounded-3xl bg-card/90 dark:bg-[#12162A]/90 backdrop-blur-2xl" style={{ borderRadius: '22px' }} />
                    {/* Decorative Gradient Overlay */}
                    <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 pointer-events-none" style={{ borderRadius: '22px' }} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Enhanced Header */}
                      <motion.div 
                        className="text-center mb-10"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        <h4 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
                          What Your Custom Agent Can Do
                        </h4>
                        <p className="text-base md:text-lg text-muted-foreground/90 font-medium max-w-2xl mx-auto">
                          Powerful capabilities to automate and enhance your business operations
                        </p>
                      </motion.div>
                      
                      {/* Modern Interactive Grid with Hover Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
                        {[
                          {
                            icon: MessageSquare,
                            title: "Handle customer inquiries 24/7",
                            description: "Round-the-clock support with instant responses",
                            color: "from-blue-500 to-cyan-500",
                          },
                          {
                            icon: ShoppingCart,
                            title: "Process orders and bookings automatically",
                            description: "Seamless order management and booking systems",
                            color: "from-purple-500 to-pink-500",
                          },
                          {
                            icon: Zap,
                            title: "Analyze sentiment and resolve issues",
                            description: "Real-time sentiment analysis and issue resolution",
                            color: "from-orange-500 to-red-500",
                          },
                          {
                            icon: Globe,
                            title: "Integrate with your existing tools",
                            description: "Connect with your favorite business tools",
                            color: "from-green-500 to-emerald-500",
                          },
                          {
                            icon: Sparkles,
                            title: "Learn from your business data",
                            description: "AI-powered insights from your data",
                            color: "from-indigo-500 to-purple-500",
                          },
                          {
                            icon: Rocket,
                            title: "Scale with your business needs",
                            description: "Grow seamlessly as your business expands",
                            color: "from-pink-500 to-rose-500",
                          },
                          {
                            icon: Ticket,
                            title: "Support ticket creation",
                            description: "Automated ticket generation and tracking",
                            color: "from-yellow-500 to-orange-500",
                          },
                          {
                            icon: Clock,
                            title: "Reminder tool",
                            description: "Never miss important deadlines",
                            color: "from-teal-500 to-cyan-500",
                          },
                          {
                            icon: FileCheck,
                            title: "Docs convert tool",
                            description: "Transform documents effortlessly",
                            color: "from-violet-500 to-purple-500",
                          },
                        ].map((feature, index) => {
                          const Icon = feature.icon;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.4, delay: 0.8 + index * 0.05 }}
                              whileHover={{ y: -8, scale: 1.05 }}
                              className="group cursor-pointer"
                            >
                              {/* Modern Card with Hover Effects */}
                              <div className="relative p-5 rounded-2xl bg-card/50 dark:bg-white/5 border border-border/30 dark:border-white/10 hover:border-primary/50 dark:hover:border-white/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:hover:shadow-purple-500/20 h-full">
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`} />
                                
                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                                  {/* Icon Container */}
                                  <div className="relative">
                                    {/* Outer Glow Effect */}
                                    <motion.div
                                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-20 blur-xl group-hover:opacity-30 transition-opacity`}
                                      animate={{
                                        opacity: [0.15, 0.25, 0.15],
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                      }}
                                    />
                                    
                                    {/* Icon Container */}
                                    <div className={`relative w-16 h-16 md:w-18 md:h-18 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-xl border-2 border-white/30 dark:border-white/40 group-hover:border-white/50 dark:group-hover:border-white/60 transition-all duration-300 group-hover:shadow-2xl`}>
                                      <Icon className="w-8 h-8 md:w-9 md:h-9 text-white drop-shadow-lg" />
                                      
                                      {/* Inner Glow on Hover */}
                                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                  </div>
                                  
                                  {/* Text Content */}
                                  <div className="space-y-1">
                                    <h5 className="text-sm md:text-base font-bold text-foreground dark:text-white group-hover:text-primary dark:group-hover:text-purple-300 transition-colors duration-300 leading-tight">
                                      {feature.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground dark:text-white/60 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      {feature.description}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Shine Effect on Hover */}
                                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "200%" }}
                                    transition={{ duration: 1, ease: "easeInOut" }}
                                  />
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
        </motion.div>
      </div>
    </section>
    </TooltipProvider>
  );
};

export default CreateAgentSection;

