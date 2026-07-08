"use clients"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"

type ClientsFormDialogProps = {
  smallTrigger?: boolean
}

const ClientsFormDialog = ({ smallTrigger }: ClientsFormDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {smallTrigger ? (
          <Button size="icon" variant="ghost" type="button">
            <Plus />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2" />
            Novo Cliente
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl"></DialogContent>
    </Dialog>
  )
}

export { ClientsFormDialog }