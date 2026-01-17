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
    <div className="min-h-screen bg-background dark:bg-gradient-to-br dark:from-[#0a0a0f] dark:via-[#0f0f1a] dark:to-[#050508]">
      {/* Professional Header */}
      <header className="sticky top-0 z-30 backdrop-blur-2xl bg-white/80 dark:bg-black/40 border-b border-border dark:border-white/10 -mx-2 lg:-mx-4 px-4 lg:px-6 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo/Icon and Sort Options */}
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30"
            >
              <Compass className="w-5 h-5 text-purple-400" />
            </motion.div>
            
            {/* Sort Options - Professional Consistent Styling */}
            <div className="flex items-center gap-1.5">
              {sortOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    onClick={() => setActiveSort(option.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeSort === option.id
                        ? "bg-primary/10 text-foreground dark:bg-white/10 dark:text-white border border-primary/30 dark:border-white/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 border border-transparent"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-pressed={activeSort === option.id}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {option.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right: Filter Options - Professional Consistent Styling */}
          <div className="flex items-center gap-1.5">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <motion.button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      activeFilter === filter.id
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md shadow-purple-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50 dark:text-white/60 dark:hover:text-white dark:hover:bg-white/5 border border-transparent"
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-pressed={activeFilter === filter.id}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {filter.label}
                </motion.button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Professional Agents Section - Show only when agents filter is active */}
      {activeFilter === "agents" && (
        <div className="px-4 lg:px-6 py-8 space-y-8">
          {/* Section 1: Explore Agents - Professional Design */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="relative"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/30 flex items-center justify-center shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Bot className="w-7 h-7 text-purple-400" />
                </motion.div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-foreground mb-0.5">Explore Agents</h2>
                  <p className="text-xs text-muted-foreground">Discover and interact with powerful AI agents</p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate("/dashboard/agent-store")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-md shadow-purple-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Agents Grid - Professional Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mockAgents.slice(0, 6).map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="relative group cursor-pointer"
                  onClick={() => navigate("/dashboard/agent-store")}
                >
                  {/* Card with Glass Morphism */}
                  <div className="relative rounded-2xl p-4 backdrop-blur-xl bg-card dark:bg-white/5 border-2 border-border dark:border-white/10 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20 overflow-hidden">
                    {/* Gradient Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Agent Icon */}
                    <div className="relative mb-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-purple-500/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Bot className="w-6 h-6 text-purple-300" />
                      </div>
                    </div>
                    
                    {/* Agent Info */}
                    <div className="relative z-10">
                      <h3 className="text-sm font-bold text-foreground dark:text-white mb-2 line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-300 transition-colors">
                        {agent.name}
                      </h3>
                      <p className="text-xs text-muted-foreground dark:text-white/60 line-clamp-2 mb-3 leading-relaxed">
                        {agent.description}
                      </p>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border dark:border-white/10">
                        <span className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-400 font-semibold border border-green-500/30">
                          {agent.pricing}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground dark:text-white/50">
                          <Zap className="w-3 h-3 text-yellow-500 dark:text-yellow-400" />
                          <span className="font-semibold">{agent.interactions}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

      

        {/* Section 3: Agent Categories - Professional Design */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/30 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Grid3x3 className="w-7 h-7 text-blue-400" />
              </motion.div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-0.5">Agent Categories</h2>
                <p className="text-xs text-muted-foreground">Browse agents by category</p>
              </div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {agentCategories.map((category, index) => {
              const Icon = category.icon;
              const colors = [
                { from: "from-blue-500", to: "to-cyan-500" },
                { from: "from-purple-500", to: "to-pink-500" },
                { from: "from-green-500", to: "to-emerald-500" },
                { from: "from-orange-500", to: "to-red-500" },
              ];
              const color = colors[index % colors.length];
              
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.08, y: -8 }}
                  className="relative group cursor-pointer"
                  onClick={() => navigate("/dashboard/agent-store")}
                >
                  {/* Category Card */}
                  <div className={`relative rounded-2xl p-6 backdrop-blur-xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden dark:bg-gradient-to-br ${color.from}/10 ${color.to}/5 dark:border-white/10 dark:hover:border-white/30`}>
                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${color.from}/20 ${color.to}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 dark:opacity-0 dark:group-hover:opacity-100`} />
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center text-center gap-4">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Icon className="w-8 h-8 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="text-base font-extrabold text-foreground dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-white/90 transition-colors">
                          {category.label}
                        </h3>
                        <p className="text-sm text-muted-foreground dark:text-white/60 font-semibold">
                          {category.count} agents
                        </p>
                      </div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Section 4: My Agents - Premium Design */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="relative"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center shadow-lg"
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <User className="w-7 h-7 text-green-400" />
              </motion.div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-0.5">My Agents</h2>
                <p className="text-xs text-muted-foreground">Your created and saved agents</p>
              </div>
            </div>
            <motion.button
              onClick={() => navigate("/dashboard/agent-store")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium hover:from-green-600 hover:to-emerald-600 transition-all shadow-md shadow-green-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Agent
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          {mockAgents.slice(0, 3).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {mockAgents.slice(0, 3).map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8 }}
                  className="relative group cursor-pointer"
                  onClick={() => navigate("/dashboard/agent-store")}
                >
                  {/* My Agent Card */}
                  <div className="relative rounded-2xl p-6 backdrop-blur-xl bg-card dark:bg-gradient-to-br dark:from-white/5 dark:to-white/[0.02] border-2 border-border dark:border-white/10 hover:border-green-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-green-500/20 overflow-hidden">
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/30 to-emerald-500/30 border-2 border-green-500/40 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                          <Bot className="w-7 h-7 text-green-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-extrabold text-foreground dark:text-white group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">
                              {agent.name}
                            </h3>
                            <span className="text-xs px-2 py-1 rounded-lg bg-accent dark:bg-white/10 text-muted-foreground dark:text-white/70 font-semibold border border-border dark:border-white/20">
                              {agent.status}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground dark:text-white/70 line-clamp-2 leading-relaxed">
                            {agent.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border dark:border-white/10">
                        <span className="text-xs px-2 py-1 rounded-lg bg-green-500/20 text-green-400 font-semibold border border-green-500/30">
                          {agent.pricing}
                        </span>
                        <motion.button
                          className="text-xs text-foreground dark:text-white/80 dark:hover:text-white font-bold flex items-center gap-1"
                          whileHover={{ x: 3 }}
                        >
                          Manage
                          <ArrowRight className="w-3 h-3" />
                        </motion.button>
                      </div>
                    </div>
                    
                    {/* Shine Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 border-2 border-dashed border-border dark:border-white/10 rounded-2xl backdrop-blur-xl bg-card dark:bg-white/5"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-4"
              >
                <Bot className="w-10 h-10 text-green-500 dark:text-green-400" />
              </motion.div>
              <p className="text-base text-foreground dark:text-white/80 mb-3 font-semibold">No agents created yet</p>
              <motion.button
                onClick={() => navigate("/dashboard/agent-store")}
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-bold flex items-center gap-2 mx-auto"
                whileHover={{ scale: 1.05 }}
              >
                Create your first agent
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </motion.section>
        </div>
      )}

      {/* Professional Masonry Grid - Hide when agents filter is active */}
      {activeFilter !== "agents" && (
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="pt-4"
      >
        <div className="w-full">
          <div
            className="
              gap-1 grid
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
                className="flex flex-col min-w-0 break-inside-avoid"
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
