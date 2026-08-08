import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-none border-2 sm:border-4 px-2.5 py-0.5 text-[10px] sm:text-xs font-display font-extrabold uppercase tracking-wider transition-colors focus:outline-none",
  {
    variants: {
      variant: {
        default: "border-primary bg-primary/10 text-primary hover:bg-primary hover:text-background",
        secondary: "border-secondary bg-secondary/10 text-secondary hover:bg-secondary hover:text-background",
        tertiary: "border-tertiary bg-tertiary/10 text-tertiary hover:bg-tertiary hover:text-background",
        destructive: "border-destructive bg-destructive/10 text-destructive hover:bg-destructive hover:text-white",
        outline: "border-foreground/40 bg-background text-foreground/70 hover:border-primary hover:text-primary",
        success: "border-emerald-600 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        warning: "border-amber-600 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)


export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
