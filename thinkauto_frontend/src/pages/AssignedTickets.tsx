import DashboardLayout from "@/components/DashboardLayout";
import TicketCard from "@/components/TicketCard";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";

const tickets = [
  { id: "1024", title: "VPN not connecting on office network", description: "Unable to connect to corporate VPN since morning.", status: "urgent" as const, priority: "critical" as const, slaTime: "0h 45m", assignee: "You", createdAt: "2h ago" },
  { id: "1022", title: "Printer not responding on 3rd floor", description: "HP LaserJet on floor 3 is showing offline status.", status: "in_progress" as const, priority: "high" as const, slaTime: "3h 20m", assignee: "You", createdAt: "4h ago" },
  { id: "1020", title: "Slow laptop performance after update", description: "Windows update caused significant lag.", status: "open" as const, priority: "medium" as const, slaTime: "5h", assignee: "You", createdAt: "6h ago" },
  { id: "1018", title: "New employee onboarding - IT setup", description: "Set up workstation, email, VPN for new hire.", status: "open" as const, priority: "low" as const, slaTime: "24h", assignee: "You", createdAt: "1d ago" },
  { id: "1016", title: "Outlook calendar sync issue", description: "Calendar not syncing across devices.", status: "in_progress" as const, priority: "medium" as const, slaTime: "4h", assignee: "You", createdAt: "1d ago" },
];

const AssignedTickets = () => {
  const [search, setSearch] = useState("");
  const filtered = tickets.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="Assigned Tickets">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assigned tickets..." className="w-full bg-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div className="space-y-3">
        {filtered.map((ticket, i) => (
          <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <TicketCard {...ticket} />
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AssignedTickets;
