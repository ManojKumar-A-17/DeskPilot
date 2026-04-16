import { ReactNode } from "react";
import Navigation from "./Navigation";
import ChatBot from "./ChatBot";
import BrandLogo from "./BrandLogo";
import ProfileDropdown from "./ProfileDropdown";
import { useAuth } from "@/contexts/AuthContext";

const DashboardLayout = ({ children, title }: { children: ReactNode; title: string }) => {
  const { role } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-primary/95 text-primary-foreground border-b border-primary-foreground/20">
        <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 py-3 flex items-center justify-between">
          <BrandLogo size="sm" />
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-primary capitalize px-3 py-1.5 rounded-full bg-primary-foreground">
              {role}
            </span>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Page title */}
      <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 pt-6 pb-2">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary">{title}</h1>
      </div>

      {/* Content */}
      <main className="w-full px-5 sm:px-8 lg:px-12 xl:px-16 pb-24 pt-2">{children}</main>

      <Navigation />
      <ChatBot />
    </div>
  );
};

export default DashboardLayout;
