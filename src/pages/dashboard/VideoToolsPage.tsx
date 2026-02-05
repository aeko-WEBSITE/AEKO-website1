import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Wand2,
  Paperclip,
  Settings2,
  Zap,
  Loader2,
  Sparkles,
  ChevronDown,
  Download,
  Share2,
  Copy,
  Play,
  Pause,
  Trash2,
  Star,
  Grid3x3,
  Square,
  Film,
  ArrowLeftRight,
  Maximize2,
  Eye,
  Palette,
  Timer,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const videoModes = [
  { id: "text-to-video", label: "Text to Video", icon: Video, color: "from-orange-500 to-red-500" },
  { id: "video-to-video", label: "Video to Video", icon: ArrowLeftRight, color: "from-blue-500 to-cyan-500" },
  { id: "enhance", label: "Enhance", icon: Wand2, color: "from-pink-500 to-rose-500" },
];

const videoModels = [
  { id: "runway", name: "Runway Gen-2", icon: Film, description: "Cinematic quality videos" },
  { id: "pika", name: "Pika Labs", icon: Zap, description: "Fast generation" },
  { id: "stability", name: "Stable Video", icon: Video, description: "Stable and consistent" },
  { id: "google", name: "Google", icon: Video, description: "Fast and reliable generation" },
];

