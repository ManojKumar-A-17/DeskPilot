import DashboardLayout from "@/components/DashboardLayout";
import StatsCard from "@/components/StatsCard";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Loader2, Shield, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const riskColors: Record<string, string> = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-[hsl(var(--warning))] bg-[hsl(var(--warning))]/5",
  safe: "border-l-[hsl(var(--success))] bg-[hsl(var(--success))]/5",
};

const formatDuration = (milliseconds: number) => {
  const abs = Math.abs(milliseconds);
  const hours = Math.floor(abs / (1000 * 60 * 60));
  const minutes = Math.floor((abs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

const getRisk = (deadline?: string) => {
  if (!deadline) return "safe";

  const remaining = new Date(deadline).getTime() - Date.now();
  if (remaining <= 0) return "critical";
  if (remaining <= 4 * 60 * 60 * 1000) return "warning";
  return "safe";
};

const SLAMonitor = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await api.getTickets();
        if (response.success) {
          setTickets(response.data.tickets || []);
        }
      } catch (error: any) {
        toast.error("Failed to load SLA data", {
          description: error.message || "Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const sla = useMemo(() => {
    const activeTickets = tickets.filter((ticket) => !["Resolved", "Closed"].includes(ticket.status));
    const trackedTickets = activeTickets
      .filter((ticket) => ticket.sla?.resolutionDeadline)
      .map((ticket) => {
        const deadline = ticket.sla.resolutionDeadline;
        const remaining = new Date(deadline).getTime() - Date.now();
        const risk = getRisk(deadline);

        return {
          ...ticket,
          risk,
          remaining,
          slaTime: remaining <= 0 ? `${formatDuration(remaining)} overdue` : formatDuration(remaining),
        };
      })
      .sort((a, b) => a.remaining - b.remaining);

    const breached = trackedTickets.filter((ticket) => ticket.risk === "critical").length;
    const warning = trackedTickets.filter((ticket) => ticket.risk === "warning").length;
    const met = tickets.filter((ticket) => ["Resolved", "Closed"].includes(ticket.status) && !ticket.sla?.breached).length;
    const compliance = tickets.length ? Math.round(((tickets.length - breached) / tickets.length) * 100) : 100;

    return {
      trackedTickets,
      breached,
      warning,
      atRisk: breached + warning,
      met,
      compliance,
    };
  }, [tickets]);

  return (
    <DashboardLayout title="SLA Monitor">
      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-7 h-7 animate-spin text-primary mr-2" />
          Loading SLA data...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatsCard icon={Shield} label="Compliance" value={`${sla.compliance}%`} variant="primary" />
            <StatsCard icon={AlertTriangle} label="At Risk" value={sla.atRisk} variant="warning" />
            <StatsCard icon={CheckCircle2} label="Met SLA" value={sla.met} variant="success" />
            <StatsCard icon={Clock} label="Breached" value={sla.breached} variant="info" />
          </div>

          <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Active SLA Tracking
          </h3>
          <div className="space-y-3">
            {sla.trackedTickets.map((ticket, i) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`glass rounded-xl p-4 border-l-4 ${riskColors[ticket.risk]} flex items-center justify-between gap-4`}
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    #{ticket.ticketNumber || ticket._id.slice(-6)} - {ticket.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Resolution SLA: {ticket.slaTime}
                  </p>
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

            {sla.trackedTickets.length === 0 && (
              <div className="glass rounded-xl p-8 text-center text-muted-foreground">
                No active SLA-tracked tickets right now.
              </div>
            )}
          </div>
        </>
      )}
    </DashboardLayout>
  );
};

export default SLAMonitor;
