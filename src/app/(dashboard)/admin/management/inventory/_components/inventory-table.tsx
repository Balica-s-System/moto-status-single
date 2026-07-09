"use client";

import { Fragment, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { ClickToCopy } from "@/components/click-to-copy";
import { NoItemsFound } from "@/components/no-items-found";
import { useInventoryStore } from "../_libs/use-inventory-store";
import { useDeleteMotorcycle } from "../_services/use-inventory-mutations";
import { useGetMotorcycles } from "../_services/use-inventory-queries";
import { MotorcycleSchema } from "../_types/motorcycleSchema";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Eye, Trash, Bike, Hash, Calendar } from "lucide-react";
import { alert } from "@/lib/use-global-store";
import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { InventoryTableSkeleton } from "./inventory-table-skeleton";

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
  const {
    updateMotorcycleId,
    updateInventoryDialogOpen,
    updateInventoryPreviewOpen,
    motorcycleFilters,
    updateMotorcycleFiltersPage,
  } = useInventoryStore();

  const motorcyclesQuery = useGetMotorcycles(motorcycleFilters);
  const deleteMotorcycleMutation = useDeleteMotorcycle();

  const { data, totalPages } = motorcyclesQuery.data ?? {
    data: [] as MotorcycleSchema[],
    totalPages: 0,
  };

  const [openRows, setOpenRows] = useState<Set<string>>(new Set());

  const toggleRow = (rowId: string) => {
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }
      return next;
    });
  };

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "toggle",
        header: "",
        cell: ({ row }) => {
          const isOpen = openRows.has(row.id);
          return (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={(e) => {
                e.stopPropagation();
                toggleRow(row.id);
              }}
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen && "rotate-90",
                )}
              />
            </Button>
          );
        },
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "model",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Bike className="size-4" />
            Modelo
          </span>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.model}</span>
        ),
      },
      {
        accessorKey: "chassi",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Hash className="size-4" />
            Chassi
          </span>
        ),
        cell: ({ row }) => (
          <ClickToCopy text={row.original.chassi}>
            <span className="font-mono text-xs">{row.original.chassi}</span>
          </ClickToCopy>
        ),
      },
      {
        accessorKey: "forecastArrival",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            Previsão de Chegada
          </span>
        ),
        cell: ({ row }) => {
          const date = row.original.forecastArrival;
          return date ? format(new Date(date), "dd/MM/yyyy") : "-";
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
                  updateInventoryPreviewOpen(true);
                }}
              >
                <Eye className="size-4" />
              </Button>
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
    [updateMotorcycleId, updateInventoryDialogOpen, updateInventoryPreviewOpen, deleteMotorcycleMutation, openRows],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (motorcyclesQuery.isLoading) {
    return <InventoryTableSkeleton />;
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
          {table.getRowModel().rows.map((row) => {
            const isOpen = openRows.has(row.id);
            const cellCount = row.getVisibleCells().length;
            return (
              <Fragment key={row.id}>
                <TableRow
                  className="cursor-pointer"
                  onClick={() => toggleRow(row.id)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
                {isOpen && (
                  <TableRow>
                    <TableCell colSpan={cellCount} className="p-0">
                      <div className="border-t bg-muted/30 px-6 py-4 animate-in slide-in-from-top-1 duration-200">
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Status da Chegada
                            </p>
                            <p className="text-sm">
                              {arrivalStatusLabels[
                                row.original.forecastArrivalStatus
                              ] || row.original.forecastArrivalStatus}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Status Emplacamento
                            </p>
                            <p className="text-sm">
                              {row.original.registrationStatus
                                ? registrationStatusLabels[
                                    row.original.registrationStatus
                                  ] || row.original.registrationStatus
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Data Emplacamento
                            </p>
                            <p className="text-sm">
                              {row.original.registrationDate
                                ? format(
                                    new Date(
                                      row.original.registrationDate,
                                    ),
                                    "dd/MM/yyyy",
                                  )
                                : "-"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">
                              Cliente
                            </p>
                            <p className="text-sm">
                              {row.original.client ? (
                                <span className="font-medium">
                                  {row.original.client.name}
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  -
                                </span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
      <Pagination
        currentPage={motorcycleFilters.page}
        totalPages={totalPages}
        updatePage={updateMotorcycleFiltersPage}
      />
    </div>
  );
};

export default InventoryTable;
