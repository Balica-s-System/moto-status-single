import { Skeleton } from "@/components/ui/skeleton";

const ClientsTableSkeleton = () => (
  <div className="rounded-md border bg-card">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {["Nome", "CPF / CNPJ", "Cidade", "Vendedor", "Data Fat.", "Motos", "Ações"].map(
              (h) => (
                <th key={h} className="h-10 px-4 text-left align-middle">
                  <Skeleton className="h-4 w-20" />
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b">
              <td className="p-4">
                <Skeleton className="h-4 w-32" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-36" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-12" />
              </td>
              <td className="p-4">
                <div className="flex gap-2 justify-end">
                  <Skeleton className="size-8" />
                  <Skeleton className="size-8" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export { ClientsTableSkeleton };
