import DashboardLayout from "@/components/DashboardLayout";
import TicketCard from "@/components/TicketCard";
import { motion } from "framer-motion";
import { Search, Loader2, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";

const AssignedTickets = () => {
  const [search, setSearch] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingTickets, setCompletingTickets] = useState(new Set());
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const fetchAssignedTickets = async () => {
    try {
      setLoading(true);
      const response = await api.getTickets();
      if (response.success) {
        // Filter for tickets assigned to current user
        const assignedTickets = response.data.tickets.filter(
          (ticket: any) => ticket.assignedTo?._id === user?._id
        );
        setTickets(assignedTickets);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch assigned tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTicket = async (ticketId: string) => {
    try {
      setCompletingTickets(prev => new Set(prev).add(ticketId));
      
      const response = await api.updateTicket(ticketId, { status: 'Resolved' });
      
      if (response.success) {
        toast.success('Ticket marked as completed successfully!');
        // Update the ticket in the local state
        setTickets(prev => prev.map((ticket: any) => 
          ticket._id === ticketId 
            ? { ...ticket, status: 'Resolved' }
            : ticket
        ));
      }
    } catch (error) {
      console.error('Error completing ticket:', error);
      toast.error('Failed to complete ticket. Please try again.');
    } finally {
      setCompletingTickets(prev => {
        const newSet = new Set(prev);
        newSet.delete(ticketId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchAssignedTickets();
  }, []);

  const filtered = tickets.filter((ticket: any) => 
    ticket.title.toLowerCase().includes(search.toLowerCase())
  );

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

  if (loading) {
    return (
      <DashboardLayout title="Assigned Tickets">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading assigned tickets...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Assigned Tickets">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search assigned tickets..." 
            className="w-full bg-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50" 
          />
        </div>
        <Button 
          onClick={fetchAssignedTickets}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {tickets.length === 0 
              ? "No tickets assigned to you yet." 
              : "No tickets match your search."
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ticket: any, i: number) => (
            <motion.div 
              key={ticket._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.05 }}
            >
              <TicketCard 
                id={ticket._id}
                title={ticket.title}
                description={ticket.description}
                status={formatStatus(ticket.status)}
                priority={formatPriority(ticket.priority)}
                assignee="You"
                createdAt={formatTimeAgo(ticket.createdAt)}
                onClick={() => navigate(`/technician/tickets/${ticket._id}`)}
                showCompleteButton={true}
                onComplete={handleCompleteTicket}
                isCompleting={completingTickets.has(ticket._id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AssignedTickets;
