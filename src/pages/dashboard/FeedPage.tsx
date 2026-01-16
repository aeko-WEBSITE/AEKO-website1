import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Image, Video, Loader2, Sparkles, Heart, Compass, Bot, TrendingDown, Grid3x3, User, ArrowRight, Star, Zap, Users, Briefcase, Code2, Globe } from "lucide-react";
import { toast } from "sonner";
import { FeedItem } from "@/components/feed/FeedCard";
import MasonryCard from "@/components/feed/MasonryCard";
import ImageDetailModal from "@/components/feed/ImageDetailModal";
import ReelsViewer from "@/components/feed/ReelsViewer";
import CommentsSheet from "@/components/feed/CommentsSheet";
import ShareSheet from "@/components/feed/ShareSheet";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useNavigate } from "react-router-dom";

const filters = [
  { id: "styles", label: "Styles", icon: Sparkles },
  { id: "images", label: "Images", icon: Image },
  { id: "videos", label: "Videos", icon: Video },
  { id: "agents", label: "Agents", icon: Bot },
];

const sortOptions = [
  { id: "top", label: "Top Day", icon: TrendingUp },
  { id: "likes", label: "Likes", icon: Heart },
];

const generateMockItems = (startId: number, count: number): FeedItem[] => {
  // ...no change...
  const models = [
    "FLUX Pro",
    "Stable Diffusion XL",
    "DALL-E 3",
    "Midjourney Style",
    "Runway Gen-3",
    "Pika Labs",
  ];
  const prompts = [
    "Cyberpunk city with neon lights and flying cars at sunset",
    "Abstract digital art with flowing colors and geometric shapes",
    "Cinematic mountain landscape with dramatic lighting",
    "Futuristic robot portrait in studio lighting with reflections",
    "Ethereal fantasy forest with magical creatures and glowing plants",
    "Portrait animation with subtle movements and emotion",
    "Surreal underwater world with bioluminescent creatures",
    "Steampunk airship flying through clouds at golden hour",
    "Minimalist Japanese garden with cherry blossoms",
    "Cosmic nebula with vibrant colors and stars",
    "Hyper realistic portrait of a woman with freckles, dramatic lighting",
    "Van Gogh style eye with swirling colors and dramatic waves",
    "Black horse rearing on red background, magazine cover style",
    "Athletic woman running in urban environment, fitness magazine",
    "Vintage interior room with afternoon sunlight streaming through windows",
    "Two monkeys having a conversation, photorealistic animal portrait",
  ];
  const usernames = [
    "creator_1",
    "artist_pro",
    "filmmaker",
    "tech_art",
    "fantasy_maker",
    "motion_artist",
    "ai_wizard",
    "pixel_master",
    "onboku",
    "atreyu77",
    "visual_dreams",
  ];
  const avatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
  ];
  const images = [
    "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800",
    "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800",
    "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800",
    "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800",
    "https://images.unsplash.com/photo-1604076913837-52ab5f6a3b5e?w=800",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800",
  ];

  return Array.from({ length: count }, (_, i) => {
    const id = startId + i;
    const isVideo = Math.random() > 0.8;
    const randomUser = Math.floor(Math.random() * usernames.length);
    const randomAvatar = Math.floor(Math.random() * avatars.length);
    const randomImage = Math.floor(Math.random() * images.length);
    const randomPrompt = Math.floor(Math.random() * prompts.length);
    const randomModel = Math.floor(Math.random() * models.length);

    const hoursAgo = Math.floor(Math.random() * 168);
    const createdAt = new Date(
      Date.now() - hoursAgo * 60 * 60 * 1000
    ).toISOString();

    return {
      id,
      type: isVideo ? "video" : "image",
      mediaUrl: images[randomImage],
      thumbnailUrl: isVideo ? images[randomImage] : undefined,
      prompt: prompts[randomPrompt],
      author: {
        username: usernames[randomUser],
        avatar: avatars[randomAvatar],
        verified: Math.random() > 0.7,
      },
      likes: Math.floor(Math.random() * 10000) + 100,
      comments: Math.floor(Math.random() * 500) + 10,
      shares: Math.floor(Math.random() * 200) + 5,
      saves: Math.floor(Math.random() * 1000) + 20,
      model: models[randomModel],
      createdAt,
      isLiked: false,
      isSaved: false,
      isFollowing: Math.random() > 0.6,
    };
  });
};

