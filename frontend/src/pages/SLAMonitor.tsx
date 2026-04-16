import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, CheckCircle2, Clock, Zap } from "lucide-react";

const slaTickets = [
  { id: "1024", title: "VPN not connecting", slaTime: "0h 45m", risk: "critical" },
  { id: "1022", title: "Printer not responding", slaTime: "3h 20m", risk: "warning" },
  { id: "1020", title: "Slow laptop performance", slaTime: "5h 00m", risk: "safe" },
  { id: "1018", title: "Employee onboarding setup", slaTime: "22h 00m", risk: "safe" },
  { id: "1019", title: "Software license request", slaTime: "4h 30m", risk: "warning" },
];

const riskColors: Record<string, string> = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-[hsl(var(--warning))] bg-[hsl(var(--warning))]/5",
  safe: "border-l-[hsl(var(--success))] bg-[hsl(var(--success))]/5",
};

const SLAMonitor = () => {
  return (
    <DashboardLayout title="SLA Monitor">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatsCard icon={Shield} label="Compliance" value="94%" variant="primary" />
        <StatsCard icon={AlertTriangle} label="At Risk" value={3} variant="warning" />
        <StatsCard icon={CheckCircle2} label="Met SLA" value={132} variant="success" />
        <StatsCard icon={Clock} label="Avg Response" value="18m" variant="info" />
      </div>

      <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
        <Zap className="w-4 h-4 text-primary" /> Active SLA Tracking
      </h3>
      <div className="space-y-3">
        {slaTickets.map((ticket, i) => (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass rounded-xl p-4 border-l-4 ${riskColors[ticket.risk]} flex items-center justify-between`}
          >
            <div>
              <p className="text-sm font-medium text-foreground">#{ticket.id} — {ticket.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Time remaining: {ticket.slaTime}</p>
            </div>
            <span className={`text-xs font-medium capitalize px-2.5 py-1 rounded-lg ${
              ticket.risk === "critical" ? "bg-destructive/15 text-destructive" :
              ticket.risk === "warning" ? "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]" :
              "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]"
            }`}>
              {ticket.risk}
            </span>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default SLAMonitor;
