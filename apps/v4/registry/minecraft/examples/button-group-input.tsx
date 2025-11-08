import { SearchIcon } from "lucide-react"

import { Button } from "@/registry/minecraft/ui/button"
import { ButtonGroup } from "@/registry/minecraft/ui/button-group"
import { Input } from "@/registry/minecraft/ui/input"

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input placeholder="Search..." />
      <Button variant="outline" aria-label="Search">
        <SearchIcon />
      </Button>
    </ButtonGroup>
  )
}
