import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShowcaseSection = () => {
  const showcaseImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80",
  ];

  const profileImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&q=80",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80",
  ];

  return (
    <section className="py-14 lg:py-12 relative overflow-hidden w-full">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {showcaseImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div
                  className="relative overflow-hidden rounded-3xl"
                  style={{
                    border: "5px solid white",
                    boxShadow: "0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <img
                    src={image}
                    alt={`Showcase ${index + 1}`}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Sparkle Icon */}
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-white/30 mb-4"
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                Showcase Your
              </span>
              <br />
              <span className="text-white">Creative Work</span>
            </h2>

            {/* Profile Images */}
            <div className="flex items-center gap-2 mb-4">
              {profileImages.map((profile, index) => (
                <motion.img
                  key={index}
                  src={profile}
                  alt={`Profile ${index + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-white/50 object-cover"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                />
              ))}
              <span className="text-white/80 text-sm ml-2">+2.5K creators</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-6">
              <div>
                <div className="text-3xl font-black text-white">10M+</div>
                <div className="text-sm text-white/70">Generations</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">50K+</div>
                <div className="text-sm text-white/70">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white">99.9%</div>
                <div className="text-sm text-white/70">Uptime</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-white/80 leading-relaxed mb-8">
              Join thousands of creators, designers, and developers who are using AEKO to bring their creative visions to life. 
              Generate stunning images, create amazing videos, and build powerful AI agents—all in one platform.
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              className="group gap-2 px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-2 border-white/30"
            >
              Start Creating Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ShowcaseSection;
