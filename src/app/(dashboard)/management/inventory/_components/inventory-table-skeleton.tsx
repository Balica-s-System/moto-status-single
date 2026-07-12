import { Skeleton } from "@/components/ui/skeleton";

const InventoryTableSkeleton = () => (
  <div className="rounded-md border bg-card">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            {[
              "Modelo",
              "Chassi",
              "Previsão",
              "Status Chegada",
              "Status Emplacamento",
              "Data Emplacamento",
              "Ações",
            ].map((h) => (
              <th key={h} className="h-10 px-4 text-left align-middle">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b">
              <td className="p-4">
                <Skeleton className="h-4 w-32" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-40" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-28" />
              </td>
              <td className="p-4">
                <Skeleton className="h-4 w-24" />
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

export { InventoryTableSkeleton };
