import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import { BarChart3, Loader2, Ticket, TrendingUp, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const categoryColors = [
  "hsl(var(--primary))",
  "hsl(var(--info))",
  "hsl(var(--success))",
  "hsl(var(--warning))",
  "hsl(var(--muted-foreground))",
  "hsl(var(--destructive))",
];

const tooltipStyle = {
  backgroundColor: "hsl(var(--primary))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "8px",
  color: "hsl(var(--primary-foreground))",
};

const formatDay = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short" });

const getAverageResolutionHours = (tickets: any[]) => {
  const resolved = tickets.filter((ticket) => ticket.resolution?.resolvedAt);
  if (resolved.length === 0) return "0h";

  const totalHours = resolved.reduce((sum, ticket) => {
    const created = new Date(ticket.createdAt).getTime();
    const resolvedAt = new Date(ticket.resolution.resolvedAt).getTime();
    return sum + Math.max(0, resolvedAt - created) / (1000 * 60 * 60);
  }, 0);

  return `${(totalHours / resolved.length).toFixed(1)}h`;
};

const Analytics = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [ticketResponse, userResponse] = await Promise.all([
          api.getTickets(),
          api.getUsers(),
        ]);

        if (ticketResponse.success) setTickets(ticketResponse.data.tickets || []);
        if (userResponse.success) setUsers(userResponse.data.users || []);
      } catch (error: any) {
        toast.error("Failed to load analytics", {
          description: error.message || "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const analytics = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - index));
      return day;
    });

    const weeklyVolume = days.map((day) => {
      const count = tickets.filter((ticket) => {
        const created = new Date(ticket.createdAt);
        return created.toDateString() === day.toDateString();
      }).length;

      return { day: formatDay(day), count };
    });

    const categoryMap = tickets.reduce((acc, ticket) => {
      const category = ticket.category || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryBreakdown = Object.entries(categoryMap).map(([name, value], index) => ({
      name,
      value,
      color: categoryColors[index % categoryColors.length],
    }));

    const resolvedCount = tickets.filter((ticket) => ["Resolved", "Closed"].includes(ticket.status)).length;
    const resolutionRate = tickets.length ? Math.round((resolvedCount / tickets.length) * 100) : 0;
    const thisWeek = weeklyVolume.reduce((sum, day) => sum + day.count, 0);
    const activeAgents = users.filter((user) => user.role === "technician" && user.isActive !== false).length;

    return {
      weeklyVolume,
      categoryBreakdown,
      thisWeek,
      resolutionRate,
      activeAgents,
      averageResolution: getAverageResolutionHours(tickets),
    };
  }, [tickets, users]);

  return (
    <DashboardLayout title="Analytics">
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-7 h-7 animate-spin text-primary mr-2" />
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatsCard icon={Ticket} label="This Week" value={analytics.thisWeek} variant="primary" />
            <StatsCard icon={TrendingUp} label="Resolution Rate" value={`${analytics.resolutionRate}%`} variant="success" />
            <StatsCard icon={BarChart3} label="Avg Time" value={analytics.averageResolution} variant="info" />
            <StatsCard icon={Users} label="Active Agents" value={analytics.activeAgents} variant="warning" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Weekly Volume</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.weeklyVolume}>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">By Category</h3>
              {analytics.categoryBreakdown.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={analytics.categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {analytics.categoryBreakdown.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {analytics.categoryBreakdown.map((category) => (
                      <span key={category.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} /> {category.name}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No ticket categories yet.
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
