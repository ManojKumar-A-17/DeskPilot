import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Users, Ticket } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";

const weeklyVolume = [
  { day: "Mon", count: 12 }, { day: "Tue", count: 19 }, { day: "Wed", count: 15 },
  { day: "Thu", count: 22 }, { day: "Fri", count: 18 }, { day: "Sat", count: 8 }, { day: "Sun", count: 5 },
];

const categoryBreakdown = [
  { name: "Network", value: 35, color: "hsl(25, 95%, 53%)" },
  { name: "Hardware", value: 25, color: "hsl(38, 92%, 55%)" },
  { name: "Software", value: 20, color: "hsl(210, 90%, 55%)" },
  { name: "Access", value: 15, color: "hsl(142, 71%, 45%)" },
  { name: "Other", value: 5, color: "hsl(25, 12%, 50%)" },
];

const tooltipStyle = { backgroundColor: "hsl(20, 12%, 11%)", border: "1px solid hsl(25, 12%, 18%)", borderRadius: "12px", color: "hsl(35, 25%, 88%)" };

const Analytics = () => {
  return (
    <DashboardLayout title="Analytics">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Ticket} label="This Week" value={99} variant="primary" trend="+7%" />
        <StatsCard icon={TrendingUp} label="Resolution Rate" value="94%" variant="success" />
        <StatsCard icon={BarChart3} label="Avg Time" value="2.6h" variant="info" />
        <StatsCard icon={Users} label="Active Agents" value={12} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Weekly Volume</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyVolume}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="hsl(25, 95%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryBreakdown.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryBreakdown.map((c) => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} /> {c.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
