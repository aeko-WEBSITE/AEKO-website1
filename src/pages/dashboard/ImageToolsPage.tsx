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
  Maximize2,
  Zap,
  Sun,
  Moon,
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Tool modes
type ToolMode = "text2image" | "image2image" | "image-editing" | "bg-removal";

const toolModes = [
  { id: "text2image" as ToolMode, label: "Text to Image", icon: Type, color: "text-blue-500" },
  { id: "image2image" as ToolMode, label: "Image to Image", icon: ArrowLeftRight, color: "text-purple-500" },
  { id: "image-editing" as ToolMode, label: "AI Edit", icon: Wand2, color: "text-amber-500" },
  { id: "bg-removal" as ToolMode, label: "Remove BG", icon: Eraser, color: "text-rose-500" },
];

// Image models
const imageModels = [
  { id: "flux-2-dev", name: "Z Image", description: "High quality image generation", badge: "Pro" },
  { id: "flux-kontext-dev", name: "Kingly", description: "Advanced context understanding", badge: "New" },
  { id: "gen3", name: "Gen3", description: "Next-gen image model", badge: "Beta" },
  { id: "sdxl", name: "SDXL", description: "Stable Diffusion XL", badge: null },
  { id: "dalle-3", name: "DALL-E 3", description: "OpenAI's latest model", badge: "Premium" },
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
  const [isDarkMode, setIsDarkMode] = useState(true);
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
  const [isBasicSettingsOpen, setIsBasicSettingsOpen] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const [referenceImageUrl, setReferenceImageUrl] = useState("");
  const [strength, setStrength] = useState(0.7);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toggle Theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

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

    for (const task of newTasks) {
      processTask(task);
    }

    setPrompt("");
  };

  // Process a single task
  const processTask = async (task: Task) => {
    try {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: "processing", progress: 5 } : t
        )
      );

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

      let imageUrl: string | null = null;

      if (toolMode === "text2image") {
        const ratio = aspectRatios.find((r) => r.value === aspectRatio);
        const width = ratio?.value === "1:1" ? 1024 : ratio?.value === "2:3" ? 768 : ratio?.value === "16:9" ? 1024 : 1024;
        const height = ratio?.value === "1:1" ? 1024 : ratio?.value === "2:3" ? 1152 : ratio?.value === "16:9" ? 576 : 1024;

        const response = await moduleAPI.imageGen({
          prompt: task.prompt,
          model_id: selectedModel,
          width,
          height,
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
            } catch (error) {}
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

        const response = await moduleAPI.imageToImage({
          prompt: task.prompt,
          model_id: selectedModel,
          file: fileToSend,
          init_image: fileToSend ? undefined : initImageBase64,
          strength: toolMode === "image-editing" ? 0.5 : strength,
        });

        imageUrl = extractImageFromResponse(response);
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

        const response = await moduleAPI.backgroundRemoval({
          file: fileToSend,
          init_image: fileToSend ? undefined : initImageBase64,
        });

        imageUrl = extractImageFromResponse(response);
      }

      clearInterval(progressInterval);

      if (imageUrl) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? { ...t, status: "completed", progress: 100, result: imageUrl }
              : t
          )
        );

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
        if (!selectedImage) setSelectedImage(newImage);

        toast.success("Creation complete!");
        setIsGenerating(false);
      } else {
        throw new Error("Failed to extract image");
      }
    } catch (error: any) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: "failed", progress: 0 } : t
        )
      );
      toast.error(error.message || "Generation failed");
      setIsGenerating(false);
    }
  };

  // Download image
  const handleDownloadImage = (image: GeneratedImage) => {
    const link = document.createElement("a");
    link.href = image.imageUrl;
    link.download = `creation-${image.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Downloaded!");
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 overflow-hidden selection:bg-primary/30 transition-colors duration-200">
      {/* TOP NAVIGATION BAR */}
      <div className="flex-shrink-0 h-16 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/50 backdrop-blur-xl flex items-center justify-between px-4 sm:px-8 z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 lg:hidden hover:bg-zinc-200 dark:hover:bg-white/5"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(var(--primary),0.5)]">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">Aeko Studio</span>
          </div>
          <Separator orientation="vertical" className="h-6 bg-zinc-200 dark:bg-white/10 hidden lg:block" />
          <div className="hidden lg:flex gap-1 text-zinc-500 dark:text-zinc-400">
            <Button variant="ghost" size="sm" className="text-xs font-medium hover:text-zinc-900 dark:hover:text-white">Assets</Button>
            <Button variant="ghost" size="sm" className="text-xs font-medium hover:text-zinc-900 dark:hover:text-white">Templates</Button>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="px-4 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {getCurrentDate()}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-zinc-200 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400">
            <Search className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-zinc-200 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400">
            <User className="w-4 h-4" />
          </Button>
          <Button className="h-9 px-4 text-xs font-semibold bg-primary hover:opacity-90">
            Upgrade
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* LEFT SIDEBAR - Attractive Proper Grey */}
        <div className={cn(
          "w-72 sm:w-80 flex-shrink-0 border-r border-zinc-200 dark:border-white/5 bg-zinc-100 dark:bg-zinc-900/40 backdrop-blur-sm overflow-y-auto fixed lg:static inset-y-0 left-0 z-50 lg:z-auto transform transition-all duration-300 ease-in-out shadow-2xl lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between lg:hidden">
              <span className="text-sm font-bold text-zinc-600 dark:text-zinc-300">Studio Settings</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Tool Mode Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500 flex items-center gap-2">
                <Grid3x3 className="w-3 h-3" />
                Workflow Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {toolModes.map((mode) => {
                  const Icon = mode.icon;
                  const isActive = toolMode === mode.id;
                  return (
                    <Button
                      key={mode.id}
                      variant="outline"
                      onClick={() => setToolMode(mode.id)}
                      className={cn(
                        "h-auto py-3 px-2 flex-col gap-2 bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-white/5 transition-all hover:bg-zinc-200 dark:hover:bg-white/5",
                        isActive && "bg-zinc-200 dark:bg-white/5 border-primary ring-1 ring-primary/50 shadow-sm"
                      )}
                    >
                      <Icon className={cn("w-4 h-4", mode.color)} />
                      <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">{mode.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Reference Image Upload */}
            {(toolMode !== "text2image") && (
              <div className="space-y-3 pt-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Source Image</label>
                {uploadedImage ? (
                  <div className="relative group rounded-xl overflow-hidden border border-zinc-300 dark:border-white/10 bg-white dark:bg-black shadow-inner">
                    <img src={uploadedImage} alt="Ref" className="w-full h-auto max-h-[180px] object-cover opacity-80 group-hover:opacity-100 transition-all" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-all">
                      <Button onClick={() => fileInputRef.current?.click()} size="icon" variant="secondary" className="h-8 w-8 rounded-full shadow-md"><Edit2 className="w-3 h-3" /></Button>
                      <Button onClick={handleRemoveImage} size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-md"><X className="w-3 h-3" /></Button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 dark:border-white/10 rounded-xl p-8 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group bg-white dark:bg-transparent shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-zinc-500" />
                    </div>
                    <span className="text-xs font-bold text-zinc-500">Upload base image</span>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                )}
              </div>
            )}

            {/* Model Selection */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Core Engine</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="h-11 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 focus:ring-primary/20 shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/10 text-zinc-900 dark:text-zinc-200">
                  {imageModels.map((model) => (
                    <SelectItem key={model.id} value={model.id} className="focus:bg-zinc-100 dark:focus:bg-white/5">
                      <div className="flex items-center gap-2 py-0.5">
                        <span className="font-medium">{model.name}</span>
                        {model.badge && <Badge className="text-[9px] h-4 bg-primary/20 text-primary border-0">{model.badge}</Badge>}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visual Style */}
            <div className="space-y-3">
              <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Art Style</label>
              <div className="flex flex-wrap gap-2">
                {styles.map(s => (
                    <button 
                      key={s.id}
                      onClick={() => setSelectedStyle(s.id)}
                      className={cn(
                        "px-2 py-1.5 rounded-full text-[11px] font-bold border border-zinc-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 hover:border-zinc-400 dark:hover:border-white/20 transition-all text-zinc-600 dark:text-zinc-400",
                        selectedStyle === s.id && "bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-black dark:border-white shadow-sm"
                      )}
                    >
                      {s.name}
                    </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            {toolMode === "text2image" && (
              <div className="space-y-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Canvas Dimensions</label>
                <div className="grid grid-cols-4 gap-2">
                  {aspectRatios.map((ratio) => (
                    <Button
                      key={ratio.value}
                      variant="outline"
                      className={cn(
                        "h-12 flex-col gap-1 bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 shadow-sm",
                        aspectRatio === ratio.value && "border-primary bg-primary/5 dark:bg-primary/10"
                      )}
                      onClick={() => setAspectRatio(ratio.value)}
                    >
                      <span className="text-sm">{ratio.icon}</span>
                      <span className="text-[9px] font-bold">{ratio.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="pt-4">
              <Collapsible open={isBasicSettingsOpen} onOpenChange={setIsBasicSettingsOpen} className="border border-zinc-200 dark:border-white/5 rounded-xl bg-white dark:bg-zinc-900/30 overflow-hidden shadow-sm">
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors">
                  <span className="text-[11px] font-bold uppercase text-zinc-500">Advanced Control</span>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isBasicSettingsOpen && "rotate-180")} />
                </CollapsibleTrigger>
                <CollapsibleContent className="p-4 pt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-tight">Private Session</span>
                    <Switch checked={privateMode} onCheckedChange={setPrivateMode} />
                  </div>
                  <Separator className="bg-zinc-200 dark:bg-white/5" />
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-500">
                        <span>STRENGTH</span>
                        <span className="text-primary">{strength * 100}%</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" value={strength} onChange={(e) => setStrength(parseFloat(e.target.value))} 
                      className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary" />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col bg-white dark:bg-black relative transition-colors duration-300">
          
          {/* PROMPT AREA - Soft Transition Surface */}
          <div className="flex-shrink-0 p-6 sm:p-10 border-b border-zinc-200 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900/20">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-10 dark:opacity-20 group-focus-within:opacity-25 dark:group-focus-within:opacity-40 transition duration-1000"></div>
                
                {/* GREY INPUT BOX FOR LIGHT MODE */}
                <div className="relative bg-zinc-100 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden shadow-xl transition-all focus-within:border-zinc-400 dark:focus-within:border-zinc-700">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your imagination in detail..."
                    className="min-h-[120px] bg-transparent border-0 text-lg placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus-visible:ring-0 resize-none p-5 text-zinc-900 dark:text-zinc-100"
                    onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleGenerate()}
                  />
                  <div className="flex items-center justify-between p-3 bg-zinc-200/50 dark:bg-black/40 border-t border-zinc-300 dark:border-white/5">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-300/50 dark:hover:bg-white/5 gap-2">
                          <Zap className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">Enhance</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-300/50 dark:hover:bg-white/5 gap-2">
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold">Random</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        onClick={handleGenerate} 
                        disabled={!prompt.trim() || isGenerating}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                      >
                        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4 mr-2" /> Generate</>}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas Viewport */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8 sm:p-12 max-w-7xl mx-auto">
              {generatedImages.length === 0 && !isGenerating ? (
                <div className="h-[40vh] flex flex-col items-center justify-center text-center opacity-30">
                  <div className="w-20 h-20 rounded-3xl bg-zinc-200 dark:bg-zinc-900 flex items-center justify-center mb-6">
                    <ImageIcon className="w-10 h-10 text-zinc-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Ready to Create?</h3>
                  <p className="max-w-xs text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-bold">Enter a prompt to see the magic happen</p>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-white/5 pb-4">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Creations Gallery</h2>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 shadow-sm">Grid View</Button>
                            <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-white/5 shadow-sm">History</Button>
                        </div>
                      </div>
                      
                      {/* Horizontal Gallery */}
                      <div className="flex gap-6 overflow-x-auto pb-6 snap-x no-scrollbar">
                        {generatedImages.map((image) => (
                          <motion.div
                            key={image.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                              "relative flex-shrink-0 w-[300px] sm:w-[450px] group rounded-2xl overflow-hidden border-2 transition-all cursor-pointer snap-center shadow-xl",
                              selectedImage?.id === image.id ? "border-primary shadow-2xl shadow-primary/10" : "border-transparent dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/20"
                            )}
                            onClick={() => setSelectedImage(image)}
                          >
                            <img src={image.imageUrl} alt="Generated" className="w-full aspect-[4/5] object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
                              <div className="flex gap-2 justify-end">
                                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-lg" onClick={(e) => { e.stopPropagation(); handleDownloadImage(image); }}>
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full shadow-lg"><Share2 className="w-4 h-4" /></Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Rendering Progress */}
                      {tasks.filter(t => t.status !== "completed" && t.status !== "failed").length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {tasks.filter(t => t.status !== "completed" && t.status !== "failed").map(task => (
                              <div key={task.id} className="p-5 rounded-2xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 space-y-4 shadow-md">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-2">
                                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                                      <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Rendering Frame</span>
                                  </div>
                                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{Math.round(task.progress)}%</span>
                                </div>
                                <Progress value={task.progress} className="h-1.5 bg-white dark:bg-zinc-800 shadow-inner" />
                              </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Inspector Panel */}
                    <AnimatePresence>
                      {selectedImage && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                          <div className="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-white/10 backdrop-blur-md sticky top-0 shadow-xl space-y-6">
                              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                                <Info className="w-4 h-4 text-primary" />
                                Creation Stats
                              </h3>
                              <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-white/5 shadow-inner">
                                <p className="text-[11px] font-bold text-zinc-400 uppercase mb-2">Prompt</p>
                                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-300 italic">"{selectedImage.prompt}"</p>
                              </div>
                              <Separator className="bg-zinc-300 dark:bg-white/5" />
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/5 text-center">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Model</p>
                                    <p className="text-[10px] font-bold truncate">{selectedImage.model}</p>
                                  </div>
                                  <div className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-white/5 text-center">
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase mb-1">Aspect</p>
                                    <p className="text-[10px] font-bold">{selectedImage.aspectRatio}</p>
                                  </div>
                              </div>
                              <Button 
                                className="w-full bg-zinc-900 text-white dark:bg-white dark:text-black hover:opacity-90 font-bold h-11 shadow-lg"
                                onClick={() => handleDownloadImage(selectedImage)}
                              >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download Result
                              </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a1a1aa; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
      `}</style>
    </div>
  );
};

export default ImageToolsPage;