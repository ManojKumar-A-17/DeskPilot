import DashboardLayout from "@/components/DashboardLayout";
import TicketCard from "@/components/TicketCard";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const tickets = [
  { id: "1024", title: "VPN not connecting on office network", description: "Unable to connect to VPN.", status: "in_progress" as const, priority: "high" as const, slaTime: "2h 15m", assignee: "Alex Chen", createdAt: "2h ago" },
  { id: "1022", title: "Printer not responding on 3rd floor", description: "HP LaserJet showing offline.", status: "urgent" as const, priority: "critical" as const, slaTime: "0h 45m", assignee: "Sarah Kim", createdAt: "4h ago" },
  { id: "1020", title: "Slow laptop performance", description: "Windows update caused lag.", status: "open" as const, priority: "medium" as const, slaTime: "5h", createdAt: "6h ago" },
  { id: "1019", title: "New software license request", description: "Need Adobe Creative Suite.", status: "open" as const, priority: "medium" as const, slaTime: "6h", createdAt: "5h ago" },
  { id: "1018", title: "Employee onboarding IT setup", description: "New hire workstation setup.", status: "open" as const, priority: "low" as const, slaTime: "24h", assignee: "Mike Johnson", createdAt: "1d ago" },
  { id: "1015", title: "Email signature update", description: "Update signature with new title.", status: "resolved" as const, priority: "low" as const, assignee: "Lisa Park", createdAt: "1d ago" },
];

const AllTickets = () => {
  const [search, setSearch] = useState("");
  const filtered = tickets.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="All Tickets">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search all tickets..." className="w-full bg-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ticket, i) => (
          <motion.div key={ticket.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <TicketCard {...ticket} />
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AllTickets;