interface Agent {
  id: string;
  name: string;
  description: string;
  status: "UNPUBLISHED" | "PUBLISHED";
  pricing: "FREE" | "PAID";
  icon?: string;
  createdAt: Date;
  interactions?: number;
  category?: string;
}

const mockAgents: Agent[] = [
  {
    id: "1",
    name: "Cnergee",
    description: "Integrated network security products—SD-WAN, NGFW, Managed WiFi",
    status: "PUBLISHED",
    pricing: "FREE",
    createdAt: new Date(),
    interactions: 1250,
    category: "Business",
  },
  {
    id: "2",
    name: "Instagram",
    description: "Social media assistant for Instagram management",
    status: "PUBLISHED",
    pricing: "FREE",
    createdAt: new Date(),
    interactions: 890,
    category: "Social",
  },
  {
    id: "3",
    name: "Yamaha Motor India",
    description: "Motorcycle and scooter information assistant",
    status: "PUBLISHED",
    pricing: "FREE",
    createdAt: new Date(),
    interactions: 2100,
    category: "Automotive",
  },
  {
    id: "4",
    name: "IIT Roorkee",
    description: "Technical research university information assistant",
    status: "PUBLISHED",
    pricing: "FREE",
    createdAt: new Date(),
    interactions: 1560,
    category: "Education",
  },
  {
    id: "5",
    name: "Cloud Support",
    description: "Help users raise support requests on Scogo Cloud Platform",
    status: "PUBLISHED",
    pricing: "FREE",
    createdAt: new Date(),
    interactions: 980,
    category: "Support",
  },
  {
    id: "6",
    name: "Globalnet",
    description: "ICT Solutions and infrastructure information",
    status: "PUBLISHED",
    pricing: "FREE",
    createdAt: new Date(),
    interactions: 750,
    category: "Technology",
  },
];

const agentCategories = [
  { id: "business", label: "Business", icon: Briefcase, count: 24 },
  { id: "social", label: "Social Media", icon: Users, count: 18 },
  { id: "tech", label: "Technology", icon: Code2, count: 32 },
  { id: "education", label: "Education", icon: Globe, count: 15 },
];

const FeedPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("styles");
  const [activeSort, setActiveSort] = useState("top");
  const [items, setItems] = useState<FeedItem[]>(() =>
    generateMockItems(1, 20)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  // Modal states
  const [reelsOpen, setReelsOpen] = useState(false);
  const [reelsIndex, setReelsIndex] = useState(0);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsItemId, setCommentsItemId] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareItemId, setShareItemId] = useState(0);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    setTimeout(() => {
      const newItems = generateMockItems(items.length + 1, 12);
      setItems((prev) => [...prev, ...newItems]);
      setIsLoading(false);

      if (items.length >= 80) {
        setHasMore(false);
      }
    }, 1000);
  }, [items.length, isLoading, hasMore]);

  const loadMoreRef = useInfiniteScroll(loadMore);

  const filteredItems = items.filter((item) => {
    if (activeFilter === "styles") return true;
    if (activeFilter === "images") return item.type === "image";
    if (activeFilter === "videos") return item.type === "video";
    if (activeFilter === "agents") return false; // Agents filter shows agent sections, not feed items
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (activeSort === "top") {
      return b.likes - a.likes;
    }
    if (activeSort === "likes") {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleLike = (id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newIsLiked = !item.isLiked;
          if (newIsLiked) {
            toast.success("Added to your likes!");
          }
          return {
            ...item,
            isLiked: newIsLiked,
            likes: newIsLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  const handleSave = (id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newIsSaved = !item.isSaved;
          toast.success(
            newIsSaved ? "Saved to collection!" : "Removed from collection"
          );
          return {
            ...item,
            isSaved: newIsSaved,
            saves: newIsSaved ? item.saves + 1 : item.saves - 1,
          };
        }
        return item;
      })
    );
  };

  const handleShare = (id: number) => {
    setShareItemId(id);
    setShareOpen(true);
  };

  const handleFollow = (id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          toast.success(`Following @${item.author.username}`);
          return { ...item, isFollowing: true };
        }
        return item;
      })
    );
  };

  const handleOpenComments = (id: number) => {
    setCommentsItemId(id);
    setCommentsOpen(true);
  };

  const handleOpenReels = (id: number) => {
    const videoItems = items.filter((item) => item.type === "video");
    const index = videoItems.findIndex((item) => item.id === id);
    if (index !== -1) {
      setReelsIndex(index);
      setReelsOpen(true);
    }
  };

  const handleOpenDetail = (id: number) => {
    setSelectedItemId(id);
    setDetailModalOpen(true);
  };

  const handlePrevDetail = () => {
    const imageItems = sortedItems.filter((item) => item.type === "image");
    const currentImageIndex = imageItems.findIndex(
      (item) => item.id === selectedItemId
    );
    if (currentImageIndex > 0) {
      setSelectedItemId(imageItems[currentImageIndex - 1].id);
    }
  };

  const handleNextDetail = () => {
    const imageItems = sortedItems.filter((item) => item.type === "image");
    const currentImageIndex = imageItems.findIndex(
      (item) => item.id === selectedItemId
    );
    if (currentImageIndex < imageItems.length - 1) {
      setSelectedItemId(imageItems[currentImageIndex + 1].id);
    }
  };

  const selectedItem =
    items.find((item) => item.id === selectedItemId) || null;
  const imageItems = sortedItems.filter((item) => item.type === "image");
  const currentImageIndex = imageItems.findIndex(
    (item) => item.id === selectedItemId
  );
  const videoItems = items.filter((item) => item.type === "video");

  return (
    <div className="min-h-screen bg-background">
      {/* Header - Matching Midjourney Layout */}
      <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border -mx-2 lg:-mx-4 px-3 lg:px-4 py-2">
        <div className="flex items-center justify-between gap-3">
          {/* Left: Compass Icon */}
          <div className="flex items-center gap-3">
            <Compass className="w-4 h-4 text-red-500" />
            
            {/* Center: Sort Options */}
            <div className="flex items-center gap-1.5">
              {sortOptions.map((option) => {
                return (
                  <button
                    key={option.id}
                    onClick={() => setActiveSort(option.id)}
                    className={`px-2 py-1 rounded text-sm font-medium transition-all ${
                      activeSort === option.id
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    aria-pressed={activeSort === option.id}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Filter Options */}
          <div className="flex items-center gap-1.5">
            {filters.map((filter) => {
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    activeFilter === filter.id
                      ? "bg-red-500 text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  aria-pressed={activeFilter === filter.id}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Exploration Sections - Show only when agents filter is active */}
      {activeFilter === "agents" && (
        <div className="px-2 lg:px-4 py-4 space-y-4">
          {/* Section 1: Explore Agents */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border/50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Explore Agents</h2>
                  <p className="text-xs text-muted-foreground">Discover and interact with AI agents</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/dashboard/agent-store")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mockAgents.slice(0, 6).map((agent) => (
                <motion.div
                  key={agent.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-background/50 border border-border/50 rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-all group"
                  onClick={() => navigate("/dashboard/agent-store")}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                        {agent.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {agent.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">
                      {agent.pricing}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      {agent.interactions}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

        {/* Section 2: Trending Agents */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-card border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Trending Agents</h2>
                <p className="text-xs text-muted-foreground">Most popular agents this week</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/agent-store")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-colors"
            >
              See More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {mockAgents
              .sort((a, b) => (b.interactions || 0) - (a.interactions || 0))
              .slice(0, 4)
              .map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-background/50 border border-border/50 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-all group relative overflow-hidden"
                  onClick={() => navigate("/dashboard/agent-store")}
                >
                  {index === 0 && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      #1
                    </div>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Zap className="w-3 h-3" />
                        {agent.interactions}
                      </div>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">
                        {agent.pricing}
                      </span>
                    </div>
                    <button className="text-xs text-primary hover:text-primary/80 font-medium">
                      Interact →
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        </motion.section>

        {/* Section 3: Agent Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-card border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                <Grid3x3 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Agent Categories</h2>
                <p className="text-xs text-muted-foreground">Browse agents by category</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {agentCategories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="bg-background/50 border border-border/50 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-all group"
                  onClick={() => navigate("/dashboard/agent-store")}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                        {category.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.count} agents
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Section 4: My Agents */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-card border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">My Agents</h2>
                <p className="text-xs text-muted-foreground">Your created and saved agents</p>
              </div>
            </div>
            <button
              onClick={() => navigate("/dashboard/agent-store")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Create Agent
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {mockAgents.slice(0, 3).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {mockAgents.slice(0, 3).map((agent) => (
                <motion.div
                  key={agent.id}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-background/50 border border-border/50 rounded-lg p-4 cursor-pointer hover:border-primary/50 transition-all group"
                  onClick={() => navigate("/dashboard/agent-store")}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                          {agent.name}
                        </h3>
                        <span className="text-xs px-1.5 py-0.5 rounded bg-secondary/50 text-muted-foreground">
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-500">
                      {agent.pricing}
                    </span>
                    <button className="text-xs text-primary hover:text-primary/80 font-medium">
                      Manage →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-border/50 rounded-lg">
              <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-2">No agents created yet</p>
              <button
                onClick={() => navigate("/dashboard/agent-store")}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                Create your first agent →
              </button>
            </div>
          )}
        </motion.section>
        </div>
      )}

      {/* Masonry Grid - Full Width Like Midjourney - Hide when agents filter is active */}
      {activeFilter !== "agents" && (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.3 }}
        className="pt-2 px-0.5 sm:px-1"
      >
        <div className="w-full">
          <div
            className="
              gap-2 grid
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-4
              lg:grid-cols-5
              xl:grid-cols-6
              2xl:grid-cols-7
              "
          >
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="mb-2 flex flex-col min-w-0 break-inside-avoid"
              >
                <MasonryCard
                  item={item}
                  onLike={handleLike}
                  onSave={handleSave}
                  onShare={handleShare}
                  onOpenComments={handleOpenComments}
                  onOpenReels={handleOpenReels}
                  onClick={handleOpenDetail}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Infinite scroll trigger */}
        <div
          ref={loadMoreRef}
          className="py-6 flex justify-center items-center min-h-12"
        >
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs font-medium">Loading more...</span>
            </div>
          )}
          {!hasMore && (
            <p className="text-muted-foreground text-xs font-medium px-2 text-center">
              You've seen it all! 🎉
            </p>
          )}
        </div>
      </motion.main>
      )}

      {/* Image Detail Modal */}
      <ImageDetailModal
        isOpen={detailModalOpen}
        item={selectedItem}
        onClose={() => setDetailModalOpen(false)}
        onLike={handleLike}
        onSave={handleSave}
        onShare={handleShare}
        onOpenComments={handleOpenComments}
        onPrev={handlePrevDetail}
        onNext={handleNextDetail}
        hasPrev={currentImageIndex > 0}
        hasNext={currentImageIndex < imageItems.length - 1}
      />

      {/* Reels Viewer */}
      <ReelsViewer
        items={videoItems}
        initialIndex={reelsIndex}
        isOpen={reelsOpen}
        onClose={() => setReelsOpen(false)}
        onLike={handleLike}
        onSave={handleSave}
        onShare={handleShare}
        onOpenComments={handleOpenComments}
      />

      {/* Comments Sheet */}
      <CommentsSheet
        isOpen={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        itemId={commentsItemId}
      />

      {/* Share Sheet */}
      <ShareSheet
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
        itemId={shareItemId}
      />
    </div>
  );
};

export default FeedPage;
