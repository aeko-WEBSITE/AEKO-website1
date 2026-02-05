import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Sparkles,
  Copy,
  Image as ImageIcon,
  Info,
  Search,
  Grid3x3,
  Filter,
  User,
  Play,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Plus,
  RotateCcw,
  StickyNote,
  Type,
  ArrowLeftRight,
  Wand2,
  Eraser,
  Upload,
  X,
  Edit2,
  Download,
  Heart,
  Share2,
  MoreVertical,
  Check,
  Menu,
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
import { Switch } from "@/components/ui/switch";
import { moduleAPI } from "@/lib/api";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

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
  { id: "flux-2-dev", name: "Z Image", description: "High quality image generation" },
  { id: "flux-kontext-dev", name: "Kingly", description: "Advanced context understanding" },
  { id: "gen3", name: "Gen3", description: "Next-gen image model" },
  { id: "sdxl", name: "SDXL", description: "Stable Diffusion XL" },
  { id: "dalle-3", name: "DALL-E 3", description: "OpenAI's latest model" },
];

// Styles
const styles = [
  { id: "dynamic", name: "Dynamic" },
  { id: "cinematic", name: "Cinematic" },
  { id: "photographic", name: "Photographic" },
  { id: "anime", name: "Anime" },
  { id: "3d", name: "3D Render" },
];

// Aspect ratios
const aspectRatios = [
  { value: "2:3", label: "2:3", icon: "📐" },
  { value: "1:1", label: "1:1", icon: "⬜" },
  { value: "16:9", label: "16:9", icon: "📺" },
  { value: "4:3", label: "4:3", icon: "🖼️" },
];

// Task type
type TaskStatus = "pending" | "processing" | "completed" | "failed";

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  style?: string;
  aspectRatio: string;
  createdAt: Date;
  width: number;
  height: number;
}

interface Task {
  id: string;
  prompt: string;
  status: TaskStatus;
  progress: number;
  model: string;
  style?: string;
  aspectRatio: string;
  estimatedTime?: string;
  createdAt: Date;
  result?: string;
}

