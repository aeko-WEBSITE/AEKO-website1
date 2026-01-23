import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const imageModels = [
  {
    id: 1,
    title: "Text2Image",
    description: "Generate stunning images from text prompts using advanced AI models.",
    image: "https://images.unsplash.com/photo-1604076913837-52ab5f6a3b5e?w=800&q=80",
  },
  {
    id: 2,
    title: "Image2Image",
    description: "Transform and modify existing images with AI-powered image-to-image conversion.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
  },
  {
    id: 3,
    title: "Background Removal",
    description: "Instantly remove backgrounds from images with precision and accuracy.",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
  },
  {
    id: 4,
    title: "Avatar Generation",
    description: "Create unique AI-generated avatars and profile pictures in various styles.",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
  },
  {
    id: 5,
    title: "Upscale",
    description: "Enhance image resolution and quality with AI-powered upscaling technology.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  },
  {
    id: 6,
    title: "Watermark Removal",
    description: "Remove watermarks and unwanted elements from images seamlessly.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
  },
  {
    id: 7,
    title: "Content Creation",
    description: "Create engaging visual content for social media, marketing, and more.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
  },
];

const accentGradient =
  "from-[#9333ea]/90 via-[#c026d3]/80 to-[#facc15]/80";

const glassBg =
  "bg-gradient-to-br from-white/10 via-slate-900/50 to-black/60 shadow-2xl backdrop-blur-xl";

const ImageToolsFeaturesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoScrollRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollability();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      return () => {
        scrollElement.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, []);

  // Sync ref with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // Auto-scroll functionality
  useEffect(() => {
    // Clear any existing interval
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current);
      autoScrollRef.current = null;
    }

    if (!scrollRef.current || isPaused) return;

    const scrollElement = scrollRef.current;
    
    const startAutoScroll = () => {
      if (!scrollElement || isPausedRef.current) return;

      const autoScroll = () => {
        if (!scrollElement || isPausedRef.current) return;
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollElement;
        const maxScroll = scrollWidth - clientWidth;
        
        if (maxScroll <= 0) return; // No scroll needed
        
        if (scrollLeft >= maxScroll - 5) {
          // Reset to start when reaching the end
          scrollElement.scrollTo({ left: 0, behavior: "auto" });
        } else {
          // Continue scrolling smoothly - faster speed
          scrollElement.scrollBy({ left: 1.5, behavior: "auto" });
        }
      };

      autoScrollRef.current = window.setInterval(autoScroll, 16); // ~60fps for smoothness
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(startAutoScroll, 100);

    return () => {
      clearTimeout(timeoutId);
      if (autoScrollRef.current) {
        clearInterval(autoScrollRef.current);
        autoScrollRef.current = null;
      }
    };
  }, [isPaused]);

  const handlePrev = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / imageModels.length;
      scrollRef.current.scrollBy({
        left: -cardWidth * 4,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / imageModels.length;
      scrollRef.current.scrollBy({
        left: cardWidth * 4,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="relative py-28 md:py-36 w-full overflow-x-clip bg-white dark:bg-black">
      {/* Animated mesh and sparkles */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.16 }}
        transition={{ duration: 1 }}
        style={{
          background: `
            radial-gradient(900px 500px at 20% 30%, rgba(168,85,247,0.26) 0px, transparent 60%),
            radial-gradient(1200px 800px at 80% 90%, rgba(236,72,153,0.22) 0px, transparent 80%),
            radial-gradient(750px 550px at 65% 20%, rgba(250,204,21,0.12) 0px, transparent 70%)
          `,
        }}
      />
      <div className="container mx-auto px-4 lg:px-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[2.8rem] md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight text-black dark:text-white drop-shadow-lg mb-2 relative">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="inline-block w-8 h-8 text-yellow-400 animate-pulse drop-shadow-[0_0_12px_#face19]" />
                Image Tool{" "}
                <span
                  className={`bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
                  Showcase
                </span>
              </span>
            </h2>
            <div className="hidden md:block">
              <p className="mt-2 ml-1 text-lg font-light text-black/70 dark:text-white/70 max-w-3xl">
                Discover how cutting-edge AI transforms your creative workflow.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 self-start md:self-center"
          >
            <button
              onClick={handlePrev}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full border-2 border-purple-400/50 ${glassBg} transition-all duration-150 flex items-center justify-center ring-2 ring-transparent focus:ring-purple-400/30 shadow-lg group
                ${!canScrollLeft
                  ? "opacity-45 cursor-not-allowed"
                  : "hover:border-yellow-400/70 hover:scale-110 cursor-pointer"}
              `}
            >
              <ChevronLeft className="w-7 h-7 text-white drop-shadow-[0_2px_10px_#7c3aed]" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full border-2 border-purple-400/50 ${glassBg} transition-all duration-150 flex items-center justify-center ring-2 ring-transparent focus:ring-purple-400/30 shadow-lg group
                ${!canScrollRight
                  ? "opacity-45 cursor-not-allowed"
                  : "hover:border-yellow-400/70 hover:scale-110 cursor-pointer"}
              `}
            >
              <ChevronRight className="w-7 h-7 text-white drop-shadow-[0_2px_10px_#7c3aed]" />
            </button>
          </motion.div>
        </div>

        {/* Cards - Horizontal Scrollable */}
        <div className="relative">
          <div
            ref={scrollRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="flex gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{
              scrollBehavior: "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {imageModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.54, delay: index * 0.14 }}
                className="group relative rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-gradient-to-br dark:from-[#201873]/70 dark:via-[#161135]/70 dark:to-[#120c3f]/80 backdrop-blur-lg transition-transform duration-300 hover:scale-[1.035] hover:-translate-y-1 cursor-pointer flex-shrink-0 w-[320px] md:w-[360px] border border-gray-200 dark:border-transparent"
                style={{ zIndex: 1 }}
              >
                {/* Animated Colorful Gradient Border */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-3xl z-20"
                  style={{
                    padding: "3px",
                    background: "conic-gradient(from 110deg, #7C3AED, #F472B6, #FACC15, #22D3EE, #A21CAF, #F472B6, #7C3AED)",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    boxShadow: "0 2px 16px 0 rgba(156, 39, 176, 0.15)",
                    zIndex: 2,
                  }}
                  initial={{ opacity: 0.7, rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 9 + index * 0.5,
                    ease: "linear"
                  }}
                />
                <div className="relative z-20 flex flex-col h-full">
                  <div className="relative w-full h-60 overflow-hidden flex-0">
                    <img
                      src={model.image}
                      alt={model.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-lg"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent rounded-lg" />
                    <div className="absolute top-5 right-5">
                      <span className="inline-block rounded-full bg-gradient-to-br from-yellow-400 via-pink-400 to-purple-500 p-[2.5px] animate-pulse shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-end p-6 pb-7 bg-white/50 dark:bg-gradient-to-b dark:from-white/5 dark:via-[#241e48]/80 dark:to-[#15132dad]/90 rounded-b-3xl backdrop-blur-[1.5px]">
                    <h3
                      className="text-2xl font-semibold mb-2 text-black dark:text-white tracking-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:via-pink-400 group-hover:to-purple-500 group-hover:bg-clip-text transition-all duration-300"
                    >
                      {model.title}
                    </h3>
                    <p className="text-base text-black/80 dark:text-white/85 leading-relaxed mb-1 group-hover:text-black/90 dark:group-hover:text-white/95">
                      {model.description}
                    </p>
                  </div>
                </div>
                {/* Extra animated border highlight for cool effect */}
                <motion.div
                  className="absolute inset-0 z-30 pointer-events-none rounded-3xl"
                  style={{
                    background: "linear-gradient(95deg,rgba(124,58,237,.04) 20%,rgba(236,72,153,.08) 70%,rgba(250,204,21,.05) 100%)",
                    mixBlendMode: "screen",
                    filter: "blur(4.5px)",
                  }}
                  initial={{ opacity: 0.8 }}
                  animate={{ opacity: [0.8, 0.6, 0.9, 0.8] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 3.5 + index * 0.22,
                    delay: index * 0.24
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      {/* Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default ImageToolsFeaturesSection;
