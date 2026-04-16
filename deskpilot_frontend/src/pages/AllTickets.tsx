import DashboardLayout from "@/components/DashboardLayout";
import TicketCard from "@/components/TicketCard";
import { motion } from "framer-motion";
import { Search, Filter, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

const AllTickets = () => {
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchAllTickets = async () => {
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
    fetchAllTickets();
  }, []);

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'Open': 'open',
      'In Progress': 'in_progress',
      'Resolved': 'resolved',
      'Urgent': 'urgent'
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

  const filtered = tickets.filter((ticket: any) =>
    ticket.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="All Tickets">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search all tickets..." 
            className="w-full bg-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50" 
          />
        </div>
        <Button
          onClick={fetchAllTickets}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading tickets...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((ticket: any, i: number) => (
            <motion.div key={ticket._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <TicketCard 
                id={ticket._id}
                title={ticket.title}
                description={ticket.description}
                status={formatStatus(ticket.status)}
                priority={formatPriority(ticket.priority)}
                assignee={ticket.assignedTo?.name || 'Unassigned'}
                createdAt={formatTimeAgo(ticket.createdAt)}
                onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
              />
            </motion.div>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground text-sm col-span-full text-center py-12">
              {tickets.length === 0 ? 'No tickets available.' : 'No tickets found matching your search.'}
            </p>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllTickets;
