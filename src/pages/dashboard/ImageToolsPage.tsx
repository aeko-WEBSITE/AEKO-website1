import { useState, useRef } from "react";
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

// Tool modes
type ToolMode = "text2image" | "image2image" | "image-editing" | "bg-removal";

const toolModes = [
  { id: "text2image" as ToolMode, label: "Text to Image", icon: Type },
  { id: "image2image" as ToolMode, label: "Image to Image", icon: ArrowLeftRight },
  { id: "image-editing" as ToolMode, label: "Image Editing", icon: Wand2 },
  { id: "bg-removal" as ToolMode, label: "Background Removal", icon: Eraser },
];
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Image models
const imageModels = [
  { id: "flux-2-dev", name: "Z Image", description: "High quality image generation" },
  { id: "flux-kontext-dev", name: "Kingly", description: "Advanced context understanding" },
  { id: "gen3", name: "Gen3", description: "Next-gen image model" },
  { id: "sdxl", name: "SDXL", description: "Stable Diffusion XL" },
  { id: "dalle-3", name: "DALL-E 3", description: "OpenAI's latest model" },
];

// Aspect ratios matching the image
const aspectRatios = [
  { value: "2:3", label: "2:3" },
  { value: "1:1", label: "1:1" },
  { value: "9:16", label: "9:16" },
  { value: "4:3", label: "4:3" },
];

// Task type
type TaskStatus = "pending" | "processing" | "completed" | "failed";

interface Task {
  id: string;
  prompt: string;
  status: TaskStatus;
  progress: number;
  model: string;
  estimatedTime?: string;
  createdAt: Date;
  result?: string;
}

