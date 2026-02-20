import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import BrandLogo from "./BrandLogo";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  Plus,
  ListTodo,
  BookOpen,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Command,
  X,
  Inbox,
  Shield,
  Activity,
} from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { role, userName, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const employeeLinks = [
    { icon: Home, label: "Dashboard", path: "/employee/dashboard" },
    { icon: Plus, label: "Raise Ticket", path: "/employee/raise-ticket" },
    { icon: ListTodo, label: "My Tickets", path: "/employee/my-tickets" },
    { icon: BookOpen, label: "Knowledge Base", path: "/employee/knowledge-base" },
  ];

  const technicianLinks = [
    { icon: Home, label: "Dashboard", path: "/technician/dashboard" },
    { icon: Inbox, label: "Assigned Tickets", path: "/technician/assigned-tickets" },
    { icon: Activity, label: "Update Status", path: "/technician/update-status" },
  ];

  const adminLinks = [
    { icon: Home, label: "Dashboard", path: "/admin/dashboard" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Users, label: "Team", path: "/admin/team" },
    { icon: Shield, label: "SLA Monitor", path: "/admin/sla-monitor" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  const links =
    role === "admin" ? adminLinks : role === "technician" ? technicianLinks : employeeLinks;

  const handleNav = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating trigger */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 gradient-primary rounded-2xl p-3.5 glow-orange shadow-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Command className="w-5 h-5 text-primary-foreground" />
      </motion.button>

      {/* Navigation panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-20 left-6 z-50 w-72 glass-strong rounded-2xl p-5 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <BrandLogo size="sm" />
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4 px-3 py-2 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <span className="text-xs font-medium text-primary capitalize">{role}</span>
              </div>

              <nav className="space-y-1">
                {links.map((link) => {
                  const isActive = location.pathname === link.path;
                  return (
                    <button
                      key={link.path}
                      onClick={() => handleNav(link.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                        isActive
                          ? "gradient-primary text-primary-foreground glow-orange"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
