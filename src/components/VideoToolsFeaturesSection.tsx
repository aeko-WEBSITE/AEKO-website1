import { motion } from "framer-motion";
import { useRef } from "react";

const videoCards = [
  { id: 1, label: "T2Video", video: "/feeds/video1.mp4" },
  { id: 2, label: "Editing", video: "/feeds/video4.mp4" },
  { id: 3, label: "Upscale", video: "/feeds/video7.mp4" },
  { id: 4, label: "Motion", video: "/feeds/video14.mp4" },
];

// Sub-component for individual Video Cards
const VideoCard = ({ card, index }) => {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay prevented:", err);
      });
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      // Optional: videoRef.current.currentTime = 0; // Reset to start on leave
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0.3, 0, 1],
      }}
      whileHover={{ scale: 1.05 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative aspect-square cursor-pointer"
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-muted">
        <video
          ref={videoRef}
          src={card.video}
          loop
          muted
          playsInline
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-white font-semibold text-sm tracking-wide">
            {card.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const VideoToolsFeaturesSection = () => {
  return (
    <section className="py-14 lg:py-18 relative overflow-x-clip w-full bg-background dark:bg-transparent">
      <div className="container mx-auto relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Panel */}
          <div className="space-y-6">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              EXPLORE AI VIDEO
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight">
              Video Tool <span className="gradient-text">Features</span>
            </h2>
            <p className="text-muted-foreground max-w-xl">
              Hover over the cards to preview our AI-powered video capabilities in real-time.
            </p>
            
            {/* CTA and Features as before... */}
          </div>

          {/* Right Panel - Grid */}
          <div className="grid grid-cols-2 gap-4">
            {videoCards.map((card, index) => (
              <VideoCard key={card.id} card={card} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoToolsFeaturesSection;