import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import { BarChart3, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";

const monthlyData = [
  { month: "Jan", tickets: 120, resolved: 110 },
  { month: "Feb", tickets: 140, resolved: 130 },
  { month: "Mar", tickets: 130, resolved: 125 },
  { month: "Apr", tickets: 160, resolved: 150 },
  { month: "May", tickets: 155, resolved: 148 },
  { month: "Jun", tickets: 170, resolved: 165 },
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--primary))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--primary-foreground))",
};

const Reports = () => {
  return (
    <DashboardLayout title="Reports">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={BarChart3} label="Total Tickets" value={875} variant="primary" />
        <StatsCard icon={CheckCircle2} label="Resolved" value={828} variant="success" trend="+5%" />
        <StatsCard icon={Clock} label="Avg Resolution" value="2.8h" variant="info" trend="-10%" />
        <StatsCard icon={TrendingUp} label="SLA Rate" value="95%" variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="tickets" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="resolved" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5">
          <h3 className="font-display font-semibold text-foreground mb-4">Volume by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="tickets" fill="hsl(25, 95%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
