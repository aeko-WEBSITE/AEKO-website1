import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Video,
  Bot,
  Upload,
  Grid3x3,
  List,
  Search,
  Calendar,
  Sparkles,
  ArrowLeft,
  Heart,
  Bookmark,
  MoreVertical,
  Play,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ImageDetailModal from "@/components/feed/ImageDetailModal";
import { FeedItem } from "@/components/feed/FeedCard";

interface AgentItem {
  id: number;
  name: string;
  description: string;
  avatar: string;
  model: string;
  createdAt: string;
  interactions: number;
  status: "active" | "inactive";
}

const CreationHistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"images" | "videos" | "agents">("images");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Static data for gallery
  const staticImages: FeedItem[] = [
    {
      id: 1,
      type: "image",
      mediaUrl: "/feeds/image1.jpg",
      prompt: "A futuristic cityscape at sunset with neon lights",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 234,
      comments: 12,
      shares: 5,
      saves: 18,
      model: "Imagen 3",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isLiked: false,
      isSaved: false,
      isFollowing: false,
    },
    {
      id: 2,
      type: "image",
      mediaUrl: "/feeds/image2.jpg",
      prompt: "Abstract art with vibrant colors",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 189,
      comments: 8,
      shares: 3,
      saves: 15,
      model: "DALL-E 3",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      isLiked: true,
      isSaved: true,
      isFollowing: false,
    },
    {
      id: 3,
      type: "image",
      mediaUrl: "/feeds/image3.png",
      prompt: "Minimalist logo design for tech startup",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 156,
      comments: 6,
      shares: 2,
      saves: 22,
      model: "Midjourney",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      isLiked: false,
      isSaved: false,
      isFollowing: false,
    },
    {
      id: 4,
      type: "image",
      mediaUrl: "/feeds/image4.jpg",
      prompt: "Portrait photography with dramatic lighting",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 312,
      comments: 15,
      shares: 7,
      saves: 28,
      model: "Stable Diffusion XL",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      isLiked: true,
      isSaved: false,
      isFollowing: false,
    },
    {
      id: 5,
      type: "image",
      mediaUrl: "/feeds/image5.jpg",
      prompt: "3D render of a modern office space",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 278,
      comments: 10,
      shares: 4,
      saves: 19,
      model: "Imagen 3",
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      isLiked: false,
      isSaved: true,
      isFollowing: false,
    },
    {
      id: 6,
      type: "image",
      mediaUrl: "/feeds/image6.jpg",
      prompt: "Fantasy landscape with mountains and waterfalls",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 445,
      comments: 22,
      shares: 9,
      saves: 35,
      model: "DALL-E 3",
      createdAt: new Date(Date.now() - 518400000).toISOString(),
      isLiked: true,
      isSaved: true,
      isFollowing: false,
    },
    {
      id: 7,
      type: "image",
      mediaUrl: "/feeds/image7.jpg",
      prompt: "Cyberpunk street scene with flying cars",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 389,
      comments: 18,
      shares: 6,
      saves: 24,
      model: "Midjourney",
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      isLiked: false,
      isSaved: false,
      isFollowing: false,
    },
    {
      id: 8,
      type: "image",
      mediaUrl: "/feeds/image8.jpg",
      prompt: "Minimalist product photography",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 267,
      comments: 9,
      shares: 3,
      saves: 16,
      model: "Imagen 3",
      createdAt: new Date(Date.now() - 691200000).toISOString(),
      isLiked: true,
      isSaved: false,
      isFollowing: false,
    },
    {
      id: 9,
      type: "image",
      mediaUrl: "/feeds/image9.jpg",
      prompt: "Abstract geometric patterns",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 198,
      comments: 7,
      shares: 2,
      saves: 13,
      model: "DALL-E 3",
      createdAt: new Date(Date.now() - 777600000).toISOString(),
      isLiked: false,
      isSaved: true,
      isFollowing: false,
    },
    {
      id: 10,
      type: "image",
      mediaUrl: "/feeds/image10.jpg",
      prompt: "Nature photography with golden hour lighting",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 523,
      comments: 31,
      shares: 11,
      saves: 42,
      model: "Stable Diffusion XL",
      createdAt: new Date(Date.now() - 864000000).toISOString(),
      isLiked: true,
      isSaved: true,
      isFollowing: false,
    },
  ];

  const staticVideos: FeedItem[] = [
    {
      id: 11,
      type: "video",
      mediaUrl: "/feeds/video1.mp4",
      thumbnailUrl: "/feeds/image7.jpg",
      prompt: "Time-lapse of a bustling city street",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 567,
      comments: 28,
      shares: 12,
      saves: 42,
      model: "VideoFusion",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      isLiked: true,
      isSaved: false,
      isFollowing: false,
    },
    {
      id: 12,
      type: "video",
      mediaUrl: "/feeds/video2.mp4",
      thumbnailUrl: "/feeds/image8.jpg",
      prompt: "Animated logo reveal with particle effects",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 389,
      comments: 15,
      shares: 6,
      saves: 31,
      model: "Runway Gen-2",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      isLiked: false,
      isSaved: true,
      isFollowing: false,
    },
    {
      id: 13,
      type: "video",
      mediaUrl: "/feeds/video3.mp4",
      thumbnailUrl: "/feeds/image9.jpg",
      prompt: "Product showcase with smooth camera movements",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 423,
      comments: 19,
      shares: 8,
      saves: 27,
      model: "VideoFusion",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      isLiked: true,
      isSaved: false,
      isFollowing: false,
    },
    {
      id: 14,
      type: "video",
      mediaUrl: "/feeds/video4.mp4",
      thumbnailUrl: "/feeds/image10.jpg",
      prompt: "Cinematic landscape with dramatic clouds",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 498,
      comments: 24,
      shares: 10,
      saves: 38,
      model: "Runway Gen-2",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      isLiked: false,
      isSaved: true,
      isFollowing: false,
    },
    {
      id: 15,
      type: "video",
      mediaUrl: "/feeds/video5.mp4",
      thumbnailUrl: "/feeds/image11.jpg",
      prompt: "Abstract motion graphics animation",
      author: { username: "alexcreator", avatar: "", verified: true },
      likes: 356,
      comments: 14,
      shares: 5,
      saves: 22,
      model: "VideoFusion",
      createdAt: new Date(Date.now() - 432000000).toISOString(),
      isLiked: true,
      isSaved: false,
      isFollowing: false,
    },
  ];

  const staticAgents: AgentItem[] = [
    {
      id: 1,
      name: "Content Writer Pro",
      description: "AI agent specialized in creating engaging blog posts and articles",
      avatar: "",
      model: "GPT-4",
      createdAt: new Date(Date.now() - 604800000).toISOString(),
      interactions: 1247,
      status: "active",
    },
    {
      id: 2,
      name: "Image Generator Assistant",
      description: "Helps create and refine image generation prompts",
      avatar: "",
      model: "Claude 3",
      createdAt: new Date(Date.now() - 1209600000).toISOString(),
      interactions: 892,
      status: "active",
    },
    {
      id: 3,
      name: "Video Editor Bot",
      description: "Automated video editing and post-production assistant",
      avatar: "",
      model: "GPT-4 Turbo",
      createdAt: new Date(Date.now() - 1814400000).toISOString(),
      interactions: 634,
      status: "inactive",
    },
    {
      id: 4,
      name: "Social Media Manager",
      description: "Creates and schedules social media content across platforms",
      avatar: "",
      model: "Claude 3 Opus",
      createdAt: new Date(Date.now() - 2419200000).toISOString(),
      interactions: 2156,
      status: "active",
    },
    {
      id: 5,
      name: "Code Review Assistant",
      description: "Reviews and suggests improvements for code quality",
      avatar: "",
      model: "GPT-4",
      createdAt: new Date(Date.now() - 3024000000).toISOString(),
      interactions: 478,
      status: "inactive",
    },
  ];

  const filteredImages = staticImages.filter((item) =>
    searchQuery
      ? item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const filteredVideos = staticVideos.filter((item) =>
    searchQuery
      ? item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const filteredAgents = staticAgents.filter((item) =>
    searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  const handleLike = (id: number) => {
    toast.success("Liked!");
  };

  const handleSave = (id: number) => {
    toast.success("Saved!");
  };

  const handleShare = (id: number) => {
    toast.success("Shared!");
  };

  const handleOpenComments = (id: number) => {
    toast.info("Comments feature coming soon!");
  };

  const handleOpenDetail = (id: number) => {
    const item =
      activeTab === "images"
        ? staticImages.find((i) => i.id === id)
        : staticVideos.find((i) => i.id === id);
    if (item) {
      setSelectedItem(item);
      setIsModalOpen(true);
    }
  };

  const handleOpenReels = (id: number) => {
    handleOpenDetail(id);
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`${files.length} file(s) selected. Upload feature coming soon!`);
    }
  };

  const getCurrentItems = () => {
    if (activeTab === "images") return filteredImages;
    if (activeTab === "videos") return filteredVideos;
    return [];
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard/account")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary" />
                Creation History
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                View and manage all your AI-generated content in one place
              </p>
            </div>
            <Button
              onClick={handleUpload}
              variant="hero"
              size="sm"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-6 border-b border-border/50"
        >
          <button
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "images"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Images ({staticImages.length})
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "videos"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Video className="w-4 h-4" />
            Videos ({staticVideos.length})
          </button>
          <button
            onClick={() => setActiveTab("agents")}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "agents"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Bot className="w-4 h-4" />
            Agents ({staticAgents.length})
          </button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          <div className="p-4 rounded-xl bg-secondary/30 text-center">
            <div className="text-2xl font-bold text-foreground">
              {activeTab === "images"
                ? staticImages.length
                : activeTab === "videos"
                ? staticVideos.length
                : staticAgents.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Total {activeTab}
            </div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 text-center">
            <div className="text-2xl font-bold text-foreground">3</div>
            <div className="text-xs text-muted-foreground mt-1">Days</div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 text-center">
            <div className="text-2xl font-bold text-foreground">
              {activeTab === "images"
                ? filteredImages.length
                : activeTab === "videos"
                ? filteredVideos.length
                : filteredAgents.length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Filtered</div>
          </div>
          <div className="p-4 rounded-xl bg-secondary/30 text-center">
            <div className="text-2xl font-bold text-foreground">2</div>
            <div className="text-xs text-muted-foreground mt-1">Statuses</div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-6"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by prompt or model..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-secondary/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2.5 rounded-lg bg-secondary/30 border border-border/50 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            >
              <option value="all">Status: All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <div className="flex items-center gap-1 p-1 rounded-lg bg-secondary/30">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Display */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {activeTab === "agents" ? (
            <div className="space-y-4">
              {filteredAgents.map((agent) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
                      <Bot className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground">{agent.name}</h3>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            agent.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {agent.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {agent.model}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(agent.createdAt)}
                        </span>
                        <span>{agent.interactions} interactions</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-secondary/60 transition-colors">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {getCurrentItems().length > 0 && formatDate(getCurrentItems()[0]?.createdAt || "")} •{" "}
                  {getCurrentItems().length} {activeTab}
                </span>
              </div>
              {viewMode === "grid" ? (
                // UPDATED: Use CSS Grid with gap-2 instead of Masonry for uniform size
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {getCurrentItems().map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group relative aspect-square rounded-xl overflow-hidden bg-secondary/20 cursor-pointer"
                      onClick={() => handleOpenDetail(item.id)}
                    >
                      {/* Media Rendering */}
                      {item.type === "video" ? (
                        <video
                          src={item.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.prompt}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}

                      {/* Overlay (Visible on Hover) */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-between">
                        <div className="flex justify-end">
                           <div className="bg-black/50 p-1.5 rounded-lg backdrop-blur-md">
                              {item.type === 'video' ? <Video className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                           </div>
                        </div>
                        
                        <div className="space-y-2">
                            <p className="text-white text-xs line-clamp-2 font-medium drop-shadow-md">{item.prompt}</p>
                            <div className="flex items-center justify-end gap-2">
                               <div className="flex gap-1">
                                 <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); handleLike(item.id); }}>
                                    <Heart className={`w-4 h-4 ${item.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                                 </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); handleSave(item.id); }}>
                                    <Bookmark className={`w-4 h-4 ${item.isSaved ? 'fill-white' : ''}`} />
                                 </Button>
                                  <Button variant="ghost" size="icon" className="h-7 w-7 text-white hover:text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); handleShare(item.id); }}>
                                    <Share2 className="w-4 h-4" />
                                 </Button>
                               </div>
                            </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {getCurrentItems().map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors cursor-pointer"
                      onClick={() => handleOpenDetail(item.id)}
                    >
                      <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                        {item.type === "video" ? (
                          <div className="relative w-full h-full">
                            <video
                               src={item.mediaUrl}
                               className="w-full h-full object-cover"
                               muted
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-background/20">
                              <Video className="w-6 h-6 text-foreground" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={item.mediaUrl}
                            alt={item.prompt}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground mb-1 line-clamp-2">
                          {item.prompt}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                          <span>{item.model}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1 text-foreground">
                            <Heart className="w-3 h-3" />
                            {item.likes}
                          </span>
                          <span className="text-muted-foreground">
                            {item.comments} comments
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Image/Video Detail Modal */}
      <ImageDetailModal
        isOpen={isModalOpen}
        item={selectedItem}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        onLike={handleLike}
        onSave={handleSave}
        onShare={handleShare}
        onOpenComments={handleOpenComments}
      />
    </div>
  );
};

export default CreationHistoryPage;