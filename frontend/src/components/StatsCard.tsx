import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  variant?: "default" | "primary" | "success" | "warning" | "info";
  children?: ReactNode;
}

const StatsCard = ({ icon: Icon, label, value, trend, variant = "default" }: StatsCardProps) => {
  const variantStyles = {
    default: "glass",
    primary: "glass glow-orange border-primary/30",
    success: "glass border-[hsl(var(--success)/.3)]",
    warning: "glass border-[hsl(var(--warning)/.3)]",
    info: "glass border-[hsl(var(--info)/.3)]",
  };

  const iconBg = {
    default: "bg-secondary",
    primary: "gradient-primary",
    success: "bg-[hsl(var(--success)/.15)]",
    warning: "bg-[hsl(var(--warning)/.15)]",
    info: "bg-[hsl(var(--info)/.15)]",
  };

  const iconColor = {
    default: "text-muted-foreground",
    primary: "text-primary-foreground",
    success: "text-[hsl(var(--success))]",
    warning: "text-[hsl(var(--warning))]",
    info: "text-[hsl(var(--info))]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={`${variantStyles[variant]} rounded-2xl p-5 transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`${iconBg[variant]} rounded-xl p-2.5`}>
          <Icon className={`w-5 h-5 ${iconColor[variant]}`} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-[hsl(var(--success))] bg-[hsl(var(--success)/.1)] px-2 py-1 rounded-full">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
};

export default StatsCard;
