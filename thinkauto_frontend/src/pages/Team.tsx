import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";

const teamMembers = [
  { name: "Alex Chen", role: "Senior Technician", speciality: "Network", resolved: 24, pending: 3, rating: 4.8 },
  { name: "Sarah Kim", role: "Technician", speciality: "Hardware", resolved: 21, pending: 5, rating: 4.6 },
  { name: "Mike Johnson", role: "Technician", speciality: "Software", resolved: 18, pending: 2, rating: 4.9 },
  { name: "Lisa Park", role: "Junior Technician", speciality: "Access", resolved: 15, pending: 4, rating: 4.5 },
  { name: "Tom Wilson", role: "Technician", speciality: "Email", resolved: 12, pending: 1, rating: 4.7 },
];

const Team = () => {
  return (
    <DashboardLayout title="Team Management">
      <div className="space-y-3">
        {teamMembers.map((member, i) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground shrink-0">
              {member.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-foreground">{member.name}</p>
              <p className="text-xs text-muted-foreground">{member.role} · {member.speciality}</p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-muted-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-[hsl(var(--success))]" /> {member.resolved}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <AlertTriangle className="w-3.5 h-3.5 text-[hsl(var(--warning))]" /> {member.pending}
              </span>
              <span className="text-muted-foreground">⭐ {member.rating}</span>
            </div>
            <div className="w-24 hidden sm:block">
              <div className="w-full bg-secondary rounded-full h-1.5">
                <div className="gradient-primary rounded-full h-1.5" style={{ width: `${(member.resolved / 25) * 100}%` }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Team;