const ImageToolsPage = () => {
  const [toolMode, setToolMode] = useState<ToolMode>("text2image");
  const [selectedModel, setSelectedModel] = useState("flux-2-dev");
  const [prompt, setPrompt] = useState("");
  const [generationMode, setGenerationMode] = useState<"standard" | "quality">("standard");
  const [promptMagic, setPromptMagic] = useState<"auto" | "on" | "off">("auto");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isImageSettingsOpen, setIsImageSettingsOpen] = useState(true);
  const [isBasicSettingsOpen, setIsBasicSettingsOpen] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [strength, setStrength] = useState(0.7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get current date
  const getCurrentDate = () => {
    const date = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
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

  // Handle generation
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (
      (toolMode === "image2image" || toolMode === "image-editing" || toolMode === "bg-removal") &&
      !uploadedImage && !uploadedImageFile
    ) {
      toast.error("Please upload an image first");
      return;
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      prompt: prompt.trim(),
      status: "pending",
      progress: 0,
      model: selectedModel,
      createdAt: new Date(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setPrompt("");

    // Simulate task processing
    setTimeout(() => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === newTask.id ? { ...task, status: "processing", progress: 3 } : task
        )
      );

      // Simulate progress
      const progressInterval = setInterval(() => {
        setTasks((prev) =>
          prev.map((task) => {
            if (task.id === newTask.id && task.status === "processing") {
              const newProgress = Math.min(task.progress + Math.random() * 10, 95);
              if (newProgress >= 95) {
                clearInterval(progressInterval);
                // Actually generate the image
                generateImage(task);
              }
              return { ...task, progress: newProgress };
            }
            return task;
          })
        );
      }, 1000);
    }, 500);
  };

  // Helper function to extract image from response
  const extractImageFromResponse = (response: any): string | null => {
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

  // Actually generate image
  const generateImage = async (task: Task) => {
    try {
      let imageUrl: string | null = null;

      if (toolMode === "text2image") {
        const ratio = aspectRatios.find((r) => r.value === aspectRatio);
        const width = ratio?.value === "1:1" ? 1024 : ratio?.value === "2:3" ? 768 : ratio?.value === "9:16" ? 576 : 1024;
        const height = ratio?.value === "1:1" ? 1024 : ratio?.value === "2:3" ? 1152 : ratio?.value === "9:16" ? 1024 : 768;

        const response = await moduleAPI.imageGen({
          prompt: task.prompt,
          model_id: selectedModel,
          width,
          height,
        });

        imageUrl = extractImageFromResponse(response);
        if (!imageUrl && response.id) {
          const result = await moduleAPI.fetchImageResult(response.id);
          imageUrl = extractImageFromResponse(result);
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
          const result = await moduleAPI.fetchImageResult(response.id);
          imageUrl = extractImageFromResponse(result);
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
          const result = await moduleAPI.fetchImageResult(response.id);
          imageUrl = extractImageFromResponse(result);
        }
      }

      if (imageUrl) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? { ...t, status: "completed", progress: 100, result: imageUrl }
              : t
          )
        );
        toast.success("Image generated successfully!");
      } else {
        throw new Error("Failed to extract image");
      }
    } catch (error: any) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: "failed", progress: 0 } : t
        )
      );
      toast.error(error.message || "Failed to generate image");
    }
  };

  // Cancel task
  const handleCancelTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    toast.info("Task cancelled");
  };

  // Copy model name
  const handleCopyModel = () => {
    const modelName = imageModels.find((m) => m.id === selectedModel)?.name || "";
    navigator.clipboard.writeText(modelName);
    toast.success("Model name copied!");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* TOP NAVIGATION BAR */}
      <div className="flex-shrink-0 h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-foreground">Image</span>
          <Button variant="ghost" size="sm" className="h-8 text-xs">
            Guides
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">{getCurrentDate()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Grid3x3 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <User className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - Settings */}
        <div className="w-80 flex-shrink-0 border-r border-border bg-card/30 overflow-y-auto">
          <div className="p-4 space-y-4">
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

            {/* Reference Image Upload - for image2image, image-editing, bg-removal */}
            {(toolMode === "image2image" || toolMode === "image-editing" || toolMode === "bg-removal") && (
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-2">
                  Reference Image
                  {(toolMode === "image2image" || toolMode === "image-editing") && (
                    <span className="text-[10px] text-muted-foreground">(Required)</span>
                  )}
                </label>
                
                {/* URL Input */}
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

                {/* Image Preview */}
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
              <div className="flex items-center gap-2">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={handleCopyModel}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                  <Info className="w-4 h-4" />
                </Button>
              </div>
              <Select defaultValue="1">
                <SelectTrigger className="h-9 bg-background border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="1" className="text-foreground">1</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full h-9 text-xs">
                Combo Library NEW
              </Button>
            </div>

            {/* Additional Section - Collapsed */}
            <Collapsible>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded hover:bg-secondary/50">
                <span className="text-xs text-muted-foreground">Additional</span>
                <Plus className="w-4 h-4 text-muted-foreground" />
              </CollapsibleTrigger>
            </Collapsible>

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
                {/* Generation Mode */}
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

                {/* Prompt Magic */}
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
              </CollapsibleContent>
            </Collapsible>

            {/* Image Settings */}
            <Collapsible open={isImageSettingsOpen} onOpenChange={setIsImageSettingsOpen}>
              <CollapsibleTrigger className="flex items-center justify-between w-full p-2 rounded hover:bg-secondary/50">
                <span className="text-xs font-medium text-foreground">Image Settings</span>
                {isImageSettingsOpen ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Reset
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs">
                    <StickyNote className="w-3 h-3 mr-1" />
                    Notes
                  </Button>
                </div>
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
                            "h-8 text-xs",
                            aspectRatio === ratio.value && "ring-2 ring-primary"
                          )}
                          onClick={() => setAspectRatio(ratio.value)}
                        >
                          {ratio.label}
                        </Button>
                      ))}
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        More
                      </Button>
                    </div>
                  </div>
                )}

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
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Tasks List */}
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div className="space-y-2">
                  <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No tasks yet. Create one below!</p>
                </div>
              </div>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border rounded-lg p-4 bg-card/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground">
                          Txt2Img {task.prompt.length > 50 ? `${task.prompt.substring(0, 50)}...` : task.prompt}
                        </span>
                      </div>
                      {task.status === "processing" && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Completed {Math.round(task.progress)}%.
                            </span>
                            <span className="text-muted-foreground">
                              Ready in about 5 minutes
                            </span>
                          </div>
                          <Progress value={task.progress} className="h-2" />
                        </div>
                      )}
                      {task.status === "pending" && (
                        <span className="text-xs text-muted-foreground">Waiting to start...</span>
                      )}
                      {task.status === "completed" && task.result && (
                        <div className="mt-2 rounded overflow-hidden border border-border">
                          <img
                            src={task.result}
                            alt={task.prompt}
                            className="w-full h-auto max-h-64 object-contain"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex items-start gap-2 ml-4">
                      <div className="flex flex-col items-center gap-1">
                        <div className="w-10 h-10 rounded border border-border bg-secondary/50 flex items-center justify-center">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          Model {imageModels.find((m) => m.id === task.model)?.name || "Z Image"}
                        </span>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <Info className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === "pending" && (
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Try Fast Queue
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => handleCancelTask(task.id)}
                    >
                      Cancel Task
                    </Button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Bottom Input Area */}
          <div className="flex-shrink-0 border-t border-border bg-card/50 p-4 space-y-3">
            <Button
              variant="default"
              size="sm"
              className="h-8 text-xs gap-2"
            >
              <Play className="w-3 h-3" />
              Play It
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="What do you want to create?"
                  className="pr-20 bg-background border-border text-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-10 gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Assistant
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                size="sm"
                className="h-10 gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Generate
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ImageToolsPage;
