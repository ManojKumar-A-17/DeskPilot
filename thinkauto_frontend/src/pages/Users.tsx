import DashboardLayout from "@/components/DashboardLayout";
import { motion } from "framer-motion";
import { Search, UserPlus, Shield, Wrench, User } from "lucide-react";
import { useState } from "react";

const users = [
  { name: "Alex Chen", email: "alex@company.com", role: "technician", status: "active", tickets: 24 },
  { name: "Sarah Kim", email: "sarah@company.com", role: "technician", status: "active", tickets: 21 },
  { name: "Mike Johnson", email: "mike@company.com", role: "technician", status: "active", tickets: 18 },
  { name: "Lisa Park", email: "lisa@company.com", role: "technician", status: "active", tickets: 15 },
  { name: "John Doe", email: "john@company.com", role: "employee", status: "active", tickets: 8 },
  { name: "Jane Smith", email: "jane@company.com", role: "employee", status: "inactive", tickets: 3 },
  { name: "Admin User", email: "admin@company.com", role: "admin", status: "active", tickets: 0 },
];

const roleIcons: Record<string, typeof User> = { admin: Shield, technician: Wrench, employee: User };

const Users = () => {
  const [search, setSearch] = useState("");
  const filtered = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout title="User Management">
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full bg-secondary rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <button className="gradient-primary text-primary-foreground text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2">
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="space-y-3">
        {filtered.map((user, i) => {
          const RoleIcon = roleIcons[user.role] || User;
          return (
            <motion.div
              key={user.email}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="glass rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                {user.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground capitalize">
                  <RoleIcon className="w-3 h-3" /> {user.role}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.status === "active" ? "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]" : "bg-secondary text-muted-foreground"}`}>
                  {user.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default Users;
