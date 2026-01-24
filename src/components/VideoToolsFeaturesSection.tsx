import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const videoModels = [
  {
    id: 1,
    title: "Text2Video",
    description: "Generate stunning videos from text prompts using advanced AI video models.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  },
  {
    id: 2,
    title: "Video2Video",
    description: "Transform and modify existing videos with AI-powered video-to-video conversion.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
  },
  {
    id: 3,
    title: "Video Editing",
    description: "Edit and enhance videos with AI-powered editing tools and effects.",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
  },
  {
    id: 4,
    title: "Video Upscale",
    description: "Enhance video resolution and quality with AI-powered upscaling technology.",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
  },
  {
    id: 5,
    title: "Video Background Removal",
    description: "Remove or replace video backgrounds with precision and accuracy.",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
  },
  {
    id: 6,
    title: "Video Generation",
    description: "Create professional videos from images, text, or other media sources.",
    image: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&q=80",
  },
  {
    id: 7,
    title: "Video Content Creation",
    description: "Create engaging video content for social media, marketing, and more.",
    image: "https://images.unsplash.com/photo-1604076913837-52ab5f6a3b5e?w=800&q=80",
  },
];

const VideoToolsFeaturesSection = () => {
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
        
        // Calculate the width of one set of models
        const singleSetWidth = scrollWidth / 2;
        
        if (scrollLeft >= singleSetWidth - 5) {
          // Seamlessly loop back to start (invisible jump)
          scrollElement.scrollTo({ left: scrollLeft - singleSetWidth, behavior: "auto" });
        } else {
          // Continue scrolling smoothly - faster speed
          scrollElement.scrollBy({ left: 1.5, behavior: "auto" });
        }
      };

      autoScrollRef.current = window.setInterval(autoScroll, 16); // ~60fps
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
      const cardWidth = scrollRef.current.scrollWidth / videoModels.length;
      scrollRef.current.scrollBy({
        left: -cardWidth * 4,
        behavior: "smooth",
      });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.scrollWidth / videoModels.length;
      scrollRef.current.scrollBy({
        left: cardWidth * 4,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-28 lg:py-36 relative overflow-x-clip w-full bg-white dark:bg-black">
      {/* Nice animated mesh background */}
      <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen animate-pulse-slow">
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 20% 60%, rgba(148,87,235,0.16) 0, transparent 90%), radial-gradient(ellipse at 75% 30%, rgba(236,72,153,0.13) 0, transparent 80%), radial-gradient(circle at 60% 85%, rgba(96,165,250,0.13) 0, transparent 90%)",
          }}
        />
      </div>
      <div className="container mx-auto relative z-10">
        {/* Header + Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          >
            <span className="inline-block mb-2 font-semibold tracking-widest uppercase text-xs text-[#A78BFA]/90 dark:text-[#A78BFA]/90 letter-spacing-wide">
              Explore AI Video
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black dark:text-white tracking-tight flex flex-wrap items-center leading-tight">
              <span>
                Video Tool{" "}
                <span
                  className="bg-gradient-to-r from-[#a78bfa] via-[#f472b6] to-[#60a5fa] bg-clip-text text-transparent animate-gradient-move"
                >
                  Features
                </span>
              </span>
            </h2>
            <p className="mt-5 text-base md:text-lg text-black/70 dark:text-white/60 max-w-xl">
              Discover a suite of professional-grade, AI-powered video tools to empower your creativity and supercharge your workflow.
            </p>
          </motion.div>
          {/* Navigation Arrows */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            className="flex items-center gap-4"
          >
            <button
              aria-label="Previous"
              onClick={handlePrev}
              disabled={!canScrollLeft}
              className={`w-14 h-14 rounded-full border-2 border-white/20 shadow-xl hover:shadow-2xl bg-gradient-to-tr from-black/70 to-[#16161c]/90 flex items-center justify-center transition-all duration-200 ring-0 outline-none group
                ${
                  !canScrollLeft
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-105 hover:border-[#A78BFA] hover:border-2"
                }`}
            >
              <ChevronLeft className="w-7 h-7 text-white group-hover:text-[#A78BFA] transition" />
            </button>
            <button
              aria-label="Next"
              onClick={handleNext}
              disabled={!canScrollRight}
              className={`w-14 h-14 rounded-full border-2 border-white/20 shadow-xl hover:shadow-2xl bg-gradient-to-tr from-black/70 to-[#232336]/90 flex items-center justify-center transition-all duration-200 ring-0 outline-none group
                ${
                  !canScrollRight
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:scale-105 hover:border-[#F472B6] hover:border-2"
                }`}
            >
              <ChevronRight className="w-7 h-7 text-white group-hover:text-[#F472B6] transition" />
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
            {/* Duplicate models for infinite scroll */}
            {[...videoModels, ...videoModels].map((model, index) => (
              <motion.div
                key={`${model.id}-${index}`}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: (index % videoModels.length) * 0.08,
                  ease: [0.4, 0.3, 0, 1],
                }}
                className="group relative cursor-pointer flex-shrink-0 w-[320px] md:w-[360px]"
              >
                {/* Card with animated colorful border */}
                <div className="relative bg-white dark:bg-gradient-to-br dark:from-[#13131A] dark:via-[#191924] dark:to-[#13141a] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md border border-gray-200 dark:border-transparent">
                  {/* Animated colorful rotating border */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none z-0"
                    style={{
                      padding: "3px",
                      background: "conic-gradient(from 0deg, #a78bfa, #f472b6, #60a5fa, #e879f9, #a78bfa)",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  {/* Image */}
                  <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-t-lg">
                    <img
                      src={model.image}
                      alt={model.title}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[1.5deg] z-10"
                      draggable={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent backdrop-blur-sm z-20 rounded-lg" />
                    <div className="absolute left-3 top-3 flex space-x-2 z-30">
                      <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-tr from-pink-500 via-purple-400 to-blue-400 animate-pulse shadow-lg"></span>
                    </div>
                  </div>
                  {/* Card Content */}
                  <div className="relative p-6 z-10 flex flex-col items-start">
                    <h3 className="text-2xl font-bold text-black dark:text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                      {model.title}
                    </h3>
                    <p className="text-base text-black/70 dark:text-white/70 leading-relaxed mb-2 min-h-[48px]">
                      {model.description}
                    </p>
                    <span className="mt-auto inline-flex text-xs px-3 py-1 rounded-full bg-black dark:bg-black  text-[#a78bfa] font-semibold tracking-wide uppercase shadow-inner group-hover:bg-gradient-to-r group-hover:from-pink-500/30 group-hover:to-purple-400/20 transition">
                      AI powered
                    </span>
                  </div>
                  {/* Extra animated rainbow glow on hover */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-2xl z-[2] opacity-0 group-hover:opacity-90 transition-all duration-700 bg-gradient-to-br from-[#a78bfa55] via-[#f472b655] to-[#60a5fa60] blur-3xl"
                    initial={false}
                    animate={{
                      opacity: [0, 0.8, 0.9, 0.8, 0],
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    style={{ mixBlendMode: "plus-lighter" }}
                  />
                </div>
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
        @keyframes gradient-move {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default VideoToolsFeaturesSection;
