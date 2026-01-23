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
import { moduleAPI } from "@/lib/api";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { useEffect } from "react";

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

// Styles
const styles = [
  "Photorealistic",
  "Digital Art",
  "Anime",
  "3D Render",
  "Oil Painting",
  "Watercolor",
  "Sketch",
  "Abstract",
];

// Aspect ratios
const aspectRatios = [
  { value: "16:9", label: "16:9", width: 1024, height: 576 },
  { value: "1:1", label: "1:1", width: 1024, height: 1024 },
  { value: "9:16", label: "9:16", width: 576, height: 1024 },
  { value: "4:3", label: "4:3", width: 1024, height: 768 },
  { value: "3:4", label: "3:4", width: 768, height: 1024 },
];

// Number of images
const imageCounts = ["1", "2", "3", "4"];

const ImageToolsPage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  const [toolMode, setToolMode] = useState<ToolMode>("text2image");
  const [selectedModel, setSelectedModel] = useState("flux-2-dev");
  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [numberOfImages, setNumberOfImages] = useState("1");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageFile, setUploadedImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Add smooth scrolling styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .scroll-smooth {
        -webkit-overflow-scrolling: touch;
        scroll-behavior: smooth;
      }
      .scroll-smooth::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .scroll-smooth::-webkit-scrollbar-track {
        background: transparent;
      }
      .scroll-smooth::-webkit-scrollbar-thumb {
        background: ${isDark ? "rgba(111,108,255,0.3)" : "rgba(0,0,0,0.2)"};
        border-radius: 4px;
      }
      .scroll-smooth::-webkit-scrollbar-thumb:hover {
        background: ${isDark ? "rgba(111,108,255,0.5)" : "rgba(0,0,0,0.3)"};
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, [isDark]);

  // Theme-aware colors - using black for light mode
  const colors = {
    bg: isDark ? "#000000" : "#FFFFFF",
    bgSecondary: isDark ? "#000000" : "#FFFFFF",
    bgCard: isDark ? "#000000" : "#000000",
    bgCardHover: isDark ? "#181818" : "#1A1A1A", // darker hover for dark mode
    border: isDark ? "rgba(111,108,255,0.18)" : "rgba(0,0,0,0.2)",
    borderStrong: isDark ? "#222222" : "#000000",
    text: isDark ? "#D7DBFF" : "#FFFFFF", // White text on black cards in light mode
    textMuted: isDark ? "#A5ACD9" : "#CCCCCC", // Light gray on black
    textSecondary: isDark ? "#7C83B8" : "#999999", // Medium gray on black
    textOnLight: isDark ? "#D7DBFF" : "#000000", // For text on light backgrounds
    primary: isDark ? "#6D5BFF" : "#FFFFFF", // White/light for light mode
    primaryHover: isDark ? "#7B6CFF" : "#E0E0E0",
    overlay: isDark ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.8)",
  };

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

  // Convert base64 to File for API
  const base64ToFile = (base64: string, filename: string): File => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Helper function to extract image from response
  const extractImageFromResponse = (response: any): string | null => {
    // Try different possible response formats based on API documentation
    // Format 1: Direct image_base64 field (most common)
    if (response.image_base64) {
      return response.image_base64.startsWith("data:") 
        ? response.image_base64 
        : `data:image/${response.mime?.split('/')[1] || 'png'};base64,${response.image_base64}`;
    }
    // Format 2: Direct base64 field
    if (response.base64) {
      return response.base64.startsWith("data:") 
        ? response.base64 
        : `data:image/png;base64,${response.base64}`;
    }
    // Format 3: Nested in data object
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
    // Format 4: Direct image field
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

    // For image2image, image-editing, and bg-removal, require uploaded image
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
        // Text to Image - POST /apimodule/v1/image-gen
        // No file upload, just prompt, model_id, width, height
        const response = await moduleAPI.imageGen({
          prompt: prompt.trim(),
          model_id: selectedModel,
          width: dimensions.width,
          height: dimensions.height,
        });

        // API returns 201 with base64 image (no polling)
        const imageUrl = extractImageFromResponse(response);
        if (imageUrl) {
          setGeneratedImage(imageUrl);
          toast.success("Image generated successfully!");
        } else if (response.id) {
          // If response has ID, fetch the result
          const result = await moduleAPI.fetchResult(response.id);
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
        // Image to Image - POST /apimodule/v1/image-to-image
        // Requires: prompt, file OR init_image (base64), optional: model_id, strength
        // API accepts either file or init_image (base64), but not both
        
        // Prepare file or base64 image - prefer file if available
        let fileToSend: File | undefined;
        let initImageBase64: string | undefined;

        if (uploadedImageFile) {
          // Prefer file upload if available
          fileToSend = uploadedImageFile;
        } else if (uploadedImage) {
          // Fallback to base64 string (extract base64 part from Data URL)
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
          file: fileToSend, // Prefer file if available
          init_image: fileToSend ? undefined : initImageBase64, // Only send base64 if no file
          strength: toolMode === "image-editing" ? 0.5 : 0.7, // Lower strength for editing
        });

        // API returns 201 with base64 image
        const imageUrl = extractImageFromResponse(response);
        if (imageUrl) {
          setGeneratedImage(imageUrl);
          toast.success(toolMode === "image-editing" 
            ? "Image edited successfully!" 
            : "Image transformed successfully!");
        } else if (response.id) {
          // If response has ID, fetch the result
          const result = await moduleAPI.fetchResult(response.id);
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
        // Background Removal - POST /apimodule/v1/background-removal
        // Requires: file OR init_image (base64)
        
        // Prepare file or base64 for background removal - prefer file if available
        let fileToSend: File | undefined;
        let initImageBase64: string | undefined;

        if (uploadedImageFile) {
          fileToSend = uploadedImageFile;
        } else if (uploadedImage) {
          // Extract base64 part from Data URL
          const base64String = uploadedImage.includes(',')
            ? uploadedImage.split(',')[1]
            : uploadedImage;
          initImageBase64 = base64String;
        }

        if (!fileToSend && !initImageBase64) {
          throw new Error("Please upload an image");
        }

        const response = await moduleAPI.backgroundRemoval({
          file: fileToSend, // Prefer file if available
          init_image: fileToSend ? undefined : initImageBase64, // Only send base64 if no file
        });

        const imageUrl = extractImageFromResponse(response);
        if (imageUrl) {
          setGeneratedImage(imageUrl);
          toast.success("Background removed successfully!");
        } else if (response.id) {
          const result = await moduleAPI.fetchResult(response.id);
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div
      className="flex h-screen w-full transition-colors duration-300"
      style={{ backgroundColor: colors.bg, overflow: "hidden" }}
    >
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0" style={{ overflow: "hidden" }}>
        {/* Top Section - Image Display */}
        <div
          className="w-full flex-shrink-0"
          style={{
            height: "60%",
            minHeight: "400px",
            backgroundColor: colors.bgSecondary,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="w-full p-4 sm:p-6 flex items-center justify-center" style={{ minHeight: "100%" }}>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4"
                >
                  <Loader2
                    className="w-12 h-12 animate-spin"
                    style={{ color: colors.primary }}
                  />
                  <p style={{ color: isDark ? colors.textMuted : "#000000" }}>Generating your image...</p>
                </motion.div>
              ) : generatedImage ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-7xl mx-auto rounded-lg shadow-lg"
                  style={{
                    backgroundColor: colors.bgCard,
                    border: `1px solid ${colors.border}`,
                    maxHeight: "none",
                  }}
                >
                  <img
                    src={generatedImage}
                    alt="Generated"
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: "none" }}
                  />
                  {/* Image Actions Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDownload}
                      className="p-2.5 rounded-lg backdrop-blur-sm transition-all"
                      style={{
                        backgroundColor: colors.overlay,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleShare}
                      className="p-2.5 rounded-lg backdrop-blur-sm transition-all"
                      style={{
                        backgroundColor: colors.overlay,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
                      }}
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCopy}
                      className="p-2.5 rounded-lg backdrop-blur-sm transition-all"
                      style={{
                        backgroundColor: colors.overlay,
                        border: `1px solid ${colors.border}`,
                        color: colors.text,
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
                      backgroundColor: colors.bgCard,
                      border: `1px solid ${colors.borderStrong}`,
                    }}
                  >
                    <motion.div
                      className="w-16 h-16 rounded-lg flex items-center justify-center"
                      style={{
                        background: isDark
                          ? "linear-gradient(135deg, #6D5BFF, #4FD1FF)"
                          : "linear-gradient(135deg, #000000, #333333)",
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
                      <Sparkles className="w-8 h-8" style={{ color: "#FFFFFF" }} />
                    </motion.div>
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: isDark ? colors.text : "#000000" }}>
                    Ready to generate
                  </h3>
                  <p className="text-sm" style={{ color: isDark ? colors.textMuted : "#666666" }}>
                    {toolMode === "text2image"
                      ? "Enter a prompt below to start generating images"
                      : toolMode === "image2image"
                      ? "Upload an image and enter a prompt to transform it"
                      : toolMode === "image-editing"
                      ? "Upload an image and describe the edits you want"
                      : "Upload an image to remove its background"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Section - Control Panel */}
        <div
          className="flex-shrink-0 w-full border-t"
          style={{
            height: "40%",
            minHeight: "350px",
            backgroundColor: colors.bgSecondary,
            borderColor: colors.border,
            overflowY: "auto",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div className="flex flex-col sm:flex-row gap-4 p-4" style={{ minHeight: "100%", paddingBottom: "80px" }}>
            {/* Left Side - Image Upload/Preview (only show for modes that require it) */}
            {(toolMode === "image2image" || toolMode === "image-editing" || toolMode === "bg-removal") && (
              <div className="w-full sm:w-64 flex-shrink-0">
                <div
                  className="rounded-lg p-4 flex flex-col"
                  style={{
                    backgroundColor: colors.bgCard,
                    border: `1px solid ${colors.border}`,
                    minHeight: "100%",
                  }}
                >
                  <label
                    className="text-xs font-medium mb-2 block"
                    style={{ color: colors.text }}
                  >
                    Upload Image {toolMode === "image2image" || toolMode === "image-editing" ? "(Required)" : ""}
                  </label>
                <div className="relative min-h-[120px] flex-1" style={{ maxHeight: "250px" }}>
                  {uploadedImage ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden group" style={{ minHeight: "120px" }}>
                      <img
                        src={uploadedImage}
                        alt="Uploaded"
                        className="w-full h-full object-cover"
                        style={{ maxHeight: "250px" }}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="p-2 rounded backdrop-blur-sm"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "#FFFFFF",
                          }}
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={handleRemoveImage}
                          className="p-2 rounded backdrop-blur-sm"
                          style={{
                            backgroundColor: "rgba(255,255,255,0.2)",
                            color: "#FFFFFF",
                          }}
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <motion.label
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors"
                      style={{
                        borderColor: colors.borderStrong,
                        backgroundColor: colors.bgSecondary,
                        color: colors.textSecondary,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                        e.currentTarget.style.backgroundColor = colors.bgCardHover;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = colors.borderStrong;
                        e.currentTarget.style.backgroundColor = colors.bgSecondary;
                      }}
                    >
                      <Upload className="w-8 h-8 mb-2" style={{ color: colors.text }} />
                      <span className="text-xs" style={{ color: colors.text }}>Click to upload</span>
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
              </div>
            </div>
            )}

            {/* Right Section - Prompt and Controls */}
            <div 
              className="flex-1 flex flex-col gap-4 min-w-0"
              style={{
                overflowY: "auto",
                overflowX: "hidden",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {/* Model Selection and Prompt Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 flex-shrink-0">
                  <label
                    className="text-xs font-medium mb-2 block"
                    style={{ color: isDark ? colors.textMuted : "#000000" }}
                  >
                    Model
                  </label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger
                      className="w-full transition-colors"
                      style={{
                        backgroundColor: colors.bgCard,
                        borderColor: colors.borderStrong,
                        color: colors.text,
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        backgroundColor: colors.bgCard,
                        borderColor: colors.borderStrong,
                      }}
                    >
                      {imageModels.map((model) => (
                        <SelectItem
                          key={model.id}
                          value={model.id}
                          style={{ color: colors.text }}
                        >
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Prompt Input */}
                <div className="flex-1 min-w-0">
                  <label
                    className="text-xs font-medium mb-2 block"
                    style={{ color: isDark ? colors.textMuted : "#000000" }}
                  >
                    Prompt:
                  </label>
                  <Input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="A futuristic city on floating waterfalls"
                    className="w-full transition-colors"
                    style={{
                      backgroundColor: colors.bgCard,
                      borderColor: colors.borderStrong,
                      color: colors.text,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.borderStrong;
                    }}
                  />
                </div>
              </div>

              {/* Negative Prompt - only for text2image and image2image */}
              {(toolMode === "text2image" || toolMode === "image2image") && (
                <div>
                  <label
                    className="text-xs font-medium mb-2 block"
                    style={{ color: isDark ? colors.textMuted : "#000000" }}
                  >
                    Negative Prompt: Optional...
                  </label>
                  <Input
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Enter negative prompt..."
                    className="w-full transition-colors"
                    style={{
                      backgroundColor: colors.bgCard,
                      borderColor: colors.borderStrong,
                      color: colors.text,
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = colors.primary;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = colors.borderStrong;
                    }}
                  />
                </div>
              )}

              {/* Settings and Generate Button Row */}
              <div className="flex flex-wrap items-end gap-3 sm:gap-4">
                {/* Style dropdown - only for text2image and image2image */}
                {(toolMode === "text2image" || toolMode === "image2image") && (
                  <div className="w-full sm:w-48 flex-shrink-0">
                    <label
                      className="text-xs font-medium mb-2 block"
                      style={{ color: isDark ? colors.textMuted : "#000000" }}
                    >
                      Style:
                    </label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger
                        className="w-full transition-colors"
                        style={{
                          backgroundColor: colors.bgCard,
                          borderColor: colors.borderStrong,
                          color: colors.text,
                        }}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          backgroundColor: colors.bgCard,
                          borderColor: colors.borderStrong,
                        }}
                      >
                        {styles.map((s) => (
                          <SelectItem key={s} value={s} style={{ color: colors.text }}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Aspect Ratio - only for text2image */}
                {toolMode === "text2image" && (
                  <>
                    <div className="w-full sm:w-32 flex-shrink-0">
                      <label
                        className="text-xs font-medium mb-2 block"
                        style={{ color: isDark ? colors.textMuted : "#000000" }}
                      >
                        Aspect Ratio:
                      </label>
                      <Select value={aspectRatio} onValueChange={setAspectRatio}>
                        <SelectTrigger
                          className="w-full transition-colors"
                          style={{
                            backgroundColor: colors.bgCard,
                            borderColor: colors.borderStrong,
                            color: colors.text,
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            backgroundColor: colors.bgCard,
                            borderColor: colors.borderStrong,
                          }}
                        >
                          {aspectRatios.map((ratio) => (
                            <SelectItem
                              key={ratio.value}
                              value={ratio.value}
                              style={{ color: colors.text }}
                            >
                              {ratio.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="w-full sm:w-32 flex-shrink-0">
                      <label
                        className="text-xs font-medium mb-2 block"
                        style={{ color: isDark ? colors.textMuted : "#000000" }}
                      >
                        Number of Images:
                      </label>
                      <Select value={numberOfImages} onValueChange={setNumberOfImages}>
                        <SelectTrigger
                          className="w-full transition-colors"
                          style={{
                            backgroundColor: colors.bgCard,
                            borderColor: colors.borderStrong,
                            color: colors.text,
                          }}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          style={{
                            backgroundColor: colors.bgCard,
                            borderColor: colors.borderStrong,
                          }}
                        >
                          {imageCounts.map((count) => (
                            <SelectItem key={count} value={count} style={{ color: colors.text }}>
                              {count}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className="w-full sm:w-auto sm:flex-initial sm:max-w-[200px] font-semibold transition-all"
                  style={{
                    background:
                      isLoading || !prompt.trim()
                        ? isDark
                          ? "linear-gradient(135deg, #2A337A, #121A3F)"
                          : "linear-gradient(135deg, #CCCCCC, #999999)"
                        : isDark
                        ? "linear-gradient(90deg, #6D5BFF, #4FD1FF)"
                        : "linear-gradient(90deg, #000000, #1A1A1A)",
                    color: "#FFFFFF",
                    boxShadow:
                      isLoading || !prompt.trim()
                        ? "none"
                        : isDark
                        ? "0 0 20px rgba(79,209,255,0.55)"
                        : "0 0 20px rgba(0,0,0,0.5)",
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

      {/* Right Sidebar - Tool Mode Switcher */}
      <div
        className="hidden md:flex w-16 flex-shrink-0 flex-col items-center py-4 gap-2 border-l transition-colors"
        style={{
          backgroundColor: colors.bgSecondary,
          borderColor: colors.border,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {toolModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = toolMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => setToolMode(mode.id)}
              className="relative group"
              title={mode.label}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center transition-all"
                style={{
                  backgroundColor: isActive ? colors.bgCardHover : "transparent",
                  border: isActive
                    ? `1px solid ${colors.primary}`
                    : "1px solid transparent",
                  color: isActive ? colors.primary : (isDark ? colors.textSecondary : "#000000"),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = colors.bgCard;
                    e.currentTarget.style.borderColor = colors.border;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "transparent";
                  }
                }}
              >
                <Icon className="w-5 h-5" />
              </div>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full"
                  style={{ backgroundColor: colors.primary }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Tool Mode Switcher - Bottom */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around py-2 px-2 border-t transition-colors z-50"
        style={{
          backgroundColor: colors.bgCard,
          borderColor: colors.border,
          boxShadow: isDark ? "0 -2px 10px rgba(0,0,0,0.3)" : "0 -2px 10px rgba(0,0,0,0.2)",
          paddingBottom: "env(safe-area-inset-bottom, 8px)",
        }}
      >
        {toolModes.map((mode) => {
          const Icon = mode.icon;
          const isActive = toolMode === mode.id;
          return (
              <button
              key={mode.id}
              onClick={() => setToolMode(mode.id)}
              className="flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-all min-w-0 flex-1"
              style={{
                backgroundColor: isActive ? colors.bgCardHover : "transparent",
                color: isActive ? colors.primary : colors.textSecondary,
              }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-[10px] font-medium truncate w-full text-center">{mode.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ImageToolsPage;
