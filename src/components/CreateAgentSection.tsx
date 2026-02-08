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
      description: "Autonomous resolution for order tracking and logistics.",
      example: "Customer: Status of order #AE-992? It was due yesterday.\nAgent: Package is at the Vasai hub; out for delivery by 6 PM today.",
      icon: Headphones,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "E-commerce Assistant",
      description: "Scale personalized shopping and custom order workflows.",
      example: "Customer: Is the Midnight Hoodie in Size L available for ₹1,499?\nAgent: Yes, 4 units left. Would you like to proceed to checkout?",
      icon: ShoppingCart,
      color: "from-primary to-primary/80",
    },
    {
      title: "Travel Booking Agent",
      description: "Real-time API integration for flight and hotel management.",
      example: "Customer: My flight is delayed. Rebook me on the next available.\nAgent: Rebooked on Indigo 6E-2134 at 12:45 PM. Seat 12F confirmed.",
      icon: Briefcase,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Business Intelligence",
      description: "Convert unstructured conversation into actionable data insights.",
      example: "Admin: Why are returns increasing for the Summer Collection?\nAgent: 65% of tickets cite sizing inconsistencies across those SKUs.",
      icon: Zap,
      color: "from-orange-500 to-red-500",
    },
  ];

  const features = [
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

          {/* Launch AI Agents Section - Professional Refined Design */}
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.6 }} className="mt-24 max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight">Launch AI Agents in Minutes</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium">Deploy specialized agents tailored to your business workflows without writing code.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {useCases.map((useCase, index) => {
                const Icon = useCase.icon;
                return (
                  <motion.div key={useCase.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.1 }}>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value={`item-${index}`} className="border border-border/60 rounded-2xl bg-card/50 dark:bg-zinc-900/40 backdrop-blur-sm overflow-hidden transition-all hover:border-primary/40 shadow-sm">
                        <AccordionTrigger className="hover:no-underline px-6 py-5 group">
                          <div className="flex items-center gap-4 text-left">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${useCase.color}`} />
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${useCase.color} flex-shrink-0 shadow-lg`}><Icon className="w-5 h-5 text-white" /></div>
                            <div>
                              <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{useCase.title}</h4>
                              <p className="text-sm text-muted-foreground line-clamp-1 font-normal">{useCase.description}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6 pt-2">
                          <div className="rounded-xl bg-muted/30 dark:bg-black/40 border border-border/40 p-4 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Live Simulation</span>
                            </div>
                            <div className="space-y-3">
                              {useCase.example.split('\n').map((line, lineIndex) => {
                                const isCustomer = line.startsWith('Customer:') || line.startsWith('Admin:');
                                return (
                                  <div key={lineIndex} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${isCustomer ? 'bg-white dark:bg-zinc-800 border border-border/50 text-foreground rounded-tl-none shadow-sm' : 'bg-primary text-primary-foreground rounded-tr-none shadow-md'}`}>
                                      <span className="block text-[10px] opacity-70 mb-1 font-bold">{isCustomer ? 'USER' : 'AI AGENT'}</span>
                                      {line.replace(/^(Customer:|Agent:|Admin:)\s*/, '')}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Capabilities Grid - Features */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.7 }} className="mt-24">
            <div className="relative rounded-3xl p-8 lg:p-10 dark:p-10 dark:lg:p-12 shadow-2xl overflow-hidden border-2 border-border/60 dark:border-white" style={{ borderRadius: '24px' }}>
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
                animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 dark:inset-[4px] rounded-3xl bg-card/95 dark:bg-[#121212] backdrop-blur-2xl" style={{ borderRadius: '22px' }} />
              <div className="relative z-10">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-4">
                    <Sparkles className="w-4 h-4 text-primary" /><span className="text-xs font-semibold text-primary uppercase tracking-wider">Capabilities</span>
                  </div>
                  <h4 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground mb-4 tracking-tight">What Your Custom Agent Can Do</h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div key={index} className="group" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.8 + index * 0.05 }}>
                        <div className="relative h-full p-4 rounded-xl bg-background/80 dark:bg-white/5 border border-border/50 dark:border-white/10 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-sm">
                          <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-[0.08] dark:group-hover:opacity-[0.12] transition-opacity duration-500`} />
                          <div className="relative z-10 flex flex-col items-center gap-3 text-center h-full">
                            <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}><Icon className="w-7 h-7 text-white" /></div>
                            <h5 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">{feature.title}</h5>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
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