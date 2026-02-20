import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import TicketCard from "@/components/TicketCard";
import { motion } from "framer-motion";
import { Plus, ListTodo, BookOpen, Clock, Ticket, CheckCircle2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const quickActions = [
  { icon: Plus, label: "Raise Ticket", desc: "Create a new support ticket", path: "/employee/raise-ticket", gradient: true },
  { icon: ListTodo, label: "My Tickets", desc: "View all your tickets", path: "/employee/my-tickets", gradient: false },
  { icon: BookOpen, label: "Knowledge Base", desc: "Browse solutions", path: "/employee/knowledge-base", gradient: false },
];

const mockTickets = [
  { id: "1024", title: "VPN not connecting on office network", description: "Unable to connect to corporate VPN since morning. Getting timeout error.", status: "in_progress" as const, priority: "high" as const, slaTime: "2h 15m", createdAt: "2h ago" },
  { id: "1019", title: "Request for new software license", description: "Need Adobe Creative Suite license for marketing project.", status: "open" as const, priority: "medium" as const, slaTime: "6h", createdAt: "5h ago" },
  { id: "1015", title: "Email signature update", description: "Please update my email signature with new title.", status: "resolved" as const, priority: "low" as const, createdAt: "1d ago" },
];

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="Welcome back 👋">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <motion.button
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => navigate(action.path)}
            className={`p-5 rounded-2xl text-left transition-all group ${
              action.gradient
                ? "gradient-primary text-primary-foreground glow-orange hover:opacity-90"
                : "glass hover:border-primary/30"
            }`}
          >
            <action.icon className={`w-6 h-6 mb-3 ${action.gradient ? "" : "text-primary"}`} />
            <p className="font-display font-semibold">{action.label}</p>
            <p className={`text-sm mt-1 ${action.gradient ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {action.desc}
            </p>
          </motion.button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Ticket} label="Total Tickets" value={12} variant="primary" />
        <StatsCard icon={Clock} label="Pending" value={3} variant="warning" />
        <StatsCard icon={CheckCircle2} label="Resolved" value={8} variant="success" />
        <StatsCard icon={AlertTriangle} label="Urgent" value={1} variant="info" />
      </div>

      {/* Recent Tickets */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-foreground">Recent Tickets</h2>
        <button className="text-sm text-primary hover:underline">View all</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockTickets.map((ticket) => (
          <TicketCard key={ticket.id} {...ticket} />
        ))}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
