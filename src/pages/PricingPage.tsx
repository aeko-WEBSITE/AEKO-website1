import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Shield, Zap, HeadphonesIcon, Edit, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { packageAPI, paymentAPI, adminAPI, authAPI } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Package {
  _id: string;
  name: string;
  description?: string;
  price: number;
  credits: number;
  features?: string[];
  duration?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const freeFeatures = [
  "1 Basic AI Agent with image tool integration",
  "20 Prompts per day",
  "3 Images per day",
  "Watermarked outputs",
  "Standard support",
  "Cloud storage",
];

const enterpriseFeatures = [
  "Unlimited AI Agents",
  "Unlimited integrations",
  "Custom API access",
  "Multi-user team management",
  "Dedicated support",
  "SLA uptime",
  "Dedicated S3 storage",
];

const sharedProFeatures = [
  "All-in-one multi-model support",
  "Text/Image/Video to video",
  "AI avatar generator",
  "AI short video generator",
  "Reference to video",
  "AI animation generator",
  "Text/Image/Chat to image",
  "300+ templates & effects",
];

// Static pricing data (fallback when no packages available)
const PRICE_OPTIONS = [9, 19, 40, 80, 129] as const;
const TIER_LABELS: Record<number, string> = {
  9: "Starter",
  19: "Growth",
  40: "Pro",
  80: "Business",
  129: "Elite",
};

const pricingPlans: Record<
  number,
  { agents: number; tokens: string; images: number; videos?: number; parallelTasks?: number }
> = {
  9: { agents: 2, tokens: "9M", images: 5, videos: 5, parallelTasks: 1 },
  19: { agents: 3, tokens: "20M", images: 10, videos: 10, parallelTasks: 2 },
  40: { agents: 4, tokens: "44M", images: 15, videos: 15, parallelTasks: 3 },
  80: { agents: 7, tokens: "95M", images: 20, videos: 20, parallelTasks: 5 },
  129: { agents: 10, tokens: "160M", images: 25, videos: 25, parallelTasks: 10 },
};

const tierFeatureOverrides: Partial<Record<number, string[]>> = {
  9: [
    "Custom AI Agents with image tool integration",
    "Access to integrate any 1 tool",
    "9M Token Pool",
    "LLM model option: GPT.nano",
    "5 parallel generation",
    "AI avatar generator",
    "Experience high quality generation",
    "AI short video generator",
    "Add Team Members",
    "24/7 standard support",
    "99.9% uptime",
    "No watermark",
    "100+ templates & effects",
  ],
  19: [
    "3 Custom AI Agents with image tool integration",
    "20M Token Pool (get 5% extra)",
    "Access to integrate any 2 tools",
    "LLM model option: Sarvam, GPT.nano, GPT mini",
    "10 parallel generation",
    "All-in-one multi-model support",
    "Experience high quality image generation",
    "Experience high quality video generation",
    "Add Team Members",
    "24/7 standard support",
    "99.9% uptime",
    "No watermark",
  ],
};

const PricingPage = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [useStaticPricing, setUseStaticPricing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    credits: "",
    features: "",
    duration: "",
    isActive: true,
  });

  // Check if user is admin
  useEffect(() => {
    const adminToken = localStorage.getItem("adminAccessToken");
    setIsAdmin(!!adminToken);
  }, []);

  // Fetch packages
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packageAPI.getAll();
      // Handle both array and object with packages property
      const packagesList = Array.isArray(data) ? data : (data.packages || []);
      // Filter active packages and ensure they have required fields
      const validPackages = packagesList
        .filter((pkg: Package) => pkg && pkg.isActive !== false && pkg._id && pkg.name && pkg.price !== undefined && pkg.credits !== undefined)
        .map((pkg: Package) => ({
          ...pkg,
          credits: pkg.credits || 0,
          price: pkg.price || 0,
          features: pkg.features || [],
        }))
        .sort((a: Package, b: Package) => a.price - b.price); // Sort by price
      setPackages(validPackages);
      setUseStaticPricing(validPackages.length === 0);
      
      // Reset slider if packages changed
      if (validPackages.length > 0 && sliderIndex >= validPackages.length) {
        setSliderIndex(0);
      }
    } catch (error: any) {
      console.error("Error fetching packages:", error);
      toast.error(error.message || "Failed to load packages");
      setPackages([]);
      setUseStaticPricing(true); // Use static pricing on error
    } finally {
      setLoading(false);
    }
  };

  // Get selected package based on slider
  const selectedPackage = packages.length > 0 && sliderIndex < packages.length 
    ? packages[sliderIndex] 
    : null;

  // Static pricing data
  const selectedPrice = PRICE_OPTIONS[sliderIndex] || PRICE_OPTIONS[0];
  const planFeatures = pricingPlans[selectedPrice];
  const staticFeatures = tierFeatureOverrides[selectedPrice];

  const handleBuyPackage = (pkg?: Package) => {
    if (!pkg) {
      // For static pricing, show message
      toast.info("Packages are being set up. Please contact support or check back later.");
      return;
    }

    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      toast.error("Please sign in to purchase a package");
      navigate("/auth/sign-in", { state: { returnTo: `/payment?packageId=${pkg._id}` } });
      return;
    }

    // Navigate to payment page with package ID
    navigate(`/payment?packageId=${pkg._id}`);
  };

  const handleUpdatePackage = async () => {
    if (!editingPackage) return;

    try {
      const featuresArray = formData.features
        .split("\n")
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      await adminAPI.updatePackage(editingPackage._id, {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        credits: parseInt(formData.credits),
        features: featuresArray.length > 0 ? featuresArray : undefined,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        isActive: formData.isActive,
      });

      toast.success("Package updated successfully");
      setIsEditing(false);
      setEditingPackage(null);
      resetForm();
      fetchPackages();
    } catch (error: any) {
      toast.error(error.message || "Failed to update package");
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      await adminAPI.deletePackage(id);
      toast.success("Package deleted successfully");
      fetchPackages();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete package");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      credits: "",
      features: "",
      duration: "",
      isActive: true,
    });
  };

  const openEditDialog = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name || "",
      description: pkg.description || "",
      price: (pkg.price || 0).toString(),
      credits: (pkg.credits || 0).toString(),
      features: pkg.features?.join("\n") || "",
      duration: pkg.duration?.toString() || "",
      isActive: pkg.isActive !== false,
    });
    setIsEditing(true);
  };

  if (loading) {
    return (
      <main className="min-h-screen overflow-x-hidden w-full relative text-white">
        <div className="fixed inset-0 pointer-events-none z-0" style={{
          background: "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 30%, #2d1b4e 55%, #3b2a5c 75%, #4c2d5e 90%, #5c3a5a 100%)",
        }} />
        <div className="relative z-10 flex flex-col min-h-screen items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
          <p className="mt-4 text-violet-200">Loading packages...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden w-full relative text-white">
      {/* Refined gradient: deep indigo → violet → soft rose */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "linear-gradient(135deg, #0f0f23 0%, #1a1a3e 30%, #2d1b4e 55%, #3b2a5c 75%, #4c2d5e 90%, #5c3a5a 100%)",
        }}
      />
      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <section className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-5xl">
            {/* Heading + Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                Plans & Pricing
              </h1>
              <p className="text-violet-200/90 text-sm sm:text-base mb-5 max-w-md mx-auto">
                Choose the right plan for your team. Upgrade or downgrade anytime.
              </p>
              <div className="inline-flex items-center rounded-full bg-white/10 backdrop-blur-sm border border-violet-400/20 p-0.5 mb-4">
                <button
                  type="button"
                  onClick={() => setBillingPeriod("monthly")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "monthly"
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                      : "text-violet-200/80 hover:text-white"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setBillingPeriod("yearly")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    billingPeriod === "yearly"
                      ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                      : "text-violet-200/80 hover:text-white"
                  }`}
                >
                  Yearly
                </button>
              </div>
            </motion.div>

            {/* 3-column layout: equal height cards, aligned content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 items-stretch">
              {/* Left: Free Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl p-5 sm:p-6 flex flex-col bg-black border border-violet-400/15 hover:border-violet-400/25 hover:shadow-xl hover:shadow-violet-500/10 transition-all"
              >
                <h2 className="text-lg font-bold text-white mb-1">Free</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-white">₹0</span>
                  <span className="text-sm text-violet-200/70">/ month</span>
                </div>
                <Button
                  onClick={() => navigate("/auth/sign-in")}
                  variant="secondary"
                  className="w-full rounded-xl h-10 bg-violet-500/20 hover:bg-violet-500/30 text-violet-100 border border-violet-400/25 mb-4 text-sm font-medium"
                >
                  Try Now
                </Button>
                <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                  {freeFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-violet-100/90">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Middle: Pay-As-You-Go (highlighted, dynamic) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl p-5 sm:p-6 flex flex-col bg-black border-2 border-violet-400/40 shadow-2xl shadow-violet-500/20"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.12)",
                }}
              >
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-1">Pay-As-You-Go</h2>
                {selectedPackage ? (
                  <>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-bold text-white">₹{selectedPackage.price}</span>
                      <span className="text-sm text-violet-200/70">/ {selectedPackage.duration ? `${selectedPackage.duration} days` : "month"}</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={selectedPackage._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-medium text-violet-300 mb-3"
                      >
                        {selectedPackage.name}
                      </motion.p>
                    </AnimatePresence>
                    {packages.length > 1 && (
                      <div className="mb-3">
                        <Slider
                          value={[sliderIndex]}
                          onValueChange={([v]) => setSliderIndex(Math.min(v, packages.length - 1))}
                          min={0}
                          max={packages.length - 1}
                          step={1}
                          className="py-2 [&_[data-orientation=horizontal]]:max-w-full"
                        />
                        <div className="flex justify-between mt-0.5 text-[10px] text-violet-300/60">
                          <span>₹{packages[0]?.price || 0}</span>
                          <span>₹{packages[packages.length - 1]?.price || 0}</span>
                        </div>
                      </div>
                    )}
                    <Button
                      onClick={() => handleBuyPackage(selectedPackage)}
                      className="w-full rounded-xl h-10 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-600 text-white font-semibold hover:opacity-95 shadow-lg shadow-violet-500/25 mb-4 text-sm"
                    >
                      Buy Now
                    </Button>
                    {isAdmin && (
                      <div className="flex gap-1 mb-2 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => openEditDialog(selectedPackage)}
                          className="h-6 w-6 p-0 text-violet-300 hover:text-violet-100"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeletePackage(selectedPackage._id)}
                          className="h-6 w-6 p-0 text-red-300 hover:text-red-100"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                      {selectedPackage.features && selectedPackage.features.length > 0 ? (
                        selectedPackage.features.map((feature, i) => (
                          <motion.li
                            key={`${selectedPackage._id}-${i}`}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-2 text-xs sm:text-sm text-violet-100/90"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </motion.li>
                        ))
                      ) : (
                        <li className="text-xs text-violet-300/60">No features listed</li>
                      )}
                    </ul>
                  </>
                ) : useStaticPricing ? (
                  <>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-2xl font-bold text-white">₹{selectedPrice}</span>
                      <span className="text-sm text-violet-200/70">/ month</span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={selectedPrice}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs font-medium text-violet-300 mb-3"
                      >
                        {TIER_LABELS[selectedPrice]}
                      </motion.p>
                    </AnimatePresence>
                    <div className="mb-3">
                      <Slider
                        value={[sliderIndex]}
                        onValueChange={([v]) => setSliderIndex(Math.min(v, PRICE_OPTIONS.length - 1))}
                        min={0}
                        max={PRICE_OPTIONS.length - 1}
                        step={1}
                        className="py-2 [&_[data-orientation=horizontal]]:max-w-full"
                      />
                      <div className="flex justify-between mt-0.5 text-[10px] text-violet-300/60">
                        <span>₹{PRICE_OPTIONS[0]}</span>
                        <span>₹{PRICE_OPTIONS[PRICE_OPTIONS.length - 1]}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleBuyPackage()}
                      className="w-full rounded-xl h-10 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-600 text-white font-semibold hover:opacity-95 shadow-lg shadow-violet-500/25 mb-4 text-sm"
                    >
                      Buy Now
                    </Button>
                    <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                      {staticFeatures ? (
                        staticFeatures.map((text, i) => (
                          <motion.li
                            key={`${selectedPrice}-${i}`}
                            initial={{ opacity: 0, x: -4 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-start gap-2 text-xs sm:text-sm text-violet-100/90"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{text}</span>
                          </motion.li>
                        ))
                      ) : (
                        <>
                          {[
                            `${planFeatures.agents} Custom AI Agents`,
                            `${planFeatures.tokens} Token Pool`,
                            `Up to ${planFeatures.images} images/month`,
                            `Up to ${planFeatures.videos ?? planFeatures.images} videos/month`,
                            `${planFeatures.parallelTasks ?? 3} parallel tasks`,
                          ].map((text, i) => (
                            <motion.li
                              key={`${selectedPrice}-${i}`}
                              initial={{ opacity: 0, x: -4 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-start gap-2 text-xs sm:text-sm text-violet-100/90"
                            >
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{text}</span>
                            </motion.li>
                          ))}
                          {sharedProFeatures.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-violet-100/90">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </>
                      )}
                    </ul>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-violet-300/60 text-sm">Loading packages...</p>
                  </div>
                )}
              </motion.div>

              {/* Right: Enterprise */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                whileHover={{ scale: 1.02 }}
                className="relative rounded-2xl p-5 sm:p-6 flex flex-col bg-black border border-violet-400/15 hover:border-violet-400/25 hover:shadow-xl hover:shadow-violet-500/10 transition-all"
              >
                <h2 className="text-lg font-bold text-white mb-1">Enterprise</h2>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-2xl font-bold text-white">Custom</span>
                </div>
                <Button
                  onClick={() => navigate("/auth/sign-in")}
                  variant="outline"
                  className="w-full rounded-xl h-10 bg-violet-500/15 hover:bg-violet-500/25 text-violet-100 border border-violet-400/25 mb-4 text-sm font-medium"
                >
                  Contact Sales
                </Button>
                <ul className="space-y-2 flex-1 min-h-0 overflow-y-auto pr-1">
                  {enterpriseFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-violet-100/90">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Edit Package Dialog */}
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogContent className="bg-black border-violet-400/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Package</DialogTitle>
              <DialogDescription className="text-violet-200/70">
                Update package details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="edit-name">Package Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/50 border-violet-400/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-black/50 border-violet-400/20 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price (₹) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="bg-black/50 border-violet-400/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-credits">Credits *</Label>
                  <Input
                    id="edit-credits"
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                    className="bg-black/50 border-violet-400/20 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-features">Features (one per line)</Label>
                <Textarea
                  id="edit-features"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="bg-black/50 border-violet-400/20 text-white min-h-[120px]"
                />
              </div>
              <div>
                <Label htmlFor="edit-duration">Duration (days, optional)</Label>
                <Input
                  id="edit-duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="bg-black/50 border-violet-400/20 text-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                <Label htmlFor="edit-isActive">Active (visible on pricing page)</Label>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleUpdatePackage}
                  className="flex-1 bg-violet-500 hover:bg-violet-600"
                  disabled={!formData.name || !formData.price || !formData.credits}
                >
                  Update Package
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingPackage(null);
                    resetForm();
                  }}
                  className="flex-1 border-violet-400/20 text-violet-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pricing page footer - benefits & trust */}
        <footer className="relative z-10 border-t border-violet-400/15 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left"
            >
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/20">
                  <Shield className="w-5 h-5 text-violet-300" />
                </div>
                <h3 className="text-sm font-semibold text-white">Secure & reliable</h3>
                <p className="text-sm text-violet-200/80">
                  Enterprise-grade security. Your data stays yours.
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/20">
                  <Zap className="w-5 h-5 text-violet-300" />
                </div>
                <h3 className="text-sm font-semibold text-white">Cancel anytime</h3>
                <p className="text-sm text-violet-200/80">
                  No long-term lock-in. Upgrade or downgrade as you grow.
                </p>
              </div>
              <div className="flex flex-col items-center sm:items-start gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20 border border-violet-400/20">
                  <HeadphonesIcon className="w-5 h-5 text-violet-300" />
                </div>
                <h3 className="text-sm font-semibold text-white">Support when you need it</h3>
                <p className="text-sm text-violet-200/80">
                  Documentation, chat, and dedicated support on higher plans.
                </p>
              </div>
            </motion.div>
            <div className="mt-10 pt-8 border-t border-violet-400/10 text-center">
              <p className="text-sm text-violet-200/70">
                Questions? <Link to="/dashboard/support" className="text-violet-300 hover:text-white underline underline-offset-2">Contact support</Link> or{" "}
                <Link to="/auth/sign-in" className="text-violet-300 hover:text-white underline underline-offset-2">sign in</Link> to get started.
              </p>
            </div>
          </div>
          {/* Sub-footer */}
          <div className="border-t border-violet-400/10 bg-black/30">
            <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-violet-300/60">
                © {new Date().getFullYear()} AEKO.AI. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link to="/privacy" className="text-xs text-violet-300/60 hover:text-violet-200 transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-xs text-violet-300/60 hover:text-violet-200 transition-colors">
                  Terms
                </Link>
                <Link to="/pricing" className="text-xs text-violet-300/60 hover:text-violet-200 transition-colors">
                  Pricing
                </Link>
              </div>
            </div>
          </div>
        </footer>

        <Footer />
      </div>
    </main>
  );
};

export default PricingPage;
