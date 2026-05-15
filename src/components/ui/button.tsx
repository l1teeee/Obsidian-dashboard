import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C8553A]/70 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 active:scale-[0.97] active:brightness-90",
  {
    variants: {
      variant: {
        default:
          "bg-[#C8553A] text-white shadow-sm hover:bg-[#A53F28] hover:shadow-[0_0_24px_rgba(200,85,58,0.3)]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500",
        outline:
          "border border-[rgba(21,20,15,0.14)] bg-transparent text-[#3D3A30] shadow-sm hover:bg-[#EFE9DC] hover:text-[#15140F] hover:border-[#C8553A]/30",
        secondary:
          "bg-[#EFE9DC] text-[#3D3A30] shadow-sm hover:bg-[#E7E0D0]",
        ghost:
          "text-[#6B655B] hover:bg-[#EFE9DC] hover:text-[#15140F]",
        link:
          "text-[#C8553A] underline-offset-4 hover:underline",
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
