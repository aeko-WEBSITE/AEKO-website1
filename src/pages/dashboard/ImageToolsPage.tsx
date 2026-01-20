import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Grid3x3,
  Square,
  Info,
  Star,
  Loader2,
  Sparkles,
  ChevronDown,
  Download,
  Share2,
  Copy,
  Image as ImageIcon,
  ArrowLeftRight,
  Eraser,
  Maximize2,
  Wand2,
  Film,
  Zap,
  Camera,
  LayoutGrid,
  Infinity as InfinityIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const imageSizes = [
  { ratio: "2:3", label: "2:3", icon: "vertical" },
  { ratio: "1:1", label: "1:1", icon: "square" },
  { ratio: "16:9", label: "16:9", icon: "horizontal" },
  { ratio: "custom", label: "Custom", icon: "custom" },
];

const imageModels = [
  { id: "flux", name: "FLUX" },
  { id: "flux-dev", name: "FLUX.DEV" },
  { id: "flux-kontext", name: "FLUX KONTEXT" },
  { id: "nano-banana", name: "NANO BANANA" },
  { id: "runway-gen4", name: "RUNWAY GEN 4" },
];

const contentTypes = [
  { id: "image", label: "Image", icon: ImageIcon },
  { id: "video", label: "Video", icon: Film },
  { id: "flow-state", label: "Flow State", icon: InfinityIcon },
  { id: "blueprints", label: "Blueprints", icon: LayoutGrid, isNew: true },
];

