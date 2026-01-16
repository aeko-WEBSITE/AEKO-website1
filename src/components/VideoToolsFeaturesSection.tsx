import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef } from "react";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleCards = 4;
  const maxIndex = Math.max(0, videoModels.length - visibleCards);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const displayedModels = videoModels.slice(currentIndex, currentIndex + visibleCards);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden w-full">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-12">
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-2 tracking-tight">
              Video Tool{" "}
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Feature
              </span>
          </h2>
        </motion.div>

          {/* Navigation Arrows */}
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
        >
          <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`w-12 h-12 rounded-full border-2 border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center transition-all ${
                currentIndex === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/10 hover:border-white/50 cursor-pointer"
            }`}
          >
              <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
              onClick={handleNext}
              disabled={currentIndex >= maxIndex}
              className={`w-12 h-12 rounded-full border-2 border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center transition-all ${
                currentIndex >= maxIndex
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-white/10 hover:border-white/50 cursor-pointer"
            }`}
          >
              <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </motion.div>
        </div>

        {/* Cards Grid */}
        <div ref={scrollRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Card Container */}
              <div className="relative bg-gradient-to-br from-[#0a0a0a]/90 to-[#1a1a1a]/90 backdrop-blur-md border-4 border-white overflow-hidden shadow-xl">
                {/* Image */}
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={model.image}
                    alt={model.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
                
                {/* Content */}
                <div className="p-6 bg-gradient-to-b from-[#0a0a0a]/95 to-[#1a1a1a]/95">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all">
                    {model.title}
                  </h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {model.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VideoToolsFeaturesSection;
