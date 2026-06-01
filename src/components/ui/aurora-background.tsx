"use client";

import { cn } from "@/lib/utils";
import type { HTMLProps, ReactNode } from "react";

interface AuroraBackgroundProps extends HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex min-h-[100vh] flex-col items-center justify-center overflow-hidden bg-white text-[#0F172A]",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className={cn(
            "pointer-events-none absolute -inset-[10px] animate-aurora opacity-[0.45] blur-[8px] will-change-transform",
            showRadialGradient &&
              "[mask-image:radial-gradient(ellipse_at_50%_0%,black_0%,black_55%,transparent_90%)]",
          )}
          style={{
            backgroundImage:
              "repeating-linear-gradient(100deg,#ffffff 0%,#ffffff 7%,transparent 10%,transparent 12%,#ffffff 16%),repeating-linear-gradient(100deg,rgba(15,23,42,0.30) 10%,rgba(15,23,42,0.10) 15%,rgba(15,23,42,0.22) 20%,rgba(15,23,42,0.07) 25%,rgba(15,23,42,0.18) 30%)",
            backgroundSize: "300%, 200%",
            backgroundPosition: "50% 50%, 50% 50%",
            mixBlendMode: "multiply",
          }}
        />
      </div>
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
};
