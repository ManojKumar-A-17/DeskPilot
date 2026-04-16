import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import TicketCard from "@/components/TicketCard";
import { motion } from "framer-motion";
import { Inbox, Clock, CheckCircle2, TrendingUp, Zap, Timer } from "lucide-react";

const assignedTickets = [
  { id: "1024", title: "VPN not connecting on office network", description: "Unable to connect to corporate VPN since morning.", status: "urgent" as const, priority: "critical" as const, slaTime: "0h 45m", assignee: "You", createdAt: "2h ago" },
  { id: "1022", title: "Printer not responding on 3rd floor", description: "HP LaserJet on floor 3 is showing offline status.", status: "in_progress" as const, priority: "high" as const, slaTime: "3h 20m", assignee: "You", createdAt: "4h ago" },
  { id: "1020", title: "Slow laptop performance after update", description: "Windows update caused significant lag on Dell Latitude.", status: "open" as const, priority: "medium" as const, slaTime: "5h", assignee: "You", createdAt: "6h ago" },
  { id: "1018", title: "New employee onboarding - IT setup", description: "Set up workstation, email, VPN access for new hire.", status: "open" as const, priority: "low" as const, slaTime: "24h", assignee: "You", createdAt: "1d ago" },
];

const TechnicianDashboard = () => {
  return (
    <DashboardLayout title="Your Workflow">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Inbox} label="Assigned" value={8} variant="primary" />
        <StatsCard icon={Timer} label="SLA At Risk" value={2} variant="warning" trend="-1" />
        <StatsCard icon={CheckCircle2} label="Resolved Today" value={5} variant="success" trend="+3" />
        <StatsCard icon={TrendingUp} label="Avg Resolution" value="2.4h" variant="info" />
      </div>

      {/* SLA Alert */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass rounded-2xl p-5 mb-8 border-destructive/30 flex items-center gap-4"
      >
        <div className="bg-destructive/15 rounded-xl p-3">
          <Zap className="w-5 h-5 text-destructive" />
        </div>
        <div className="flex-1">
          <p className="font-display font-semibold text-foreground">SLA Alert</p>
          <p className="text-sm text-muted-foreground">Ticket #1024 is approaching SLA breach in 45 minutes</p>
        </div>
        <button className="gradient-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl">
          Take Action
        </button>
      </motion.div>

      {/* Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "This Week", resolved: 18, target: 20 },
          { label: "SLA Compliance", resolved: 92, target: 95 },
          { label: "Customer Rating", resolved: 4.7, target: 5 },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-5"
          >
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-2xl font-display font-bold text-foreground">
                {metric.resolved}
                {metric.label === "Customer Rating" ? "/5" : metric.label === "SLA Compliance" ? "%" : ""}
              </span>
              <span className="text-xs text-muted-foreground mb-1">/ {metric.target}{metric.label === "SLA Compliance" ? "%" : ""}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="gradient-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${(metric.resolved / metric.target) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Ticket Stream */}
      <h2 className="text-lg font-display font-semibold text-foreground mb-4">Assigned Tickets</h2>
      <div className="space-y-3">
        {assignedTickets.map((ticket) => (
          <TicketCard key={ticket.id} {...ticket} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default TechnicianDashboard;
