import { SquareChartGantt } from "lucide-react";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-primary text-primary-foreground ${className}`}
    >
      <SquareChartGantt className="h-6 w-6" />
    </div>
  );
}
