import type { Metadata } from "next"
import { ClientsFormDialog } from "./_components/clients-form-dialog"

export const metadata: Metadata = {
  title: "Clientes | Auge Motos"
}

const Page = () => {
  return (
    <div className="space-y-2">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <h1 className="text-3xl font-semibold">Clientes</h1>
        <ClientsFormDialog />
      </div>
    </div>
  )
}

export default Page
