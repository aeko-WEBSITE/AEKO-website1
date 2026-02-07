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
  Layers,
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

const quantityOptions = [
  { value: "1", label: "1 Video", badge: "1x" },
  { value: "2", label: "2 Videos", badge: "2x" },
  { value: "3", label: "3 Videos", badge: "3x" },
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
    <div className="flex flex-col h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 relative font-sans selection:bg-primary/30 transition-colors duration-300">
      
      {/* Enhanced Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 dark:opacity-20 mix-blend-overlay dark:mix-blend-soft-light"></div>
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            opacity: [0.3, 0.5, 0.3], // Slightly more visible in light mode
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] bg-purple-200/60 dark:bg-purple-600/20 rounded-full blur-[100px] dark:blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
          className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-blue-200/60 dark:bg-blue-600/20 rounded-full blur-[100px] dark:blur-[120px]"
        />
      </div>

      {/* Adaptive Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none" />

      {/* Professional Header */}
      <div className="relative z-10 flex-shrink-0 border-b border-zinc-200 dark:border-white/10 bg-white/70 dark:bg-black/20 backdrop-blur-xl px-4 sm:px-6 py-4 transition-colors duration-300">
        <div className="flex items-center justify-between w-full max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-[0_0_15px_rgba(79,70,229,0.3)] border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <Video className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">AI Video Playground</h1>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Create stunning videos with AI</p>
            </div>
          </div>
          
          {/* Mode Switcher - Adaptive Pills */}
          <div className="flex p-1 bg-zinc-100 dark:bg-white/5 rounded-xl border border-zinc-200 dark:border-white/5 backdrop-blur-md">
            {videoModes.map((mode) => {
              const Icon = mode.icon;
              const isActive = activeMode === mode.id;
              return (
                <motion.button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all z-10 ${
                    isActive ? "text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute inset-0 rounded-lg bg-gradient-to-r ${mode.color} shadow-lg opacity-90`}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 hidden sm:inline">{mode.label}</span>
                  <span className="relative z-10 sm:hidden">{mode.label.split(' ')[0]}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Playground Layout */}
      <div className="relative z-10 flex flex-1 h-full w-full max-w-[1920px] mx-auto min-h-0 gap-4 overflow-hidden p-4 sm:p-6">
        
        {/* LEFT: Input Section - Adaptive Glass Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col w-full lg:w-[30%] min-h-0 h-full"
        >
          <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-xl shadow-zinc-200/50 dark:shadow-2xl dark:shadow-black/50 p-5 space-y-5 h-full overflow-y-auto custom-scrollbar transition-colors duration-300">
            
            {/* Header with Model Selector */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center">
                  <Wand2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white">Creative Input</h2>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Describe your vision</p>
                </div>
              </div>
              
              {/* Model Selector - Adaptive Button */}
              <DropdownMenu open={isModelOpen} onOpenChange={setIsModelOpen}>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-white text-xs font-medium transition-all shadow-sm"
                  >
                    {(() => {
                      const ModelIcon = selectedModel.icon;
                      return <ModelIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />;
                    })()}
                    <span className="hidden sm:inline">{selectedModel.name}</span>
                    <ChevronDown className={`w-3 h-3 text-zinc-400 dark:text-zinc-500 transition-transform ${isModelOpen ? 'rotate-180' : ''}`} />
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-xl p-1">
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
                        className={`cursor-pointer hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors p-2 rounded-md mb-1 ${
                          isSelected ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300" : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        <div className="flex items-center gap-3 w-full">
                          <ModelIcon className={`w-4 h-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                          <div className="flex flex-col flex-1">
                            <span className="font-medium text-xs">{model.name}</span>
                            <span className="text-[10px] text-zinc-500">{model.description}</span>
                          </div>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Prompt Input - IMPROVED GREY BACKGROUND */}
            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="flex-1 flex flex-col min-h-0 relative group">
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-amber-500 dark:text-amber-400" /> Video Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic cityscape at sunset, neon lights reflecting on wet streets, cyberpunk aesthetic..."
                  disabled={activeMode === "video-to-video"}
                  // UPDATED: bg-zinc-100 for light mode
                  className="w-full flex-1 min-h-[140px] bg-zinc-100/70 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 backdrop-blur-sm border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 rounded-xl px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 text-sm leading-relaxed transition-all shadow-inner"
                />
                <div className="absolute bottom-3 right-3">
                   {/* UPDATED: Badge background to match input */}
                   <Badge variant="outline" className="text-[10px] h-5 border-zinc-200 dark:border-white/5 bg-zinc-100/50 dark:bg-black/40 text-zinc-500">
                    {prompt.length} chars
                  </Badge>
                </div>
              </div>
              
              {/* Video Upload for Video-to-Video */}
              {activeMode === "video-to-video" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="border border-dashed border-zinc-300 dark:border-white/20 rounded-xl p-6 text-center bg-zinc-50 dark:bg-white/5 hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Video className="w-8 h-8 mx-auto mb-2 text-indigo-500 dark:text-indigo-400 opacity-80" />
                  <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Upload source video</p>
                  <p className="text-xs text-zinc-500 mt-1">MP4, MOV up to 50MB</p>
                </motion.div>
              )}
              
              {/* Action Buttons - Adaptive */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 transition-colors">
                  <Switch
                    checked={enhancePrompt}
                    onCheckedChange={setEnhancePrompt}
                    className="data-[state=checked]:bg-indigo-500 scale-75"
                  />
                  <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">Enhance</span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 border border-zinc-200 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>Improve</span>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setPrompt("")}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-100 dark:bg-white/5 hover:bg-red-50 dark:hover:bg-red-500/10 border border-zinc-200 dark:border-white/5 hover:border-red-200 dark:hover:border-red-500/30 text-xs font-medium text-zinc-600 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Advanced Options - Adaptive */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-zinc-200 dark:border-white/10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Quantity
                </label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-full flex items-center justify-between px-3 py-2 bg-zinc-100/50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg text-zinc-700 dark:text-zinc-300 text-xs hover:bg-zinc-100 dark:hover:bg-white/5 hover:border-zinc-300 dark:hover:border-white/20 transition-all focus:outline-none focus:ring-1 focus:ring-indigo-500/50 group">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-white dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors border border-zinc-200 dark:border-white/5 shadow-sm">
                           {numberOfVideos}
                        </span>
                        <span>{numberOfVideos === "1" ? "Video" : "Videos"}</span>
                      </span>
                      <ChevronDown className="w-3 h-3 text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[140px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200 dark:border-white/10 shadow-xl p-1 z-50">
                    {quantityOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        onClick={() => setNumberOfVideos(option.value)}
                        className={`cursor-pointer flex items-center justify-between p-2 rounded-md text-xs mb-1 last:mb-0 ${
                          numberOfVideos === option.value
                            ? "bg-indigo-50 dark:bg-indigo-600/20 text-indigo-600 dark:text-indigo-300"
                            : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                           <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold border ${
                              numberOfVideos === option.value 
                                ? "bg-indigo-100 dark:bg-indigo-500/30 text-indigo-600 dark:text-indigo-200 border-indigo-200 dark:border-indigo-500/30" 
                                : "bg-zinc-100 dark:bg-white/5 text-zinc-500 border-zinc-200 dark:border-white/5"
                           }`}>
                              {option.value}
                           </span>
                           {option.label}
                        </div>
                        {numberOfVideos === option.value && <CheckCircle2 className="w-3 h-3 text-indigo-500 dark:text-indigo-400" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Duration
                </label>
                <div className="px-3 py-2 bg-zinc-100/50 dark:bg-black/20 border border-zinc-200 dark:border-white/10 rounded-lg flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">5 seconds</span>
                  <Badge variant="outline" className="text-[9px] h-4 border-zinc-200 dark:border-white/10 text-zinc-500">Auto</Badge>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <motion.div
              whileHover={{ scale: isLoading || !prompt.trim() ? 1 : 1.02 }}
              whileTap={{ scale: isLoading || !prompt.trim() ? 1 : 0.98 }}
              className="pt-2"
            >
              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full h-11 relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 dark:shadow-[0_0_20px_rgba(79,70,229,0.4)] border-0 transition-all"
              >
                {/* Shimmer Effect */}
                 {!isLoading && (
                   <div className="absolute inset-0 -translate-x-full hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                )}
                
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin text-white/80" />
                    <span className="animate-pulse">Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 fill-white/20" />
                    Generate Video
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* RIGHT: Output Section - Adaptive Glass Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col w-full lg:w-[70%] min-h-0 h-full"
        >
          <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-white/10 bg-white/60 dark:bg-black/40 backdrop-blur-xl shadow-xl shadow-zinc-200/50 dark:shadow-2xl dark:shadow-black/50 p-6 space-y-6 h-full min-h-0 overflow-hidden relative">
            
            {/* Header with Actions */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-white/10 flex-shrink-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center">
                  <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900 dark:text-white">Live Preview</h2>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Real-time generation</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-black/40 p-1 rounded-lg border border-zinc-200 dark:border-white/5">
                <motion.button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid" ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                  title="Grid View"
                >
                  <Grid3x3 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode("single")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "single" ? "bg-white dark:bg-white/10 text-zinc-900 dark:text-white shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                  title="Single View"
                >
                  <Square className="w-4 h-4" />
                </motion.button>
                <div className="w-px h-4 bg-zinc-300 dark:bg-white/10 mx-1" />
                <motion.button
                  className="p-2 rounded-md text-zinc-500 hover:text-zinc-700 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                  title="Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            {/* Video Preview Area - IMPROVED GREY BACKGROUND */}
            {/* UPDATED: bg-zinc-100 for light mode */}
            <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden bg-zinc-100 dark:bg-zinc-950/50 rounded-xl border border-zinc-200 dark:border-white/10 relative group">
              {/* Inner Grid for Tech feel */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center w-full z-10"
                  >
                    <div className="relative w-24 h-24 mb-6">
                      <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin" />
                      <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin-slow" />
                      <div className="absolute inset-0 flex items-center justify-center">
                          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-white animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">Generating Your Video</h3>
                    <p className="text-xs text-zinc-500">Processing frames...</p>
                  </motion.div>
                ) : generatedVideo ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full h-full flex flex-col min-h-0 space-y-4 p-4 z-10"
                  >
                    <div className="relative rounded-lg overflow-hidden flex-1 min-h-0 bg-black border border-zinc-200 dark:border-white/10 shadow-2xl group/video">
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
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/video:opacity-100 transition-opacity duration-300">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            const video = e.currentTarget.parentElement?.previousElementSibling as HTMLVideoElement;
                            if (video) isPlaying ? video.pause() : video.play();
                          }}
                          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 flex items-center justify-center transition-all border border-white/30 shadow-2xl"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white fill-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1 fill-white" />
                          )}
                        </motion.button>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-emerald-500/90 backdrop-blur-md text-white border-0 text-[10px] px-2 py-0.5">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Generated
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <Button variant="outline" size="sm" className="flex-1 gap-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm">
                        <Download className="w-3.5 h-3.5" /> Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm">
                        <Share2 className="w-3.5 h-3.5" /> Share
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-zinc-50 dark:hover:bg-white/10 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center w-full max-w-md px-4 z-10"
                  >
                    <div className="relative w-24 h-24 mb-6">
                       <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 blur-2xl rounded-full" />
                       <div className="relative w-full h-full rounded-2xl bg-white/40 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex items-center justify-center backdrop-blur-sm">
                         <Sparkles className="w-10 h-10 text-zinc-400 dark:text-white/20" />
                       </div>
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">
                      Ready to Create
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-sm">
                      Enter your prompt in the sidebar and click generate to watch your imagination come to life.
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