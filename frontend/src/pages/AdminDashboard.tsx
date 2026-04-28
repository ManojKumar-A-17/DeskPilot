import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  Loader2,
  Shield,
  Ticket,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const colors = [
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

const dayLabel = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short" });

const AdminDashboard = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [ticketResponse, userResponse] = await Promise.all([
          api.getTickets(),
          api.getUsers(),
        ]);

        if (ticketResponse.success) setTickets(ticketResponse.data.tickets || []);
        if (userResponse.success) setUsers(userResponse.data.users || []);
      } catch (error: any) {
        toast.error("Failed to load command center", {
          description: error.message || "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const data = useMemo(() => {
    const now = new Date();
    const days = Array.from({ length: 7 }).map((_, index) => {
      const day = new Date(now);
      day.setDate(now.getDate() - (6 - index));
      return day;
    });

    const ticketTrend = days.map((day) => ({
      name: dayLabel(day),
      tickets: tickets.filter((ticket) => new Date(ticket.createdAt).toDateString() === day.toDateString()).length,
    }));

    const resolutionData = days.slice(-5).map((day) => ({
      name: dayLabel(day),
      created: tickets.filter((ticket) => new Date(ticket.createdAt).toDateString() === day.toDateString()).length,
      resolved: tickets.filter((ticket) => {
        const resolvedAt = ticket.resolution?.resolvedAt;
        return resolvedAt && new Date(resolvedAt).toDateString() === day.toDateString();
      }).length,
    }));

    const categoryMap = tickets.reduce((acc, ticket) => {
      const category = ticket.category || "Other";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const categoryData = Object.entries(categoryMap).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length],
    }));

    const activeTickets = tickets.filter((ticket) => !["Resolved", "Closed"].includes(ticket.status));
    const resolvedTickets = tickets.filter((ticket) => ["Resolved", "Closed"].includes(ticket.status));
    const breached = activeTickets.filter((ticket) => {
      const deadline = ticket.sla?.resolutionDeadline;
      return deadline && new Date(deadline).getTime() < Date.now();
    }).length;
    const atRisk = activeTickets.filter((ticket) => {
      const deadline = ticket.sla?.resolutionDeadline;
      if (!deadline) return false;
      const remaining = new Date(deadline).getTime() - Date.now();
      return remaining > 0 && remaining <= 4 * 60 * 60 * 1000;
    }).length;
    const slaCompliance = tickets.length ? Math.round(((tickets.length - breached) / tickets.length) * 100) : 100;

    const technicians = users.filter((user) => user.role === "technician");
    const teamMembers = technicians.map((technician) => {
      const assigned = tickets.filter((ticket) => ticket.assignedTo?._id === technician._id);
      const resolved = assigned.filter((ticket) => ["Resolved", "Closed"].includes(ticket.status)).length;
      const pending = assigned.filter((ticket) => !["Resolved", "Closed"].includes(ticket.status)).length;

      return {
        name: technician.name || technician.email,
        resolved,
        pending,
        completion: assigned.length ? Math.round((resolved / assigned.length) * 100) : 0,
      };
    });

    return {
      ticketTrend,
      resolutionData,
      categoryData,
      teamMembers,
      totalTickets: tickets.length,
      resolvedTickets: resolvedTickets.length,
      activeTickets: activeTickets.length,
      slaCompliance,
      breached,
      atRisk,
    };
  }, [tickets, users]);

  return (
    <DashboardLayout title="Command Center">
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-7 h-7 animate-spin text-primary mr-2" />
          Loading command center...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard icon={Ticket} label="Total Tickets" value={data.totalTickets} variant="primary" />
            <StatsCard icon={CheckCircle2} label="Resolved" value={data.resolvedTickets} variant="success" />
            <StatsCard icon={Clock} label="Active" value={data.activeTickets} variant="info" />
            <StatsCard icon={Shield} label="SLA Compliance" value={`${data.slaCompliance}%`} variant="warning" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Ticket Volume</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data.ticketTrend}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">Resolution Trend</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.resolutionData}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="created" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="resolved" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-5">
              <h3 className="font-display font-semibold text-foreground mb-4">By Category</h3>
              {data.categoryData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={data.categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                        {data.categoryData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {data.categoryData.map((category) => (
                      <span key={category.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                        {category.name}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  No category data yet.
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-foreground">Team Performance</h3>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-3">
                {data.teamMembers.map((member, i) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                      {member.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}
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
                      </div>
                    </div>
                    <div className="w-24">
                      <div className="w-full bg-secondary rounded-full h-1.5">
                        <div className="gradient-primary rounded-full h-1.5" style={{ width: `${member.completion}%` }} />
                      </div>
                    </div>
                  </motion.div>
                ))}

                {data.teamMembers.length === 0 && (
                  <div className="text-sm text-muted-foreground">No technicians found yet.</div>
                )}
              </div>
            </motion.div>
          </div>

          <h2 className="text-lg font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" /> System Alerts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { text: `${data.atRisk} tickets approaching SLA breach`, type: "warning" },
              { text: `${data.breached} tickets breached SLA`, type: "warning" },
              { text: `${data.activeTickets} tickets currently active`, type: "info" },
            ].map((alert, i) => (
              <motion.div
                key={alert.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass rounded-xl p-4 border-l-4 ${
                  alert.type === "warning" ? "border-l-[hsl(var(--warning))]" : "border-l-[hsl(var(--info))]"
                }`}
              >
                <p className="text-sm text-foreground">{alert.text}</p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default AdminDashboard;
