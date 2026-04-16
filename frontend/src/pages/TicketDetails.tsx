import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Clock, User, Tag, MessageSquare, Paperclip, CheckCircle2, AlertTriangle, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const TicketDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  useEffect(() => {
    fetchTicketDetails();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      setLoading(true);
      const response = await api.getTicket(id);
      
      if (response.success) {
        setTicket(response.data.ticket);
      }
    } catch (error) {
      console.error('Error fetching ticket:', error);
      toast.error('Failed to load ticket details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim() || addingComment) return;

    try {
      setAddingComment(true);
      const response = await api.addComment(id, comment);
      
      if (response.success) {
        toast.success('Comment added successfully');
        setComment("");
        fetchTicketDetails(); // Refresh ticket to show new comment
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setAddingComment(false);
    }
  };

  const formatStatus = (status: string) => {
    const statusMap: { [key: string]: any } = {
      'Open': { label: 'Open', color: 'bg-[hsl(var(--info))]/15 text-[hsl(var(--info))]' },
      'In Progress': { label: 'In Progress', color: 'bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]' },
      'Resolved': { label: 'Resolved', color: 'bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]' },
      'Closed': { label: 'Closed', color: 'bg-muted text-muted-foreground' }
    };
    return statusMap[status] || statusMap['Open'];
  };

  const formatPriority = (priority: string) => {
    const priorityMap: { [key: string]: any } = {
      'Low': { label: 'Low', color: 'bg-[hsl(var(--info))]/15 text-[hsl(var(--info))]' },
      'Medium': { label: 'Medium', color: 'bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]' },
      'High': { label: 'High', color: 'bg-primary/15 text-primary' },
      'Critical': { label: 'Critical', color: 'bg-destructive/15 text-destructive' }
    };
    return priorityMap[priority] || priorityMap['Medium'];
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
      <DashboardLayout title="Loading...">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading ticket details...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (!ticket) {
    return (
      <DashboardLayout title="Not Found">
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Ticket not found</p>
          <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go back</button>
        </div>
      </DashboardLayout>
    );
  }

  const statusInfo = formatStatus(ticket.status);
  const priorityInfo = formatPriority(ticket.priority);

  return (
    <DashboardLayout title={`Ticket #${ticket.ticketNumber || id.slice(-6)}`}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${priorityInfo.color}`}>{priorityInfo.label} Priority</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>
            </div>
            <h2 className="text-xl font-display font-bold text-foreground mb-2">{ticket.title}</h2>
            <p className="text-sm text-muted-foreground">{ticket.description}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
            <h3 className="font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" /> Comments ({ticket.comments?.length || 0})
            </h3>
            <div className="space-y-4">
              {ticket.comments && ticket.comments.length > 0 ? (
                ticket.comments.map((comment: any, index: number) => (
                  <div key={index} className="bg-secondary/50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                        {comment.user?.name?.[0] || 'U'}
                      </div>
                      <span className="text-sm font-medium text-foreground">{comment.user?.name || 'User'}</span>
                      <span className="text-xs text-muted-foreground">{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </div>
            <div className="mt-4">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..." 
                rows={3} 
                className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 resize-none" 
              />
              <button 
                onClick={handleAddComment}
                disabled={!comment.trim() || addingComment}
                className="mt-2 gradient-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addingComment ? 'Sending...' : 'Send'}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-5">
            <h3 className="font-display font-semibold text-foreground mb-3">Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" /> 
                <span>Created by: {ticket.createdBy?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="w-4 h-4" /> 
                <span>Assigned: {ticket.assignedTo?.name || 'Unassigned'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Tag className="w-4 h-4" /> 
                <span>Category: {ticket.category}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" /> 
                <span>Created: {formatTimeAgo(ticket.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Paperclip className="w-4 h-4" /> 
                <span>{ticket.attachments?.length || 0} attachments</span>
              </div>
            </div>
          </motion.div>

          {ticket.resolution?.resolvedAt && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-5 border-l-4 border-success">
              <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" /> Resolved
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{ticket.resolution.text || 'Ticket has been resolved'}</p>
              <p className="text-xs text-muted-foreground">
                Resolved by {ticket.resolution.resolvedBy?.name} • {formatTimeAgo(ticket.resolution.resolvedAt)}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TicketDetails;
