import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Apple, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import Logo from "@/components/Logo";

// Video Configuration
const VIDEO_PLAYLIST = [
  {
    src: "/feeds/video19.mp4",
    title: "AI-Powered Intelligence",
    description: "Experience the next generation of neural processing. Our agents analyze data in real-time."
  },
  {
    src: "/feeds/video20.mp4",
    title: "Seamless Integration",
    description: "Connect your entire workflow with a single click. Automate complex tasks with precision."
  }
];

const AuthSignIn = () => {
  const navigate = useNavigate();
  const { login, register, refreshUser } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Video State Management
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEO_PLAYLIST.length);
  };

  // Function to slow down video
  const setSlowMotion = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.playbackRate = 0.5; // 50% speed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isSignUp && !username) {
      toast.error("Please enter a username");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        // Register
        await register(email, username, password);
        toast.success("Account created successfully!");
        navigate("/dashboard");
      } else {
        // Login
        await login(email, password);
        toast.success("Logged in successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // OAuth functionality - commented out for now
  // const handleGoogleSignIn = async () => {
  //   try {
  //     setIsLoading(true);
  //     // Import authAPI for Google login since it's a special case
  //     const { authAPI } = await import("@/lib/api");
  //     const result = await authAPI.googleLogin();
  //     // If redirectUrl is provided, the API will redirect automatically
  //     // Otherwise, check if we got tokens directly
  //     if (result.accessToken) {
  //       // Refresh user from context
  //       refreshUser();
  //       // Dispatch event to update UI
  //       window.dispatchEvent(new Event('auth-storage-change'));
  //       toast.success("Logged in with Google!");
  //       navigate("/dashboard");
  //     }
  //   } catch (error: any) {
  //     toast.error(error.message || "Google sign-in failed. Please try again.");
  //     setIsLoading(false);
  //   }
  // };

  const currentVideo = VIDEO_PLAYLIST[currentVideoIndex];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Login/Signup UI */}
      <div className="w-full lg:w-[480px] bg-card flex flex-col p-8 lg:p-8 relative z-10 overflow-hidden border-r border-border">
        {/* Animated Background Glow Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <div className="relative z-10 flex flex-col h-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 relative z-10"
        >
          <Logo size="lg" showText={true} href="/" />
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-foreground text-3xl font-bold mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground text-sm">
            {isSignUp ? "Join AEKO Creative Suite today" : "Sign in to continue to your dashboard"}
          </p>
        </motion.div>

        {/* OAuth Buttons - Commented out for now */}
        {/* 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-3 mb-6"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              className="w-full h-14 bg-secondary hover:bg-secondary/80 border border-border text-foreground justify-start gap-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleSignIn}
            >
              <div className="relative z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span className="font-semibold text-base relative z-10">Google</span>
            </Button>
          </motion.div>
        </motion.div>
        */}

        {/* Email/Password Form - Always Visible */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-5 flex-1"
        >
          {/* Sign In / Sign Up Toggle */}
          <div className="flex gap-2 p-1 bg-secondary rounded-lg border border-border">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 h-10 rounded-md text-sm font-semibold transition-all duration-300 ${
                !isSignUp 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 h-10 rounded-md text-sm font-semibold transition-all duration-300 ${
                isSignUp 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Username Field - Only for Sign Up */}
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 bg-background border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
              />
            </motion.div>
          )}

          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-background border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-background border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Submit Button */}
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "linear",
                }}
              />
              <span className="relative z-10">
                {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
              </span>
            </Button>
          </motion.div>
        </motion.form>

        {/* Need help link */}
        <div className="pt-4">
          <Link to="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 inline-flex items-center gap-1 group">
            Need help?
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="text-primary"
            >
              →
            </motion.span>
          </Link>
        </div>

        {/* Mobile App Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-auto pt-8"
        >
          <p className="text-foreground text-sm mb-4 font-medium">Soon Available now on iOS and Android</p>
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 bg-primary/20 dark:bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                onClick={() => toast.info("App Store link coming soon")}
              >
                <Apple className="w-5 h-5 mr-2" />
                <span className="text-xs font-semibold">App Store</span>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                variant="outline"
                className="w-full h-12 bg-primary/20 dark:bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
                onClick={() => toast.info("Google Play link coming soon")}
              >
                <Chrome className="w-5 h-5 mr-2" />
                <span className="text-xs font-semibold">Google Play</span>
              </Button>
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>

      {/* Right Panel - Full Screen Video Background with Bottom-Only Shadow */}
      <div className="hidden lg:block flex-1 relative overflow-hidden bg-black">
        {/* Cinematic Video Player */}
        <AnimatePresence mode="popLayout">
          <motion.div 
            key={currentVideoIndex}
            className="absolute inset-0 w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <video
              ref={videoRef}
              src={currentVideo.src}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop={false}
              playsInline
              onEnded={handleVideoEnd}
              onLoadedMetadata={setSlowMotion}
            />
          </motion.div>
        </AnimatePresence>

        {/* The "Black Shadow" Overlay - RESTRICTED TO BOTTOM 50% */}
        <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black via-black/70 to-transparent z-10 pointer-events-none" />
        
        {/* Content Description Area */}
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVideoIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl"
            >
              {/* Badge/Tag */}
              <motion.div 
                className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                <span className="text-xs font-medium text-white tracking-wide uppercase">Now Showing</span>
              </motion.div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                {currentVideo.title}
              </h1>

              {/* Description */}
              <p className="text-lg text-gray-300 leading-relaxed font-light">
                {currentVideo.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Progress Indicators */}
          <div className="flex gap-2 mt-8">
            {VIDEO_PLAYLIST.map((_, idx) => (
              <motion.div
                key={idx}
                className={`h-1 rounded-full overflow-hidden ${
                  idx === currentVideoIndex ? "w-16 bg-white" : "w-4 bg-white/20"
                }`}
                layout
                transition={{ duration: 0.3 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthSignIn;



// import { useState, useRef } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { Mail, Apple, Chrome } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { useAuth } from "@/hooks/use-auth";
// import Logo from "@/components/Logo";

// // Video Configuration
// const VIDEO_PLAYLIST = [
//   {
//     src: "/feeds/video19.mp4",
//     title: "AI-Powered Intelligence",
//     description: "Experience the next generation of neural processing. Our agents analyze data in real-time."
//   },
//   {
//     src: "/feeds/video20.mp4",
//     title: "Seamless Integration",
//     description: "Connect your entire workflow with a single click. Automate complex tasks with precision."
//   }
// ];

// const AuthSignIn = () => {
//   const navigate = useNavigate();
//   const { login, register, refreshUser } = useAuth();
//   const [email, setEmail] = useState("");
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [showEmailForm, setShowEmailForm] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
  
//   // Video State Management
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
//   const videoRef = useRef<HTMLVideoElement>(null);

//   const handleVideoEnd = () => {
//     setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % VIDEO_PLAYLIST.length);
//   };

//   // Function to slow down video
//   const setSlowMotion = (e: React.SyntheticEvent<HTMLVideoElement>) => {
//     e.currentTarget.playbackRate = 0.5; // 50% speed
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!email || !password) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     if (isSignUp && !username) {
//       toast.error("Please enter a username");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       if (isSignUp) {
//         // Register
//         await register(email, username, password);
//         toast.success("Account created successfully!");
//         navigate("/dashboard");
//       } else {
//         // Login
//         await login(email, password);
//         toast.success("Logged in successfully!");
//         navigate("/dashboard");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Authentication failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       setIsLoading(true);
//       // Import authAPI for Google login since it's a special case
//       const { authAPI } = await import("@/lib/api");
//       const result = await authAPI.googleLogin();
//       // If redirectUrl is provided, the API will redirect automatically
//       // Otherwise, check if we got tokens directly
//       if (result.accessToken) {
//         // Refresh user from context
//         refreshUser();
//         // Dispatch event to update UI
//         window.dispatchEvent(new Event('auth-storage-change'));
//         toast.success("Logged in with Google!");
//         navigate("/dashboard");
//       }
//     } catch (error: any) {
//       toast.error(error.message || "Google sign-in failed. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   const currentVideo = VIDEO_PLAYLIST[currentVideoIndex];

//   return (
//     <div className="min-h-screen flex bg-background">
//       {/* Left Panel - Login/Signup UI */}
//       <div className="w-full lg:w-[480px] bg-card flex flex-col p-8 lg:p-8 relative z-10 overflow-hidden border-r border-border">
//         {/* Animated Background Glow Effects */}
//         <div className="absolute inset-0 pointer-events-none overflow-hidden">
//           <motion.div
//             className="absolute -top-20 -left-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl"
//             animate={{
//               x: [0, 50, 0],
//               y: [0, 30, 0],
//               scale: [1, 1.2, 1],
//             }}
//             transition={{
//               duration: 8,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//           <motion.div
//             className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary/10 dark:bg-primary/10 rounded-full blur-3xl"
//             animate={{
//               x: [0, -50, 0],
//               y: [0, -30, 0],
//               scale: [1, 1.2, 1],
//             }}
//             transition={{
//               duration: 10,
//               repeat: Infinity,
//               ease: "easeInOut",
//             }}
//           />
//         </div>
//         <div className="relative z-10 flex flex-col h-full">
//         {/* Logo */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="mb-12 relative z-10"
//         >
//           <Logo size="lg" showText={true} href="/" />
//         </motion.div>

//         {/* Sign up or Login with */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.1 }}
//           className="mb-8"
//         >
//           <h2 className="text-foreground text-2xl font-semibold mb-1">
//             {isSignUp ? "Create your account" : "Sign up or Login with"}
//           </h2>
//           <p className="text-muted-foreground text-sm">
//             {isSignUp ? "Join AEKO Creative Suite today" : "Get started with AI-powered creativity"}
//           </p>
//         </motion.div>

//         {/* Login Options */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.2 }}
//           className="space-y-3 flex-1"
//         >
//           {/* Google */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               disabled={isLoading}
//               className="w-full h-14 bg-secondary hover:bg-secondary/80 dark:bg-[#1F2937] dark:hover:bg-[#374151] border border-border text-foreground justify-start gap-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
//               onClick={handleGoogleSignIn}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-full bg-white dark:bg-white flex items-center justify-center">
//                 <svg className="w-5 h-5" viewBox="0 0 24 24">
//                   <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
//                   <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
//                   <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
//                   <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
//                 </svg>
//               </div>
//               <span className="font-semibold text-base relative z-10">Google</span>
//             </Button>
//           </motion.div>

//           {/* GitHub */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 bg-secondary hover:bg-secondary/80 dark:bg-[#0D1117] dark:hover:bg-[#161B22] border border-border text-foreground justify-start gap-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
//               onClick={() => navigate("/dashboard/tools/agent")}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center">
//                 <svg className="w-5 h-5 text-foreground" fill="currentColor" viewBox="0 0 24 24">
//                   <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
//                 </svg>
//               </div>
//               <span className="font-semibold text-base relative z-10">GitHub</span>
//             </Button>
//           </motion.div>

//           {/* Apple */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 bg-foreground hover:bg-foreground/90 dark:bg-[#000000] dark:hover:bg-[#1C1C1C] text-background dark:text-white justify-start gap-3 rounded-xl transition-all duration-300 border-0 shadow-sm hover:shadow-md"
//               onClick={() => navigate("/dashboard/tools/agent")}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-full bg-background/20 dark:bg-white/10 flex items-center justify-center">
//                 <Apple className="w-5 h-5 text-background dark:text-white" />
//               </div>
//               <span className="font-semibold text-base relative z-10">Apple</span>
//             </Button>
//           </motion.div>

//           {/* Microsoft */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 bg-secondary hover:bg-secondary/80 dark:bg-[#2F2F2F] dark:hover:bg-[#3A3A3A] border border-border text-foreground justify-start gap-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
//               onClick={() => navigate("/dashboard/tools/agent")}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-lg bg-white dark:bg-white flex items-center justify-center">
//                 <div className="w-4 h-4 bg-secondary dark:bg-[#2F2F2F] rounded-sm grid grid-cols-2 gap-0.5">
//                   <div className="bg-[#F25022]"></div>
//                   <div className="bg-[#7FBA00]"></div>
//                   <div className="bg-[#00A4EF]"></div>
//                   <div className="bg-[#FFB900]"></div>
//                 </div>
//               </div>
//               <span className="font-semibold text-base relative z-10">Microsoft</span>
//             </Button>
//           </motion.div>

//           {/* Continue with Email - Main CTA */}
//           <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//             <Button
//               type="button"
//               variant="outline"
//               className="w-full h-14 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-white justify-start gap-3 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 border-0"
//               onClick={() => setShowEmailForm(!showEmailForm)}
//             >
//               <div className="relative z-10 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
//                 <Mail className="w-4 h-4 text-white" />
//               </div>
//               <span className="font-semibold text-base relative z-10">Continue with Email</span>
//             </Button>
//           </motion.div>

//           {/* Email/Password Form - Show when Continue with Email is clicked */}
//           {showEmailForm && (
//             <motion.form
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "auto" }}
//               exit={{ opacity: 0, height: 0 }}
//               onSubmit={handleSubmit}
//               className="mt-4 space-y-4 p-6 bg-card/90 dark:bg-card/90 rounded-xl border-2 border-border shadow-xl backdrop-blur-sm"
//             >
//               {isSignUp && (
//                 <div>
//                   <Input
//                     type="text"
//                     placeholder="Username"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     className="h-12 bg-background dark:bg-card/80 border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                   />
//                 </div>
//               )}
//               <div>
//                 <Input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="h-12 bg-background dark:bg-card/80 border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>
//               <div>
//                 <Input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="h-12 bg-background dark:bg-card/80 border-2 border-border focus:border-primary text-foreground placeholder:text-muted-foreground rounded-lg transition-all duration-300 focus:ring-2 focus:ring-primary/20"
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsSignUp(false)}
//                   className={`flex-1 h-11 border-2 text-foreground font-semibold rounded-lg transition-all duration-300 ${
//                     !isSignUp 
//                       ? "bg-primary/20 dark:bg-primary/30 border-primary shadow-lg shadow-primary/20" 
//                       : "bg-secondary/50 dark:bg-card/60 border-border hover:border-primary/40"
//                   }`}
//                 >
//                   Sign In
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => setIsSignUp(true)}
//                   className={`flex-1 h-11 border-2 text-foreground font-semibold rounded-lg transition-all duration-300 ${
//                     isSignUp 
//                       ? "bg-primary/20 dark:bg-primary/30 border-primary shadow-lg shadow-primary/20" 
//                       : "bg-secondary/50 dark:bg-card/60 border-border hover:border-primary/40"
//                   }`}
//                 >
//                   Sign Up
//                 </Button>
//               </div>
//               <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
//                 <Button
//                   type="submit"
//                   disabled={isLoading}
//                   className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base rounded-lg shadow-lg shadow-primary/40 hover:shadow-primary/60 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   <motion.div
//                     className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
//                     animate={{
//                       x: ['-100%', '100%'],
//                     }}
//                     transition={{
//                       duration: 2,
//                       repeat: Infinity,
//                       repeatDelay: 1,
//                       ease: "linear",
//                     }}
//                   />
//                   <span className="relative z-10">
//                     {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
//                   </span>
//                 </Button>
//               </motion.div>
//             </motion.form>
//           )}

//           {/* Need help link */}
//           <div className="pt-4">
//             <Link to="#" className="text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 inline-flex items-center gap-1 group">
//               Need help?
//               <motion.span
//                 animate={{ x: [0, 4, 0] }}
//                 transition={{ duration: 1.5, repeat: Infinity }}
//                 className="text-primary"
//               >
//                 →
//               </motion.span>
//             </Link>
//           </div>
//         </motion.div>

//         {/* Mobile App Section */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5, delay: 0.4 }}
//           className="mt-auto pt-8"
//         >
//           <p className="text-foreground text-sm mb-4 font-medium">Available now on iOS and Android</p>
//           <div className="flex gap-3">
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
//               <Button
//                 variant="outline"
//                 className="w-full h-12 bg-primary/20 dark:bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
//                 onClick={() => toast.info("App Store link coming soon")}
//               >
//                 <Apple className="w-5 h-5 mr-2" />
//                 <span className="text-xs font-semibold">App Store</span>
//               </Button>
//             </motion.div>
//             <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
//               <Button
//                 variant="outline"
//                 className="w-full h-12 bg-primary/20 dark:bg-primary/30 border-2 border-primary/60 hover:border-primary hover:bg-primary/30 dark:hover:bg-primary/40 text-primary-foreground rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300"
//                 onClick={() => toast.info("Google Play link coming soon")}
//               >
//                 <Chrome className="w-5 h-5 mr-2" />
//                 <span className="text-xs font-semibold">Google Play</span>
//               </Button>
//             </motion.div>
//           </div>
//         </motion.div>
//         </div>
//       </div>

//       {/* Right Panel - Full Screen Video Background with Bottom-Only Shadow */}
//       <div className="hidden lg:block flex-1 relative overflow-hidden bg-black">
//         {/* Cinematic Video Player */}
//         <AnimatePresence mode="popLayout">
//           <motion.div 
//             key={currentVideoIndex}
//             className="absolute inset-0 w-full h-full"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 1.2, ease: "easeInOut" }}
//           >
//             <video
//               ref={videoRef}
//               src={currentVideo.src}
//               className="absolute inset-0 w-full h-full object-cover"
//               autoPlay
//               muted
//               loop={false}
//               playsInline
//               onEnded={handleVideoEnd}
//               onLoadedMetadata={setSlowMotion}
//             />
//           </motion.div>
//         </AnimatePresence>

//         {/* The "Black Shadow" Overlay - RESTRICTED TO BOTTOM 50% */}
//         <div className="absolute bottom-0 left-0 right-0 h-[50%] bg-gradient-to-t from-black via-black/70 to-transparent z-10 pointer-events-none" />
        
//         {/* Content Description Area */}
//         <div className="absolute bottom-0 left-0 right-0 p-12 z-20">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentVideoIndex}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="max-w-2xl"
//             >
//               {/* Badge/Tag */}
//               <motion.div 
//                 className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-4"
//                 initial={{ width: 0, opacity: 0 }}
//                 animate={{ width: "auto", opacity: 1 }}
//                 transition={{ duration: 0.5 }}
//               >
//                 <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
//                 <span className="text-xs font-medium text-white tracking-wide uppercase">Now Showing</span>
//               </motion.div>

//               {/* Title */}
//               <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
//                 {currentVideo.title}
//               </h1>

//               {/* Description */}
//               <p className="text-lg text-gray-300 leading-relaxed font-light">
//                 {currentVideo.description}
//               </p>
//             </motion.div>
//           </AnimatePresence>

//           {/* Progress Indicators */}
//           <div className="flex gap-2 mt-8">
//             {VIDEO_PLAYLIST.map((_, idx) => (
//               <motion.div
//                 key={idx}
//                 className={`h-1 rounded-full overflow-hidden ${
//                   idx === currentVideoIndex ? "w-16 bg-white" : "w-4 bg-white/20"
//                 }`}
//                 layout
//                 transition={{ duration: 0.3 }}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthSignIn;