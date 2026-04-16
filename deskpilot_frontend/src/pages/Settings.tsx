import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Bell, Palette, Globe, Lock, Database, Mail } from "lucide-react";

const sections = [
  { icon: Bell, title: "Notifications", desc: "Configure email and push notification preferences" },
  { icon: Palette, title: "Appearance", desc: "Customize theme and display settings" },
  { icon: Globe, title: "Language & Region", desc: "Set language, timezone, and date formats" },
  { icon: Lock, title: "Security", desc: "Password policies, 2FA, and session management" },
  { icon: Database, title: "Data & Privacy", desc: "Export data, retention policies, and GDPR" },
  { icon: Mail, title: "Email Templates", desc: "Customize ticket notification email templates" },
];

const Settings = () => {
  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, i) => (
          <motion.button
            key={section.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-5 text-left hover:border-primary/30 transition-all group"
          >
            <div className="bg-secondary rounded-xl p-2.5 w-fit mb-3 group-hover:bg-primary/10 transition-colors">
              <section.icon className="w-5 h-5 text-primary" />
            </div>
            <p className="font-display font-semibold text-foreground">{section.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{section.desc}</p>
          </motion.button>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
