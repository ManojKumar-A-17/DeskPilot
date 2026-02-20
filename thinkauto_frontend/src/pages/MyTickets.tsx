import DashboardLayout from "@/components/DashboardLayout";
import TicketCard from "@/components/TicketCard";
import { motion } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const allTickets = [
  { id: "1024", title: "VPN not connecting on office network", description: "Unable to connect to corporate VPN since morning.", status: "in_progress" as const, priority: "high" as const, slaTime: "2h 15m", createdAt: "2h ago" },
  { id: "1019", title: "Request for new software license", description: "Need Adobe Creative Suite license for marketing project.", status: "open" as const, priority: "medium" as const, slaTime: "6h", createdAt: "5h ago" },
  { id: "1015", title: "Email signature update", description: "Please update my email signature with new title.", status: "resolved" as const, priority: "low" as const, createdAt: "1d ago" },
  { id: "1010", title: "Monitor flickering intermittently", description: "Dell 27\" monitor flickers every few minutes.", status: "open" as const, priority: "medium" as const, slaTime: "8h", createdAt: "2d ago" },
  { id: "1005", title: "Access to shared drive", description: "Need access to Marketing shared drive.", status: "resolved" as const, priority: "low" as const, createdAt: "3d ago" },
];

const filters = ["All", "Open", "In Progress", "Resolved"];

const MyTickets = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allTickets.filter((t) => {
    const matchFilter = activeFilter === "All" || t.status.replace("_", " ").toLowerCase() === activeFilter.toLowerCase();
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <DashboardLayout title="My Tickets">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            className="w-full bg-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                activeFilter === f ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((ticket, i) => (
          <motion.div key={ticket.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <TicketCard {...ticket} />
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full text-center py-12">No tickets found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTickets;
