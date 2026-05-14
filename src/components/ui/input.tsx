import * as React from "react";
import { cn } from "@/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lg border border-[#1C1814]/30 bg-[#171616] px-3 py-1 text-sm text-[#1C1814] shadow-sm transition-colors placeholder:text-[#1C1814] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7DD3C7]/40 focus-visible:border-[#7DD3C7]/40 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
);
Input.displayName = "Input";

export { Input };
