import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse border-2 border-[var(--mc-border)] bg-[var(--mc-stone-dark)]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
