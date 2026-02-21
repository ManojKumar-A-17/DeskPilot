import DashboardLayout from "@/components/DashboardLayout";
import TicketCard from "@/components/TicketCard";
import { motion } from "framer-motion";
import { Search, Filter, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

const filters = ["All", "Open", "In Progress", "Resolved", "Closed"];

const MyTickets = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyTickets = async () => {
    try {
      setLoading(true);
      const response = await api.getTickets();
      
      if (response.success) {
        setTickets(response.data.tickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTickets();
  }, []);

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Open': 'open',
      'In Progress': 'in_progress',
      'Resolved': 'resolved',
      'Closed': 'resolved'
    };
    return statusMap[status] || status.toLowerCase();
  };

  const formatPriority = (priority: string) => {
    return priority.toLowerCase();
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const filtered = tickets.filter((t: any) => {
    const matchFilter = activeFilter === "All" || t.status === activeFilter;
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
        <div className="flex gap-2 items-center">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                activeFilter === f ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
          <Button
            onClick={fetchMyTickets}
            variant="outline"
            size="sm"
            className="ml-2"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading your tickets...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ticket: any, i: number) => (
            <motion.div key={ticket._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <TicketCard
                id={ticket._id}
                title={ticket.title}
                description={ticket.description}
                status={formatStatus(ticket.status)}
                priority={formatPriority(ticket.priority)}
                createdAt={formatTimeAgo(ticket.createdAt)}
                onClick={() => navigate(`/employee/tickets/${ticket._id}`)}
              />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-sm col-span-full text-center py-12">
              {tickets.length === 0 ? 'No tickets created yet.' : 'No tickets found matching your filters.'}
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyTickets;
