import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        // Primary button - Gradient background
        default: "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700 hover:scale-[1.02] shadow-md",
        
        // Destructive button - Red theme
        destructive: "bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02] shadow-md",
        
        // Outline button - Bordered with hover effect
        outline: "border-2 border-violet-500/20 bg-transparent text-white hover:bg-violet-500/20 hover:border-violet-500/40",
        
        // Secondary button - Softer background
        secondary: "bg-violet-500/20 text-white hover:bg-violet-500/30 hover:scale-[1.02]",
        
        // Ghost button - No background until hover
        ghost: "text-white hover:bg-violet-500/20",
        
        // Link style button
        link: "text-violet-400 underline-offset-4 hover:text-violet-300 hover:underline",
        
        // Success button - Green theme
        success: "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02] shadow-md",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
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