const VideoToolsPage = () => {
  const [activeMode, setActiveMode] = useState("text-to-video");
  const [selectedModel, setSelectedModel] = useState(videoModels[0]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [enhancePrompt, setEnhancePrompt] = useState(false);
  const [numberOfVideos, setNumberOfVideos] = useState("1");
  const [viewMode, setViewMode] = useState<"grid" | "single">("single");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setGeneratedVideo("https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4");
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background relative">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5,
          }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-primary/10 rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />

      {/* Professional Header */}
      <div className="relative z-10 flex-shrink-0 border-b border-border/50 bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-xl px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(99, 102, 241, 0.3)",
                  "0 0 30px rgba(168, 85, 247, 0.4)",
                  "0 0 20px rgba(99, 102, 241, 0.3)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Video className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl sm:text-xl font-bold text-foreground">AI Video Playground</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">Create stunning videos with AI</p>
            </div>
          </div>
          
          {/* Mode Switcher - Modern Pills */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {videoModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? `bg-gradient-to-r ${mode.color} text-white shadow-lg shadow-primary/30`
                      : "bg-card/60 text-muted-foreground hover:bg-card/80 hover:text-foreground border border-border/50"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-white/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.3, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{mode.label}</span>
                  <span className="sm:hidden">{mode.label.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Playground Layout */}
      <div className="relative z-6 flex flex-1 h-full w-full min-w-0 gap-2 sm:gap-4 overflow-hidden p-4 sm:p-4">
        {/* LEFT: Input Section - Professional Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col w-full lg:w-[30%] min-h-0 h-full"
        >
          <div className="flex flex-col rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl shadow-2xl shadow-primary/5 p-5 sm:p-6 space-y-6 h-full overflow-hidden">
            {/* Header with Model Selector */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">Creative Input</h2>
                  <p className="text-xs text-muted-foreground">Describe your vision</p>
                </div>
              </div>
              
              {/* Model Selector - Enhanced */}
              <DropdownMenu open={isModelOpen} onOpenChange={setIsModelOpen}>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 hover:from-primary/20 hover:to-purple-500/20 border-2 border-primary/30 hover:border-primary/50 text-foreground text-sm font-semibold transition-all shadow-lg backdrop-blur-sm"
                  >
                    {(() => {
                      const ModelIcon = selectedModel.icon;
                      return (
                        <motion.div
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <ModelIcon className="w-4 h-4 text-primary" />
                        </motion.div>
                      );
                    })()}
                    <span className="hidden sm:inline">{selectedModel.name}</span>
                    <span className="sm:hidden">{selectedModel.name.split(' ')[0]}</span>
                    <Badge variant="outline" className="ml-1 text-xs border-primary/30">
                      {selectedModel.description}
                    </Badge>
                    <ChevronDown className={`w-2 h-4 text-muted-foreground transition-transform ${isModelOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 backdrop-blur-xl bg-card/95 border border-border/50 shadow-xl">
                  {videoModels.map((model) => {
                    const ModelIcon = model.icon;
                    const isSelected = selectedModel.id === model.id;
                    return (
                      <DropdownMenuItem
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setIsModelOpen(false);
                        }}
                        className={`cursor-pointer hover:bg-primary/5 transition-colors p-3 rounded-lg ${
                          isSelected ? "bg-primary/10 border border-primary/30" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${isSelected ? 'from-primary to-purple-500' : 'from-secondary to-secondary'} flex items-center justify-center`}>
                            <ModelIcon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-foreground'}`} />
                          </div>
                          <div className="flex flex-col flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-foreground text-sm">{model.name}</span>
                              {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                            </div>
                            <span className="text-xs text-muted-foreground">{model.description}</span>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Enhanced Prompt Input - This expands to fill space */}
            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="flex-1 flex flex-col min-h-0 relative">
                <label className="block text-sm font-semibold text-foreground mb-2 flex-shrink-0 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Video Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic cityscape at sunset, neon lights reflecting on wet streets, cyberpunk aesthetic, cinematic 4K, slow panning shot..."
                  disabled={activeMode === "video-to-video"}
                  className="w-full flex-1 min-h-[120px] bg-background/60 backdrop-blur-sm border-2 border-border/50 rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs border-border/30 bg-background/80">
                    {prompt.length} chars
                  </Badge>
                </div>
              </div>
              
              {/* Video Upload for Video-to-Video */}
              {activeMode === "video-to-video" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border-2 border-dashed border-primary/30 rounded-xl p-6 text-center bg-gradient-to-br from-primary/5 to-purple-500/5 hover:border-primary/50 transition-all cursor-pointer group flex-shrink-0"
                >
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Video className="w-12 h-12 mx-auto mb-3 text-primary" />
                  </motion.div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Upload a video to transform
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supports MP4, MOV, AVI up to 500MB
                  </p>
                  <Button variant="outline" size="sm" className="gap-2 border-primary/30 hover:border-primary/50">
                    <Paperclip className="w-4 h-4" />
                    Choose Video
                  </Button>
                </motion.div>
              )}
              
              {/* Action Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30 border border-border/30">
                    <Switch
                      checked={enhancePrompt}
                      onCheckedChange={setEnhancePrompt}
                    />
                    <span className="text-sm font-medium text-foreground">Enhance Prompt</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30 hover:bg-secondary/50 border border-border/30 hover:border-primary/30 text-sm text-foreground transition-all"
                  >
                    <Star className="w-4 h-4 text-primary" />
                    <span className="hidden sm:inline">AI Translate</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPrompt("")}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/30 hover:bg-destructive/10 border border-border/30 hover:border-destructive/30 text-sm text-foreground transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Clear</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Advanced Options - flex-shrink-0 to stay at bottom */}
            <div className="grid grid-cols-2 gap-4 flex-shrink-0">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  Quantity
                </label>
                <div className="relative">
                  <select
                    value={numberOfVideos}
                    onChange={(e) => setNumberOfVideos(e.target.value)}
                    className="w-full px-4 py-2.5 bg-background/60 backdrop-blur-sm border-2 border-border/50 rounded-xl text-foreground text-sm focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 appearance-none transition-all"
                  >
                    <option value="1">1 Video</option>
                    <option value="2">2 Videos</option>
                    <option value="4">4 Videos</option>
                    <option value="8">8 Videos</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-primary/5">
                  <Star className="w-3 h-3 mr-1" />
                  Pro Feature
                </Badge>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Duration
                </label>
                <div className="px-4 py-2.5 bg-background/60 backdrop-blur-sm border-2 border-border/50 rounded-xl flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">5 seconds</span>
                  <Badge variant="outline" className="text-xs">Default</Badge>
                </div>
              </div>
            </div>

            {/* Generate Button - Enhanced */}
            <motion.div
              whileHover={{ scale: isLoading || !prompt.trim() ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !prompt.trim() ? 1 : 0.98 }}
              className="flex-shrink-0"
            >
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full h-12 bg-gradient-to-r from-primary via-purple-500 to-pink-500 hover:from-primary/90 hover:via-purple-500/90 hover:to-pink-500/90 text-white font-bold text-base shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT: Output Section - Professional Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col w-full lg:w-[70%] min-h-0 h-full"
        >
          <div className="flex flex-col rounded-2xl border border-border/50 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl shadow-2xl shadow-primary/5 p-5 sm:p-6 space-y-6 h-full min-h-0 overflow-hidden">
            {/* Header with Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-border/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-foreground">Live Preview</h2>
                  <p className="text-xs text-muted-foreground">Real-time generation</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-xl transition-all border ${
                    viewMode === "grid"
                      ? "bg-primary/10 border-primary/50 text-primary"
                      : "bg-secondary/30 border-border/30 hover:bg-secondary/50 text-foreground"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setViewMode("single")}
                  className={`p-2.5 rounded-xl transition-all border ${
                    viewMode === "single"
                      ? "bg-primary/10 border-primary/50 text-primary"
                      : "bg-secondary/30 border-border/30 hover:bg-secondary/50 text-foreground"
                  }`}
                  title="Single View"
                >
                  <Square className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2.5 rounded-xl transition-all border bg-secondary/30 border-border/30 hover:bg-secondary/50 hover:border-primary/50"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4 text-foreground" />
                </motion.button>
              </div>
            </div>

            {/* Enhanced Video Preview Area - Occupies all available height */}
            <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden bg-black/5 rounded-2xl border-2 border-dashed border-border/50 relative">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center w-full"
                  >
                    <div className="relative w-32 h-32 mb-6">
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-pink-500/20 blur-xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-primary/10 to-purple-500/10 border-2 border-primary/30 flex items-center justify-center">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Generating Your Video</h3>
                    <p className="text-sm text-muted-foreground mb-4">This may take a few moments...</p>
                    <div className="w-64 h-2 bg-secondary/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary via-purple-500 to-pink-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                  </motion.div>
                ) : generatedVideo ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex flex-col min-h-0 space-y-4 p-4"
                  >
                    <div className="relative rounded-xl overflow-hidden flex-1 min-h-0 bg-black border-2 border-border/50 shadow-xl group">
                      <video
                        src={generatedVideo}
                        className="w-full h-full object-contain"
                        controls={false}
                        autoPlay
                        loop
                        ref={(video) => {
                          if (video) {
                            video.onplay = () => setIsPlaying(true);
                            video.onpause = () => setIsPlaying(false);
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            const video = e.currentTarget.parentElement?.previousElementSibling as HTMLVideoElement;
                            if (video) {
                              if (isPlaying) {
                                video.pause();
                              } else {
                                video.play();
                              }
                            }
                          }}
                          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all border-2 border-white/30 shadow-2xl"
                        >
                          {isPlaying ? (
                            <Pause className="w-10 h-10 text-white" />
                          ) : (
                            <Play className="w-10 h-10 text-white ml-1" />
                          )}
                        </motion.button>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-black/50 backdrop-blur-md text-white border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Generated
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button variant="outline" size="lg" className="flex-1 gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="lg" className="flex-1 gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                      <Button variant="outline" size="lg" className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5 transition-all">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center w-full max-w-md px-4"
                  >
                    <div className="relative w-32 h-32 mb-6">
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 blur-2xl"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-card/50 to-card/30 border-2 border-border/50 flex items-center justify-center backdrop-blur-sm">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Sparkles className="w-12 h-12 text-primary" />
                        </motion.div>
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">
                      Ready to Generate
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Enter your prompt above and click generate to create stunning AI-powered videos
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VideoToolsPage;