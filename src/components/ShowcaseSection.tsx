import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Play, Image as ImageIcon, Video, MessageSquare, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShowcaseSection = () => {
  const showcaseContent = [
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
      title: "AI Generated Art",
      icon: ImageIcon,
    },
    {
      type: "video",
      url: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80",
      title: "AI Video Creation",
      icon: Video,
    },
    {
      type: "chat",
      url: null,
      title: "AI Chat Assistant",
      icon: MessageSquare,
      messages: [
        { role: "user", text: "Create a logo for my startup" },
        { role: "assistant", text: "I'll generate a modern logo design for you!" },
      ],
    },
    {
      type: "image",
      url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
      title: "Creative Designs",
      icon: ImageIcon,
    },
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
          {/* Left Side - Mixed Content Grid (Images, Videos, AI Chat) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {showcaseContent.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative group"
                >
                  <div
                    className="relative overflow-hidden rounded-3xl border-4 border-border dark:border-white bg-card"
                    style={{
                      boxShadow: "0 0 20px rgba(0, 0, 0, 0.1), 0 0 40px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    {/* Image/Video Content */}
                    {item.type !== "chat" && item.url && (
                      <>
                        <img
                          src={item.url}
                          alt={item.title}
                          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {/* Video Play Overlay */}
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                            <motion.div
                              className="w-16 h-16 rounded-full bg-white/90 dark:bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Play className="w-8 h-8 text-purple-600 dark:text-purple-500 ml-1" fill="currentColor" />
                            </motion.div>
                          </div>
                        )}
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-background/90 dark:bg-black/80 backdrop-blur-sm border border-border dark:border-white/20 flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-foreground dark:text-white uppercase">
                            {item.type}
                          </span>
                        </div>
                      </>
                    )}

                    {/* AI Chat Interface */}
                    {item.type === "chat" && (
                      <div className="w-full h-64 p-4 flex flex-col gap-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
                        {/* Chat Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-border/30 dark:border-white/10">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Bot className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground dark:text-white">AI Assistant</p>
                            <p className="text-xs text-muted-foreground dark:text-white/60">Online</p>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                          {item.messages?.map((msg, msgIndex) => (
                            <motion.div
                              key={msgIndex}
                              initial={{ opacity: 0, x: msg.role === "user" ? 10 : -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: msgIndex * 0.2 }}
                              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                              {msg.role === "assistant" && (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                                  <Bot className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <div
                                className={`max-w-[80%] rounded-lg px-3 py-2 text-xs ${
                                  msg.role === "user"
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-card dark:bg-white/10 border border-border dark:border-white/20 text-foreground dark:text-white"
                                }`}
                              >
                                {msg.text}
                              </div>
                              {msg.role === "user" && (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                  <User className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>

                        {/* Type Badge */}
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-background/90 dark:bg-black/80 backdrop-blur-sm border border-border dark:border-white/20 flex items-center gap-2">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold text-foreground dark:text-white uppercase">
                            {item.type}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Hover Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-sm font-semibold text-white">{item.title}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-border dark:border-white/30 mb-4"
            >
              <Sparkles className="w-8 h-8 text-purple-600 dark:text-white" />
            </motion.div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground dark:text-white mb-4 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-foreground via-purple-600 to-pink-600 dark:from-white dark:via-purple-200 dark:to-pink-200 bg-clip-text text-transparent">
                Showcase Your
              </span>
              <br />
              <span className="text-foreground dark:text-white">Creative Work</span>
            </h2>

            {/* Profile Images */}
            <div className="flex items-center gap-2 mb-4">
              {profileImages.map((profile, index) => (
                <motion.img
                  key={index}
                  src={profile}
                  alt={`Profile ${index + 1}`}
                  className="w-10 h-10 rounded-full border-2 border-border dark:border-white/50 object-cover"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  style={{ marginLeft: index > 0 ? "-8px" : "0" }}
                />
              ))}
              <span className="text-muted-foreground dark:text-white/80 text-sm ml-2">+2.5K creators</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8 mb-6">
              <div>
                <div className="text-3xl font-black text-foreground dark:text-white">10M+</div>
                <div className="text-sm text-muted-foreground dark:text-white/70">Generations</div>
              </div>
              <div>
                <div className="text-3xl font-black text-foreground dark:text-white">50K+</div>
                <div className="text-sm text-muted-foreground dark:text-white/70">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-black text-foreground dark:text-white">99.9%</div>
                <div className="text-sm text-muted-foreground dark:text-white/70">Uptime</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground dark:text-white/80 leading-relaxed mb-8">
              Join thousands of creators, designers, and developers who are using AEKO to bring their creative visions to life. 
              Generate stunning images, create amazing videos, and build powerful AI agents—all in one platform.
            </p>

            {/* CTA Button */}
            <Button
              size="lg"
              className="group gap-2 px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-2 border-border dark:border-white/30"
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
