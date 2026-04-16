import { Zap } from "lucide-react";

const BrandLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <div className="gradient-primary rounded-lg p-1.5 glow-orange">
          <Zap className={`${size === "lg" ? "w-7 h-7" : size === "md" ? "w-5 h-5" : "w-4 h-4"} text-primary-foreground`} />
        </div>
      </div>
      <span className={`font-display font-bold ${sizes[size]} text-gradient`}>
        DeskPilot
      </span>
    </div>
  );
};

export default BrandLogo;
