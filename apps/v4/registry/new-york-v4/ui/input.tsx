import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground bg-background h-9 w-full min-w-0 border-2 border-[var(--mc-border)] bg-transparent px-3 py-1 text-base shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.3)] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-sans",
        "focus-visible:border-[var(--mc-stone-dark)] focus-visible:shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.5)]",
        "aria-invalid:border-[var(--mc-error)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
