import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7DD3C7]/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.97] active:brightness-90",
  {
    variants: {
      variant: {
        default:
          "bg-[#7DD3C7] text-[#3a0060] shadow-sm hover:bg-[#c97cff] hover:shadow-[0_0_24px_rgba(125,211,199,0.3)]",
        destructive:
          "bg-red-600 text-[#1C1814] shadow-sm hover:bg-red-500",
        outline:
          "border border-white/[0.12] bg-[#1C1814]/[0.05] text-[#1C1814]/60 shadow-sm hover:bg-[#1C1814]/[0.05] hover:text-[#1C1814]/80 hover:border-[#7DD3C7]/30",
        secondary:
          "bg-[#1C1814]/[0.05] text-[#1C1814]/70 shadow-sm hover:bg-white/[0.10]",
        ghost:
          "text-[#1C1814]/50 hover:bg-white/[0.05] hover:text-[#1C1814]/80",
        link:
          "text-[#7DD3C7] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-10 rounded-lg px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants };
