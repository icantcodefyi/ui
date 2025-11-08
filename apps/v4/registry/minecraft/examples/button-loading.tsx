import { Button } from "@/registry/minecraft/ui/button"
import { Spinner } from "@/registry/minecraft/ui/spinner"

export default function ButtonLoading() {
  return (
    <Button size="sm" variant="outline" disabled>
      <Spinner />
      Submit
    </Button>
  )
}
