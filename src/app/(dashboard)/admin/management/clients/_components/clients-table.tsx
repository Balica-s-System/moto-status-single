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
import { useClientStore } from "../_libs/use-clients-store";
import { useDeleteClient } from "../_services/use-client-mutations";
import { useGetClients } from "../_services/use-client-queries";
import { ClientSchema } from "../_types/clientSchema";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Edit,
  Eye,
  Trash,
  User,
  IdCard,
  MapPin,
  UserCheck,
  Calendar,
  Bike,
} from "lucide-react";
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
import { ClientsTableSkeleton } from "./clients-table-skeleton";
import { formatDocument } from "@/lib/format";

const ClientsTable = () => {
  const {
    updateClientId,
    updateClientDialogOpen,
    updateClientPreviewOpen,
    clientFilters,
    updateClientFiltersPage,
  } = useClientStore();

  const clientsQuery = useGetClients(clientFilters);
  const deleteClientMutation = useDeleteClient();

  const { data, totalPages } = clientsQuery.data ?? {
    data: [] as ClientSchema[],
    totalPages: 0,
  };

  const rows = useMemo(() => {
    if (!clientsQuery.data) return [];
    return clientsQuery.data.data.map((item: any) => ({
      ...item,
      _motorcycles: item.motorcycles ?? [],
      _motorcycleCount: (item.motorcycles ?? []).length,
    }));
  }, [clientsQuery.data]);

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
        accessorKey: "name",
        header: () => (
          <span className="flex items-center gap-1.5">
            <User className="size-4" />
            Nome
          </span>
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "cpf",
        header: () => (
          <span className="flex items-center gap-1.5">
            <IdCard className="size-4" />
            CPF / CNPJ
          </span>
        ),
        cell: ({ row }) => (
          <ClickToCopy text={row.original.cpf}>
            <span className="font-mono text-xs">
              {formatDocument(row.original.cpf)}
            </span>
          </ClickToCopy>
        ),
      },
      {
        accessorKey: "city",
        header: () => (
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" />
            Cidade
          </span>
        ),
      },
      {
        accessorKey: "sellersName",
        header: () => (
          <span className="flex items-center gap-1.5">
            <UserCheck className="size-4" />
            Vendedor
          </span>
        ),
      },
      {
        accessorKey: "billingDate",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Calendar className="size-4" />
            Data Fat.
          </span>
        ),
        cell: ({ row }) => {
          const date = row.original.billingDate;
          return date ? format(new Date(date), "dd/MM/yyyy") : "-";
        },
      },
      {
        accessorKey: "_motorcycleCount",
        header: () => (
          <span className="flex items-center gap-1.5">
            <Bike className="size-4" />
            Motos
          </span>
        ),
        cell: ({ row }) => (
          <span className="text-center block">
            {row.original._motorcycleCount}
          </span>
        ),
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
                onClick={(e) => {
                  e.stopPropagation();
                  updateClientId(item.id);
                  updateClientPreviewOpen(true);
                }}
              >
                <Eye className="size-4" />
              </Button>
              <Button
                className="size-8"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  updateClientId(item.id);
                  updateClientDialogOpen(true);
                }}
              >
                <Edit className="size-4" />
              </Button>
              <Button
                className="size-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  alert({
                    onConfirm: () => deleteClientMutation.mutate(item.id),
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
    [
      updateClientId,
      updateClientDialogOpen,
      updateClientPreviewOpen,
      deleteClientMutation,
      openRows,
    ],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (clientsQuery.isLoading) {
    return <ClientsTableSkeleton />;
  }

  if (rows.length === 0) {
    return <NoItemsFound onClick={() => updateClientDialogOpen(true)} />;
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
            const motorcycles = row.original._motorcycles ?? [];
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
                        <p className="mb-3 text-xs font-medium text-muted-foreground">
                          Motos associadas ({motorcycles.length})
                        </p>
                        {motorcycles.length > 0 ? (
                          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                            {motorcycles.map((moto: any) => (
                              <div
                                key={moto.id}
                                className="flex items-center gap-3 rounded-md border bg-card px-3 py-2"
                              >
                                <span className="text-sm font-medium">
                                  {moto.model}
                                </span>
                                <ClickToCopy text={moto.chassi}>
                                  <span className="font-mono text-xs text-muted-foreground">
                                    {moto.chassi}
                                  </span>
                                </ClickToCopy>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Nenhuma moto associada
                          </p>
                        )}
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
        currentPage={clientFilters.page}
        totalPages={totalPages}
        updatePage={updateClientFiltersPage}
      />
    </div>
  );
};

export default ClientsTable;
