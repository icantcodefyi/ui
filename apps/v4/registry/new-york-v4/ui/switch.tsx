"use client"

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-[var(--mc-success)] data-[state=unchecked]:bg-[var(--mc-stone-dark)] inline-flex h-[1.15rem] w-8 shrink-0 items-center border-0 shadow-[inset_1px_1px_0px_0px_rgba(0,0,0,0.3)] transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-[var(--mc-stone)] pointer-events-none block size-4 ring-0 shadow-[1px_1px_0px_0px_var(--mc-border)] transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
