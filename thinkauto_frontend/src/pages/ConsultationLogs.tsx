import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Bot, Search, Filter, Calendar, Clock, User, MessageSquare, Download, Trash2, RefreshCw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface ConsultationLog {
  id: string;
  timestamp: Date;
  user: string;
  userId: string;
  query: string;
  response: string;
  duration: number; // in seconds
  category: string;
  resolved: boolean;
}

// Sample data - replace with API call
const sampleLogs: ConsultationLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: "John Doe",
    userId: "emp123",
    query: "How do I reset my email password?",
    response: "To reset your email password, follow these steps:\n1. Go to the IT portal login page\n2. Click on 'Forgot Password'\n3. Enter your employee ID\n4. Follow the instructions sent to your recovery email\n\nIf you don't have access to your recovery email, please create a support ticket and our IT team will assist you within 2 hours.",
    duration: 45,
    category: "Email",
    resolved: true,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    user: "Jane Smith",
    userId: "emp456",
    query: "My laptop won't connect to the office WiFi",
    response: "I can help you troubleshoot your WiFi connection. Try these steps:\n\n1. Forget the network and reconnect\n2. Check if WiFi is enabled on your laptop\n3. Restart your laptop\n4. Make sure you're using the correct network credentials\n\nIf the issue persists, it might be a hardware problem. Would you like me to create a support ticket for the IT team to check your laptop?",
    duration: 120,
    category: "Network",
    resolved: false,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    user: "Mike Johnson",
    userId: "emp789",
    query: "I need access to the finance dashboard",
    response: "Access to the finance dashboard requires manager approval. I can help you with the access request process:\n\n1. Submit an access request form through the IT portal\n2. Get approval from your department manager\n3. The IT team will grant access within 24 hours of approval\n\nWould you like me to guide you through the access request form?",
    duration: 90,
    category: "Access",
    resolved: true,
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    user: "Sarah Williams",
    userId: "emp321",
    query: "Excel keeps crashing when I open large files",
    response: "Excel crashes with large files can be caused by several factors:\n\n1. Insufficient RAM\n2. Outdated software version\n3. Corrupted Excel installation\n4. File size exceeding recommended limits\n\nI recommend:\n- Closing other applications\n- Updating Excel to the latest version\n- Breaking down large files into smaller workbooks\n\nIf the problem continues, I'll create a ticket for the software support team to investigate further.",
    duration: 180,
    category: "Software",
    resolved: true,
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    user: "David Brown",
    userId: "emp654",
    query: "How do I set up VPN for remote work?",
    response: "Setting up VPN for remote work:\n\n1. Download the company VPN client from the IT portal\n2. Install the application\n3. Use your employee credentials to log in\n4. Select the server closest to your location\n5. Click 'Connect'\n\nFor security reasons, VPN credentials expire every 90 days. Make sure to update them regularly. If you encounter any connection issues, please contact the IT helpdesk.",
    duration: 60,
    category: "Network",
    resolved: true,
  },
];

