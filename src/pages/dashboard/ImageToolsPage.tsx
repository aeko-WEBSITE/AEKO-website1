import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Sparkles,
  Download,
  Share2,
  Copy,
  Image as ImageIcon,
  ArrowLeftRight,
  Eraser,
  Wand2,
  Upload,
  Edit2,
  X,
  Type,
  Settings2,
  ChevronDown,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { moduleAPI } from "@/lib/api";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Tool modes
type ToolMode = "text2image" | "image2image" | "image-editing" | "bg-removal";

const toolModes = [
  { id: "text2image" as ToolMode, label: "Text to Image", icon: Type },
  { id: "image2image" as ToolMode, label: "Image to Image", icon: ArrowLeftRight },
  { id: "image-editing" as ToolMode, label: "Image Editing", icon: Wand2 },
  { id: "bg-removal" as ToolMode, label: "Background Removal", icon: Eraser },
];

// Image models
const imageModels = [
  { id: "flux-2-dev", name: "FLUX", description: "High quality image generation" },
  { id: "flux-kontext-dev", name: "Kingly", description: "Advanced context understanding" },
  { id: "gen3", name: "Gen3", description: "Next-gen image model" },
  { id: "sdxl", name: "SDXL", description: "Stable Diffusion XL" },
  { id: "dalle-3", name: "DALL-E 3", description: "OpenAI's latest model" },
];

// Aspect ratios
const aspectRatios = [
  { value: "16:9", label: "16:9", width: 1024, height: 576 },
  { value: "1:1", label: "1:1", width: 1024, height: 1024 },
  { value: "9:16", label: "9:16", width: 576, height: 1024 },
  { value: "4:3", label: "4:3", width: 1024, height: 768 },
  { value: "3:4", label: "3:4", width: 768, height: 1024 },
];

