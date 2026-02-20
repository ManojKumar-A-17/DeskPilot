import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Search, UserPlus, Sparkles } from "lucide-react";
import { useState } from "react";

const unassigned = [
  { id: "1020", title: "Slow laptop performance", priority: "medium", category: "Hardware" },
  { id: "1019", title: "New software license request", priority: "medium", category: "Software" },
  { id: "1017", title: "Conference room projector issue", priority: "low", category: "Hardware" },
];

const technicians = [
  { name: "Alex Chen", speciality: "Network", load: 3 },
  { name: "Sarah Kim", speciality: "Hardware", load: 5 },
  { name: "Mike Johnson", speciality: "Software", load: 2 },
  { name: "Lisa Park", speciality: "Access", load: 4 },
];

const AssignTicket = () => {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  return (
    <DashboardLayout title="Assign Tickets">
      <div className="glass rounded-2xl p-4 mb-6 flex items-center gap-3 border-primary/20">
        <div className="gradient-primary rounded-xl p-2.5 shrink-0">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">AI Auto-Assignment</p>
          <p className="text-xs text-muted-foreground">ThinkAuto AI recommends the best technician based on expertise and workload.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">Unassigned Tickets</h3>
          <div className="space-y-3">
            {unassigned.map((ticket, i) => (
              <motion.button
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`w-full text-left glass rounded-xl p-4 transition-all ${selectedTicket === ticket.id ? "border-primary/50 glow-orange" : "hover:border-primary/20"}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">#{ticket.id} — {ticket.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ticket.category} · {ticket.priority}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display font-semibold text-foreground mb-3">Technicians</h3>
          <div className="space-y-3">
            {technicians.map((tech, i) => (
              <motion.button
                key={tech.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                disabled={!selectedTicket}
                className="w-full text-left glass rounded-xl p-4 hover:border-primary/20 transition-all disabled:opacity-50 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                  {tech.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tech.name}</p>
                  <p className="text-xs text-muted-foreground">{tech.speciality} · {tech.load} active tickets</p>
                </div>
                <UserPlus className="w-4 h-4 text-primary" />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssignTicket;
