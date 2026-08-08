import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  state?: 'default' | 'success' | 'warning' | 'error'
  errorMessage?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, state = 'default', errorMessage, ...props }, ref) => {
    const stateStyles = {
      default: "border-foreground/40 focus:border-[#FF5C80]",
      success: "border-success focus:border-emerald-500 text-success",
      warning: "border-warning focus:border-amber-500 text-warning",
      error: "border-destructive focus:border-destructive text-destructive",
    }

    return (
      <div className="w-full space-y-1">
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "flex h-11 sm:h-12 w-full rounded-none border-4 bg-background px-3 py-2 text-sm sm:text-base font-display text-foreground placeholder:text-foreground/40 transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              stateStyles[state],
              icon && "pl-11 sm:pl-12",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {errorMessage && (
          <p className={cn(
            "text-xs font-extrabold tracking-wide",
            state === 'error' ? "text-destructive" : state === 'warning' ? "text-warning dark:text-warning" : "text-success dark:text-success"
          )}>
            {errorMessage}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"


export { Input }
