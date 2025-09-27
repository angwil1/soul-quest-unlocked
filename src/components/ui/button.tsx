import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gradient-primary text-primary-foreground hover:shadow-primary hover:scale-[1.02] active:scale-[0.98] shadow-secondary",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-secondary",
        outline:
          "border border-input bg-background/50 backdrop-blur-sm hover:bg-accent/50 hover:text-accent-foreground hover:border-accent hover:shadow-secondary hover:scale-[1.02] active:scale-[0.98]",
        secondary:
          "bg-gradient-secondary text-secondary-foreground hover:shadow-secondary hover:scale-[1.02] active:scale-[0.98] shadow-sm",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary-glow",
        premium: "bg-gradient-launch text-white hover:shadow-launch hover:scale-[1.02] active:scale-[0.98] shadow-primary border border-primary-glow/20",
        hero: "bg-gradient-hero text-white hover:shadow-launch hover:scale-[1.02] active:scale-[0.98] shadow-primary border border-primary-glow/30 backdrop-blur-sm",
        gold: "btn-gold-hover border border-gold-light/30 bg-gradient-to-r from-gold-light to-gold hover:from-gold hover:to-gold-dark transition-all duration-300 text-primary-foreground",
      },
      size: {
        default: "h-11 px-6 py-3 rounded-lg",
        sm: "h-9 rounded-md px-4 py-2 text-xs",
        lg: "h-12 rounded-xl px-8 py-3 text-base font-semibold",
        icon: "h-11 w-11 rounded-lg",
        xl: "h-14 rounded-xl px-10 py-4 text-lg font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
