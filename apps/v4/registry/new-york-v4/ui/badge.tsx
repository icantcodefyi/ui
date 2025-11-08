import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border-0 px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none overflow-hidden shadow-[2px_2px_0px_0px_var(--mc-border)] font-sans",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--mc-stone-dark)] text-[var(--mc-stone-foreground)] [a&]:hover:brightness-110",
        secondary:
          "bg-[var(--mc-stone)] text-[var(--mc-stone-foreground)] [a&]:hover:brightness-110",
        destructive:
          "bg-[var(--mc-error)] text-[var(--mc-error-foreground)] [a&]:hover:brightness-110",
        outline:
          "border-2 border-[var(--mc-border)] bg-transparent shadow-none text-foreground [a&]:hover:bg-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
