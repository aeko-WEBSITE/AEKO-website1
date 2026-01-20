import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  MoreVertical,
  ExternalLink,
  Code,
  Bot,
  FileText,
  ArrowLeft,
  Phone,
  Pencil,
  Download,
  Paperclip,
  Send,
  Loader2,
  CheckCircle2,
  Globe,
  Database,
  Settings,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { crawlAPI } from "@/lib/api";

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "UNPUBLISHED" | "PUBLISHED";
  pricing: "FREE" | "PAID";
  icon?: string;
  createdAt: Date;
}

const AgentStorePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlSuccess, setCrawlSuccess] = useState(false);
  const [crawledData, setCrawledData] = useState<{
    url: string;
    title: string;
    description: string;
    favicon: string | null;
    logo: string | null;
  } | null>(null);
  const [agentName, setAgentName] = useState("My AI Assistant");
  const [agentDescription, setAgentDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [faviconUrl, setFaviconUrl] = useState("");
  const [currentStep, setCurrentStep] = useState<"create" | "knowledge">("create");
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);
  const [knowledgeTab, setKnowledgeTab] = useState<"website" | "files" | "integrations">("website");
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: "1",
      name: "Cnergee",
      description: "Cnergee Technologies provides integrated network security products—SD-WAN, NGFW, Managed WiFi, and Endpoint Security—built in...",
      status: "UNPUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Instagram",
      description: "No description available",
      status: "UNPUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
    },
    {
      id: "3",
      name: "Yamaha Motor India",
      description: "Presenting the new & best in the class - ✓ Mileage Scooters ✓ Performance Motorcycles ✓ Superbikes from Yamaha....",
      status: "UNPUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
    },
    {
      id: "4",
      name: "Hi Focus",
      description: "Explore advanced CCTV solutions from the most reliable and trusted CCTV camera brand in India, Hi Focus. Shop for HD CCTV Cameras, IP, PTZ...",
      status: "UNPUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
    },
    {
      id: "5",
      name: "Aavas Financiers Ltd",
      description: "Aavas Financiers Limited - a leading housing loan finance company in India offering various types of home loans at attractive interest rates...",
      status: "UNPUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
    },
    {
      id: "6",
      name: "Cloud",
      description: "This agent helps the user to raise support requests on the Scogo Cloud Platform",
      status: "UNPUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
    },
    {
      id: "7",
      name: "Globalnet",
      description: "As a market leader in Myanmar, our suite of ICT Solutions is backed up by an extensive data network and infrastructure that spans key...",
      status: "UNPUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
    },
    {
      id: "8",
      name: "IIT Roorkee",
      description: "IIT Roorkee primarily functions as a leading technical research university, offering undergraduate, postgraduate, and doctoral...",
      status: "UNPUBLISHED",
      pricing: "FREE",
      createdAt: new Date(),
    },
  ]);

  const filteredAgents = agents.filter((agent) =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Crawl website function
  const handleCrawlWebsite = async () => {
    if (!websiteUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }

    setIsCrawling(true);
    setCrawlSuccess(false);
    setCrawledData(null);

    try {
      const data = await crawlAPI.crawlWebsite(websiteUrl);

      if (data.success && data.data) {
        setCrawledData(data.data);
        setCrawlSuccess(true);
        setAgentName(data.data.title || "My AI Assistant");
        setAgentDescription(data.data.description || "");
        setLogoUrl(data.data.logo || "");
        setFaviconUrl(data.data.favicon || "");
        toast.success("Website crawled successfully!");
      } else {
        toast.error(data.message || "Failed to crawl website");
        setCrawlSuccess(false);
      }
    } catch (error: any) {
      console.error("Crawl error:", error);
      toast.error(error.message || "Failed to crawl website. Make sure the backend is running.");
      setCrawlSuccess(false);
    } finally {
      setIsCrawling(false);
    }
  };

  // Handle URL input change and auto-crawl
  useEffect(() => {
    if (websiteUrl.trim() && !isCrawling) {
      const urlPattern = /^https?:\/\/.+/;
      if (urlPattern.test(websiteUrl)) {
        // Auto-crawl when valid URL is entered
        const timeoutId = setTimeout(() => {
          handleCrawlWebsite();
        }, 1500); // Wait 1.5 seconds after user stops typing

        return () => clearTimeout(timeoutId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websiteUrl]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!isCreateDialogOpen) {
      setWebsiteUrl("");
      setIsCrawling(false);
      setCrawlSuccess(false);
      setCrawledData(null);
      setAgentName("My AI Assistant");
      setAgentDescription("");
      setLogoUrl("");
      setFaviconUrl("");
    }
  }, [isCreateDialogOpen]);

  const handleNext = () => {
    if (!websiteUrl.trim()) {
      toast.error("Please enter a website URL");
      return;
    }
    setCurrentStep("knowledge");
  };

  const handleBack = () => {
    setCurrentStep("create");
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-background mt-7">
      {/* Header */}
      <div className="mb-3 px-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Agent Store</h1>
          </div>
          <Button
            variant="hero"
            size="default"
            className="gap-2"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Create Agent
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Agents..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all text-sm"
          />
        </div>
      </div>

      {/* Agent Grid - Full Width */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 px-1">
        {filteredAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-card border border-border/50 rounded-xl p-4 hover:border-primary/50 hover:shadow-lg transition-all group"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                    {agent.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary/50 text-muted-foreground">
                      {agent.status}
                    </span>
                    <span className="text-xs text-muted-foreground">|</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500">
                      {agent.pricing}
                    </span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => toast.info("Edit agent")}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Delete agent")}>
                    Delete
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.info("Duplicate agent")}>
                    Duplicate
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Description */}
            <p className="text-xs text-muted-foreground mb-3 line-clamp-3 leading-relaxed">
              {agent.description}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50">
              <div className="flex items-center gap-2">
                <button
                  className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  title="Share"
                  onClick={() => toast.info("Share agent")}
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
                <button
                  className="p-2 hover:bg-secondary/50 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                  title="View Code"
                  onClick={() => toast.info("View code")}
                >
                  <Code className="w-4 h-4" />
                </button>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  toast.info(`Interacting with ${agent.name}`);
                }}
              >
                Interact
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-8">
          <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No agents found</p>
        </div>
      )}

      {/* Create Agent Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open);
        if (!open) {
          setCurrentStep("create");
          setSelectedUrls([]);
        }
      }}>
        <DialogContent className="max-w-5xl w-full h-[85vh] p-0 gap-0 bg-[#0a0a1a] border-4 border-white overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep === "create" ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex h-full gap-0 w-full"
              >
                {/* Left Side - Create New Agent Form */}
                <div className="w-full lg:w-[400px] bg-gradient-to-br from-[#12162A] via-[#1a1f3a] to-[#12162A] p-6 overflow-y-auto flex flex-col">
              <DialogHeader className="mb-4">
                <DialogTitle className="text-xl font-bold text-white">Create New Agent</DialogTitle>
              </DialogHeader>

              <div className="space-y-4 flex-1">
                {/* Website URL */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Website URL<span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Input
                      type="url"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                    />
                    {isCrawling && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-white/70" />
                      </div>
                    )}
                    {crawlSuccess && !isCrawling && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-white/50 mt-1.5">
                    Enter only the main domain, not specific pages
                  </p>
                </div>

                {/* Agent Name */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Agent Name
                  </label>
                  <Input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="My AI Assistant"
                    className="w-full bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                  />
                </div>

                {/* Agent Description */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Agent Description
                  </label>
                  <Textarea
                    value={agentDescription}
                    onChange={(e) => setAgentDescription(e.target.value)}
                    placeholder="Brief description of what your agent does..."
                    rows={4}
                    className="w-full bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/50 resize-none"
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Logo
                  </label>
                  <Input
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Paste image URL"
                    className="w-full bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                  />
                </div>

                {/* Favicon */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Favicon
                  </label>
                  <Input
                    type="url"
                    value={faviconUrl}
                    onChange={(e) => setFaviconUrl(e.target.value)}
                    placeholder="Paste image URL"
                    className="w-full bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                  />
                </div>

              </div>
              
              {/* Next Button - Fixed at Bottom */}
              <div className="flex justify-end pt-4 mt-auto border-t border-white/10">
                <Button
                  onClick={handleNext}
                  disabled={!websiteUrl.trim() || !isValidUrl(websiteUrl)}
                  className={`px-8 py-2 rounded-lg font-medium transition-all ${
                    websiteUrl.trim() && isValidUrl(websiteUrl)
                      ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Right Side - Live Preview */}
            <div className="hidden lg:flex w-[480px] bg-gradient-to-br from-[#1a1f3a] via-[#0f1629] to-[#1a1f3a] p-6 overflow-y-auto">
              <div className="w-full mx-auto">
                <DialogHeader className="mb-4">
                  <DialogTitle className="text-xl font-bold text-white">Live Preview</DialogTitle>
                </DialogHeader>

                {/* Preview Chat Interface */}
                <div className="bg-[#0f1629] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#12162A]">
                    <div className="flex items-center gap-3">
                      <ArrowLeft className="w-5 h-5 text-white/70 cursor-pointer hover:text-white" />
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">AI</span>
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">{agentName || "My AI Assistant"}</div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-400"></div>
                            <span className="text-xs text-white/60">Always Available</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Phone className="w-4 h-4 text-white/70" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Pencil className="w-4 h-4 text-white/70" />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-white/70" />
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-4 space-y-4 min-h-[300px]">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-xs">AI</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 rounded-2xl rounded-tl-sm p-3 text-white text-sm">
                          Hi, I'm {agentName || "My AI Assistant"}, your AI Support Agent, how can I help you?
                        </div>
                        <div className="text-xs text-white/40 mt-1 ml-1">01:05 PM</div>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-white/10 bg-[#12162A]">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Ask AI about anything..."
                        className="flex-1 bg-black/40 border border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 text-sm"
                      />
                      <button className="p-2.5 hover:bg-white/10 rounded-lg transition-colors">
                        <Paperclip className="w-4 h-4 text-white/70" />
                      </button>
                      <button className="p-2.5 hover:bg-white/10 rounded-lg transition-colors">
                        <Send className="w-4 h-4 text-white/70" />
                      </button>
                    </div>
                    <p className="text-xs text-white/40 mt-2 text-center">
                      Your AI-powered business companion is here.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
            ) : (
              <motion.div
                key="knowledge"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex h-full gap-0 w-full"
              >
                {/* Website Knowledge Step */}
                <div className="w-full bg-gradient-to-br from-[#12162A] via-[#1a1f3a] to-[#12162A] p-6 overflow-hidden flex flex-col">
                  <DialogHeader className="mb-6">
                    <DialogTitle className="text-2xl font-bold text-white mb-2">Agent Superpowers</DialogTitle>
                    <p className="text-sm text-white/70">Enhance your agent with additional capabilities</p>
                  </DialogHeader>

                  {/* Tabs */}
                  <div className="flex gap-2 mb-6 border-b border-white/10">
                    <button 
                      onClick={() => setKnowledgeTab("website")}
                      className={`px-4 py-2 font-medium pb-2 flex items-center gap-2 transition-colors ${
                        knowledgeTab === "website"
                          ? "text-white border-b-2 border-blue-500"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      Website Knowledge
                    </button>
                    <button 
                      onClick={() => setKnowledgeTab("files")}
                      className={`px-4 py-2 font-medium pb-2 flex items-center gap-2 transition-colors ${
                        knowledgeTab === "files"
                          ? "text-white border-b-2 border-blue-500"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Database className="w-4 h-4" />
                      Knowledge Files
                    </button>
                    <button 
                      onClick={() => setKnowledgeTab("integrations")}
                      className={`px-4 py-2 font-medium pb-2 flex items-center gap-2 transition-colors ${
                        knowledgeTab === "integrations"
                          ? "text-white border-b-2 border-blue-500"
                          : "text-white/50 hover:text-white"
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      Integrations
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto mb-4">
                    {knowledgeTab === "website" && (
                      <>
                        {/* Search Bar */}
                        <div className="relative mb-6">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                          <Input
                            type="text"
                            placeholder="Search website pages..."
                            className="w-full pl-10 bg-black/40 border-white/20 text-white placeholder:text-white/50 focus:border-white/50"
                          />
                        </div>

                        {/* Selected URLs Info */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm text-white/70">
                            Selected URLs To Scrape ({selectedUrls.length}/96)
                          </span>
                          <span className="text-xs text-white/50">Will save on deploy</span>
                        </div>

                        {/* URL List - Show only 4 pages */}
                        <div className="space-y-2">
                        {websiteUrl && [
                          { url: websiteUrl, title: new URL(websiteUrl).hostname },
                          { url: `${websiteUrl}/featured`, title: "Featured" },
                          { url: `${websiteUrl}/sitemap`, title: "Sitemap" },
                          { url: `${websiteUrl}/add-new`, title: "Add New" },
                        ].slice(0, 4).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-black/20 rounded-lg border border-white/10 hover:border-white/30 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedUrls.includes(item.url)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUrls([...selectedUrls, item.url]);
                                } else {
                                  setSelectedUrls(selectedUrls.filter(u => u !== item.url));
                                }
                              }}
                              className="w-4 h-4 rounded border-white/30 bg-transparent text-blue-500 focus:ring-blue-500"
                            />
                            <ExternalLink className="w-4 h-4 text-white/50" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{item.title}</p>
                              <p className="text-xs text-white/50">{item.url}</p>
                            </div>
                          </div>
                        ))}
                        </div>
                      </>
                    )}

                    {/* Knowledge Files Tab */}
                    {knowledgeTab === "files" && (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-full max-w-md border-2 border-dashed border-white/20 rounded-xl p-12 text-center hover:border-white/30 transition-colors cursor-pointer">
                          <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                              <FileText className="w-8 h-8 text-white/50" />
                            </div>
                            <div>
                              <p className="text-lg font-semibold text-white mb-2">Upload Knowledge Files</p>
                              <p className="text-sm text-white/60 mb-1">Drag and drop files here, or click to browse</p>
                              <p className="text-xs text-white/40">Supports PDF, DOC, DOCX, TXT, MD files</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Integrations Tab */}
                    {knowledgeTab === "integrations" && (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Settings className="w-16 h-16 text-white/30 mx-auto mb-4" />
                          <p className="text-lg font-semibold text-white mb-2">Integrations</p>
                          <p className="text-sm text-white/60">Connect your favorite tools and services</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons - Fixed at Bottom */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10 flex-shrink-0">
                    <Button
                      onClick={handleBack}
                      variant="outline"
                      className="flex items-center gap-2 px-6 py-2 border-white/20 text-white hover:bg-white/10"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </Button>
                    <div className="flex-1" />
                    <Button
                      onClick={() => {
                        if (knowledgeTab === "website") {
                          setKnowledgeTab("files");
                        } else if (knowledgeTab === "files") {
                          setKnowledgeTab("integrations");
                        } else {
                          toast.success("Agent created successfully!");
                          setIsCreateDialogOpen(false);
                          setCurrentStep("create");
                          setSelectedUrls([]);
                          setKnowledgeTab("website");
                        }
                      }}
                      className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-lg"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AgentStorePage;