const ImageToolsPage = () => {
  const [selectedModel, setSelectedModel] = useState("flux");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [numberOfImages, setNumberOfImages] = useState("1");
  const [prompt, setPrompt] = useState("");
  const [selectedSize, setSelectedSize] = useState("1:1");
  const [selectedContentType, setSelectedContentType] = useState("image");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80");

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Generated Superman character collage image
      setGeneratedImage("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80");
      setIsLoading(false);
    }, 2000);
  };

  const getSizeIcon = (ratio: string) => {
    switch (ratio) {
      case "2:3":
        return <div className="w-4 h-6 border border-current rounded" />;
      case "1:1":
        return <div className="w-5 h-5 border border-current rounded" />;
      case "16:9":
        return <div className="w-6 h-4 border border-current rounded" />;
      case "custom":
        return <div className="w-5 h-4 border-2 border-dashed border-current rounded flex items-center justify-center"><ChevronDown className="w-2 h-2" /></div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] w-full overflow-hidden" style={{ backgroundColor: "#070A1A" }}>
      {/* Top 70% - Image Display Area */}
      <div className="w-full overflow-hidden flex-shrink-0" style={{ height: "calc(70vh - 0.7rem)", flex: "0 0 calc(70vh - 0.7rem)", backgroundColor: "#0B1026" }}>
        <div className="h-full w-full p-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {generatedImage ? (
              <motion.div
                key="image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full h-full max-w-6xl mx-auto rounded-lg overflow-hidden"
                style={{ 
                  backgroundColor: "#121A3F",
                  border: "1px solid rgba(255,255,255,0.08)"
                }}
              >
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    e.currentTarget.src = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80";
                  }}
                />
                {/* Image Actions Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg backdrop-blur-sm transition-all"
                    style={{ 
                      backgroundColor: "#121A3F",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#D7DBFF"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#18205A";
                      e.currentTarget.style.borderColor = "#6D5BFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#121A3F";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg backdrop-blur-sm transition-all"
                    style={{ 
                      backgroundColor: "#121A3F",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#D7DBFF"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#18205A";
                      e.currentTarget.style.borderColor = "#6D5BFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#121A3F";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                    title="Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg backdrop-blur-sm transition-all"
                    style={{ 
                      backgroundColor: "#121A3F",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#D7DBFF"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#18205A";
                      e.currentTarget.style.borderColor = "#6D5BFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#121A3F";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                    }}
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
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
                <div 
                  className="w-24 h-24 mx-auto mb-4 rounded-lg flex items-center justify-center"
                  style={{ 
                    backgroundColor: "#121A3F",
                    border: "1px solid #2A337A"
                  }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-lg flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #6D5BFF, #4FD1FF)"
                    }}
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
                      <Sparkles className="w-8 h-8" style={{ color: "#FFFFFF" }} />
                    </motion.div>
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: "#FFFFFF" }}>
                  Ready to generate
                </h3>
                <p className="text-sm" style={{ color: "#A5ACD9" }}>
                  Enter a prompt below to start generating images
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom 30% - Controls Section */}
      <div 
        className="flex-shrink-0 w-full" 
        style={{ 
          height: "calc(30vh - 0.3rem)", 
          flex: "0 0 calc(30vh - 0.3rem)",
          backgroundColor: "#0E1533",
          borderTop: "1px solid rgba(111,108,255,0.18)"
        }}
      >
        <div className="h-full flex gap-4 p-4">
          {/* Left Sidebar - Model and Number of Images */}
          <div className="w-80 flex-shrink-0 overflow-y-auto ml-0 space-y-4">
            {/* Model Selection */}
            <div 
              className="rounded-lg p-3"
              style={{ 
                backgroundColor: "#121A3F",
                border: "1px solid rgba(111,108,255,0.18)"
              }}
            >
              <label className="text-xs font-medium mb-2 block" style={{ color: "#A5ACD9" }}>Model</label>
              <DropdownMenu open={isModelOpen} onOpenChange={setIsModelOpen}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{ 
                      backgroundColor: "#121A3F",
                      border: "1px solid #2A337A",
                      color: "#D7DBFF"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#18205A";
                      e.currentTarget.style.borderColor = "#6D5BFF";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#121A3F";
                      e.currentTarget.style.borderColor = "#2A337A";
                    }}
                  >
                    <span>{imageModels.find(m => m.id === selectedModel)?.name || "FLUX"}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isModelOpen ? 'rotate-180' : ''}`} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="w-64 backdrop-blur-xl"
                  style={{ 
                    backgroundColor: "#121A3F",
                    border: "1px solid #2A337A"
                  }}
                >
                  {imageModels.map((model) => (
                    <DropdownMenuItem
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setIsModelOpen(false);
                      }}
                      className="cursor-pointer transition-colors"
                      style={{ 
                        color: "#D7DBFF",
                        backgroundColor: selectedModel === model.id ? "rgba(123,108,255,0.18)" : "transparent"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#18205A";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = selectedModel === model.id ? "rgba(123,108,255,0.18)" : "transparent";
                      }}
                    >
                      <span className="font-medium text-sm">{model.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Number of Images Selection */}
            <div 
              className="rounded-lg p-3"
              style={{ 
                backgroundColor: "#121A3F",
                border: "1px solid rgba(111,108,255,0.18)"
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <label className="text-xs font-medium" style={{ color: "#A5ACD9" }}>Number of images</label>
                <button 
                  className="w-4 h-4 rounded-full flex items-center justify-center transition-colors"
                  style={{ 
                    backgroundColor: "rgba(124,131,184,0.2)",
                    color: "#7C83B8"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(124,131,184,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(124,131,184,0.2)";
                  }}
                >
                  <Info className="w-3 h-3" />
                </button>
              </div>
              <div className="flex gap-2">
                {["1", "2", "3", "4"].map((num) => {
                  const isSelected = numberOfImages === num;
                  return (
                    <button
                      key={num}
                      onClick={() => setNumberOfImages(num)}
                      className="flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all"
                      style={{
                        backgroundColor: isSelected ? "#18205A" : "#121A3F",
                        borderColor: isSelected ? "#6D5BFF" : "#2A337A",
                        color: isSelected ? "#D7DBFF" : "#A5ACD9",
                        boxShadow: isSelected ? "0 0 8px rgba(123,108,255,0.45)" : "none",
                        background: isSelected ? "linear-gradient(180deg, #0E1533, #18205A)" : undefined
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "#18205A";
                          e.currentTarget.style.color = "#D7DBFF";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.backgroundColor = "#121A3F";
                          e.currentTarget.style.color = "#A5ACD9";
                        }
                      }}
                    >
                      {num}
                    </button>
                  );
                })}
                <button 
                  className="px-3 py-2 rounded-lg border transition-all"
                  style={{ 
                    backgroundColor: "#121A3F",
                    borderColor: "#2A337A",
                    color: "#A5ACD9"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#18205A";
                    e.currentTarget.style.color = "#D7DBFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#121A3F";
                    e.currentTarget.style.color = "#A5ACD9";
                  }}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Prompt and Controls */}
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            {/* Prompt Textbox */}
            <div className="flex-1 flex flex-col">
              <div className="relative h-full">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A visually striking iteration of supermen, each figure embodies strength and power in every detail: chiseled features, rippling muscles, and dynamic poses exuding confidence. This mesmerizing image, whether it be a digital illustration or a hyper-realistic painting, showcases the supermen in vibrant colors and intricate textures, highlighting their superhuman qualities. The meticulous attention to detail and exceptional rendering elevate this image to a masterful piece of art, capturing the essence of heroism and rugged charm."
                  className="w-full h-full rounded-lg px-4 py-3 resize-none focus:outline-none text-sm"
                  style={{ 
                    backgroundColor: "#0E1533",
                    border: "1px solid #2A337A",
                    color: "#D7DBFF",
                    paddingLeft: "2.75rem"
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#6D5BFF";
                    e.currentTarget.style.boxShadow = "0 0 0 2px rgba(123,108,255,0.18)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#2A337A";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <div className="absolute top-3 left-3">
                  <ImageIcon className="w-4 h-4" style={{ color: "#7C83B8" }} />
                </div>
              </div>
            </div>

            {/* Bottom Row - Size Option and Generate Button */}
            <div className="flex items-center justify-between gap-4">
              {/* Image Dimensions Selection - Left Side */}
              <div className="flex-shrink-0">
                <div 
                  className="rounded-lg p-3"
                  style={{ 
                    backgroundColor: "#121A3F",
                    border: "1px solid rgba(111,108,255,0.18)"
                  }}
                >
                  <label className="text-xs font-medium mb-2 block" style={{ color: "#A5ACD9" }}>Image Dimensions</label>
                  <div className="flex gap-2">
                    {imageSizes.map((size) => {
                      const isSelected = selectedSize === size.ratio;
                      return (
                        <button
                          key={size.ratio}
                          onClick={() => setSelectedSize(size.ratio)}
                          className="flex flex-col items-center justify-center gap-1.5 px-2 py-2.5 rounded-lg border transition-all"
                          style={{
                            backgroundColor: isSelected ? "#18205A" : "#121A3F",
                            borderColor: isSelected ? "#6D5BFF" : "#2A337A",
                            color: isSelected ? "#D7DBFF" : "#A5ACD9",
                            background: isSelected ? "linear-gradient(180deg, #0E1533, #18205A)" : undefined
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "#18205A";
                              e.currentTarget.style.color = "#D7DBFF";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.backgroundColor = "#121A3F";
                              e.currentTarget.style.color = "#A5ACD9";
                            }
                          }}
                        >
                          <div style={{ color: isSelected ? "#6D5BFF" : "#7C83B8" }}>
                            {getSizeIcon(size.ratio)}
                          </div>
                          <span className="text-[10px] font-medium">{size.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Generate Button - Right Side */}
              <div className="flex items-center gap-2">
                <button 
                  className="p-2 rounded-lg border transition-colors"
                  style={{ 
                    backgroundColor: "#121A3F",
                    borderColor: "#2A337A",
                    color: "#D7DBFF"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#18205A";
                    e.currentTarget.style.borderColor = "#6D5BFF";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#121A3F";
                    e.currentTarget.style.borderColor = "#2A337A";
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="font-semibold px-6 py-2 border-0"
                  style={{
                    background: isLoading || !prompt.trim() 
                      ? "linear-gradient(135deg, #2A337A, #121A3F)"
                      : "linear-gradient(90deg, #6D5BFF, #4FD1FF, #3FE0C5)",
                    color: "#FFFFFF",
                    boxShadow: isLoading || !prompt.trim() 
                      ? "none"
                      : "0 0 20px rgba(79,209,255,0.55)"
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && prompt.trim()) {
                      e.currentTarget.style.boxShadow = "0 0 30px rgba(79,209,255,0.75)";
                      e.currentTarget.style.background = "linear-gradient(135deg, #7B6CFF, #2BB0FF)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading && prompt.trim()) {
                      e.currentTarget.style.boxShadow = "0 0 20px rgba(79,209,255,0.55)";
                      e.currentTarget.style.background = "linear-gradient(90deg, #6D5BFF, #4FD1FF, #3FE0C5)";
                    }
                  }}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToolsPage;
