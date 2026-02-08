import { motion } from "framer-motion";

const videoCards = [
  {
    id: 1,
    label: "T2Video",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
  },
  {
    id: 2,
    label: "Editing",
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
  },
  {
    id: 3,
    label: "Upscale",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
  },
  {
    id: 4,
    label: "Motion",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
  },
];

const VideoToolsFeaturesSection = () => {

  return (
    <section className="py-14 lg:py-18 relative overflow-x-clip w-full bg-background">
      <div className="container mx-auto relative z-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Panel - Text and Feature Boxes */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            className="space-y-6"
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-muted-foreground">
              EXPLORE AI VIDEO
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground tracking-tight leading-tight">
              Video Tool{" "}
              <span className="gradient-text">
                Features
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Discover a suite of professional-grade, AI-powered video tools to empower your creativity and supercharge your workflow. From text-to-video to upscaling, we have it all.
            </p>
            
            {/* Two Feature Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">Text to Video</h3>
                <p className="text-sm text-muted-foreground">Generate stunning videos from text prompts.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-6 hover:bg-card/70 transition-all duration-300"
              >
                <h3 className="text-xl font-bold text-foreground mb-2">Video to Video</h3>
                <p className="text-sm text-muted-foreground">Transform existing videos with AI styles.</p>
              </motion.div>
            </div>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg transition-all duration-300"
            >
              Start Creating Now
            </motion.button>
          </motion.div>

          {/* Right Panel - 2x2 Grid of Cards */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
            className="grid grid-cols-2 gap-4"
          >
            {videoCards.map((card, index) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.4, 0.3, 0, 1],
                }}
                whileHover={{ scale: 1.05 }}
                className="group relative aspect-square cursor-pointer"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.label}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <span className="text-white font-semibold text-sm tracking-wide">
                      {card.label}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoToolsFeaturesSection;
