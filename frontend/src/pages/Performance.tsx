import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, TrendingUp, Star, Target } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const weeklyData = [
  { day: "Mon", resolved: 4 },
  { day: "Tue", resolved: 6 },
  { day: "Wed", resolved: 5 },
  { day: "Thu", resolved: 7 },
  { day: "Fri", resolved: 3 },
];

const Performance = () => {
  return (
    <DashboardLayout title="Performance">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={CheckCircle2} label="Resolved" value={42} variant="success" trend="+8" />
        <StatsCard icon={Clock} label="Avg Time" value="2.1h" variant="info" trend="-12%" />
        <StatsCard icon={Star} label="Rating" value="4.8" variant="warning" />
        <StatsCard icon={Target} label="SLA Met" value="96%" variant="primary" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5 mb-8">
        <h3 className="font-display font-semibold text-foreground mb-4">Weekly Resolutions</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: "hsl(var(--primary))", border: "1px solid hsl(var(--border))", borderRadius: "8px", color: "hsl(var(--primary-foreground))" }} />
            <Bar dataKey="resolved" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Tickets This Month", value: 42, target: 50 },
          { label: "SLA Compliance", value: 96, target: 100, suffix: "%" },
          { label: "Customer Satisfaction", value: 4.8, target: 5, suffix: "/5" },
        ].map((metric, i) => (
          <motion.div key={metric.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-5">
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <div className="flex items-end gap-1 mb-3">
              <span className="text-2xl font-display font-bold text-foreground">{metric.value}{metric.suffix || ""}</span>
              <span className="text-xs text-muted-foreground mb-1">/ {metric.target}{metric.suffix || ""}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div className="gradient-primary rounded-full h-2" style={{ width: `${(metric.value / metric.target) * 100}%` }} />
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Performance;