const ImageToolsPage = () => {
  const [toolMode, setToolMode] = useState<ToolMode>("text2image");
  const [selectedModel, setSelectedModel] = useState("flux-2-dev");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [strength, setStrength] = useState(0.7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get dimensions from aspect ratio
  const getDimensions = () => {
    const ratio = aspectRatios.find((r) => r.value === aspectRatio);
    return ratio ? { width: ratio.width, height: ratio.height } : { width: 1024, height: 576 };
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setUploadedImage(reader.result as string);
          setUploadedImageFile(file);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please upload a valid image file");
      }
    }
  };

  // Handle URL input for reference image
  const handleUrlImageLoad = async () => {
    if (!referenceImageUrl.trim()) return;
    
    try {
      const response = await fetch(referenceImageUrl);
      if (!response.ok) throw new Error("Failed to load image");
      const blob = await response.blob();
      const file = new File([blob], "reference-image.jpg", { type: blob.type });
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setUploadedImageFile(file);
      };
      reader.readAsDataURL(file);
      toast.success("Image loaded from URL");
    } catch (error) {
      toast.error("Failed to load image from URL");
    }
  };

  // Helper function to extract image from response
  const extractImageFromResponse = (response: any): string | null => {
    if (response.image_base64) {
      return response.image_base64.startsWith("data:") 
        ? response.image_base64 
        : `data:image/${response.mime?.split('/')[1] || 'png'};base64,${response.image_base64}`;
    }
    if (response.base64) {
      return response.base64.startsWith("data:") 
        ? response.base64 
        : `data:image/png;base64,${response.base64}`;
    }
    if (response.data) {
      if (typeof response.data === 'string') {
        return response.data.startsWith("data:") 
          ? response.data 
          : `data:image/png;base64,${response.data}`;
      }
      if (response.data.image_base64) {
        return response.data.image_base64.startsWith("data:") 
          ? response.data.image_base64 
          : `data:image/${response.data.mime?.split('/')[1] || 'png'};base64,${response.data.image_base64}`;
      }
      if (response.data.base64) {
        return response.data.base64.startsWith("data:") 
          ? response.data.base64 
          : `data:image/png;base64,${response.data.base64}`;
      }
      if (response.data.image) {
        return response.data.image.startsWith("data:") 
          ? response.data.image 
          : `data:image/png;base64,${response.data.image}`;
      }
    }
    if (response.image) {
      return response.image.startsWith("data:") 
        ? response.image 
        : `data:image/png;base64,${response.image}`;
    }
    return null;
  };

  // Handle generation based on tool mode
  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    if (
      (toolMode === "image2image" || toolMode === "image-editing" || toolMode === "bg-removal") &&
      !uploadedImage && !uploadedImageFile
    ) {
      toast.error("Please upload an image first");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const dimensions = getDimensions();

      if (toolMode === "text2image") {
        const response = await moduleAPI.imageGen({
          prompt: prompt.trim(),
          model_id: selectedModel,
          width: dimensions.width,
          height: dimensions.height,
        });

        const imageUrl = extractImageFromResponse(response);
        if (imageUrl) {
          setGeneratedImage(imageUrl);
          toast.success("Image generated successfully!");
        } else if (response.id) {
          const result = await moduleAPI.fetchImageResult(response.id);
          const fetchedImageUrl = extractImageFromResponse(result);
          if (fetchedImageUrl) {
            setGeneratedImage(fetchedImageUrl);
            toast.success("Image generated successfully!");
          } else {
            throw new Error("Invalid response format from API");
          }
        } else {
          throw new Error("Invalid response format from API");
        }
      } else if (toolMode === "image2image" || toolMode === "image-editing") {
        let fileToSend: File | undefined;
        let initImageBase64: string | undefined;

        if (uploadedImageFile) {
          fileToSend = uploadedImageFile;
        } else if (uploadedImage) {
          const base64String = uploadedImage.includes(',')
            ? uploadedImage.split(',')[1]
            : uploadedImage;
          initImageBase64 = base64String;
        }

        if (!fileToSend && !initImageBase64) {
          throw new Error("Please upload an image");
        }

        const response = await moduleAPI.imageToImage({
          prompt: prompt.trim(),
          model_id: selectedModel,
          file: fileToSend,
          init_image: fileToSend ? undefined : initImageBase64,
          strength: toolMode === "image-editing" ? 0.5 : strength,
        });

        const imageUrl = extractImageFromResponse(response);
        if (imageUrl) {
          setGeneratedImage(imageUrl);
          toast.success(toolMode === "image-editing" 
            ? "Image edited successfully!" 
            : "Image transformed successfully!");
        } else if (response.id) {
          const result = await moduleAPI.fetchImageResult(response.id);
          const fetchedImageUrl = extractImageFromResponse(result);
          if (fetchedImageUrl) {
            setGeneratedImage(fetchedImageUrl);
            toast.success(toolMode === "image-editing" 
              ? "Image edited successfully!" 
              : "Image transformed successfully!");
          } else {
            throw new Error("Invalid response format from API");
          }
        } else {
          throw new Error("Invalid response format from API");
        }
      } else if (toolMode === "bg-removal") {
        let fileToSend: File | undefined;
        let initImageBase64: string | undefined;

        if (uploadedImageFile) {
          fileToSend = uploadedImageFile;
        } else if (uploadedImage) {
          const base64String = uploadedImage.includes(',')
            ? uploadedImage.split(',')[1]
            : uploadedImage;
          initImageBase64 = base64String;
        }

        if (!fileToSend && !initImageBase64) {
          throw new Error("Please upload an image");
        }

        const response = await moduleAPI.backgroundRemoval({
          file: fileToSend,
          init_image: fileToSend ? undefined : initImageBase64,
        });

        const imageUrl = extractImageFromResponse(response);
        if (imageUrl) {
          setGeneratedImage(imageUrl);
          toast.success("Background removed successfully!");
        } else if (response.id) {
          const result = await moduleAPI.fetchImageResult(response.id);
          const fetchedImageUrl = extractImageFromResponse(result);
          if (fetchedImageUrl) {
            setGeneratedImage(fetchedImageUrl);
            toast.success("Background removed successfully!");
          } else {
            throw new Error("Invalid response format from API");
          }
        } else {
          throw new Error("Invalid response format from API");
        }
      }
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Failed to process image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle download
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement("a");
      link.href = generatedImage;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Image downloaded!");
    }
  };

  // Handle copy
  const handleCopy = async () => {
    if (generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
        toast.success("Image copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy image");
      }
    }
  };

  // Handle share
  const handleShare = async () => {
    if (generatedImage && navigator.share) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], "image.png", { type: blob.type });
        await navigator.share({
          files: [file],
          title: "Generated Image",
        });
        toast.success("Image shared!");
      } catch (error) {
        toast.error("Failed to share image");
      }
    } else {
      toast.info("Share feature not available in your browser");
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedImageFile(null);
    setReferenceImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* LEFT PANEL - Input Section */}
      <div className="w-full lg:w-[40%] xl:w-[30%] flex flex-col border-r border-border bg-card/50 overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Settings2 className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Input</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Configure your parameters and generate AI-powered images
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Reference Image Upload - for image2image, image-editing, bg-removal */}
          {(toolMode === "image2image" || toolMode === "image-editing" || toolMode === "bg-removal") && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                Reference Image
                {(toolMode === "image2image" || toolMode === "image-editing") && (
                  <span className="text-xs text-muted-foreground">(Required)</span>
                )}
              </label>
              
              {/* URL Input */}
              <div className="flex gap-2">
                <Input
                  value={referenceImageUrl}
                  onChange={(e) => setReferenceImageUrl(e.target.value)}
                  placeholder="Enter image URL or upload file"
                  className="flex-1 bg-background border-border text-foreground"
                />
                <Button
                  onClick={handleUrlImageLoad}
                  disabled={!referenceImageUrl.trim()}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  <Upload className="w-4 h-4" />
                </Button>
              </div>

              {/* Image Preview */}
              {uploadedImage ? (
                <div className="relative group rounded-lg overflow-hidden border border-border bg-background">
                  <img
                    src={uploadedImage}
                    alt="Reference"
                    className="w-full h-auto max-h-[300px] object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={handleRemoveImage}
                      size="sm"
                      variant="destructive"
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              ) : (
                <motion.label
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors border-border bg-secondary/30 hover:border-primary hover:bg-secondary/50"
                >
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <span className="text-sm text-foreground mb-1">Click to upload or paste URL</span>
                  <span className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </motion.label>
              )}
            </div>
          )}

          {/* Model Selection */}
          <div className="space-y-1">
  <label className="text-xs font-medium text-muted-foreground">
    Model
  </label>

  <Select value={selectedModel} onValueChange={setSelectedModel}>
    <SelectTrigger
      className="
        h-10 w-full
        bg-background
        border border-border
        rounded-md
        px-3
        text-sm
        shadow-none
        hover:bg-accent/40
        focus:ring-1 focus:ring-primary/30
      "
    >
      <span className="truncate">
        {imageModels.find(m => m.id === selectedModel)?.name ?? "Select model"}
      </span>
    </SelectTrigger>

    <SelectContent
      className="
        bg-popover
        border border-border
        rounded-md
        shadow-md
      "
    >
      {imageModels.map((model) => (
        <SelectItem
          key={model.id}
          value={model.id}
          className="
            px-3 py-2
            text-sm
            focus:bg-accent
          "
        >
          {model.name}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
</div>


          {/* Prompt */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Prompt</label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city on floating waterfalls, cinematic lighting, 4k"
              className="min-h-[120px] bg-background border-border text-foreground resize-none"
            />
          </div>

          {/* Advanced Settings */}
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors">
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Advanced Settings</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  isAdvancedOpen ? "rotate-180" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 mt-3">
              {/* Negative Prompt */}
              {(toolMode === "text2image" || toolMode === "image2image") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Negative Prompt (Optional)</label>
                  <Textarea
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="blurry, low quality, distorted..."
                    className="min-h-[80px] bg-background border-border text-foreground resize-none"
                  />
                </div>
              )}

              {/* Aspect Ratio - only for text2image */}
              {toolMode === "text2image" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Aspect Ratio</label>
                  <Select value={aspectRatio} onValueChange={setAspectRatio}>
                    <SelectTrigger className="w-full bg-background border-border text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {aspectRatios.map((ratio) => (
                        <SelectItem
                          key={ratio.value}
                          value={ratio.value}
                          className="text-foreground"
                        >
                          {ratio.label} ({ratio.width}x{ratio.height})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Strength - for image2image and image-editing */}
              {(toolMode === "image2image" || toolMode === "image-editing") && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Strength: {strength.toFixed(1)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={strength}
                    onChange={(e) => setStrength(parseFloat(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <p className="text-xs text-muted-foreground">
                    Higher values create more dramatic transformations
                  </p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full h-12 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
      </div>

      {/* RIGHT PANEL - Output Section */}
      <div className="flex-1 flex flex-col bg-background overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-4 sm:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-lg font-semibold text-foreground">Output</h2>
            </div>
            {isLoading && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs font-medium text-primary">Generating...</span>
              </div>
            )}
            {!isLoading && generatedImage && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-green-500">Ready</span>
              </div>
            )}
            {!isLoading && !generatedImage && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border">
                <span className="text-xs font-medium text-muted-foreground">Idle</span>
              </div>
            )}
          </div>
        </div>

        {/* Output Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px]"
              >
                <div className="relative">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-primary/20"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
                <p className="mt-6 text-lg font-medium text-foreground">Generating your image...</p>
                <p className="mt-2 text-sm text-muted-foreground">This may take a few moments</p>
                </motion.div>
              ) : generatedImage ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full h-full flex items-center justify-center"
                >
                <div className="relative max-w-full max-h-full rounded-lg overflow-hidden border border-border bg-card shadow-lg">
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="max-w-full max-h-[calc(100vh-200px)] object-contain"
                  />
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDownload}
                      className="p-2.5 rounded-lg backdrop-blur-md bg-card/90 border border-border text-foreground hover:bg-card transition-colors shadow-lg"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleShare}
                      className="p-2.5 rounded-lg backdrop-blur-md bg-card/90 border border-border text-foreground hover:bg-card transition-colors shadow-lg"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopy}
                      className="p-2.5 rounded-lg backdrop-blur-md bg-card/90 border border-border text-foreground hover:bg-card transition-colors shadow-lg"
                      title="Copy"
                    >
                      <Copy className="w-5 h-5" />
                    </motion.button>
                  </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[400px] text-center"
                >
                <div className="w-32 h-32 mx-auto mb-6 rounded-lg flex items-center justify-center bg-card border-2 border-dashed border-border">
                    <motion.div
                    className="w-20 h-20 rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10"
                      animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                      duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                    <Sparkles className="w-10 h-10 text-primary" />
                    </motion.div>
                  </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  Ready to Generate
                  </h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  Configure your parameters on the left and click "Generate" to see your AI-powered results here.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      {/* Mobile Tool Mode Switcher - Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 px-2 border-t bg-card border-border shadow-lg z-50">
        {toolModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = toolMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              onClick={() => setToolMode(mode.id)}
              className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 relative ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "bg-transparent text-muted-foreground"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActiveIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <Icon className={`w-5 h-5 flex-shrink-0 transition-transform ${isActive ? "scale-110" : ""}`} />
              <span className="text-[10px] font-medium truncate w-full text-center">{mode.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Desktop Tool Mode Switcher - Left Side */}
      <div className="hidden lg:flex w-16 flex-shrink-0 flex-col items-center py-4 gap-2 border-r bg-background border-border">
        {toolModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = toolMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              onClick={() => setToolMode(mode.id)}
              className="relative group w-full flex justify-center"
              title={mode.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-200 ${
                isActive
                    ? "bg-primary/10 border-2 border-primary text-primary shadow-sm"
                    : "bg-transparent border-2 border-transparent text-muted-foreground hover:bg-secondary/50 hover:border-border/50 hover:text-foreground"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "scale-110" : ""}`} />
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-10 rounded-l-full bg-primary shadow-sm"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default ImageToolsPage;
