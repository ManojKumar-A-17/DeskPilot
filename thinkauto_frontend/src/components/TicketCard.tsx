import { motion } from "framer-motion";
import { Clock, AlertTriangle, CheckCircle2, Circle, ArrowRight } from "lucide-react";

export type TicketStatus = "open" | "in_progress" | "resolved" | "urgent";
export type TicketPriority = "low" | "medium" | "high" | "critical";

interface TicketCardProps {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  slaTime?: string;
  assignee?: string;
  createdAt: string;
  onClick?: () => void;
}

const statusConfig = {
  open: { icon: Circle, label: "Open", color: "text-[hsl(var(--info))]", bg: "bg-[hsl(var(--info)/.1)]" },
  in_progress: { icon: Clock, label: "In Progress", color: "text-[hsl(var(--warning))]", bg: "bg-[hsl(var(--warning)/.1)]" },
  resolved: { icon: CheckCircle2, label: "Resolved", color: "text-[hsl(var(--success))]", bg: "bg-[hsl(var(--success)/.1)]" },
  urgent: { icon: AlertTriangle, label: "Urgent", color: "text-destructive", bg: "bg-destructive/10" },
};

const priorityColors = {
  low: "bg-[hsl(var(--info)/.15)] text-[hsl(var(--info))]",
  medium: "bg-[hsl(var(--warning)/.15)] text-[hsl(var(--warning))]",
  high: "bg-primary/15 text-primary",
  critical: "bg-destructive/15 text-destructive",
};

const TicketCard = ({ id, title, description, status, priority, slaTime, assignee, createdAt, onClick }: TicketCardProps) => {
  const StatusIcon = statusConfig[status].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className="glass rounded-2xl p-5 cursor-pointer hover:border-primary/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">#{id}</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[priority]}`}>
            {priority}
          </span>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${statusConfig[status].bg} ${statusConfig[status].color}`}>
          <StatusIcon className="w-3 h-3" />
          {statusConfig[status].label}
        </div>
      </div>

      <h3 className="font-display font-semibold text-foreground mb-1 line-clamp-1">{title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {slaTime && (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {slaTime}
            </span>
          )}
          <span>{createdAt}</span>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
      </div>

      {assignee && (
        <div className="mt-3 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">Assigned to: </span>
          <span className="text-xs font-medium text-foreground">{assignee}</span>
        </div>
      )}
    </motion.div>
  );
};

export default TicketCard;
