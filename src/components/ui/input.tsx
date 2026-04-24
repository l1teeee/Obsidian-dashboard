import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-[#4c4450]/30 bg-[#171616] px-3 py-1 text-sm text-white shadow-sm transition-colors placeholder:text-[#4c4450] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d394ff]/40 focus-visible:border-[#d394ff]/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
