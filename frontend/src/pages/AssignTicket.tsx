import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Loader2, RefreshCw, Sparkles, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const getInitials = (name = "Technician") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const normalizeCategory = (value = "") => value.toLowerCase().replace("&", "and");

const AssignTicket = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketResponse, technicianResponse] = await Promise.all([
        api.getTickets(),
        api.getTechnicians(),
      ]);

      if (ticketResponse.success) {
        setTickets(ticketResponse.data.tickets || []);
      }

      if (technicianResponse.success) {
        setTechnicians(technicianResponse.data.technicians || []);
      }
    } catch (error: any) {
      toast.error("Failed to load assignment data", {
        description: error.message || "Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unassignedTickets = useMemo(
    () => tickets.filter((ticket) => !ticket.assignedTo && !["Resolved", "Closed"].includes(ticket.status)),
    [tickets]
  );

  const selectedTicket = unassignedTickets.find((ticket) => ticket._id === selectedTicketId) || unassignedTickets[0];

  useEffect(() => {
    if (!selectedTicketId && unassignedTickets.length > 0) {
      setSelectedTicketId(unassignedTickets[0]._id);
    }
  }, [selectedTicketId, unassignedTickets]);

  const technicianRows = useMemo(() => {
    return technicians.map((technician) => {
      const activeTickets = tickets.filter(
        (ticket) =>
          ticket.assignedTo?._id === technician._id &&
          !["Resolved", "Closed"].includes(ticket.status)
      ).length;

      const specialty = technician.department || "General IT";
      const categoryMatch =
        selectedTicket &&
        normalizeCategory(specialty).includes(normalizeCategory(selectedTicket.category));

      return {
        ...technician,
        activeTickets,
        specialty,
        recommended: Boolean(categoryMatch),
      };
    }).sort((a, b) => {
      if (a.recommended !== b.recommended) return a.recommended ? -1 : 1;
      return a.activeTickets - b.activeTickets;
    });
  }, [technicians, tickets, selectedTicket]);

  const handleAssign = async (technicianId: string) => {
    if (!selectedTicket) return;

    try {
      setAssigningId(technicianId);
      const response = await api.assignTicket(selectedTicket._id, technicianId);

      if (response.success) {
        toast.success("Ticket assigned", {
          description: `${selectedTicket.ticketNumber || selectedTicket.title} is now assigned.`,
        });
        await fetchData();
        setSelectedTicketId(null);
      }
    } catch (error: any) {
      toast.error("Assignment failed", {
        description: error.message || "Please try again.",
      });
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <DashboardLayout title="Assign Tickets">
      <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 border-primary/20">
        <div className="flex items-center gap-3">
          <div className="gradient-primary rounded-xl p-2.5 shrink-0">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">AI-Assisted Assignment</p>
            <p className="text-xs text-muted-foreground">
              Technicians are sorted by matching department and active workload.
            </p>
          </div>
        </div>
        <button
          onClick={fetchData}
          className="bg-secondary text-primary rounded-xl p-2.5 hover:bg-secondary/70 transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="w-7 h-7 animate-spin text-primary mr-2" />
          Loading live assignment data...
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-6">
          <div>
            <h3 className="font-display font-semibold text-foreground mb-3">
              Unassigned Tickets ({unassignedTickets.length})
            </h3>
            <div className="space-y-3">
              {unassignedTickets.map((ticket, i) => (
                <motion.button
                  key={ticket._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setSelectedTicketId(ticket._id)}
                  className={`w-full text-left glass rounded-xl p-4 transition-all ${
                    selectedTicket?._id === ticket._id ? "border-primary/60 glow-orange" : "hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        #{ticket.ticketNumber || ticket._id.slice(-6)} - {ticket.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{ticket.description}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-lg bg-primary/10 text-primary">
                      {ticket.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {ticket.category} / {ticket.status}
                  </p>
                </motion.button>
              ))}

              {unassignedTickets.length === 0 && (
                <div className="glass rounded-xl p-8 text-center text-muted-foreground">
                  No unassigned active tickets right now.
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-display font-semibold text-foreground mb-3">
              Technicians ({technicianRows.length})
            </h3>
            <div className="space-y-3">
              {technicianRows.map((tech, i) => (
                <motion.button
                  key={tech._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  disabled={!selectedTicket || assigningId === tech._id}
                  onClick={() => handleAssign(tech._id)}
                  className="w-full text-left glass rounded-xl p-4 hover:border-primary/30 transition-all disabled:opacity-50 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                    {getInitials(tech.name || tech.email)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{tech.name || tech.email}</p>
                      {tech.recommended && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tech.specialty} / {tech.activeTickets} active tickets
                    </p>
                  </div>
                  {assigningId === tech._id ? (
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  ) : (
                    <UserPlus className="w-4 h-4 text-primary" />
                  )}
                </motion.button>
              ))}

              {technicianRows.length === 0 && (
                <div className="glass rounded-xl p-8 text-center text-muted-foreground">
                  No active technicians found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AssignTicket;