const ConsultationLogs = () => {
  const [logs, setLogs] = useState<ConsultationLog[]>(sampleLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<ConsultationLog | null>(null);
  const { toast } = useToast();

  const categories = ["Email", "Network", "Software", "Hardware", "Access", "Security"];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || log.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "resolved" && log.resolved) ||
      (statusFilter === "unresolved" && !log.resolved);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleExport = () => {
    const csvContent = [
      ["Timestamp", "User", "User ID", "Query", "Category", "Duration (s)", "Status"],
      ...filteredLogs.map((log) => [
        log.timestamp.toLocaleString(),
        log.user,
        log.userId,
        log.query.replace(/"/g, '""'),
        log.category,
        log.duration.toString(),
        log.resolved ? "Resolved" : "Unresolved",
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `consultation-logs-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `Exported ${filteredLogs.length} consultation logs.`,
    });
  };

  const handleClearAll = () => {
    setLogs([]);
    toast({
      title: "Logs cleared",
      description: "All consultation logs have been removed.",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const stats = {
    total: logs.length,
    resolved: logs.filter((l) => l.resolved).length,
    avgDuration: logs.length > 0 ? Math.round(logs.reduce((sum, l) => sum + l.duration, 0) / logs.length) : 0,
    today: logs.filter((l) => {
      const today = new Date();
      return l.timestamp.toDateString() === today.toDateString();
    }).length,
  };

  return (
    <DashboardLayout title="Consultation Logs">
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="gradient-primary rounded-xl p-3 glow-orange">
              <MessageSquare className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Consultation Logs</h1>
              <p className="text-sm text-muted-foreground">AI chatbot interaction history and analytics</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass p-6 hover-lift border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Consultations</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.total}</p>
                </div>
                <div className="gradient-primary rounded-xl p-3">
                  <Bot className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="glass p-6 hover-lift border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolved}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% success rate
                  </p>
                </div>
                <div className="bg-green-500/20 rounded-xl p-3">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="glass p-6 hover-lift border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{formatDuration(stats.avgDuration)}</p>
                </div>
                <div className="bg-blue-500/20 rounded-xl p-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass p-6 hover-lift border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Today</p>
                  <p className="text-3xl font-bold text-foreground mt-2">{stats.today}</p>
                </div>
                <div className="bg-purple-500/20 rounded-xl p-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass p-6 border-border/50">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search by query, user name, or user ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full lg:w-48 bg-background/50 border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48 bg-background/50 border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="unresolved">Unresolved</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button onClick={handleExport} variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button onClick={handleClearAll} variant="outline" className="gap-2 text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                  Clear
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Logs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full"
            >
              <Card className="glass p-12 text-center border-border/50">
                <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No consultation logs found</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Start a conversation with the AI chatbot to see logs here"}
                </p>
              </Card>
            </motion.div>
          ) : (
            filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="glass p-5 hover-lift cursor-pointer border-border/50 h-full flex flex-col"
                  onClick={() => setSelectedLog(log)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-secondary rounded-full p-2">
                        <User className="w-4 h-4 text-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-sm text-foreground">{log.user}</p>
                        <p className="text-xs text-muted-foreground">{log.userId}</p>
                      </div>
                    </div>
                    <Badge
                      variant={log.resolved ? "default" : "secondary"}
                      className={log.resolved ? "bg-green-500/20 text-green-700 hover:bg-green-500/30" : ""}
                    >
                      {log.resolved ? "Resolved" : "Pending"}
                    </Badge>
                  </div>

                  <div className="flex-1 mb-3">
                    <p className="text-sm text-foreground font-medium line-clamp-2 mb-2">{log.query}</p>
                    <p className="text-xs text-muted-foreground line-clamp-3">{log.response}</p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDuration(log.duration)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {log.category}
                      </Badge>
                    </div>
                    <span>{formatDate(log.timestamp)}</span>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Detail Dialog */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="gradient-primary rounded-lg p-2">
                  <MessageSquare className="w-5 h-5 text-primary-foreground" />
                </div>
                Consultation Details
              </DialogTitle>
              <DialogDescription>Full conversation transcript and metadata</DialogDescription>
            </DialogHeader>

            {selectedLog && (
              <div className="space-y-6 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">User</p>
                    <p className="text-sm text-foreground font-medium">{selectedLog.user}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">User ID</p>
                    <p className="text-sm text-foreground font-medium">{selectedLog.userId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Timestamp</p>
                    <p className="text-sm text-foreground">{selectedLog.timestamp.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Duration</p>
                    <p className="text-sm text-foreground">{formatDuration(selectedLog.duration)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Category</p>
                    <Badge variant="outline">{selectedLog.category}</Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-muted-foreground">Status</p>
                    <Badge variant={selectedLog.resolved ? "default" : "secondary"}>
                      {selectedLog.resolved ? "Resolved" : "Unresolved"}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="glass p-4 rounded-xl border border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <User className="w-3 h-3" />
                      User Query
                    </p>
                    <p className="text-sm text-foreground">{selectedLog.query}</p>
                  </div>

                  <div className="glass p-4 rounded-xl border border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-2">
                      <Bot className="w-3 h-3" />
                      AI Response
                    </p>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{selectedLog.response}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default ConsultationLogs;