const ImageToolsPage = () => {
  const [toolMode, setToolMode] = useState<ToolMode>("text2image");
  const [selectedModel, setSelectedModel] = useState("flux-2-dev");
  const [selectedStyle, setSelectedStyle] = useState("dynamic");
  const [prompt, setPrompt] = useState("");
  const [generationMode, setGenerationMode] = useState<"standard" | "quality">("standard");
  const [promptMagic, setPromptMagic] = useState<"auto" | "on" | "off">("auto");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [numImages, setNumImages] = useState(1);
  const [privateMode, setPrivateMode] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isImageSettingsOpen, setIsImageSettingsOpen] = useState(true);
  const [isBasicSettingsOpen, setIsBasicSettingsOpen] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [strength, setStrength] = useState(0.7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current date
  const getCurrentDate = () => {
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
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

  // Remove uploaded image
  const handleRemoveImage = () => {
    setUploadedImage(null);
    setUploadedImageFile(null);
    setReferenceImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Helper function to extract image from response
  const extractImageFromResponse = (response: any): string | null => {
    // Try various response formats
    if (response.image_base64) {
      return response.image_base64.startsWith("data:")
        ? response.image_base64
        : `data:image/${response.mime?.split("/")[1] || "png"};base64,${response.image_base64}`;
    }
    if (response.base64) {
      return response.base64.startsWith("data:")
        ? response.base64
        : `data:image/png;base64,${response.base64}`;
    }
    if (response.data) {
      if (typeof response.data === "string") {
        return response.data.startsWith("data:")
          ? response.data
          : `data:image/png;base64,${response.data}`;
      }
      if (response.data.image_base64) {
        return response.data.image_base64.startsWith("data:")
          ? response.data.image_base64
          : `data:image/${response.data.mime?.split("/")[1] || "png"};base64,${response.data.image_base64}`;
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

  // Handle generation
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    if (
      (toolMode === "image2image" || toolMode === "image-editing" || toolMode === "bg-removal") &&
      !uploadedImage && !uploadedImageFile
    ) {
      toast.error("Please upload an image first");
      return;
    }

    setIsGenerating(true);

    // Create tasks for multiple images
    const newTasks: Task[] = [];
    for (let i = 0; i < numImages; i++) {
      const newTask: Task = {
        id: `task-${Date.now()}-${i}`,
        prompt: prompt.trim(),
        status: "pending",
        progress: 0,
        model: selectedModel,
        style: selectedStyle,
        aspectRatio: aspectRatio,
        createdAt: new Date(),
      };
      newTasks.push(newTask);
    }

    setTasks((prev) => [...newTasks, ...prev]);

    // Process each task
    for (const task of newTasks) {
      processTask(task);
    }

    setPrompt("");
  };

  // Process a single task
  const processTask = async (task: Task) => {
    try {
      // Update to processing
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: "processing", progress: 5 } : t
        )
      );

      // Simulate progress
      const progressInterval = setInterval(() => {
        setTasks((prev) =>
          prev.map((t) => {
            if (t.id === task.id && t.status === "processing") {
              const newProgress = Math.min(t.progress + Math.random() * 15, 90);
              return { ...t, progress: newProgress };
            }
            return t;
          })
        );
      }, 500);

      // Actually generate the image
      let imageUrl: string | null = null;

      if (toolMode === "text2image") {
        const ratio = aspectRatios.find((r) => r.value === aspectRatio);
        const width = ratio?.value === "1:1" ? 1024 : ratio?.value === "2:3" ? 768 : ratio?.value === "16:9" ? 1024 : ratio?.value === "4:3" ? 1024 : 1024;
        const height = ratio?.value === "1:1" ? 1024 : ratio?.value === "2:3" ? 1152 : ratio?.value === "16:9" ? 576 : ratio?.value === "4:3" ? 768 : 1024;

        const response = await moduleAPI.imageGen({
          prompt: task.prompt,
          model_id: selectedModel,
          width,
          height,
        });

        imageUrl = extractImageFromResponse(response);
        
        // If we got an ID instead, poll for result
        if (!imageUrl && response.id) {
          // Poll for result
          let attempts = 0;
          const maxAttempts = 30;
          while (attempts < maxAttempts && !imageUrl) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              const result = await moduleAPI.fetchImageResult(response.id);
              imageUrl = extractImageFromResponse(result);
              if (imageUrl) break;
            } catch (error) {
              // Continue polling
            }
            attempts++;
          }
        }
      } else if (toolMode === "image2image" || toolMode === "image-editing") {
        let fileToSend: File | undefined;
        let initImageBase64: string | undefined;

        if (uploadedImageFile) {
          fileToSend = uploadedImageFile;
        } else if (uploadedImage) {
          const base64String = uploadedImage.includes(",")
            ? uploadedImage.split(",")[1]
            : uploadedImage;
          initImageBase64 = base64String;
        }

        if (!fileToSend && !initImageBase64) {
          throw new Error("Please upload an image");
        }

        const response = await moduleAPI.imageToImage({
          prompt: task.prompt,
          model_id: selectedModel,
          file: fileToSend,
          init_image: fileToSend ? undefined : initImageBase64,
          strength: toolMode === "image-editing" ? 0.5 : strength,
        });

        imageUrl = extractImageFromResponse(response);
        
        if (!imageUrl && response.id) {
          let attempts = 0;
          const maxAttempts = 30;
          while (attempts < maxAttempts && !imageUrl) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              const result = await moduleAPI.fetchImageResult(response.id);
              imageUrl = extractImageFromResponse(result);
              if (imageUrl) break;
            } catch (error) {
              // Continue polling
            }
            attempts++;
          }
        }
      } else if (toolMode === "bg-removal") {
        let fileToSend: File | undefined;
        let initImageBase64: string | undefined;

        if (uploadedImageFile) {
          fileToSend = uploadedImageFile;
        } else if (uploadedImage) {
          const base64String = uploadedImage.includes(",")
            ? uploadedImage.split(",")[1]
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

        imageUrl = extractImageFromResponse(response);
        
        if (!imageUrl && response.id) {
          let attempts = 0;
          const maxAttempts = 30;
          while (attempts < maxAttempts && !imageUrl) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              const result = await moduleAPI.fetchImageResult(response.id);
              imageUrl = extractImageFromResponse(result);
              if (imageUrl) break;
            } catch (error) {
              // Continue polling
            }
            attempts++;
          }
        }
      }

      clearInterval(progressInterval);

      if (imageUrl) {
        // Update task as completed
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? { ...t, status: "completed", progress: 100, result: imageUrl }
              : t
          )
        );

        // Add to generated images
        const ratio = aspectRatios.find((r) => r.value === aspectRatio);
        const width = ratio?.value === "1:1" ? 1024 : ratio?.value === "2:3" ? 768 : ratio?.value === "16:9" ? 1024 : 1024;
        const height = ratio?.value === "1:1" ? 1024 : ratio?.value === "2:3" ? 1152 : ratio?.value === "16:9" ? 576 : 1024;

        const newImage: GeneratedImage = {
          id: task.id,
          prompt: task.prompt,
          imageUrl: imageUrl,
          model: selectedModel,
          style: selectedStyle,
          aspectRatio: aspectRatio,
          createdAt: new Date(),
          width,
          height,
        };

        setGeneratedImages((prev) => [newImage, ...prev]);
        
        // Select the first generated image
        if (!selectedImage) {
          setSelectedImage(newImage);
        }

        toast.success("Image generated successfully!");
        setIsGenerating(false);
      } else {
        throw new Error("Failed to extract image from response");
      }
    } catch (error: any) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: "failed", progress: 0 } : t
        )
      );
      toast.error(error.message || "Failed to generate image");
      setIsGenerating(false);
    }
  };

  // Copy model name
  const handleCopyModel = () => {
    const modelName = imageModels.find((m) => m.id === selectedModel)?.name || "";
    navigator.clipboard.writeText(modelName);
    toast.success("Model name copied!");
  };

  // Download image
  const handleDownloadImage = (image: GeneratedImage) => {
    const link = document.createElement("a");
    link.href = image.imageUrl;
    link.download = `aeko-image-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <div className="flex-shrink-0 h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-4 h-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground">Image</span>
          <Button variant="ghost" size="sm" className="h-8 text-xs hidden sm:flex">
            Guides
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">{getCurrentDate()}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* LEFT SIDEBAR - Settings */}
        <div className={cn(
          "w-64 sm:w-80 flex-shrink-0 border-r border-border bg-card/30 overflow-y-auto fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-4 space-y-4">
            {/* Close Button for Mobile */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <span className="text-sm font-semibold text-foreground">Settings</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Tool Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Tool Mode</label>
              <div className="grid grid-cols-2 gap-1.5">
                {toolModes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = toolMode === mode.id;
                  return (
                    <Button
                      key={mode.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-8 text-[10px] font-medium justify-center gap-1.5 px-2 truncate",
                        isActive && "ring-2 ring-primary"
                      )}
                      onClick={() => setToolMode(mode.id)}
                      title={mode.label}
                    >
                      <Icon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{mode.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Reference Image Upload */}
            {(toolMode === "image2image" || toolMode === "image-editing" || toolMode === "bg-removal") && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  Reference Image
                  {(toolMode === "image2image" || toolMode === "image-editing") && (
                    <span className="text-[10px] text-muted-foreground">(Required)</span>
                  )}
                </label>
                
                <div className="flex gap-2">
                  <Input
                    value={referenceImageUrl}
                    onChange={(e) => setReferenceImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 h-8 text-xs bg-background border-border text-foreground"
                  />
                  <Button
                    onClick={handleUrlImageLoad}
                    disabled={!referenceImageUrl.trim()}
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 shrink-0 p-0"
                  >
                    <Upload className="w-3 h-3" />
                  </Button>
                </div>

                {uploadedImage ? (
                  <div className="relative group rounded-lg overflow-hidden border border-border bg-background">
                    <img
                      src={uploadedImage}
                      alt="Reference"
                      className="w-full h-auto max-h-[200px] object-contain"
                    />
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        size="sm"
                        variant="secondary"
                        className="h-7 w-7 p-0"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={handleRemoveImage}
                        size="sm"
                        variant="destructive"
                        className="h-7 w-7 p-0"
                      >
                        <X className="w-3 h-3" />
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
                  <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors border-border bg-secondary/30 hover:border-primary hover:bg-secondary/50">
                    <Upload className="w-6 h-6 mb-2 text-muted-foreground" />
                    <span className="text-xs text-foreground mb-1">Click to upload</span>
                    <span className="text-[10px] text-muted-foreground">PNG, JPG, WEBP</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}

            {/* Model Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">Model</label>
              </div>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="flex-1 h-9 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {imageModels.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="text-foreground">
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style Selection */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Style</label>
              <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                <SelectTrigger className="h-9 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {styles.map((style) => (
                    <SelectItem key={style.id} value={style.id} className="text-foreground">
                      {style.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            {toolMode === "text2image" && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Aspect Ratio</label>
                <div className="grid grid-cols-4 gap-2">
                  {aspectRatios.map((ratio) => (
                    <Button
                      key={ratio.value}
                      variant={aspectRatio === ratio.value ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "h-10 text-xs flex flex-col gap-1",
                        aspectRatio === ratio.value && "ring-2 ring-primary"
                      )}
                      onClick={() => setAspectRatio(ratio.value)}
                    >
                      <span className="text-lg">{ratio.icon}</span>
                      <span>{ratio.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Number of Images */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Number of Images</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    variant={numImages === num ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "flex-1 h-9 text-xs",
                      numImages === num && "ring-2 ring-primary"
                    )}
                    onClick={() => setNumImages(num)}
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>

            {/* Private Mode */}
            <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-background/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-foreground">Private Mode</span>
                <span className="text-[10px] text-muted-foreground">🔒</span>
              </div>
              <Switch
                checked={privateMode}
                onCheckedChange={setPrivateMode}
              />
            </div>

            {/* Basic Settings */}
            <Collapsible open={isBasicSettingsOpen} onOpenChange={setIsBasicSettingsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded hover:bg-secondary/50">
                <span className="text-xs font-medium text-foreground">Basic Settings</span>
                {isBasicSettingsOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Generation Mode</label>
                  <div className="flex gap-2">
                    <Button
                      variant={generationMode === "standard" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "flex-1 h-8 text-xs",
                        generationMode === "standard" && "ring-2 ring-primary"
                      )}
                      onClick={() => setGenerationMode("standard")}
                    >
                      Standard
                    </Button>
                    <Button
                      variant={generationMode === "quality" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "flex-1 h-8 text-xs",
                        generationMode === "quality" && "ring-2 ring-primary"
                      )}
                      onClick={() => setGenerationMode("quality")}
                    >
                      Quality
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Prompt Magic</label>
                  <div className="flex gap-2">
                    <Button
                      variant={promptMagic === "auto" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "flex-1 h-8 text-xs",
                        promptMagic === "auto" && "ring-2 ring-primary"
                      )}
                      onClick={() => setPromptMagic("auto")}
                    >
                      Auto
                    </Button>
                    <Button
                      variant={promptMagic === "on" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "flex-1 h-8 text-xs",
                        promptMagic === "on" && "ring-2 ring-primary"
                      )}
                      onClick={() => setPromptMagic("on")}
                    >
                      On
                    </Button>
                    <Button
                      variant={promptMagic === "off" ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "flex-1 h-8 text-xs",
                        promptMagic === "off" && "ring-2 ring-primary"
                      )}
                      onClick={() => setPromptMagic("off")}
                    >
                      Off
                    </Button>
                  </div>
                </div>

                {/* Strength - for image2image and image-editing */}
                {(toolMode === "image2image" || toolMode === "image-editing") && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
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
                    <p className="text-[10px] text-muted-foreground">
                      Higher values create more dramatic transformations
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col overflow-hidden bg-background">
          {/* Prompt Input Area */}
          <div className="flex-shrink-0 border-b border-border bg-card/30 p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What do you want to create? Describe your image in detail..."
                className="min-h-[100px] bg-background border-border text-foreground resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    e.preventDefault();
                    handleGenerate();
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Assistant</span>
                </Button>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                size="lg"
                className="h-10 gap-2 px-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Generated Images Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {generatedImages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="space-y-2">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No images generated yet. Create one above!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Date Header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-foreground">{getCurrentDate()}</h2>
                </div>

                {/* Images Grid with Details Card */}
                <div className="flex flex-col xl:flex-row gap-6">
                  {/* Images Grid - Horizontal Scrollable */}
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {generatedImages.map((image) => (
                        <motion.div
                          key={image.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "relative group flex-shrink-0 w-64 sm:w-80 rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                            selectedImage?.id === image.id
                              ? "border-primary shadow-lg"
                              : "border-border hover:border-primary/50"
                          )}
                          onClick={() => setSelectedImage(image)}
                        >
                          <img
                            src={image.imageUrl}
                            alt={image.prompt}
                            className="w-full h-auto object-contain bg-secondary/20"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadImage(image);
                                }}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="h-8 w-8"
                              >
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Image Details Card */}
                  {selectedImage && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="w-full xl:w-80 flex-shrink-0 border border-border rounded-lg bg-card/50 p-4 space-y-4"
                    >
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Prompt</p>
                          <p className="text-sm text-foreground line-clamp-3">{selectedImage.prompt}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Model</p>
                            <p className="text-sm font-medium text-foreground">
                              {imageModels.find((m) => m.id === selectedImage.model)?.name || "Unknown"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Style</p>
                            <p className="text-sm font-medium text-foreground">
                              {styles.find((s) => s.id === selectedImage.style)?.name || "Dynamic"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Resolution</p>
                          <p className="text-sm font-medium text-foreground">
                            {selectedImage.width} x {selectedImage.height}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Aspect Ratio</p>
                          <p className="text-sm font-medium text-foreground">{selectedImage.aspectRatio}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-9"
                          onClick={() => handleDownloadImage(selectedImage)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-9 w-9 p-0"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Active Tasks */}
                {tasks.filter(t => t.status !== "completed" && t.status !== "failed").length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase">Generating...</h3>
                    {tasks
                      .filter(t => t.status !== "completed" && t.status !== "failed")
                      .map((task) => (
                        <div
                          key={task.id}
                          className="border border-border rounded-lg p-3 bg-card/50 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-foreground truncate flex-1 mr-2">
                              {task.prompt.length > 40 ? `${task.prompt.substring(0, 40)}...` : task.prompt}
                            </span>
                            <span className="text-muted-foreground">
                              {Math.round(task.progress)}%
                            </span>
                          </div>
                          <Progress value={task.progress} className="h-1.5" />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageToolsPage;
