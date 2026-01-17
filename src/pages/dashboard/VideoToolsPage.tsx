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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">
      {/* Mode Switcher - Top */}
      <div className="flex-shrink-0 border-b-2 border-purple-500/30 bg-secondary/20 px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {videoModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeMode === mode.id;
            return (
              <motion.button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 border ${
                  isActive
                    ? `bg-gradient-to-r ${mode.color} text-white border-transparent shadow-lg`
                    : "bg-secondary/40 text-muted-foreground border-border/50 hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{mode.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Full Frame Layout */}
      <div className="flex flex-1 h-full w-full min-w-0 gap-1 sm:gap-2 overflow-hidden">
        {/* LEFT: Input Section */}
        <div className="flex flex-col w-full lg:w-[52%] min-w-0 border-r-2 border-purple-500/30 bg-secondary/10 overflow-y-auto scrollbar-hide">
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 min-h-full border-2 border-purple-500/20 rounded-lg m-2 sm:m-3">
            {/* Title and Model Selector */}
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Input</h2>
              
              {/* Model Dropdown */}
              <DropdownMenu open={isModelOpen} onOpenChange={setIsModelOpen}>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    className="relative"
                    animate={{
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    {/* Highlight Border Animation */}
                    <motion.div
                      className="absolute inset-0 rounded-lg"
                      animate={{
                        boxShadow: [
                          "0 0 0px rgba(124, 58, 237, 0)",
                          "0 0 15px rgba(124, 58, 237, 0.6)",
                          "0 0 0px rgba(124, 58, 237, 0)",
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border-2 border-purple-500/50 hover:border-purple-400 text-foreground text-xs sm:text-sm font-medium transition-all shadow-lg"
                    >
                      {(() => {
                        const ModelIcon = selectedModel.icon;
                        return (
                          <motion.div
                            animate={{
                              rotate: [0, 10, -10, 0],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut",
                            }}
                          >
                            <ModelIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </motion.div>
                        );
                      })()}
                      <span className="hidden sm:inline">{selectedModel.name}</span>
                      <span className="sm:hidden">{selectedModel.name.split(' ')[0]}</span>
                      <motion.div
                        animate={{
                          y: [0, 3, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground transition-transform ${isModelOpen ? 'rotate-180' : ''}`} />
                      </motion.div>
                    </motion.button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 backdrop-blur-xl bg-secondary/95 border border-border/50">
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
                        className={`cursor-pointer hover:bg-secondary/70 transition-colors ${
                          isSelected ? "bg-secondary/50" : ""
                        }`}
                      >
                        <ModelIcon className="w-4 h-4 mr-3 text-foreground" />
                        <div className="flex flex-col flex-1">
                          <span className="font-medium text-foreground text-sm">{model.name}</span>
                          <span className="text-xs text-muted-foreground">{model.description}</span>
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter negative prompt"
                disabled={activeMode === "video-to-video"}
                className="w-full h-28 sm:h-36 bg-secondary/40 border border-border/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              
              {/* Video Upload for Video-to-Video */}
              {activeMode === "video-to-video" && (
                <div className="border-2 border-dashed border-border/50 rounded-lg p-4 text-center bg-secondary/20">
                  <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    Upload a video to transform
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    Choose Video
                  </Button>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={enhancePrompt}
                    onCheckedChange={setEnhancePrompt}
                  />
                  <span className="text-sm text-muted-foreground">Enhance your prompt</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Star className="w-3 h-3" />
                    <span>AI Translate</span>
                  </button>
                  <button
                    onClick={() => setPrompt("")}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Number of Videos - Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-foreground">Number of Videos</label>
              <div className="relative">
                <select
                  value={numberOfVideos}
                  onChange={(e) => setNumberOfVideos(e.target.value)}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/40 border border-border/50 rounded-lg text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="4">4</option>
                  <option value="8">8</option>
                </select>
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground pointer-events-none" />
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">This feature is only available to paid users</p>
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 sm:py-4 text-sm sm:text-base"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate
                </>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT: Output Section */}
        <div className="flex flex-col w-full lg:w-[48%] min-w-0 border-l-2 border-purple-500/30 bg-secondary/5 overflow-y-auto scrollbar-hide">
          <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 h-full flex flex-col min-h-0 border-2 border-purple-500/20 rounded-lg m-2 sm:m-3">
            {/* Title and View Options */}
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Output</h2>
              <div className="flex gap-2">
                {/* Download Icon */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg transition-all border bg-secondary/20 border-border/30 hover:bg-secondary/40 hover:border-primary/50"
                  title="Download"
                >
                  <Download className="w-4 h-4 text-foreground" />
                </motion.button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-all border ${
                    viewMode === "grid"
                      ? "bg-secondary/60 border-border/50"
                      : "bg-secondary/20 border-border/30 hover:bg-secondary/40"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4 text-foreground" />
                </button>
                <button
                  onClick={() => setViewMode("single")}
                  className={`p-2 rounded-lg transition-all border ${
                    viewMode === "single"
                      ? "bg-secondary/60 border-border/50"
                      : "bg-secondary/20 border-border/30 hover:bg-secondary/40"
                  }`}
                >
                  <Square className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>

            {/* Video Preview Area */}
            <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
              <AnimatePresence mode="wait">
                {generatedVideo ? (
                  <motion.div
                    key="video"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="w-full h-full flex flex-col min-h-0"
                  >
                    <div className="relative rounded-lg overflow-hidden mb-4 flex-1 min-h-0 bg-secondary/30 border border-border/50 group">
                      <video
                        src={generatedVideo}
                        className="w-full h-full object-cover"
                        controls={false}
                        ref={(video) => {
                          if (video) {
                            video.onplay = () => setIsPlaying(true);
                            video.onpause = () => setIsPlaying(false);
                          }
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <button
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
                          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-all"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <Share2 className="w-4 h-4" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center w-full max-w-md px-4"
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 rounded-lg bg-secondary/40 border border-border/50 flex items-center justify-center">
                      <motion.div
                        className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center"
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
                        <motion.div
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.2, 1],
                          }}
                          transition={{
                            rotate: {
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                            },
                            scale: {
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                            },
                          }}
                        >
                          <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                        </motion.div>
                      </motion.div>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                      Ready to generate
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Enter negative prompt to start generating videos
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoToolsPage;
