import { motion } from "framer-motion";
import { Video, Image as ImageIcon, ArrowRight, Sparkles, Zap, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";

const AllModelsSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Professional smooth infinite scroll functionality
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollPosition = 0;
    const scrollSpeed = 1.5; // Smooth, professional scrolling speed
    let animationFrameId: number;
    let isPaused = false;
    let lastTime = performance.now();

    const autoScroll = (currentTime: number) => {
      if (!scrollContainer || isPaused) {
        animationFrameId = requestAnimationFrame(autoScroll);
        return;
      }

      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // Smooth scrolling based on time delta for consistent speed
      const scrollDelta = (scrollSpeed * deltaTime) / 16; // Normalize to 60fps
      
      // Since we triple-duplicated content, reset at 1/3 of scrollWidth for seamless loop
      const singleSetWidth = scrollContainer.scrollWidth / 3;
      const maxScroll = singleSetWidth;
      
      if (scrollPosition < maxScroll) {
        scrollPosition += scrollDelta;
        scrollContainer.scrollLeft = scrollPosition;
      } else {
        // Smooth reset to start for seamless infinite loop
        scrollPosition = 0;
        scrollContainer.scrollLeft = 0;
      }
      
      animationFrameId = requestAnimationFrame(autoScroll);
    };
    
    // Pause on hover for better UX
    const handleMouseEnter = () => {
      isPaused = true;
    };
    
    const handleMouseLeave = () => {
      isPaused = false;
      lastTime = performance.now();
    };
    
    scrollContainer.addEventListener('mouseenter', handleMouseEnter);
    scrollContainer.addEventListener('mouseleave', handleMouseLeave);
    
    // Start auto-scroll
    animationFrameId = requestAnimationFrame(autoScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
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

  // Triple duplicate content for ultra-smooth seamless infinite loop
  const duplicatedContent = [...galleryContent, ...galleryContent, ...galleryContent];

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
    <section className="relative overflow-hidden w-full py-16 lg:py-24 bg-background">
      {/* Animated Background Effects - Theme Aware */}
      <div className="absolute inset-0 w-full">
        <motion.div
          className="absolute inset-0 opacity-10 dark:opacity-20"
          style={{
            background: "radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)",
          }}
          animate={{
            opacity: [0.08, 0.15, 0.08],
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
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-card/60 dark:bg-white/5 backdrop-blur-xl border border-border/50 dark:border-white/10 mb-6"
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Premium Models</span>
            <Sparkles className="w-5 h-5 text-pink-600 dark:text-pink-400" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground dark:text-white mb-4 tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-foreground via-purple-600 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
              ALL the Great AI Video & Image Models
            </span>
            <br />
            <span className="text-foreground dark:text-white">in ONE Place!</span>
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
              <h3 className="text-2xl md:text-3xl font-black text-foreground dark:text-white">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Platform Gallery
                </span>
              </h3>
            </div>
            <Link
              to="/dashboard/feed"
              className="hidden md:flex items-center gap-2 text-muted-foreground dark:text-white/80 hover:text-foreground dark:hover:text-white transition-colors group text-sm font-semibold"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Professional Smooth Infinite Scrolling Container */}
          <div className="relative overflow-hidden rounded-3xl bg-card/30 dark:bg-black/20 backdrop-blur-sm border border-border/30 dark:border-white/10 p-4">
            {/* Enhanced Gradient Fade Edges - Theme Aware */}
            <div className="absolute left-0 top-0 bottom-0 w-32 md:w-40 bg-gradient-to-r from-background via-background/90 to-transparent dark:from-[#0a0a0f] dark:via-[#0a0a0f]/90 z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 md:w-40 bg-gradient-to-l from-background via-background/90 to-transparent dark:from-[#0a0a0f] dark:via-[#0a0a0f]/90 z-10 pointer-events-none" />
            
            {/* Smooth Scrolling Content */}
            <div
              ref={scrollRef}
              className="flex overflow-x-hidden scrollbar-hide pb-4 gap-5 md:gap-6"
              style={{
                scrollBehavior: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                willChange: 'scroll-position',
              }}
            >
              {duplicatedContent.map((item, index) => (
                <motion.div
                  key={`${item.id}-${index}`}
                  className="relative group cursor-pointer flex-shrink-0"
                  onClick={() => navigate("/dashboard/feed")}
                  whileHover={{ scale: 1.03, y: -8 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ willChange: 'transform' }}
                >
                  {/* Professional Content Card - Enhanced Design */}
                  <div className="relative w-72 h-80 md:w-96 md:h-[500px] overflow-hidden rounded-2xl border-2 border-border/40 dark:border-white/20 bg-card dark:bg-gradient-to-br dark:from-[#0a0a0a]/95 dark:to-[#1a1a1a]/95 backdrop-blur-xl shadow-lg dark:shadow-2xl transition-all duration-300 group-hover:border-primary/60 dark:group-hover:border-white/40 group-hover:shadow-2xl dark:group-hover:shadow-[0_20px_60px_rgba(124,58,237,0.3)]">
                    {/* Image/Video with smooth hover effect */}
                    <div className="relative w-full h-full overflow-hidden">
                      <motion.img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        loading="lazy"
                      />
                      
                      {/* Gradient Overlay - Theme Aware */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent dark:from-black/80 dark:via-black/20 opacity-80 dark:opacity-60 group-hover:opacity-60 dark:group-hover:opacity-40 transition-opacity duration-300" />
                      
                      {/* Video Play Icon - Enhanced Theme Aware */}
                      {item.type === "video" && (
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center bg-black/50 dark:bg-black/30 group-hover:bg-black/40 dark:group-hover:bg-black/20 transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-white/20 backdrop-blur-xl flex items-center justify-center rounded-full border-3 border-primary/60 dark:border-white/40 group-hover:bg-primary/10 dark:group-hover:bg-white/30 group-hover:border-primary dark:group-hover:border-white/60 transition-all duration-300 shadow-2xl">
                            <Play className="w-10 h-10 md:w-12 md:h-12 text-primary dark:text-white ml-1" fill="currentColor" />
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Title - Enhanced visibility with better styling */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 bg-gradient-to-t from-black/98 via-black/85 to-transparent dark:from-black/95 dark:via-black/80">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${
                            item.type === "video" 
                              ? "bg-red-500/20 dark:bg-red-500/30" 
                              : "bg-blue-500/20 dark:bg-blue-500/30"
                          }`}>
                            {item.type === "video" ? (
                              <Video className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
                            ) : (
                              <ImageIcon className="w-4 h-4 md:w-5 md:h-5 text-white flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-white font-bold text-sm md:text-base truncate leading-tight drop-shadow-lg">{item.title}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Professional Type Badge - Enhanced Theme Aware */}
                    <motion.div 
                      className="absolute top-4 left-4 px-3.5 py-2 bg-background/95 dark:bg-black/80 backdrop-blur-xl text-foreground dark:text-white text-xs font-extrabold border-2 border-border/60 dark:border-white/30 rounded-xl z-10 shadow-xl uppercase tracking-wider"
                      whileHover={{ scale: 1.08 }}
                    >
                      {item.type === "video" ? (
                        <span className="flex items-center gap-1.5">
                          <Video className="w-3.5 h-3.5" />
                          Video
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5" />
                          Image
                        </span>
                      )}
                    </motion.div>
                    
                    {/* Hover Glow Effect - Enhanced Theme Aware */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 dark:from-purple-500/10 dark:via-pink-500/10 dark:to-purple-500/10 blur-2xl" />
                    </div>
                    
                    {/* Shine Effect on Hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "200%" }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>


{/* 
        {/ Two Cards /}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/ AI Video Generators Card /}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group h-full flex"
          >
            {/ Card Content /}
            <div className="relative w-full bg-gradient-to-br from-[#0a0a0a]/90 via-[#1a1a1a]/90 to-[#0a0a0a]/90 backdrop-blur-xl border-4 border-white rounded-3xl p-8 lg:p-10 shadow-2xl flex flex-col">
              
              {/ Icon and Title /}
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

              {/ Model List /}
              <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                {videoModels.map((model) => (
                  <span key={model} className="text-white font-semibold text-base px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                    {model}
                  </span>
                ))}
              </div>

              {/ Button /}
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

          {/ AI Image Generators Card /}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative group h-full flex"
          >
            {/ Card Content /}
            <div className="relative w-full bg-gradient-to-br from-[#0a0a0a]/90 via-[#1a1a1a]/90 to-[#0a0a0a]/90 backdrop-blur-xl border-4 border-white rounded-3xl p-8 lg:p-10 shadow-2xl flex flex-col">
              
              {/ Icon and Title /}
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

              {/ Model List /}
              <div className="flex flex-wrap gap-2 mb-8 flex-grow">
                {imageModels.map((model) => (
                  <span key={model} className="text-white font-semibold text-base px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-default">
                    {model}
                  </span>
                ))}
              </div>

              {/ Button /}
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
        </div> */}



      </div>
    </section>
  );
};

export default AllModelsSection;
