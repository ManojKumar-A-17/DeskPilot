import { ReactNode } from "react";
import Navigation from "./Navigation";
import ChatBot from "./ChatBot";
import BrandLogo from "./BrandLogo";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen gradient-dark">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-strong border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground capitalize px-3 py-1.5 rounded-full bg-secondary">
              {role}
            </span>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">{title}</h1>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24 pt-2">{children}</main>

      <Navigation />
      <ChatBot />
    </div>
  );
};

export default DashboardLayout;
