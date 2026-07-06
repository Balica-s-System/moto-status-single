"use client";

import { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { NoItemsFound } from "@/components/no-items-found";
import { useInventoryStore } from "../_libs/use-inventory-store";
import { useDeleteMotorcycle } from "../_services/use-inventory-mutations";
import { useGetMotorcycles } from "../_services/use-inventory-queries";
import { MotorcycleSchema } from "../_types/motorcycleSchema";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { alert } from "@/lib/use-global-store";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const arrivalStatusLabels: Record<string, string> = {
  NO_INFORMATION: "Sem Informação",
  DELAYED: "Atrasado",
  ARRIVED: "Entregue",
};

const registrationStatusLabels: Record<string, string> = {
  NO_PLATE: "Sem Placa",
  PLATING: "Em Emplacamento",
  PLATED: "Emplacada",
};

const InventoryTable = () => {
  const { updateMotorcycleId, updateInventoryDialogOpen } = useInventoryStore();

  const motorcyclesQuery = useGetMotorcycles();
  const deleteMotorcycleMutation = useDeleteMotorcycle();

  const data =
    (motorcyclesQuery.data as unknown as (MotorcycleSchema & {
      id: string;
    })[]) || [];

  const columns = useMemo<ColumnDef<MotorcycleSchema & { id: string }>[]>(
    () => [
      {
        accessorKey: "model",
        header: "Modelo",
        cell: ({ row }) => (
          <span className="font-medium">{row.original.model}</span>
        ),
      },
      {
        accessorKey: "chassi",
        header: "Chassi",
      },
      {
        accessorKey: "forecastArrival",
        header: "Previsão de Chegada",
        cell: ({ row }) => {
          const date = row.original.forecastArrival;
          return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
        },
      },
      {
        accessorKey: "forecastArrivalStatus",
        header: "Status da Chegada",
        cell: ({ row }) => {
          const status = row.original.forecastArrivalStatus;
          return arrivalStatusLabels[status] || status;
        },
      },
      {
        accessorKey: "registrationStatus",
        header: "Status Emplacamento",
        cell: ({ row }) => {
          const status = row.original.registrationStatus;
          return status ? registrationStatusLabels[status] || status : "-";
        },
      },
      {
        accessorKey: "registrationDate",
        header: "Data Emplacamento",
        cell: ({ row }) => {
          const date = row.original.registrationDate;
          return date ? new Date(date).toLocaleDateString("pt-BR") : "-";
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const item = row.original;
          return (
            <div className="flex gap-2 justify-end">
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                onClick={() => {
                  updateMotorcycleId(item.id);
                  updateInventoryDialogOpen(true);
                }}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                variant="ghost"
                size="icon"
                onClick={() => {
                  alert({
                    onConfirm: () => deleteMotorcycleMutation.mutate(item.id),
                  });
                }}
              >
                <Trash className="size-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [updateMotorcycleId, updateInventoryDialogOpen, deleteMotorcycleMutation],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (motorcyclesQuery.isLoading) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Carregando inventário...
      </div>
    );
  }

  if (data.length === 0) {
    return <NoItemsFound onClick={() => updateInventoryDialogOpen(true)} />;
  }

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryTable;
