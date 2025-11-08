import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[var(--mc-stone-dark)] animate-pulse border-2 border-[var(--mc-border)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
