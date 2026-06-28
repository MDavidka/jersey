"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    const [localChecked, setLocalChecked] = React.useState(checked || false)
    const isChecked = checked !== undefined ? checked : localChecked

    const handleToggle = () => {
      const next = !isChecked
      if (checked === undefined) {
        setLocalChecked(next)
      }
      if (onCheckedChange) {
        onCheckedChange(next)
      }
    }

    return (
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        onClick={handleToggle}
        className={cn(
          "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-primary" : "bg-muted",
          className
        )}
      >
        <span
          className={cn(
            "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform",
            isChecked ? "translate-x-4" : "translate-x-0"
          )}
        />
        <input
          type="checkbox"
          ref={ref}
          checked={isChecked}
          onChange={() => {}}
          className="sr-only"
          {...props}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"
