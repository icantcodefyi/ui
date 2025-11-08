import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "placeholder:text-foreground/50 bg-background flex field-sizing-content min-h-16 w-full border-2 border-[var(--mc-border)] bg-transparent px-3 py-2 font-sans text-base shadow-[inset_2px_2px_0px_0px_rgba(0,0,0,0.3)] outline-none focus-visible:border-[var(--mc-stone-dark)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--mc-error)] md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
