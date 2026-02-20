import { useNavigate } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, BarChart3, Bot } from "lucide-react";

const features = [
  { icon: Zap, title: "Smart Routing", desc: "AI automatically assigns tickets to the right technician" },
  { icon: Shield, title: "SLA Tracking", desc: "Real-time SLA monitoring with automatic escalation" },
  { icon: BarChart3, title: "Analytics", desc: "Deep insights into your support operations" },
  { icon: Bot, title: "AI Assistant", desc: "Intelligent chatbot for instant help" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[100px]" />

      {/* Header */}
      <header className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <BrandLogo size="md" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="gradient-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-xl glow-orange hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-16 sm:pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">AI-Powered IT Helpdesk</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold text-foreground leading-tight mb-6">
            Smarter IT Support
            <br />
            <span className="text-gradient">Starts Here</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            ThinkAuto uses AI to automate ticket routing, predict issues, and accelerate resolution — so your team can focus on what matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate("/signup")}
              className="gradient-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl glow-orange hover:opacity-90 transition-opacity flex items-center gap-2 text-base"
            >
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="glass text-foreground font-medium px-8 py-3.5 rounded-xl hover:bg-secondary/50 transition-all text-base"
            >
              Watch Demo
            </button>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="glass rounded-2xl p-6 hover:border-primary/30 transition-all group"
            >
              <div className="gradient-primary rounded-xl p-2.5 w-fit mb-4 group-hover:glow-orange transition-all">
                <feature.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
