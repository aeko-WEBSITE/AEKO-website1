import { motion } from "framer-motion";
import { Video, Image as ImageIcon, ArrowRight, Sparkles, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

const AllModelsSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll functionality - fast continuous scrolling
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 2.5; // Fast continuous scrolling
    let animationFrameId: number;

    const autoScroll = () => {
      if (scrollContainer) {
        const maxScroll = scrollContainer.scrollWidth / 2; // Since we duplicated content
        if (scrollPosition < maxScroll) {
          scrollPosition += scrollSpeed;
          scrollContainer.scrollLeft = scrollPosition;
        } else {
          // Reset to start for seamless infinite loop
          scrollPosition = 0;
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };
    
    // Start auto-scroll immediately - continuous, no pause on hover
    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Mixed gallery content - images and videos with attractive visuals
  const galleryContent = [
    { id: 1, url: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80", title: "Cosmic Astronaut", type: "image" },
    { id: 2, url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80", title: "Galactic Mystic", type: "image" },
    { id: 3, url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", title: "Fantasy Character", type: "image" },
    { id: 4, url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80", title: "Epic Hero", type: "image" },
    { id: 5, url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80", title: "Neon Dreams", type: "image" },
    { id: 6, url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80", title: "Cosmic Scene", type: "image" },
    { id: 7, url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80", title: "Fantasy World", type: "image" },
    { id: 8, url: "https://images.unsplash.com/photo-1604076913837-52ab5f6a3b5e?w=800&q=80", title: "Anime Style", type: "image" },
    { id: 9, url: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80", title: "Cyberpunk City", type: "image" },
    { id: 10, url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80", title: "Video Content", type: "video" },
    { id: 11, url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80", title: "Portrait Art", type: "image" },
    { id: 12, url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80", title: "Modern Design", type: "image" },
    { id: 13, url: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80", title: "Creative Art", type: "image" },
    { id: 14, url: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=800&q=80", title: "Futuristic Design", type: "image" },
    { id: 15, url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800&q=80", title: "Digital Art", type: "image" },
  ];

  // Duplicate content for seamless loop
  const duplicatedContent = [...galleryContent, ...galleryContent];

  const videoModels = [
    "Pollo 2.5",
    "Veo 3",
    "Sora 2",
    "Kling AI",
    "Hailuo AI",
    "PixVerse AI",
    "Runway",
    "Vidu AI",
    "Luma AI",
    "Pika AI",
    "Seedance",
    "Wan AI",
    "Hunyuan",
  ];

  const imageModels = [
    "Nano Banana",
    "Midjourney",
    "Recraft",
    "Ideogram",
    "Stable Diffusion",
    "Flux AI",
    "Seedream",
    "Dall-E",
    "Imagen",
    "GPT-4o",
    "Flux Kontext",
    "Qwen Image",
    "Wan AI",
  ];

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden w-full">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 w-full">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)",
          }}
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header with Anime Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Premium Models</span>
            <Sparkles className="w-6 h-6 text-pink-400" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              ALL the Great AI Video & Image Models
            </span>
            <br />
            <span className="text-white">in ONE Place!</span>
          </h2>
          <motion.div
            className="flex items-center justify-center gap-2 mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-muted-foreground text-lg">Powered by cutting-edge AI technology</span>
            <Zap className="w-5 h-5 text-yellow-400" />
          </motion.div>
        </motion.div>

        {/* Horizontal Scrolling Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Sparkles className="w-5 h-5 text-purple-400" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-black text-white">
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Platform Gallery
                </span>
              </h3>
            </div>
            <Link
              to="/dashboard/feed"
              className="hidden md:flex items-center gap-2 text-white/80 hover:text-white transition-colors group text-sm font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Horizontal Scrolling Container */}
          <div className="relative overflow-hidden">
            {/* Gradient Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a1a] via-[#0a0a1a]/80 to-transparent z-10 pointer-events-none" />
            
            {/* Scrolling Content */}
            <div
              ref={scrollRef}
              className="flex overflow-x-auto scrollbar-hide pb-4"
              style={{
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {duplicatedContent.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="relative group cursor-pointer flex-shrink-0"
                  onClick={() => navigate("/dashboard/feed")}
                >
                  {/* Content Card - Curved with bold white border */}
                  <div className="relative w-56 h-40 md:w-72 md:h-48 overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-[#0a0a0a]/95 to-[#1a1a1a]/95 backdrop-blur-md shadow-xl">
                    {/* Image/Video */}
                    <div className="relative w-full h-full">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Video Play Icon */}
                      {item.type === "video" && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-10 h-10 bg-white/25 backdrop-blur-md flex items-center justify-center border-2 border-white/60">
                            <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Title - Always Visible */}
                      <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                        <div className="flex items-center gap-1">
                          {item.type === "video" ? (
                            <Video className="w-2.5 h-2.5 text-white/80 flex-shrink-0" />
                          ) : (
                            <ImageIcon className="w-2.5 h-2.5 text-white/80 flex-shrink-0" />
                          )}
                          <p className="text-white font-semibold text-[10px] truncate leading-tight">{item.title}</p>
                        </div>
                      </div>
                    </div>
                    
                    
                    {/* Type Badge */}
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold border border-white/50">
                      {item.type === "video" ? "VIDEO" : "IMAGE"}
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two Cards */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* AI Video Generators Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group h-full flex"
          >
            {/* Card Content */}
            <div className="relative w-full bg-gradient-to-br from-[#0a0a0a]/90 via-[#1a1a1a]/90 to-[#0a0a0a]/90 backdrop-blur-xl border-4 border-white rounded-3xl p-8 lg:p-10 shadow-2xl flex flex-col">
              
              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-white/30 shadow-lg"
                >
                  <Video className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                    AI Video Generators
                  </h3>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400/50" />
                    <span className="text-sm text-white/70">Premium Models</span>
                  </div>
                </div>
              </div>

              <p className="text-white/80 mb-6 leading-relaxed">
                With AEKO AI video generator, you can tap into our flagship AEKO 1.6 video model and all top-tier video models in the industry, like:
              </p>

              {/* Model List */}
              <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                {videoModels.map((model) => (
                  <span key={model} className="text-white font-semibold text-base px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                    {model}
                  </span>
                ))}
              </div>

              {/* Button */}
              <Link to="/dashboard/tools/video" className="mt-auto">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full group gap-2 px-8 py-6 text-lg"
                >
                  AI Video Generator
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* AI Image Generators Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group h-full flex"
          >
            {/* Card Content */}
            <div className="relative w-full bg-gradient-to-br from-[#0a0a0a]/90 via-[#1a1a1a]/90 to-[#0a0a0a]/90 backdrop-blur-xl border-4 border-white rounded-3xl p-8 lg:p-10 shadow-2xl flex flex-col">
              
              {/* Icon and Title */}
              <div className="flex items-start gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border-2 border-white/30 shadow-lg"
                >
                  <ImageIcon className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-2xl md:text-3xl font-black text-white mb-2">
                    AI Image Generators
                  </h3>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-pink-400/50" />
                    <span className="text-sm text-white/70">Premium Models</span>
                  </div>
                </div>
              </div>

              <p className="text-white/80 mb-6 leading-relaxed">
                AEKO AI image generator also allows you to choose from a selection of leading image models. They include:
              </p>

              {/* Model List */}
              <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                {imageModels.map((model) => (
                  <span key={model} className="text-white font-semibold text-base px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                    {model}
                  </span>
                ))}
              </div>

              {/* Button */}
              <Link to="/dashboard/tools/image" className="mt-auto">
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full group gap-2 px-8 py-6 text-lg"
                >
                  AI Image Generator
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AllModelsSection;
