import { motion } from "framer-motion";
import {
  MessageSquare,
  TrendingUp,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Bot,
  Check,
  Shield,
  Zap,
  Plug,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4 },
};

const agents = [
  {
    icon: MessageSquare,
    title: "Support Agent – 24/7 Intelligent Customer Automation",
    desc: "Deliver instant, human-like responses across channels. Handle inquiries, resolve issues, analyze sentiment, and automatically generate support tickets. Reduce support costs. Increase customer satisfaction. Scale effortlessly.",
  },
  {
    icon: TrendingUp,
    title: "Sales Agent – Your 24/7 Revenue Engine",
    desc: "Engage visitors, qualify leads, schedule meetings, and guide prospects through intelligent sales conversations. Shorten sales cycles and increase conversions through AI-powered engagement.",
  },
  {
    icon: Users,
    title: "Lead Management Agent – Automated Prospect Qualification",
    desc: "Capture and score leads in real time. Route high-value prospects directly into your CRM and sales pipeline. Never miss an opportunity again.",
  },
  {
    icon: Calendar,
    title: "Booking Agent – Seamless Appointment Automation",
    desc: "Automate scheduling, confirmations, and reminders. Eliminate back-and-forth communication and improve customer experience.",
  },
  {
    icon: FileText,
    title: "Content Creation Agent – AI Marketing at Scale",
    desc: "Generate marketing content, promotional materials, and digital assets instantly. Maintain consistent branding while reducing creative workload.",
  },
  {
    icon: BarChart3,
    title: "Data Analysis Agent – Smarter Business Decisions",
    desc: "Turn business data into actionable insights. Automated reporting and intelligent analytics for faster strategic decisions.",
  },
];

const customUseCases = [
  "E-commerce automation bots",
  "HR & recruitment agents",
  "Customer onboarding assistants",
  "Finance & operations bots",
  "Industry-specific AI systems",
  "Internal workflow automation agents",
  "Custom API-integrated AI solutions",
];

const whyPoints = [
  "24/7 AI-powered customer support",
  "Automated lead capture & sales engagement",
  "Smart scheduling & workflow automation",
  "AI-driven content & visual generation",
  "Seamless integration with existing tools",
  "Scalable infrastructure for growing businesses",
];

const securityPoints = [
  "Data security",
  "System reliability",
  "Ethical AI deployment",
  "Performance optimization",
  "Business-grade infrastructure",
];

