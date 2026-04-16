import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Search, BookOpen, Wifi, Monitor, Lock, Mail, HardDrive, Sparkles } from "lucide-react";
import { useState } from "react";

const articles = [
  { icon: Wifi, category: "Network", title: "How to fix VPN connection issues", views: 342 },
  { icon: Monitor, category: "Hardware", title: "Troubleshooting monitor display problems", views: 218 },
  { icon: Lock, category: "Access", title: "Requesting elevated permissions", views: 189 },
  { icon: Mail, category: "Email", title: "Setting up email on mobile devices", views: 156 },
  { icon: HardDrive, category: "Software", title: "Installing approved software packages", views: 134 },
  { icon: Wifi, category: "Network", title: "Connecting to guest Wi-Fi network", views: 112 },
  { icon: Monitor, category: "Hardware", title: "How to request new equipment", views: 98 },
  { icon: Lock, category: "Access", title: "Password reset guide", views: 287 },
];

const KnowledgeBase = () => {
  const [search, setSearch] = useState("");
  const filtered = articles.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="Knowledge Base">
      <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3 border-primary/20">
        <div className="gradient-primary rounded-xl p-2.5 shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">AI-Powered Search</p>
          <p className="text-xs text-muted-foreground">DeskPilot AI finds the most relevant articles for your query.</p>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search knowledge base..."
          className="w-full bg-secondary rounded-xl pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((article, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass rounded-2xl p-5 text-left hover:border-primary/30 transition-all group"
          >
            <div className="flex items-start gap-3">
              <div className="bg-secondary rounded-xl p-2.5 group-hover:bg-primary/10 transition-colors">
                <article.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-medium text-primary">{article.category}</span>
                <p className="text-sm font-medium text-foreground mt-0.5">{article.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{article.views} views</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBase;
