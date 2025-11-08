import { CircleFadingArrowUpIcon } from "lucide-react"

import { Button } from "@/registry/minecraft/ui/button"

export default function ButtonIcon() {
  return (
    <Button variant="outline" size="icon">
      <CircleFadingArrowUpIcon />
    </Button>
  )
}
