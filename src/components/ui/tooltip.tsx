import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";
import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip         = TooltipPrimitive.Root;
const TooltipTrigger  = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> & {
    showArrow?: boolean;
  }
>(({ className, sideOffset = 6, showArrow = false, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 max-w-[200px] rounded-lg border border-transparent bg-[#15140F] px-2.5 py-1.5 text-xs font-medium text-[#F6F2EA] shadow-lg shadow-black/20",
        "data-[state=delayed-open]:animate-tooltip-open",
        "data-[state=instant-open]:animate-tooltip-open",
        "data-[state=closed]:animate-tooltip-close",
        className,
      )}
      {...props}
    >
      {props.children}
      {showArrow && (
        <TooltipPrimitive.Arrow className="-my-px fill-[#15140F] drop-shadow-[0_1px_0_rgba(0,0,0,0.2)]" />
      )}
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
