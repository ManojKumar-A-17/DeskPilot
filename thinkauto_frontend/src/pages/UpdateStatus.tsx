import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Clock, AlertTriangle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const statuses = [
  { value: "open", label: "Open", icon: Clock, color: "text-[hsl(var(--info))]" },
  { value: "in_progress", label: "In Progress", icon: AlertTriangle, color: "text-[hsl(var(--warning))]" },
  { value: "resolved", label: "Resolved", icon: CheckCircle2, color: "text-[hsl(var(--success))]" },
  { value: "closed", label: "Closed", icon: XCircle, color: "text-muted-foreground" },
];

const UpdateStatus = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("in_progress");
  const [note, setNote] = useState("");

  return (
    <DashboardLayout title="Update Status">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-xl space-y-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
          <h3 className="font-display font-semibold text-foreground mb-1">Ticket #1024</h3>
          <p className="text-sm text-muted-foreground mb-4">VPN not connecting on office network</p>

          <label className="text-sm font-medium text-muted-foreground mb-2 block">New Status</label>
          <div className="grid grid-cols-2 gap-3 mb-5">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => setSelected(s.value)}
                className={`flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all ${
                  selected === s.value ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <s.icon className="w-4 h-4" /> {s.label}
              </button>
            ))}
          </div>

          <label className="text-sm font-medium text-muted-foreground mb-1.5 block">Resolution Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Describe what was done..."
            className="w-full bg-secondary rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50 resize-none mb-4"
          />

          <button onClick={() => navigate(-1)} className="w-full gradient-primary text-primary-foreground font-semibold py-3 rounded-xl glow-orange hover:opacity-90 transition-opacity">
            Update Status
          </button>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UpdateStatus;
