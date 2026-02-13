import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
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
  },
];

const PricingSection = () => {
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
                >
                  {plan.cta}
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
