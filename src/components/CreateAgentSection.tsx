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
      color: "from-primary to-primary/80",
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

  return (
    <TooltipProvider>
    <section className="py-24 lg:py-32 relative overflow-hidden w-full bg-gradient-to-b from-background to-muted/20 dark:bg-black">
      {/* Deep Black Base - Only for Dark Mode */}
      <div className="absolute inset-0 bg-black w-full hidden dark:block" />
      
      {/* Subtle Grid Pattern - Light Mode */}
      <div className="absolute inset-0 opacity-[0.03] dark:hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }} />
      </div>
      {/* Subtle Grid Pattern - Dark Mode */}
      <div className="absolute inset-0 opacity-8 hidden dark:block">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }} />
      </div>

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
            <div className="relative rounded-3xl p-6 lg:p-8 dark:p-8 dark:lg:p-10 overflow-hidden shadow-lg shadow-primary/5 dark:shadow-primary/5 group/card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20" style={{ borderRadius: '24px' }}>
              {/* Rich Animated Gradient Border - Only Dark Mode, Increased Width */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none hidden dark:block"
                style={{
                  padding: '4px',
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
              
              {/* Light Mode - Plain Professional Border */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none dark:hidden border-2 border-border/60 group-hover/card:border-primary/40 transition-colors duration-300" style={{ borderRadius: '24px' }} />
              
              {/* Inner Background - Theme Aware */}
              <div className="absolute inset-0 dark:inset-[4px] rounded-3xl bg-card/95 dark:bg-card/30 backdrop-blur-xl border dark:border-none border-border/60 group-hover/card:border-primary/20 transition-all duration-300" style={{ borderRadius: '22px' }} />
              
              <div className="relative z-10">
            {/* Top Section - Textarea */}
            <div className="mb-6">
              <textarea
                value={agentDescription}
                onChange={(e) => setAgentDescription(e.target.value)}
                placeholder="Describe agent or use URL"
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-none relative z-10 hover:border-primary/30 hover:shadow-md"
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/50">
              {/* Mode Selector */}
              <DropdownMenu open={isModeOpen} onOpenChange={setIsModeOpen}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 border border-border/50 text-foreground text-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:scale-105 active:scale-100 group">
                    <Bot className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    <span>{selectedMode}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
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
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 border border-border/50 text-foreground text-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:scale-105 active:scale-100 group">
                    <Sparkles className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                    <span>{selectedModel}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
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
                className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300 hover:shadow-md hover:scale-110 active:scale-100 group ${
                  webSearchEnabled
                    ? "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20"
                    : "bg-secondary/50 border-border/50 text-foreground hover:bg-secondary/70 hover:border-primary/30"
                }`}
                title="Web Search"
              >
                <Globe className={`w-4 h-4 transition-transform duration-300 ${webSearchEnabled ? 'rotate-12' : 'group-hover:rotate-12'}`} />
              </button>

              {/* Upload File */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 border border-border/50 text-foreground text-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:scale-105 active:scale-100 group">
                <FileText className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                <span>Upload File</span>
              </button>

              {/* Agent Name Input */}
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Agent Name"
                className="px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm min-w-[120px] hover:border-primary/30 hover:shadow-md"
              />
              
              {/* Deploy Button - Right Side */}
              <Button
                variant="hero"
                size="lg"
                className="ml-auto gap-2 px-6 transition-all duration-300 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
                disabled={!agentDescription.trim() || !agentName.trim()}
              >
                <Rocket className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
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
          <p className="text-lg text-foreground max-w-2xl mx-auto font-medium">
            All-in-one AI platform for{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">
              chat
            </span>
            ,{' '}
            <span className="bg-gradient-to-r from-green-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent font-bold">
              images
            </span>
            , and{' '}
            <span className="gradient-text font-bold">
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
        <source src="/feeds/video19.mp4" type="video/mp4" />
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
            <div className="relative rounded-xl bg-card/80 dark:bg-card/50 backdrop-blur-xl border border-border/60 dark:border-white/10 p-4 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 items-start">
                {useCases.map((useCase, index) => {
                  const Icon = useCase.icon;
                  return (
                    <motion.div
                      key={useCase.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                      className="w-full"
                    >
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value={`item-${index}`}
                          className="border-none"
                        >
                          {/* Professional AccordionTrigger */}
                          <AccordionTrigger className="relative group hover:no-underline px-3.5 py-2.5 rounded-lg bg-background/50 dark:bg-white/5 border border-border/40 dark:border-white/10 hover:border-primary/40 dark:hover:border-primary/30 hover:bg-background/80 dark:hover:bg-white/10 transition-all duration-200 flex-shrink-0">
                            <div className="flex items-center gap-2.5 w-full">
                              {/* Minimal Icon */}
                              <div className={`relative w-8 h-8 rounded-md bg-gradient-to-br ${useCase.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              {/* Content */}
                              <div className="flex-1 text-left min-w-0">
                                <h4 className="text-sm font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors truncate leading-tight">
                                  {useCase.title}
                                </h4>
                                <p className="text-xs text-muted-foreground/80 dark:text-white/60 line-clamp-1 leading-tight">
                                  {useCase.description}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          {/* Compact Accordion Content */}
                          <AccordionContent className="px-3.5 pb-2.5 pt-1.5">
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="relative"
                            >
                              {/* Minimal Example Card */}
                              <div className="mt-2 p-2.5 rounded-md bg-muted/40 dark:bg-white/5 border border-border/40 dark:border-white/10">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <MessageSquare className="w-3 h-3 text-primary/80" />
                                  <span className="text-[10px] font-medium text-muted-foreground dark:text-white/50 uppercase tracking-wide">
                                    Example
                                  </span>
                                </div>
                                <div className="space-y-1.5">
                                  {useCase.example.split('\n').map((line, lineIndex) => {
                                    const isCustomer = line.startsWith('Customer:') || line.startsWith('AI Intelligence Dashboard');
                                    return (
                                      <motion.div
                                        key={lineIndex}
                                        initial={{ opacity: 0, x: isCustomer ? 8 : -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: lineIndex * 0.08 }}
                                        className={`flex gap-1.5 ${isCustomer ? 'justify-end' : 'justify-start'}`}
                                      >
                                        {!isCustomer && (
                                          <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${useCase.color} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                            <Bot className="w-2 h-2 text-white" />
                                          </div>
                                        )}
                                        <div className={`max-w-[88%] rounded-md px-2.5 py-1.5 text-[11px] leading-relaxed ${
                                          isCustomer
                                            ? 'bg-primary/8 dark:bg-primary/15 text-foreground dark:text-white/90 border border-primary/15'
                                            : `bg-gradient-to-br ${useCase.color}/15 dark:${useCase.color}/20 text-foreground dark:text-white/90 border border-border/40`
                                        }`}>
                                          <span className="font-medium text-primary/90">
                                            {isCustomer ? (line.includes('Customer:') ? 'Customer: ' : '') : 'Agent: '}
                                          </span>
                                          <span className="text-muted-foreground dark:text-white/80">{line.replace(/^(Customer:|Agent:)\s*/, '')}</span>
                                        </div>
                                        {isCustomer && (
                                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <User className="w-2 h-2 text-white" />
                                          </div>
                                        )}
                                      </motion.div>
                                    );
                                  })}
                                </div>
                              </div>
                            </motion.div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  );
                })}
              </div>
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
                  <div className="relative rounded-3xl p-8 lg:p-10 dark:p-10 dark:lg:p-12 shadow-2xl overflow-hidden border-2 border-border/60 dark:border-white" style={{ borderRadius: '24px' }}>
                    {/* Animated Gradient Border - Only Dark Mode, Increased Width */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl pointer-events-none hidden dark:block"
                      style={{
                        padding: '4px',
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
                    
                    {/* Light Mode - Plain Professional Border (already has border-2 on parent) */}
                    
                    {/* Inner Background - Theme Aware */}
                    <div className="absolute inset-0 dark:inset-[4px] rounded-3xl bg-card/95 dark:bg-[#22121] backdrop-blur-2xl" style={{ borderRadius: '22px' }} />
                    {/* Decorative Gradient Overlay */}
                    <div className="absolute inset-0 dark:inset-[4px] rounded-3xl bg-primary/5 dark:bg-primary/5 pointer-events-none" style={{ borderRadius: '22px' }} />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Enhanced Header */}
                      <motion.div 
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-4">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Capabilities</span>
                        </div>
                        <h4 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight leading-tight">
                          What Your Custom Agent Can Do
                        </h4>
                        <p className="text-base md:text-lg text-muted-foreground/90 font-medium max-w-2xl mx-auto">
                          Powerful capabilities to automate and enhance your business operations
                        </p>
                      </motion.div>
                      
                      {/* Modern Interactive Grid with Hover Cards */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
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
                            color: "from-primary to-primary/80",
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
                            color: "from-primary to-primary/80",
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
                            color: "from-primary to-primary/80",
                          },
                        ].map((feature, index) => {
                          const Icon = feature.icon;
                          return (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.9, y: 20 }}
                              whileInView={{ opacity: 1, scale: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.5, delay: 0.8 + index * 0.05, type: "spring", stiffness: 100 }}
                              className="group"
                            >
                              {/* Professional Card with Modern Design */}
                              <div className="relative h-full p-4 rounded-xl bg-gradient-to-br from-background/80 to-background/60 dark:from-white/5 dark:to-white/[0.02] border border-border/50 dark:border-white/10 hover:border-primary/40 dark:hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer overflow-hidden">
                                {/* Animated Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.12] transition-opacity duration-500`} />
                                
                                {/* Subtle Shine Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none">
                                  <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    initial={{ x: "-100%" }}
                                    whileHover={{ x: "200%" }}
                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                  />
                                </div>
                                
                                {/* Content */}
                                <div className="relative z-10 flex flex-col items-center gap-3 text-center h-full">
                                  {/* Icon Container - Modern Design */}
                                  <div className="relative">
                                    {/* Subtle Glow */}
                                    <motion.div
                                      className={`absolute -inset-2 rounded-xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500`}
                                    />
                                    
                                    {/* Icon Box */}
                                    <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                                      <Icon className="w-7 h-7 text-white drop-shadow-md transition-transform duration-300 group-hover:scale-110" />
                                      
                                      {/* Inner Highlight */}
                                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </div>
                                  </div>
                                  
                                  {/* Text Content */}
                                  <div className="space-y-1 flex-1 flex flex-col justify-center">
                                    <h5 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug line-clamp-2">
                                      {feature.title}
                                    </h5>
                                    <p className="text-xs text-muted-foreground/80 dark:text-white/60 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                                      {feature.description}
                                    </p>
                                  </div>
                                  
                                  {/* Hover Indicator */}
                                  <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-auto" />
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

