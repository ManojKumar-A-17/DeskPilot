import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  Ticket,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Shield,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ticketTrend = [
  { name: "Mon", tickets: 12 },
  { name: "Tue", tickets: 19 },
  { name: "Wed", tickets: 15 },
  { name: "Thu", tickets: 22 },
  { name: "Fri", tickets: 18 },
  { name: "Sat", tickets: 8 },
  { name: "Sun", tickets: 5 },
];

const resolutionData = [
  { name: "Mon", resolved: 10, created: 12 },
  { name: "Tue", resolved: 16, created: 19 },
  { name: "Wed", resolved: 14, created: 15 },
  { name: "Thu", resolved: 20, created: 22 },
  { name: "Fri", resolved: 17, created: 18 },
];

const categoryData = [
  { name: "Network", value: 35, color: "hsl(25, 95%, 53%)" },
  { name: "Hardware", value: 25, color: "hsl(38, 92%, 55%)" },
  { name: "Software", value: 20, color: "hsl(210, 90%, 55%)" },
  { name: "Access", value: 15, color: "hsl(142, 71%, 45%)" },
  { name: "Other", value: 5, color: "hsl(25, 12%, 50%)" },
];

const teamMembers = [
  { name: "Alex Chen", resolved: 24, pending: 3, rating: 4.8 },
  { name: "Sarah Kim", resolved: 21, pending: 5, rating: 4.6 },
  { name: "Mike Johnson", resolved: 18, pending: 2, rating: 4.9 },
  { name: "Lisa Park", resolved: 15, pending: 4, rating: 4.5 },
];

const AdminDashboard = () => {
  return (
    <DashboardLayout title="Command Center">
      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Ticket} label="Total Tickets" value={156} variant="primary" trend="+12%" />
        <StatsCard icon={CheckCircle2} label="Resolved" value={132} variant="success" trend="+8%" />
        <StatsCard icon={Clock} label="Avg Resolution" value="3.2h" variant="info" trend="-15%" />
        <StatsCard icon={Shield} label="SLA Compliance" value="94%" variant="warning" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Ticket Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">Ticket Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ticketTrend}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--primary))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--primary-foreground))",
                }}
              />
              <Bar dataKey="tickets" fill="hsl(25, 95%, 53%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Resolution Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">Resolution Trend</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={resolutionData}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(25, 12%, 50%)", fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--primary))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--primary-foreground))",
                }}
              />
              <Line type="monotone" dataKey="created" stroke="hsl(25, 95%, 53%)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="resolved" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Category & Team */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {/* Category Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-5"
        >
          <h3 className="font-display font-semibold text-foreground mb-4">By Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--primary))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--primary-foreground))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryData.map((c) => (
              <span key={c.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Team Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-foreground">Team Performance</h3>
            <Users className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{member.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[hsl(var(--success))]" /> {member.resolved}
                    </span>
                    <span className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-[hsl(var(--warning))]" /> {member.pending}
                    </span>
                    <span>⭐ {member.rating}</span>
                  </div>
                </div>
                <div className="w-20">
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div
                      className="gradient-primary rounded-full h-1.5"
                      style={{ width: `${(member.resolved / 25) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent alerts */}
      <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-primary" /> System Alerts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          { text: "3 tickets approaching SLA breach", type: "warning" },
          { text: "New employee onboarding batch (5 users)", type: "info" },
          { text: "System maintenance scheduled - Sunday 2AM", type: "info" },
        ].map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass rounded-xl p-4 border-l-4 ${
              alert.type === "warning" ? "border-l-[hsl(var(--warning))]" : "border-l-[hsl(var(--info))]"
            }`}
          >
            <p className="text-sm text-foreground">{alert.text}</p>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
