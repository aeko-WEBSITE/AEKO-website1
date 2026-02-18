import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import logoDark from "@/assets/logo_light.jpeg";
import logoLight from "@/assets/logo_dark.jpeg";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
  href?: string;
}

const Logo = ({ size = "md", showText = false, className = "", href = "/" }: LogoProps) => {
  const sizeClasses = {
    sm: "w-6 h-6 md:w-7 md:h-7",
    md: "w-8 h-8 md:w-9 md:h-9",
    lg: "w-12 h-12 md:w-14 md:h-14",
  };

  const containerSizeClasses = {
    sm: "w-7 h-7 md:w-8 md:h-8",
    md: "w-8 h-8 md:w-9 md:h-9",
    lg: "w-12 h-12 md:w-14 md:h-14",
  };

  return (
    <motion.div
      className={`flex items-center gap-2 flex-shrink-0 ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link to={href} className="flex items-center gap-2">
        <div className={`relative ${containerSizeClasses[size]} flex items-center justify-center`}>
          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              padding: '2px',
              background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.8), rgba(59, 130, 246, 0.8), rgba(34, 211, 238, 0.8), rgba(236, 72, 153, 0.8))',
              backgroundSize: '200% 200%',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
          {/* Logo Container */}
          <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden bg-white dark:bg-white/95 shadow-md ring-2 ring-black/10 dark:ring-white/20 flex items-center justify-center p-0`}>

          <img
            src={logoDark}
            alt="AEKO"
            className="w-full h-full object-cover object-center block dark:hidden"
          />

          <img
            src={logoLight}
            alt="AEKO"
            className="w-full h-full object-cover object-center hidden dark:block"
          />

          </div>
        </div>
        {showText && (
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm md:text-base font-bold text-foreground">AEKO.</span>
            <motion.span
              className="text-sm md:text-base font-bold"
              style={{
                background: 'linear-gradient(135deg, #7C3AED, #3B82F6, #22D3EE, #22C55E, #FACC15, #EC4899, #7C3AED)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              AI
            </motion.span>
          </div>
        )}
      </Link>
    </motion.div>
  );
};

export default Logo;