const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden w-full relative">
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative z-10">
        <Navbar />

        <section className="pt-28 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <motion.h1
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Build Your AI Workforce. Automate Everything.
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              AKOBOT is a powerful AI automation platform that helps businesses deploy intelligent Support Agents, Sales Agents, Content Creation Agents, and fully customized AI bots — all in one scalable ecosystem.
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-4 justify-center text-muted-foreground mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span>Automate customer support.</span>
              <span>Accelerate sales.</span>
              <span>Generate content.</span>
              <span>Scale operations — without scaling costs.</span>
            </motion.div>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/auth/sign-in")}
              >
                Start Building Your AI Agent
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border"
                onClick={() => navigate("/pricing")}
              >
                Book a Demo
              </Button>
            </motion.div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border/50">
          <div className="mx-auto max-w-4xl">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-center"
              {...fadeIn}
            >
              Why AKOBOT?
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-center mb-6"
              {...fadeIn}
            >
              Modern businesses need more than chatbots. They need intelligent AI agents that perform real work.
            </motion.p>
            <motion.p
              className="text-muted-foreground text-center mb-10 max-w-3xl mx-auto"
              {...fadeIn}
            >
              AKOBOT combines conversational AI, workflow automation, sales intelligence, and content generation into one unified platform — eliminating the need for multiple disconnected tools.
            </motion.p>
            <motion.ul
              className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto"
              {...fadeIn}
            >
              {whyPoints.map((point, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </motion.ul>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/10">
          <div className="mx-auto max-w-5xl">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center"
              {...fadeIn}
            >
              Our Most Powerful AI Agents
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-center mb-12"
              {...fadeIn}
            >
              These flagship agents demonstrate the full power of AKOBOT. Built for real business impact.
            </motion.p>
            <div className="grid md:grid-cols-2 gap-6">
              {agents.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    className="rounded-xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
                    {...fadeIn}
                  >
                    <div className="flex gap-4">
                      <div className="rounded-lg bg-primary/10 p-3 h-fit">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-center"
              {...fadeIn}
            >
              Not Just These Bots — Build Any AI Agent
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-center mb-6"
              {...fadeIn}
            >
              AKOBOT is fully customizable. You are not limited to predefined bots.
            </motion.p>
            <motion.p
              className="text-muted-foreground text-center mb-8"
              {...fadeIn}
            >
              Our platform allows you to build any AI agent tailored to your workflow, industry, or business model.
            </motion.p>
            <motion.p
              className="font-medium text-foreground text-center mb-6"
              {...fadeIn}
            >
              Create:
            </motion.p>
            <motion.ul
              className="grid sm:grid-cols-2 gap-2 max-w-2xl mx-auto mb-8"
              {...fadeIn}
            >
              {customUseCases.map((useCase, i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary">•</span>
                  {useCase}
                </li>
              ))}
            </motion.ul>
            <motion.p
              className="text-center font-medium text-foreground"
              {...fadeIn}
            >
              If your business has a process — AKOBOT can automate it.
            </motion.p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/10 border-y border-border/50">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div {...fadeIn} className="flex justify-center mb-4">
              <Plug className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-4"
              {...fadeIn}
            >
              Works With Your Existing Tools
            </motion.h2>
            <motion.p
              className="text-muted-foreground"
              {...fadeIn}
            >
              AKOBOT integrates seamlessly with CRMs, helpdesk platforms, e-commerce systems, marketing tools, and custom APIs. No disruption. No complex setup. Just intelligent automation layered onto your existing infrastructure.
            </motion.p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div {...fadeIn} className="flex justify-center mb-4">
              <Layers className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-4"
              {...fadeIn}
            >
              Built for Scale
            </motion.h2>
            <motion.p
              className="text-muted-foreground mb-4"
              {...fadeIn}
            >
              Whether you are a startup, growing business, or enterprise organization, AKOBOT scales with your operations.
            </motion.p>
            <motion.p
              className="text-muted-foreground"
              {...fadeIn}
            >
              Automate thousands of conversations. Manage unlimited workflows. Deploy AI agents across multiple departments. Grow without increasing overhead.
            </motion.p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30 dark:bg-muted/10">
          <div className="mx-auto max-w-4xl">
            <motion.div {...fadeIn} className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-primary" />
            </motion.div>
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-foreground mb-4 text-center"
              {...fadeIn}
            >
              Secure, Reliable & Responsible AI
            </motion.h2>
            <motion.p
              className="text-muted-foreground text-center mb-8"
              {...fadeIn}
            >
              We prioritize:
            </motion.p>
            <motion.ul
              className="flex flex-wrap justify-center gap-4"
              {...fadeIn}
            >
              {securityPoints.map((point, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border text-foreground"
                >
                  <Zap className="w-4 h-4 text-primary" />
                  {point}
                </li>
              ))}
            </motion.ul>
            <motion.p
              className="text-muted-foreground text-center mt-8"
              {...fadeIn}
            >
              Your automation runs securely and reliably at scale.
            </motion.p>
          </div>
        </section>

        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <motion.div
            className="mx-auto max-w-2xl text-center rounded-2xl border border-border bg-card p-10 shadow-lg"
            {...fadeIn}
          >
            <Bot className="w-14 h-14 text-primary mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Stop hiring for repetitive tasks.
            </h2>
            <p className="text-muted-foreground mb-6">
              Start deploying AI agents that work 24/7. Build your AI workforce with AKOBOT.
            </p>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => navigate("/auth/sign-in")}
            >
              Start Building Your AI Agent
            </Button>
          </motion.div>
        </section>

        <Footer />
      </div>
    </main>
  );
};

export default AboutUsPage;
