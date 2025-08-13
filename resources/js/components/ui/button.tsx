import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:border-transparent aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-[#1d4ed8] shadow-sm",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-[#dc2626] shadow-sm",
        outline:
          "border border-gray-300 bg-white text-primary hover:bg-[#eff6ff]",
        secondary:
          "bg-white text-primary border border-gray-300 hover:bg-[#eff6ff]",
        ghost: "hover:bg-accent/10 text-primary",
        link: "text-primary font-medium underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-9 px-3 has-[>svg]:px-2.5",
          xs: "h-7 px-2.5 has-[>svg]:px-2",
        lg: "h-11 px-6 has-[>svg]:px-4",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : ("button" as const)
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
