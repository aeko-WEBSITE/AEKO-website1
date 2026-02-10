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
  Zap,
  CheckCircle2,
  Ticket,
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

  const whatItDoesFeatures = [
    {
      icon: MessageSquare,
      title: "Handle customer inquiries 24/7",
      description: "Round-the-clock support with instant responses. Talk to your agent on any channel—DMs and group chats.",
    },
    {
      icon: Zap,
      title: "Analyze sentiment and resolve issues",
      description: "Real-time sentiment analysis and issue resolution. Your data stays private by default.",
    },
    {
      icon: Globe,
      title: "Integrate with your existing tools",
      description: "Connect with your favorite business tools and APIs. Works with the apps you already use.",
    },
    {
      icon: Sparkles,
      title: "Learn from your business data",
      description: "AI-powered insights and personalization from your data. Becomes uniquely yours over time.",
    },
    {
      icon: Rocket,
      title: "Scale with your business needs",
      description: "Grow seamlessly as your business expands. Full access or sandboxed—your choice.",
    },
    {
      icon: Ticket,
      title: "Support ticket creation",
      description: "Automated ticket generation and tracking. Extend with community skills or build your own.",
    },
  ];

  const integrations = [
    "WhatsApp", "Telegram", "Discord", "Slack", "Signal", "iMessage",
    "Claude", "GPT", "Spotify", "Hue", "Obsidian", "X Twitter",
    "Browser", "Gmail", "GitHub",
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
            className="max-w-full mx-auto relative z-10"
          >
            <div className="relative group ">
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
              
              {/* Main card container */}
              <div className="relative rounded-3xl p-6 lg:p-8 dark:p-8 dark:lg:p-10 overflow-hidden shadow-lg shadow-primary/5 dark:shadow-primary/5 group/card transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20" style={{ borderRadius: '24px' }}>
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
                  animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                />
                
                <div className="absolute inset-0 rounded-3xl pointer-events-none dark:hidden border-2 border-border/60 group-hover/card:border-primary/40 transition-colors duration-300" style={{ borderRadius: '24px' }} />
                
                <div className="absolute inset-0 dark:inset-[4px] rounded-3xl bg-card/95 dark:bg-card/30 backdrop-blur-xl border dark:border-none border-border/60 group-hover/card:border-primary/20 transition-all duration-300" style={{ borderRadius: '22px' }} />
                
                <div className="relative z-10">
                  <div className="mb-6">
                    <textarea
                      value={agentDescription}
                      onChange={(e) => setAgentDescription(e.target.value)}
                      placeholder="Describe agent personality (e.g., 'Handle Shopify support tickets')"
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-background/80 backdrop-blur-sm border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 resize-none relative z-10 hover:border-primary/30 hover:shadow-md"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border/50">
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
                          <DropdownMenuItem key={mode} onClick={() => { setSelectedMode(mode); setIsModeOpen(false); }} className="cursor-pointer">{mode}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

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
                          <DropdownMenuItem key={model} onClick={() => { setSelectedModel(model); setIsModelOpen(false); }} className="cursor-pointer">{model}</DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="h-6 w-px bg-border/50" />

                    <button
                      onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                      className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-all duration-300 hover:shadow-md hover:scale-110 active:scale-100 group ${webSearchEnabled ? "bg-primary/10 border-primary/50 text-primary hover:bg-primary/20" : "bg-secondary/50 border-border/50 text-foreground hover:bg-secondary/70"}`}
                      title="Web Search"
                    >
                      <Globe className={`w-4 h-4 transition-transform duration-300 ${webSearchEnabled ? 'rotate-12' : 'group-hover:rotate-12'}`} />
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 border border-border/50 text-foreground text-sm transition-all duration-300 hover:border-primary/30 hover:shadow-md hover:scale-105 active:scale-100 group">
                      <FileText className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      <span>Upload File</span>
                    </button>

                    <input
                      type="text"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="Agent Name"
                      className="px-4 py-2 rounded-lg bg-secondary/50 border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300 text-sm min-w-[120px] hover:border-primary/30 hover:shadow-md"
                    />
                    
                    <Button variant="hero" size="lg" className="ml-auto gap-2 px-6 transition-all duration-300 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed group" disabled={!agentDescription.trim() || !agentName.trim()}>
                      <Rocket className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      Deploy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Platform Description Text */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }} className="text-center mt-8">
            <p className="text-lg text-foreground max-w-2xl mx-auto font-medium">
              All-in-one AI platform for <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-bold">chat</span>
              , <span className="bg-gradient-to-r from-green-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent font-bold">images</span>
              , and <span className="gradient-text font-bold">videos</span> — powered by the world's best models.
            </p>
          </motion.div>

          {/* Automate 80%+ Section */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.4 }} className="mt-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h3 className="text-5xl md:text-6xl font-bold text-foreground leading-tight tracking-tight">Automate 80%+ of interactions with AI agents</h3>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">AEKO AI agents resolve complex issues on any channel. Powered by agentic AI, they reason, adapt, and act independently – delighting customers and employees while reducing costs at scale.</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" size="lg" className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-6 text-base rounded-xl shadow-lg">Contact Sales</Button>
                </div>
              </div>

              {/* Video Interface Demo */}
              <div className="relative">
                <div className="relative rounded-3xl p-4 sm:p-2 overflow-hidden shadow-2xl" style={{ borderRadius: '24px' }}>
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
                  <div className="absolute inset-[2px] rounded-3xl bg-gradient-to-br from-green-100 to-emerald-100" style={{ borderRadius: '22px' }} />
                  <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[21/9] sm:aspect-[1.5/1] flex flex-col bg-gray-900" style={{ borderRadius: '16px' }}>
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-100">
                      <source src="/feeds/video19.mp4" type="video/mp4" />
                    </video>
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
                    <div className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_100px_rgba(0,0,0,0.2)]" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* What It Does + Works With Everything - Reference UI */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-24">
            <div className="relative rounded-2xl p-8 lg:p-10 overflow-hidden bg-card/80 dark:bg-[#0a0a0a] border border-border/50 dark:border-white/10">
              {/* Subtle dot pattern */}
              <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-purple-500/40 blur-sm" />
              <div className="absolute top-1/3 right-1/3 w-2 h-2 rounded-full bg-sky-400/30 blur-sm" />
              <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-purple-500/30 blur-sm" />
              </div>
              <div className="relative z-10 space-y-14">
                {/* What It Does */}
                <div>
                  <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-8 flex items-center gap-2">
                    <span className="text-purple-500">&gt;</span> What It Does
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                    {whatItDoesFeatures.map((feature, index) => {
                      const Icon = feature.icon;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: index * 0.06 }}
                          className="group rounded-xl p-5 bg-background/60 dark:bg-white/[0.06] border border-border/50 dark:border-white/10 hover:border-purple-500/30 transition-all duration-300"
                        >
                          <div className="flex flex-col h-full">
                            <div className="mb-3 flex justify-center">
                              <div className="rounded-lg p-2.5 border-2 border-purple-500/80 text-purple-500 dark:border-purple-500 dark:text-purple-500 group-hover:border-sky-400 group-hover:text-sky-400 transition-colors">
                                <Icon className="w-6 h-6" strokeWidth={2} />
                              </div>
                            </div>
                            <h5 className="text-base font-bold text-foreground mb-2 text-center">{feature.title}</h5>
                            <p className="text-sm text-muted-foreground leading-relaxed text-center flex-1">{feature.description}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
                {/* Works With Everything */}
                <div>
                  <h4 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-2">
                    <span className="text-purple-500">&gt;</span> Works With Everything
                  </h4>
                  <div className="flex flex-wrap gap-2 lg:gap-3">
                    {integrations.map((name, index) => (
                      <motion.span
                        key={name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 dark:bg-white/[0.06] border border-border/50 dark:border-white/10 text-sm font-medium text-foreground hover:border-purple-500/30 hover:text-sky-400/90 transition-colors"
                      >
                        {name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </TooltipProvider>
  );
};

export default CreateAgentSection;