import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Crown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentAPI, packageAPI, authAPI } from "@/lib/api";
import { toast } from "sonner";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Package {
  _id: string;
  name: string;
  description?: string;
  price: number;
  credits: number;
  features?: string[];
  duration?: number;
  isActive?: boolean;
}

// Static plans as fallback
const staticPlans = [
  {
    name: "Starter",
    icon: Zap,
    price: "$12",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      { name: "400 AI Credits", included: true },
      { name: "GPT-3.5 Access", included: true },
      { name: "10,000 LLM Questions/mo", included: true },
      { name: "15 File Uploads/day", included: true },
      { name: "Standard Image Quality", included: true },
      { name: "Basic Video Generation", included: true },
      { name: "1 Basic Chatbot", included: true },
      { name: "Standard Speed", included: true },
      { name: "Basic Integrations", included: true },
      { name: "Rate Limit: 5/min", included: true },
      { name: "No Watermark", included: true },
    ],
    cta: "Start Free",
    highlighted: false,
    packageId: null as string | null,
  },
  {
    name: "Standard",
    icon: Sparkles,
    price: "$45",
    period: "/month",
    description: "For creators who need more power",
    features: [
      { name: "4,999 AI Credits", included: true },
      { name: "GPT-4.1+ Access", included: true },
      { name: "100,000 LLM Questions/mo", included: true },
      { name: "15+ File Uploads/day", included: true },
      { name: "Advanced Image Models", included: true },
      { name: "All Video Models", included: true },
      { name: "Custom Chatbot", included: true },
      { name: "Faster Speed", included: true },
      { name: "API Access", included: true },
      { name: "Rate Limit: 10/min", included: true },
      { name: "No Watermark", included: true },
    ],
    cta: "Upgrade Now",
    highlighted: true,
    packageId: null as string | null,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "$149",
    period: "/month",
    description: "Unlimited power for teams",
    features: [
      { name: "Unlimited Low-Res + 80 HD Images", included: true },
      { name: "Multiple GPTs + Other LLMs", included: true },
      { name: "Unlimited LLM (Fair Use)", included: true },
      { name: "Configurable Uploads", included: true },
      { name: "Unlimited Low-Res Images", included: true },
      { name: "Unlimited Low-Quality Video", included: true },
      { name: "Multiple Chatbots", included: true },
      { name: "Priority Speed", included: true },
      { name: "Advanced Integrations", included: true },
      { name: "Rate Limit: 20/min", included: true },
      { name: "No Watermark", included: true },
    ],
    cta: "Go Pro",
    highlighted: false,
    packageId: null as string | null,
  },
];

const PricingSection = () => {
  const navigate = useNavigate();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [plans, setPlans] = useState(staticPlans);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Fetch packages from backend
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const data = await packageAPI.getAll();
      const packagesList = Array.isArray(data) ? data : (data.packages || []);
      const validPackages = packagesList
        .filter((pkg: Package) => pkg && pkg.isActive !== false && pkg._id && pkg.name && pkg.price !== undefined)
        .sort((a: Package, b: Package) => a.price - b.price);
      
      setPackages(validPackages);
      
      // Map packages to plans (take first 3 packages or use static)
      if (validPackages.length >= 3) {
        const mappedPlans = validPackages.slice(0, 3).map((pkg, index) => ({
          name: pkg.name,
          icon: staticPlans[index]?.icon || Zap,
          price: `₹${pkg.price}`,
          period: pkg.duration ? `/${pkg.duration} days` : "/month",
          description: pkg.description || staticPlans[index]?.description || "",
          features: pkg.features?.map(f => ({ name: f, included: true })) || staticPlans[index]?.features || [],
          cta: "Buy Now",
          highlighted: index === 1, // Middle plan is highlighted
          packageId: pkg._id,
        }));
        setPlans(mappedPlans);
      }
    } catch (error: any) {
      console.error("Error fetching packages:", error);
      // Keep static plans on error
      setPlans(staticPlans);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (packageId: string | null, planName: string) => {
    if (!packageId) {
      toast.info("This plan is not available for purchase. Please contact support.");
      return;
    }

    // Check if user is authenticated
    if (!authAPI.isAuthenticated()) {
      toast.error("Please sign in to purchase a package");
      navigate("/auth/sign-in", { state: { returnTo: `/payment?packageId=${packageId}` } });
      return;
    }

    try {
      setProcessing(packageId);
      const orderData = await paymentAPI.createOrder(packageId);

      if (!window.Razorpay) {
        toast.error("Payment gateway not loaded. Please refresh the page.");
        setProcessing(null);
        return;
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        order_id: orderData.orderId,
        name: "AEKO.AI",
        description: `Purchase ${planName}`,
        handler: async (response: any) => {
          try {
            await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Payment successful! Credits have been added to your wallet.");
            setProcessing(null);
            // Optionally navigate to dashboard
            navigate("/dashboard");
          } catch (error: any) {
            toast.error(error.message || "Payment verification failed");
            setProcessing(null);
          }
        },
        prefill: {
          name: authAPI.getCurrentUser()?.username || "",
          email: authAPI.getCurrentUser()?.email || "",
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: () => {
            setProcessing(null);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment");
      setProcessing(null);
    }
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }} ></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your creative needs
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-2xl p-6 lg:p-8 ${
                  plan.highlighted
                    ? "glass-card border-primary/50 ring-1 ring-primary/30 scale-105"
                    : "glass-card"
                }`}
              >
                {/* Highlighted badge */}
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-full">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Icon & Name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    plan.highlighted 
                      ? "bg-gradient-to-br from-primary to-accent" 
                      : "bg-secondary/50"
                  }`}>
                    <Icon className={`w-5 h-5 ${plan.highlighted ? "text-white" : "text-primary"}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {plan.name}
                  </h3>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6">
                  {plan.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature.name} className="flex items-center gap-3">
                      {feature.included ? (
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-destructive" />
                        </div>
                      )}
                      <span className="text-sm text-foreground">{feature.name}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant={plan.highlighted ? "hero" : "outline"}
                  className="w-full"
                  size="lg"
                  onClick={() => handlePayment(plan.packageId || null, plan.name)}
                  disabled={processing === plan.packageId || loading}
                >
                  {processing === plan.packageId ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          All plans include a 7-day free trial. No credit card required.
        </motion.p>
      </div>
    </section>
  );
};

export default PricingSection;
