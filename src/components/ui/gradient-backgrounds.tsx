import { cn } from "@/lib/utils";

interface GradientBackgroundProps {
  className?: string;
  /** Outer edge color — supports rgba for opacity control. */
  color?: string;
  /** Gradient source position (CSS `at X Y`). */
  position?: string;
  /** How far the center bg color extends before fading to `color`. */
  centerStop?: string;
}

export function GradientBackground({
  className,
  color = "#C8553A",
  position = "50% 90%",
  centerStop = "40%",
}: GradientBackgroundProps) {
  return (
    <div
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      style={{
        background: `radial-gradient(125% 125% at ${position}, #F6F2EA ${centerStop}, ${color} 100%)`,
      }}
    />
  );
}
